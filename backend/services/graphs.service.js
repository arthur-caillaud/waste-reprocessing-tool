'use strict';
var Rx = require('rx');
var service = {};
var sequelize = require('sequelize');

//Import required local modules
var models = require('../models/');
var db = require('../datamanagement/db.js');
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



/** All the get functions have exactly the same format:
    First we create a query corresponding to the data we want to find
    Then we create an observable object that will execute the request
    in the database
*/

function getQuantity(idPrestataire, idDechet, beginDate, endDate, sites, label) {
    var beginDate = "2017-01-01";
    var endDate = "2017-11-01";

    const query = {
        attributes: [],
        where: {
            id_dechet: idDechet
        },
        include: [
            {
                model: traitement,
                attributes: [],
                where: {
                    date_priseencharge: {
                        $lte: endDate,
                        $gte: beginDate
                    }
                },
                include: [
                    {
                        model: prestataire,
                        attributes: [],
                        where: {
                            id: idPrestataire
                        }
                    }
                ]
            }
        ]
    };

    if (typeof sites != "undefined") {
        query["where"]["id_site"] = {$in: sites};
    }

    var observable = Rx.Observable.create(obs => {
        bordereau.sum('quantitee_finale', query)
            .then((sum) => {
                if (isNaN(sum)) {
                    sum = 0;
                }
                obs.onNext([sum, label]);
                obs.onCompleted();
            })
            .catch((err) => {
                obs.onError(err);
            });
    });
    return observable;
}


function getRecycledQuantity(idPrestataire, idDechet, beginDate, endDate, sites, label) {
    const query = {
        attributes: [],
        include: [
            {
                model: traitement,
                attributes: [],
                where: {
                    date_priseencharge: {
                        $lte: endDate,
                        $gte: beginDate
                    }
                },
                include: [
                    {
                        model: type_traitement,
                        attributes: [],
                        where: {
                            qualification: "Recyclage"
                        }
                    },
                    {
                        model: prestataire,
                        attributes: [],
                        where: {
                            id: idPrestataire
                        }
                    },
                ]
            }
        ],
        where: {
            id_dechet: idDechet
        }
    };

    if (typeof sites != "undefined") {
        query["where"]["id_site"] = {$in: sites};
    }

    var observable = Rx.Observable.create(obs => {
        bordereau.sum('quantitee_finale', query)
            .then((sum) => {
                if (isNaN(sum)) {
                    sum = 0;
                }
                obs.onNext([sum, label]);
                obs.onCompleted();
            })
            .catch((err) => {
                obs.onError(err);
            });
    });
    return observable;
}

var service = {};

service.getQuantity = getQuantity;
service.getRecycledQuantity = getRecycledQuantity;

module.exports = service;
