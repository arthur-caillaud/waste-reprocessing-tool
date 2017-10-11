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

function getAllEcartsDePesee(tolerance, idArray, beginDate, endDate, label) {
    const query = {
        include: [
            {
                model: traitement,
                where: {
                    date_priseencharge: {
                        $lt: endDate,
                        $gte: beginDate,
                    }
                }
            }
        ],
        where: {
            id_site: {$in: idArray},
            $or: [
                sequelize.where(sequelize.literal('quantitee_finale - quantitee_transportee'), '>', tolerance),
                sequelize.where(sequelize.literal('quantitee_transportee - quantitee_finale'), '>', tolerance)
            ]
        }
    };
    var observable = Rx.Observable.create(obs => {
        bordereau.findAll(query)
            .then(bordereaux => {
                obs.onNext([bordereaux, label]);
                obs.onCompleted();
            })
            .catch(err => {
                obs.onError(err);
            });
    });
    return observable;
}

function getAllIncoherencesFilieres(idArray, dangereux, beginDate, endDate, label) {
    var getAllIncoherencesFilieresObservable = Rx.Observable.create(obs => {
        bordereau.findAll({
            where: {
                id_site: {$in: idArray}
            },
            include: [
                {
                    model: traitement,
                    required: true,
                    where: {
                        date_priseencharge: {
                            $lt: endDate,
                            $gte: beginDate,
                        }
                    },
                },
                {
                    model: dechet,
                    where: {
                        is_dangereux: dangereux
                    }
                }
        ]
        })
        .then(bordereaux => {
            let bordereauxAvecIncoherencesFilieres = [];
            bordereaux.forEach(bordereau => {
                let traitementPrevu = bordereau.dataValues.id_traitement_prevu;
                let traitementFinal = bordereau.dataValues.traitement.id_type_traitement;
                if(traitementPrevu != traitementFinal){
                    bordereauxAvecIncoherencesFilieres.push(bordereau);
                }
            });
            obs.onNext([bordereauxAvecIncoherencesFilieres, label]);
            obs.onCompleted();
        })
        .catch(err => {
            obs.onError(err)
        })
    })
    return getAllIncoherencesFilieresObservable;
};

function getAllFilieresInterdites(idArray, dangereux, beginDate, endDate, label){

    var getAllFilieresInterditesObservable = Rx.Observable.create(obs => {
        bordereau.findAll({
            include: [
                {
                    model: dechet,
                    required: true,
                    where: {
                        is_dangereux: dangereux
                    },
                    include: {
                        model: referentiel_dechet,
                        required: true,
                        where: {
                            gestion: 'r'
                        }
                    }
                },
                {
                    model: traitement,
                    where: {
                        date_priseencharge: {
                            $lt: endDate,
                            $gte: beginDate,
                        }
                    }
                },
                {
                    model: traitement,
                    required: true
                }],
            where: {
                traitement: sequelize.where(sequelize.col('traitement.id_type_traitement'),sequelize.col('dechet->referentiel_dechets.id_type_traitement')),
                id_site: {$in: idArray}
            }
        }).
        then(bordereauxAvecFilieresInterdites => {
            obs.onNext([bordereauxAvecFilieresInterdites, label]);
            obs.onCompleted();
        }).
        catch(err => {
            obs.onError(err)
        })
    });
    return getAllFilieresInterditesObservable;
};

function getAllRetards(idArray, dangereux, date, label) {

    if (dangereux==1) {
        var maxDelay = 30 * 60 * 60 * 1000;
    }
    else {
        var maxDelay = 60 * 60 * 60 * 1000;
    }


    var observable = Rx.Observable.create((obs) => {
        console.log("maxDelay " + maxDelay);
        bordereau.findAll({
            include: [
                {
                    model: traitement,
                    where: {
                        date_priseencharge: {$lt: (date - maxDelay)}
                }},
                {
                    model: dechet,
                    where: {
                        is_dangereux: dangereux
                    }
                }
                ],
            where: {
                id_site: {$in: idArray},
                bordereau_finished: false
            }
        })
        .then((bordereaux) => {
            obs.onNext([bordereaux, label]);
            obs.onCompleted();
        })
        .catch((err) => {
            obs.onError(err);
        })
    });
    return observable;
};

function getTotalVolume(idArray, beginDate, endDate, label) {
    var observable = Rx.Observable.create((obs) => {
        bordereau.sum('quantitee_finale', {
            include: [
                {
                    model: traitement,
                    where: {
                        date_priseencharge: {
                            $lt: endDate,
                            $gte: beginDate,
                        }
                    }
                }
            ],
            where: {
                id_site: {$in: idArray},
            },

        })
        .then((sum) => {
            obs.onNext([bordereaux, label]);
            obs.onCompleted();
        })
        .catch((err) => {
            obs.onError(err);
        });
    });
    return observable;
}

var service = {};

service.getAllEcartsDePesee = getAllEcartsDePesee;
service.getAllIncoherencesFilieres = getAllIncoherencesFilieres;
service.getAllFilieresInterdites = getAllFilieresInterdites;
service.getAllRetards = getAllRetards;
service.getTotalVolume = getTotalVolume;

module.exports = service;
