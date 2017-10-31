'use strict';
var Rx = require('rx');
var service = {};
var sequelize = require('sequelize');
var mysql = require('mysql');

var models = require('../models/');
var traitement = models.traitement;
var bordereau = models.bordereau;
var dechet = models.dechet;
var prestataire = models.prestataire;
var site = models.site;
var traitement = models.traitement;
var transport = models.transport;
var transporteur = models.transporteur;
var type_traitement = models.type_traitement;
var referentiel_dechet = models.referentiel_dechet;
var dashboard = models.dashboard;

var env       = process.env.NODE_ENV || 'development';
var dbConfig    = require(__dirname + '/../config/config.json')[env];

var connectionInfo = {
    host: dbConfig.host,
    user: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database
}

var connection = mysql.createConnection(connectionInfo);

function getAllPrestataires(queryParameters) {
    /* This function creates an Observable and returns it. It searches for all
     * prestataires
     * Args: queryParameters, parameters for the query, in the following form:
     * {attributes: string[], where: {fieldA: string, ...}, order: string[]}
     */
     if (Object.keys(queryParameters).length>0) { // checks if queryParams have actually been provided
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

    var getAllPrestatairesObservable = Rx.Observable.create((observer) => {
        prestataire.findAll(queryParameters)
            .then((prestataires) => {
                observer.onNext(prestataires);
                observer.onCompleted();
            })
            .catch ((error) => {
                observer.onError(error);
            });
    });
    return getAllPrestatairesObservable;
}


// given a sites array, returns all the prestataires working for these sites in
// the given timeframe
function getPrestatairesForSites(sitesArray, beginDate, endDate) {

    var queryString = "SELECT prestataire.nom, prestataire.localisation, " +
    "prestataire.siret, prestataire.id FROM bordereau INNER JOIN traitement ON " +
    "traitement.id = bordereau.id_traitement_final INNER JOIN transport " +
    "ON transport.id = bordereau.id_transport_1 INNER JOIN prestataire " +
    "ON prestataire.id = traitement.id_prestataire WHERE bordereau.id_site IN (?) " +
    "AND transport.date < ? AND transport.date >= ? GROUP BY prestataire.id " +
    "ORDER BY SUM(quantitee_finale) DESC";

    var query = {
        sql: queryString,
        values: [sitesArray, endDate, beginDate]
    }

    var observable = Rx.Observable.create((obs) => {
        connection.query(query, (errors, results, fields) => {
            if (errors) {
                obs.onError(errors);
            }
            else {
                obs.onNext(results);
                obs.onCompleted();
            }
        })
    })

    return observable;
}

function getPrestataireById(prestataireId) {
  /* This function creates an Observable and returns it. It should get a
   * single Prestataire with the corresponding id given in parameters
   * If not found, an error will be raised and handled in the response
   */
   var observable = Rx.Observable.create((observer) => {
      prestataire.findById(prestataireId)
          .then((prestataire) => {
              if (prestataire) {
                  observer.onNext(prestataire);
                  observer.onCompleted();
              }
              else {
                // null response: must raise a NotFound error
                throw "Resource not found";
              }
          })
          .catch ((error) => {
              observer.onError(error);
          })
   });
   return observable;
}

function getPrestataireByName(prestataireName){

    /* This function creates an Observable and returns it. It should
    search for all the Prestataires that have a name containing PrestataireName
    */
    var getPrestataireByNameObservable = Rx.Observable.create(function (obs) {
        prestataire.findAll({
            where: {
                nom: {$like: '%prestataireName%'}
            }
        })
        .then(function(prestataires) {
            obs.onCompleted(prestataires);
        })
        .catch (function(error) {
            obs.onError(error);
        });
    });
    return getPrestataireByNameObservable;

};

function getDechetsForPrestataire(id, sitesId, recycled, beginDate, endDate) {

    // TODO use a dictionnary for this
    var qualification;
    if (recycled == 1) {
        qualification = "Recyclage";
    }
    else {
        qualification = "%";
    }


    var queryString = "SELECT SUM(bordereau.quantitee_finale) AS quantitee_traitee, " +
    "dechet.id, dechet.codeinterne, dechet.famille, dechet.libelle, dechet.is_listeverte " +
    "FROM bordereau INNER JOIN traitement ON traitement.id = bordereau.id_traitement_final " +
    "INNER JOIN type_traitement ON type_traitement.id = bordereau.id_traitement_prevu " +
    "INNER JOIN transport ON transport.id = bordereau.id_transport_1 " +
    "INNER JOIN prestataire ON traitement.id_prestataire = prestataire.id " +
    "INNER JOIN dechet on dechet.id = bordereau.id_dechet " +
    "WHERE bordereau.id_site IN (?) ";

    if (typeof id != 'undefined') {
        queryString += "AND prestataire.id = ? ";
    }

    queryString += "AND transport.date < ? AND transport.date >= ? " +
    "AND type_traitement.qualification LIKE ? " +
    "GROUP BY dechet.id  HAVING SUM(quantitee_finale) > 0 ORDER BY SUM(quantitee_finale) DESC";

    var query = {
        sql: queryString,
        nestTables: true,
        values: []
    }

    if (typeof id != 'undefined') {
        query.values = [sitesId, id, endDate, beginDate, qualification];
    }
    else {
        query.values = [sitesId, endDate, beginDate, qualification];
    }

    var observable = Rx.Observable.create((obs) => {
        connection.query(query, (errors, results, fields) => {
            if (errors) {
                obs.onError(errors);
            }
            else {
                results.forEach((row) => {
                    row.quantitee_traitee = row[''].quantitee_traitee;
                    row[''] = undefined;
                })
                obs.onNext(results);
                obs.onCompleted();
            }
        })
    })

    return observable;
    //
    // var query = {
    //     where: {
    //         id_site: {$in: sitesId}
    //     },
    //     attributes: [
    //         'id_dechet',
    //         [sequelize.fn('SUM', sequelize.col('quantitee_finale')), 'quantitee_traitee']
    //     ],
    //     group: 'id_dechet',
    //     order: [
    //         [sequelize.literal('quantitee_traitee'), 'DESC']
    //     ],
    //     include: [
    //         {
    //             model: traitement,
    //             as: 'traitementFinal',
    //             attributes: [],
    //             where: {
    //                 date_priseencharge: {
    //                     $lte: endDate,
    //                     $gte: beginDate
    //                 }
    //             },
    //             include: [
    //                 {
    //                     model: type_traitement,
    //                     attributes: [],
    //                     where: {
    //                         qualification: {$like: qualification}
    //                     }
    //                 }
    //             ]
    //         },
    //         {
    //             model: dechet,
    //             attributes: [
    //                 'id',
    //                 'codeinterne',
    //                 'famille',
    //                 'libelle',
    //                 'is_listeverte',
    //             ]
    //         }
    //     ]
    // };
    //
    // if (typeof id != 'undefined') {
    //     query.include[0].where["id_prestataire"] = id;
    // }
    //
    // var observable = Rx.Observable.create((obs) => {
    //     bordereau.findAll(query)
    //         .then((bordereaux) => {
    //             obs.onNext(bordereaux);
    //             obs.onCompleted();
    //         })
    //         .catch((error) => {
    //             obs.onError(error);
    //         })
    // });
    // return observable;
}

function getQuantityForPrestataire(id, sitesId, beginDate, endDate) {
    var query = {
        attributes: [],
        where: {
            id_site: {$in: sitesId}
        },
        include: [
            {
                model: traitement,
                as: 'traitementFinal',
                attributes: [],
                where: {
                    id_prestataire: id,
                    date_priseencharge: {
                        $lte: endDate,
                        $gte: beginDate
                    }
                }
            }
        ]
    }
    var observable = Rx.Observable.create((obs) => {
        bordereau.sum('quantitee_finale', query)
            .then((sum) => {
                obs.onNext(sum);
                obs.onCompleted();
            })
            .catch((error) => {
                obs.onError(error);
            })
    })

    return observable;
}

function getPrestatairesCloseToPrestataire(prestataireName, givenDistance) {
    /* This function creates an Observable and returns it. It should searches
    for all the Prestataires that are close enough to the selected Prestataire
    */
    var getClosePrestatairesObservable = Rx.Observable.create(function(obs) {
        Distance.findAll({
            where: {
                $or: [
                    {
                        prestataire1: {$like: '%prestataireName%'}
                    },
                    {
                        prestataire2: {$like: '%prestataireName%'},
                    }
                ],
                distance: {$lte: givenDistance}
            }
        })
        .then(function(prestataires) {
            /*
            careful, this sends back objects looking like
            {prestataireName, ClosePrestataire, Distance}
            */
            obs.onCompleted(prestataires);
        })
        .catch(function(error) {
            obs.onError(error);
        });
    });
    return getClosePrestatairesObservable;
};


//All exported functionalities
service.getAllPrestataires = getAllPrestataires;
service.getPrestataireById = getPrestataireById;
service.getPrestataireByName = getPrestataireByName;
service.getPrestatairesCloseToPrestataire = getPrestatairesCloseToPrestataire;
service.getPrestatairesForSites = getPrestatairesForSites;
service.getQuantityForPrestataire = getQuantityForPrestataire;
service.getDechetsForPrestataire = getDechetsForPrestataire;

module.exports = service;
