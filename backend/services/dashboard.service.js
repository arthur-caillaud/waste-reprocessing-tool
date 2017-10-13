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
                        },
                        id_type_traitement: {
                            $ne: sequelize.col('bordereau.id_traitement_prevu')
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
            obs.onNext([bordereaux, label]);
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
                    attributes: [],
                    where: {
                        date_priseencharge: {
                            $lt: endDate,
                            $gte: beginDate
                        }
                    }
                }
            ],
            where: {
                id_site: {$in: idArray}
            }
        })
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
};


function getTotalVolumeVerte(idArray, beginDate, endDate, label) {
    var observable = Rx.Observable.create((obs) => {
        bordereau.sum('quantitee_finale', {
            include: [
                {
                    model: traitement,
                    attributes: [],
                    where: {
                        date_priseencharge: {
                            $lt: endDate,
                            $gte: beginDate
                        }
                    }
                },
                {
                    model: dechet,
                    attributes: [],
                    where: {
                        is_listeverte: 1
                    }
                }
            ],
            where: {
                id_site: {$in: idArray}
            }
        })
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
};

function getValorisationTotale(idArray, beginDate, endDate, label) {
    var query = {
        include: [
            {
                model: traitement,
                attributes: [],
                where: {
                    id: sequelize.where(sequelize.col('bordereau.id_traitement_final'), sequelize.col('traitement.id')),
                    date_priseencharge: {
                        $lt: endDate,
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
                    }
                ]
            },
        ],
        where: {
            id_site: {$in: idArray}
        }
    };
    var observable = Rx.Observable.create((obs) => {
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

function getValorisationVerte(idArray, beginDate, endDate, label) {
    var query = {
        include: [
            {
                model: traitement,
                attributes: [],
                where: {
                    id: sequelize.where(sequelize.col('bordereau.id_traitement_final'), sequelize.col('traitement.id')),
                    date_priseencharge: {
                        $lt: endDate,
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
                    }
                ]
            },
            {
                model: dechet,
                attributes: [],
                where: {
                    is_listeverte: 1
                }
            }
        ],
        where: {
            id_site: {$in: idArray}
        }
    };
    var observable = Rx.Observable.create((obs) => {
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


function countBordereaux(idArray, beginDate, endDate, label) {
    /* This function creates an Observable and returns it. It counts all bordereaux
     * Args: queryParameters, parameters for the query, in the following form:
     * {attributes: string[], where: {fieldA: string, ...}, order: string[]}
     */
     var query = {
         include: [
             {
                 model: traitement,
                 attributes: [],
                 where: {
                     id: sequelize.where(sequelize.col('bordereau.id_traitement_final'), sequelize.col('traitement.id')),
                     date_priseencharge: {
                         $lt: endDate,
                         $gte: beginDate
                     }
                 }
             }
         ],
         where: {
             id_site: {$in: idArray}
         }
     }

    var observable = Rx.Observable.create((observer) => {
        bordereau.count(query)
            .then((n) => {
                observer.onNext([n, label]);
                observer.onCompleted();
            })
            .catch ((error) => {
                observer.onError(error);
            });
    });
    return observable;
}


function getDataForSites(idArray, date) {
    var query = {
        where: {
            id_site: {$in: idArray},
            date: date
        }
    };

    var observable = Rx.Observable.create((observer) => {
        dashboard.findAll(query)
            .then((elements) => {
                observer.onNext(elements);
                observer.onCompleted();
            })
            .catch ((error) => {
                observer.onError(error);
            });
    });
    return observable;
}

function updateEntry(newEntry) {
    var query = {
        where: {
            id_site: newEntry["id_site"],
            date: newEntry["date"]
        }
    };

    var observable = Rx.Observable.create((observer) => {
        dashboard.findOne(query)
            .then((entry) => {
                entry.update(newEntry)
                    .then(() => {
                        observer.onNext();
                        observer.onCompleted();
                    })
                    .catch((error) => {
                        observer.onError(error);
                    })
            })
            .catch((error) => {
                observer.onError(error)
            })
    })
    return observable;
}

var service = {};

service.getAllEcartsDePesee = getAllEcartsDePesee;
service.getAllIncoherencesFilieres = getAllIncoherencesFilieres;
service.getAllFilieresInterdites = getAllFilieresInterdites;
service.getAllRetards = getAllRetards;
service.getTotalVolume = getTotalVolume;
service.getValorisationTotale = getValorisationTotale;
service.getValorisationVerte = getValorisationVerte;
service.getTotalVolumeVerte = getTotalVolumeVerte;
service.countBordereaux = countBordereaux;
service.getDataForSites = getDataForSites;
service.updateEntry = updateEntry;

module.exports = service;
