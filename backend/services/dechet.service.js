'use strict';
var Rx = require('rx');
var service = {};
var sequelize = require('sequelize');

var models = require('../models/');
var Dechet = models.dechet;
var Traitement = models.traitement;
var Bordereau = models.bordereau;
var Prestataire = models.prestataire;
var Type_traitement = models.type_traitement;

function getAllDechets(queryParameters) {
    /* This function creates an Observable and returns it. It searches for all
     * déchets
     * Args: queryParameters, parameters for the query, in the following form:
     * {attributes: string[], where: {fieldA: string, ...}, order: string[]}
     */

     if (Object.keys(queryParameters).length>0) {
         // modifies the fields in the 'where' statement to put everything in lower
         var where = {};
         if (typeof queryParameters["where"] != 'undefined') {
             for (const key of Object.keys(queryParameters.where)) {
                 const val = queryParameters.where[key];
                 where[key] = sequelize.where(sequelize.fn('LOWER', sequelize.col(key)), 'LIKE', val)
             }
             queryParameters.where = where;
         }
     }

     console.log(queryParameters);

     var observable = Rx.Observable.create((observer) => {
         Dechet.findAll(queryParameters)
            .then((dechets) => {
                observer.onNext(dechets);
                observer.onCompleted();
            })
            .catch((error) => {
                observer.onError(error);
            });
     });
     return observable;
}

function getDechetById(id) {
    /* This function creates an Observable and returns it. It should get a
     * single dechet with the corresponding id given in parameters
     * If not found, an error will be raised and handled in the response
     */
     var observable = Rx.Observable.create((observer) => {
         Dechet.findById(id)
            .then((dechet) => {
                if (dechet) {
                    observer.onNext(dechet);
                    observer.onCompleted();
                }
                else {
                    // null response: must raise a NotFound error
                    throw "Resource not found";
                }
            })
            .catch((error) => {
                observer.onError(error);
            })
     });
     return observable;

}


function getDechetsForSites(idArray, beginDate, endDate) {

    var query = {
        attributes: ['id'],
        group: sequelize.col('dechet.id'),
        where: {
            id_site: {$in: idArray}
        },
        include: [
            {
                attributes: [],
                model: Traitement,
                as: 'traitementFinal',
                where: {
                    date_priseencharge: {
                        $lte: endDate,
                        $gte: beginDate
                    }
                }
            },
            {
                model: Dechet,
            }
        ]
    };

    var observable = Rx.Observable.create((obs) => {
        Bordereau.findAll(query)
            .then((bordereaux) => {
                bordereaux.forEach((bordereau) => {
                    var dechet = bordereau.dataValues.dechet;
                    bordereau.dataValues = dechet.dataValues;
                    // bordereau.dataValues = bordereau.dataValues.dechet;
                })
                obs.onNext(bordereaux);
                obs.onCompleted();
            })
            .catch((error) => {
                obs.onError(error);
            })
    });

    return observable;
}

function getPrestatairesForDechet(id, sitesId, recycled, beginDate, endDate) {

    // TODO use a dictionnary for this
    var qualification;
    if (recycled == 1) {
        qualification = "Recyclage";
    }
    else {
        qualification = "%";
    }

    var query = {
        where: {
            id_site: {$in: sitesId},
            id_dechet: id
        },
        group: sequelize.col('traitementFinal.id_prestataire'),
        attributes: [
            [sequelize.fn('SUM', sequelize.col('quantitee_finale')), 'quantitee_traitee']
        ],
        order: [
            [sequelize.literal('quantitee_traitee'), 'DESC']
        ],
        include: [
            {
                model: Traitement,
                as: 'traitementFinal',
                attributes: ['id'],
                where: {
                    date_priseencharge: {
                        $lte: endDate,
                        $gte: beginDate
                    }
                },
                include: [
                    {
                        model: Type_traitement,
                        attributes: [],
                        where: {
                            qualification: {$like: qualification}
                        }
                    },
                    {
                        model: Prestataire,
                        attributes: [
                            'nom',
                            'siret',
                            'id',
                            'localisation'
                        ]
                    }
                ]
            },
        ]
    };

    var observable = Rx.Observable.create((obs) => {
        Bordereau.findAll(query)
            .then((bordereaux) => {
                bordereaux.forEach((bordereau) => {
                    bordereau.dataValues.prestataire = bordereau.dataValues.traitementFinal.prestataire;
                    bordereau.dataValues.traitementFinal = undefined;
                })
                obs.onNext(bordereaux);
                obs.onCompleted();
            })
            .catch((error) => {
                obs.onError(error);
            })
    });
    return observable;
}

service.getAllDechets = getAllDechets;
service.getDechetById = getDechetById;
service.getDechetsForSites = getDechetsForSites;
service.getPrestatairesForDechet = getPrestatairesForDechet;

module.exports = service;
