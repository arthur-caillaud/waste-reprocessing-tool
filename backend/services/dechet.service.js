'use strict';
var Rx = require('rx');
var service = {};
var sequelize = require('sequelize');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '91.134.242.69',
    user: 'root',
    password: 'arthurpierreaurelien',
    database: 'db'
});

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

    var queryString = "SELECT dechet.* FROM bordereau INNER JOIN transport ON " +
    "transport.id = bordereau.id_transport_1 INNER JOIN dechet ON dechet.id = " +
    "bordereau.id_dechet WHERE bordereau.id_site IN (?) AND transport.date < " +
    "? AND transport.date >= ? GROUP BY dechet.id " +
    "ORDER BY SUM(bordereau.quantitee_transportee) DESC";

    var query = {
        sql: queryString,
        values: [idArray, endDate, beginDate]
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

function getPrestatairesForDechet(id, sitesId, recycled, beginDate, endDate) {

    // TODO use a dictionnary for this
    var qualification;
    if (recycled == 1) {
        qualification = "Recyclage";
    }
    else {
        qualification = "%";
    }

    var queryString = "SELECT SUM(quantitee_finale) AS quantitee_traitee, " +
    "prestataire.nom, prestataire.siret, prestataire.id, prestataire.localisation " +
    "FROM bordereau INNER JOIN traitement ON traitement.id = bordereau.id_traitement_final " +
    "INNER JOIN type_traitement ON type_traitement.id = bordereau.id_traitement_prevu " +
    "INNER JOIN transport ON transport.id = bordereau.id_transport_1 " +
    "INNER JOIN prestataire ON traitement.id_prestataire = prestataire.id " +
    "WHERE bordereau.id_site IN (?) AND bordereau.id_dechet = ? AND " +
    "transport.date < ? AND transport.date >= ? " +
    "AND type_traitement.qualification LIKE ? " +
    "GROUP BY prestataire.id  HAVING SUM(quantitee_finale) > 0 ORDER BY SUM(quantitee_finale) DESC"

    var query = {
        sql: queryString,
        nestTables: true,
        values: [sitesId, id, endDate, beginDate, qualification]
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
}

service.getAllDechets = getAllDechets;
service.getDechetById = getDechetById;
service.getDechetsForSites = getDechetsForSites;
service.getPrestatairesForDechet = getPrestatairesForDechet;

module.exports = service;
