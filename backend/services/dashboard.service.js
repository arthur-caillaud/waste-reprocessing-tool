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

    For every function, we only consider a set of sites on a given date range
    NOTE: when used by the pre_computing, only a single site is usually provided
*/



// this function looks for all the bordereau in which the difference between
// the estimated quantity and the actual quantity is bigger than a max value
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



// this function looks for all the bordereau in which the actual treatment is
// different to the required treatment (that was asked)
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



// this function looks for all the bordereaux in which the treatment applied to
// the waste is forbidden (regardless of what was asked)
// For instance: if oil is burnt or rejected into water (forbidden by law)
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



// this function looks for all the bordereaux in which the difference between the
// current date (passed in the arguments) and the moment when the bordereau was
// received is bigger than a limit
// NOTE: the limit depends on the type of waste (30 days if dangerous, 60 if not)
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



// this function looks for all the bordereaux and sums the total volume
// processed. If no bordereau exists for the given site, returns 0
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



// this function looks for all the bordereaux  with wastes in the green list
// and sums the total volume processed. If no bordereau exists for the given
// site, returns 0
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



// this function looks for all the bordereaux and sums the total volume
// recycled. If no bordereau exists for the given site, returns 0
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



// this function looks for all the bordereaux  with wastes in the green list
// and sums the total volume recycled. If no bordereau exists for the given
// site, returns 0
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



// this function counts all the bordereaux for a given site
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



// this function returns an observable with all the elements in the table
// matching the provided id and date.
// NOTE: considering the constraints, it should return only one site (or 0)
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



// this function updates an existing entry in the dashboard table
// we provide the new entry as parameters.
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
                entry.update(newEntry.dataValues)
                    .then(() => {
                        entry.save()
                            .then(() => {
                                observer.onNext();
                                observer.onCompleted();
                            })
                            .catch((error) => {
                                throw error;
                            })
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
