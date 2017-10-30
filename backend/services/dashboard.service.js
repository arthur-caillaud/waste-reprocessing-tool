'use strict';
var Rx = require('rx');
var service = {};
var sequelize = require('sequelize');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'backend',
    password: 'password',
    database: 'db'
});

connection.connect();

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

var config = require('../config/config.json');
const tolerance = config.computing.tolerance;

/** All the get functions have exactly the same format:
    First we create a query corresponding to the data we want to find
    Then we create an observable object that will execute the request
    in the database

    For every function, we only consider a set of sites on a given date range
    NOTE: when used by the pre_computing, only a single site is usually provided
*/



// this function looks for all the bordereau in which the difference between
// the estimated quantity and the actual quantity is bigger than a max value
function getAllEcartsDePesee(idArray, beginDate, endDate, label) {

    const queryString = "SELECT * FROM bordereau INNER JOIN site ON bordereau.id_site = site.id " +
    "INNER JOIN transport AS transport1 ON transport1.id = bordereau.id_transport_1 INNER JOIN " +
    "traitement as traitementFinal ON traitementFinal.id = bordereau.id_traitement_final WHERE id_site IN (?) " +
    "AND (traitementFinal.date_priseencharge IS NOT NULL OR traitementFinal.id_type_traitement " +
    "IS NOT NULL) AND transport1.date < ? AND transport1.date >= ? AND (quantitee_finale - quantitee_transportee >= ? " +
    "OR quantitee_transportee - quantitee_finale >= ?)"

    const query = {
        sql: queryString,
        nestTables: true,
        values: [idArray, endDate, beginDate, tolerance, tolerance]
    };

    var observable = Rx.Observable.create((obs) => {
        connection.query(query, (error, results, fields) => {
            obs.onNext([results, label])
            obs.onCompleted()
        })
    })
    // const query = {
    //     include: [
    //         {
    //             model: traitement,
    //             as: 'traitementFinal',
    //             where: {
    //                 $or:
    //                     {
    //                         date_priseencharge: {
    //                             $not: null
    //                         },
    //                         id_type_traitement: {
    //                             $not: null
    //                         }
    //                     }
    //             }
    //         },
    //         {
    //             model: transport,
    //             as: 'transport1',
    //             where: {
    //                 date: {
    //                     $lt: endDate,
    //                     $gte: beginDate,
    //                 }
    //             }
    //         },
    //         {
    //             model: site,
    //         }
    //     ],
    //     where: {
    //         id_site: {$in: idArray},
    //         $or: [
    //             sequelize.where(sequelize.literal('quantitee_finale - quantitee_transportee'), '>=', tolerance),
    //             sequelize.where(sequelize.literal('quantitee_transportee - quantitee_finale'), '>=', tolerance)
    //         ]
    //     }
    // };
    // var observable = Rx.Observable.create(obs => {
    //     bordereau.findAll(query)
    //         .then(bordereaux => {
    //             obs.onNext([bordereaux, label]);
    //             obs.onCompleted();
    //         })
    //         .catch(err => {
    //             obs.onError(err);
    //         });
    // });
    return observable;
}



// this function looks for all the bordereau in which the actual treatment is
// different to the required treatment (that was asked)
function getAllIncoherencesFilieres(idArray, dangereux, beginDate, endDate, label) {

    const queryString = "SELECT * FROM bordereau INNER JOIN traitement AS traitementFinal ON " +
    "traitementFinal.id = bordereau.id_traitement_final INNER JOIN transport AS transport1 ON " +
    "transport1.id = bordereau.id_transport_1 INNER JOIN site ON site.id = bordereau.id_site " +
    "INNER JOIN dechet ON dechet.id = bordereau.id_dechet WHERE traitementFinal.id_type_traitement != bordereau.id_traitement_prevu " +
    "AND transport1.date < ? AND transport1.date >= ? AND dechet.is_dangereux = ? " +
    "AND id_site IN (?)";

    const query = {
        sql: queryString,
        nestTables: true,
        values: [endDate, beginDate, dangereux, idArray]
    };

    var observable = Rx.Observable.create(obs => {
        connection.query(query, (error, results, fields) => {
            obs.onNext([results, label]);
            console.log(error);
            obs.onCompleted();
        })
    })
    // var getAllIncoherencesFilieresObservable = Rx.Observable.create(obs => {
    //     bordereau.findAll({
    //         where: {
    //             id_site: {$in: idArray}
    //         },
    //         include: [
    //             {
    //                 model: traitement,
    //                 as: 'traitementFinal',
    //                 required: true,
    //                 where: {
    //                     id_type_traitement: {
    //                         $ne: sequelize.col('bordereau.id_traitement_prevu')
    //                     }
    //                 },
    //             },
    //             {
    //                 model: transport,
    //                 as: 'transport1',
    //                 where: {
    //                     date: {
    //                         $lt: endDate,
    //                         $gte: beginDate
    //                     }
    //                 }
    //             },
    //             {
    //                 model: site
    //             },
    //             {
    //                 model: dechet,
    //                 where: {
    //                     is_dangereux: dangereux
    //                 }
    //             }
    //     ]
    //     })
    //     .then(bordereaux => {
    //         obs.onNext([bordereaux, label]);
    //         obs.onCompleted();
    //     })
    //     .catch(err => {
    //         obs.onError(err)
    //     })
    // })
    // return getAllIncoherencesFilieresObservable;
    return observable;
};



// this function looks for all the bordereaux in which the treatment applied to
// the waste is forbidden (regardless of what was asked)
// For instance: if oil is burnt or rejected into water (forbidden by law)
function getAllFilieresInterdites(idArray, dangereux, beginDate, endDate, label){

    var queryString = "SELECT * FROM bordereau INNER JOIN site ON site.id = " +
    "bordereau.id_site INNER JOIN transport AS transport1 ON transport1.id = bordereau.id_transport_1 " +
    "INNER JOIN traitement AS traitementFinal ON traitementFinal.id = bordereau.id_traitement_final INNER JOIN " +
    " dechet ON dechet.id = bordereau.id_dechet INNER JOIN referentiel_dechet ON " +
    "referentiel_dechet.id_dechet = dechet.id WHERE dechet.is_dangereux = ? AND " +
    "referentiel_dechet.gestion = 'r' AND transport1.date < ? AND transport1.date >= ? "  +
    "AND traitementFinal.id_type_traitement = referentiel_dechet.id_type_traitement AND " +
    "id_site IN (?)";

    var query = {
        sql: queryString,
        nestTables: true,
        values: [dangereux, endDate, beginDate, idArray]
    };

    var observable = Rx.Observable.create((obs) => {
        connection.query(query, (error, values, fields) => {
            obs.onNext([values, label]);
            obs.onCompleted();
        })
    })

    return observable;

    // var getAllFilieresInterditesObservable = Rx.Observable.create(obs => {
    //     bordereau.findAll({
    //         include: [
    //             {
    //                 model: dechet,
    //                 required: true,
    //                 where: {
    //                     is_dangereux: dangereux
    //                 },
    //                 include: {
    //                     model: referentiel_dechet,
    //                     required: true,
    //                     where: {
    //                         gestion: 'r'
    //                     }
    //                 }
    //             },
    //             {
    //                 model: site
    //             },
    //             {
    //                 model: transport,
    //                 as: 'transport1',
    //                 where: {
    //                     date: {
    //                         $lt: endDate,
    //                         $gte: beginDate
    //                     }
    //                 }
    //             },
    //             {
    //                 model: traitement,
    //                 as: 'traitementFinal',
    //             }],
    //         where: {
    //             traitement: sequelize.where(sequelize.col('traitementFinal.id_type_traitement'),sequelize.col('dechet->referentiel_dechets.id_type_traitement')),
    //             id_site: {$in: idArray}
    //         }
    //     }).
    //     then(bordereauxAvecFilieresInterdites => {
    //         obs.onNext([bordereauxAvecFilieresInterdites, label]);
    //         obs.onCompleted();
    //     }).
    //     catch(err => {
    //         obs.onError(err)
    //     })
    // });
    // return getAllFilieresInterditesObservable;
};



// this function looks for all the bordereaux in which the difference between the
// current date (passed in the arguments) and the moment when the bordereau was
// received is bigger than a limit
// NOTE: the limit depends on the type of waste (30 days if dangerous, 60 if not)
function getAllRetards(idArray, dangereux, date, beginDate, endDate, label) {

    if (dangereux==1) {
        var maxDelay = 30 * 24 * 60 * 60 * 1000;
    }
    else {
        var maxDelay = 60 * 24 * 60 * 60 * 1000;
    }

    var ms = Date.parse(date);
    var dateLimit = new Date(ms - maxDelay);

    var month = dateLimit.getMonth() + 1;

    if (month < 10) {
        month = '0' + month;
    }

    var day = dateLimit.getDate();
    if (day < 10) {
        day = '0' + day;
    }

    var dateLimitString = '' + dateLimit.getFullYear() + '-' + month + '-' + day;

    var queryString = "SELECT * FROM bordereau INNER JOIN dechet ON dechet.id = " +
    "bordereau.id_dechet INNER JOIN transport AS transport1 ON transport1.id = bordereau.id_transport_1 " +
    "INNER JOIN site ON site.id = bordereau.id_site WHERE dechet.is_dangereux = ? " +
    "AND transport1.date < ? AND transport1.date >= AND transport1.date <= ? AND " +
    "id_site IN (?) AND bordereau_finished = 0";

    var query = {
        sql: queryString,
        nestTables: true,
        values: [dangereux, endDate, beginDate, dateLimitString, idArray]
    };

    var observable = Rx.Observable.create((obs) => {
        connection.query(query, (error, results, fields) => {
            obs.onNext(results);
            obs.onCompleted();
            console.log(error);
        })
    })

    // var query = {
    //     include: [
    //         {
    //             model: dechet,
    //             where: {
    //                 is_dangereux: dangereux
    //             }
    //         },
    //         {
    //             model: site
    //         },
    //         {
    //             model: transport,
    //             as: 'transport1',
    //             where: {
    //                 date: {
    //                     $lt: endDate,
    //                     $gte: beginDate,
    //                     $lte: dateLimitString
    //                 }
    //             }
    //         }
    //         ],
    //     where: {
    //         id_site: {$in: idArray},
    //         bordereau_finished: 0
    //     }
    // };
    //
    // // console.log(query.include[2].where.date);
    //
    // // console.log(Date.getUTCDate(date-maxDelay));
    // // console.log(Date.getUTCDate(date-maxDelay-month));
    //
    // var observable = Rx.Observable.create((obs) => {
    //     bordereau.findAll(query)
    //     .then((bordereaux) => {
    //         // console.log(bordereaux[0].dataValues);
    //         // console.log("total " + dangereux + ": " + bordereaux.length);
    //         // console.log(result.length);
    //         obs.onNext([bordereaux, label]);
    //         obs.onCompleted();
    //     })
    //     .catch((err) => {
    //         obs.onError(err);
    //     })
    // });
    return observable;
};


function getAllRetardsDetails(idArray, dangereux, date, label) {

    // console.log(date);

    if (dangereux==1) {
        var maxDelay = 30 * 24 * 60 * 60 * 1000;
    }
    else {
        var maxDelay = 60 * 24 * 60 * 60 * 1000;
    }

    var ms = Date.parse(date);
    var lastDate = (new Date(ms-maxDelay));

    // console.log("dangereux: " + dangereux);
    // console.log("before " +lastDate);
    // console.log("after " + firstDate);

    var queryString = "SELECT * FROM bordereau INNER JOIN dechet ON dechet.id = " +
    "bordereau.id_dechet INNER JOIN site ON site.id = bordereau.id_site INNER JOIN " +
    "transport AS transport1 ON transport1.id = bordereau.id_transport_1 WHERE dechet.is_dangereux " +
    "= ? AND transport1.date < ? AND id_site IN (?) AND bordereau_finished = 0";

    var query = {
        sql: queryString,
        nestTables: true,
        values: [dangereux, lastDate, idArray]
    };

    var observable = Rx.Observable.create((obs) => {
        connection.query(query, (error, results, fields) => {
            console.log(error);
            obs.onNext([results, label]);
            obs.onCompleted();
        })
    })

    return observable;

    // var query = {
    //     include: [
    //         {
    //             model: dechet,
    //             where: {
    //                 is_dangereux: dangereux
    //             }
    //         },
    //         {
    //             model: site
    //         },
    //         {
    //             model: transport,
    //             as: 'transport1',
    //             where: {
    //                 date: {
    //                     $lt: lastDate,
    //                 }
    //             }
    //         }
    //         ],
    //     where: {
    //         id_site: {$in: idArray},
    //         bordereau_finished: 0
    //     }
    // };

    // console.log(query.include[2].where.date);

    // console.log(Date.getUTCDate(date-maxDelay));
    // console.log(Date.getUTCDate(date-maxDelay-month));

    // var observable = Rx.Observable.create((obs) => {
    //     bordereau.findAll(query)
    //     .then((bordereaux) => {
    //         // console.log(bordereaux[0].dataValues);
    //         // console.log("total: " + bordereaux.length);
    //         obs.onNext([bordereaux, label]);
    //         obs.onCompleted();
    //     })
    //     .catch((err) => {
    //         obs.onError(err);
    //     })
    // });
    // return observable;
};


// this function looks for all the bordereaux and sums the total volume
// processed. If no bordereau exists for the given site, returns 0
function getTotalVolume(idArray, beginDate, endDate, label) {
    //
    // var queryString = "SELECT quantitee_finale, quantitee_transportee FROM bordereau " +
    // "INNER JOIN traitement ON traitement.id = bordereau.id_traitement_final INNER JOIN " +
    // "transport ON transport.id = bordereau.id_transport_1 WHERE transport.date < ? " +
    // "AND transport.date >= ? AND id_site IN (?)";
    //
    // var query = {
    //     sql: queryString,
    //     values: [endDate, beginDate, idArray]
    // };
    //
    // var observable = Rx.Observable.create((obs) => {
    //     connection.query(query, (error, results, fields) => {
    //         console.log(results);
    //         obs.onNext([0, label]);
    //         obs.onCompleted();
    //     })
    // })
    //
    // return observable;


    var observable = Rx.Observable.create((obs) => {
        bordereau.findAll({
            include: [
                {
                    model: traitement,
                    as: 'traitementFinal',
                    attributes: [],
                },
                {
                    model: transport,
                    as: 'transport1',
                    attributes: [],
                    where: {
                        date: {
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
        .then((bordereaux) => {
            var sum = 0
            bordereaux.forEach((bordereau) => {
                var quantitee_finale = parseFloat(bordereau.dataValues.quantitee_finale);
                var quantitee_transportee = parseFloat(bordereau.dataValues.quantitee_transportee);
                if (quantitee_finale == 0) {
                    sum += quantitee_transportee;
                }
                else {
                    sum += quantitee_finale;
                }
            })
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
        bordereau.findAll({
            include: [
                {
                    model: traitement,
                    as: 'traitementFinal',
                    attributes: [],
                },
                {
                    model: transport,
                    as: 'transport1',
                    attributes: [],
                    where: {
                        date: {
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
        .then((bordereaux) => {
            var sum = 0
            bordereaux.forEach((bordereau) => {
                var quantitee_finale = parseFloat(bordereau.dataValues.quantitee_finale);
                var quantitee_transportee = parseFloat(bordereau.dataValues.quantitee_transportee);
                if (quantitee_finale == 0) {
                    sum += quantitee_transportee;
                }
                else {
                    sum += quantitee_finale;
                }
            })
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
        attributes: ['id', 'quantitee_finale', 'quantitee_transportee'],
        include: [
            {
                model: traitement,
                as: 'traitementFinal',
                attributes: ['id'],
            },
            {
                model: transport,
                as: 'transport1',
                attributes: [],
                where: {
                    date: {
                        $lt: endDate,
                        $gte: beginDate
                    }
                }
            },
            {
                model: type_traitement,
                attributes: ['id', 'qualification'],
                where: {
                    qualification: "Recyclage"
                }
            }
        ],
        where: {
            id_site: {$in: idArray},
            type_traitement: sequelize.where(sequelize.literal('qualification'), 'Recyclage')
        }
    };
    var observable = Rx.Observable.create((obs) => {
        bordereau.findAll(query)
            .then((bordereaux) => {
                var sum = 0
                bordereaux.forEach((bordereau) => {
                    var quantitee_finale = parseFloat(bordereau.dataValues.quantitee_finale);
                    var quantitee_transportee = parseFloat(bordereau.dataValues.quantitee_transportee);
                    if (quantitee_finale == 0) {
                        sum += quantitee_transportee;
                    }
                    else {
                        sum += quantitee_finale;
                    }
                })
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
                as: 'traitementFinal',
                attributes: ['id'],
            },
            {
                model: transport,
                attributes: [],
                as: 'transport1',
                where: {
                    date: {
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
            },
            {
                model: type_traitement,
                attributes: ['id', 'qualification'],
                where: {
                    qualification: "Recyclage"
                }
            }
        ],
        where: {
            id_site: {$in: idArray},
            type_traitement: sequelize.where(sequelize.literal('qualification'), 'Recyclage')
        }
    };
    var observable = Rx.Observable.create((obs) => {
        bordereau.findAll(query)
            .then((bordereaux) => {
                var sum = 0
                bordereaux.forEach((bordereau) => {
                    var quantitee_finale = parseFloat(bordereau.dataValues.quantitee_finale);
                    var quantitee_transportee = parseFloat(bordereau.dataValues.quantitee_transportee);
                    if (quantitee_finale == 0) {
                        sum += quantitee_transportee;
                    }
                    else {
                        sum += quantitee_finale;
                    }
                })
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
                 as: 'traitementFinal',
                 attributes: [],
             },
             {
                 model: transport,
                 as: 'transport1',
                 attributes: [],
                 where: {
                     date: {
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


function getUndated(idArray, label) {
    var query1 = {
        include: [
            {
                model: traitement,
                as: 'traitementFinal',
                attributes: [],
                where: {
                    date_priseencharge: null
                }
            },
            {
                model: site
            }
        ],
        where: {
            id_site: {$in: idArray}
        }
    };

    var query2 = {
        where: {
            id_site: {$in: idArray},
            id_traitement_final: null
        }
    }

    var observable = Rx.Observable.create((obs) => {
        bordereau.findAll(query1)
            .then((bordereaux1) => {
                bordereau.findAll(query2)
                    .then((bordereaux2) => {
                        obs.onNext([bordereaux1.concat(bordereaux2), label]);
                        obs.onCompleted();
                    })
                    .catch((error) => {
                        throw error;
                    })
            })
            .catch((error) => {
                obs.onError(error);
            })
    });

    return observable;
}



// this function returns an observable with all the elements in the table
// matching the provided id and date.
// NOTE: considering the constraints, it should return only one site (or 0)
function getDataForSites(idArray, beginDate, endDate) {
    console.log(new Date());
    var query = {
        sql: 'SELECT * FROM dashboard WHERE id_site IN (?) AND date < ? AND date >= ?',
        values: [idArray, endDate, beginDate]
    }

    var observable = Rx.Observable.create((observer) => {
        connection.query(query, (error, results, fields) => {
            observer.onNext(results);
            observer.onCompleted();
            if (error) {
                observer.onError(error);
            }
        })
    })
    // var query = {
    //     where: {
    //         id_site: {$in: idArray},
    //         date: {
    //             $lt: endDate,
    //             $gte: beginDate
    //         }
    //     }
    // };
    //
    // var observable = Rx.Observable.create((observer) => {
    //     dashboard.findAll(query)
    //         .then((elements) => {
    //             observer.onNext(elements);
    //             observer.onCompleted();
    //         })
    //         .catch ((error) => {
    //             observer.onError(error);
    //         });
    // });
    return observable;
}

// this function is called to get the details in the dashboard for the requested
// sites. All the data must be processed by hands, but it will be called after
// the main function, so time is not really a big factor here
function getDetailsForSites(beginDate, endDate, idArray) {

    var observable = Rx.Observable.create((observer) => {

        var date = new Date();

        var result = {};
        var loopsToDo = 9;

        var tempNext = (data) => {
            result[data[1]] = data[0];
            loopsToDo -= 1;
        }

        var tempError = (error) => {
            console.error(error);
            throw error;
        }

        var tempCompleted = () => {
            try {
                if (loopsToDo == 0) {
                    observer.onNext(result);
                    observer.onCompleted();
                }
            }
            catch (error) {
                observer.onError(error);
            }
        }

        var observerEcarts = Rx.Observer.create(tempNext, tempError, tempCompleted);
        getAllEcartsDePesee(idArray, beginDate, endDate, "ecarts_pesee")
            .subscribe(observerEcarts);

        var observerIncoherences = Rx.Observer.create(tempNext, tempError, tempCompleted);
        getAllIncoherencesFilieres(idArray, 0, beginDate, endDate, "incoherences_filieres_norm")
            .subscribe(observerIncoherences);

        var observerIncoherencesDD = Rx.Observer.create(tempNext, tempError, tempCompleted);
        getAllIncoherencesFilieres(idArray, 1, beginDate, endDate, "incoherences_filieres_dd")
            .subscribe(observerIncoherencesDD);

        var observerFilieresInterdites = Rx.Observer.create(tempNext, tempError, tempCompleted);
        getAllFilieresInterdites(idArray, 0, beginDate, endDate, "filieres_interdites_norm")
            .subscribe(observerFilieresInterdites);

        var observerFilieresInterditesDD = Rx.Observer.create(tempNext, tempError, tempCompleted);
        getAllFilieresInterdites(idArray, 1, beginDate, endDate, "filieres_interdites_dd")
            .subscribe(observerFilieresInterditesDD);

        var observerRetards = Rx.Observer.create(tempNext, tempError, tempCompleted);
        getAllRetardsDetails(idArray, 0, endDate, "retards_norm")
            .subscribe(observerRetards);

        var observerRetardsDD = Rx.Observer.create(tempNext, tempError, tempCompleted);
        getAllRetardsDetails(idArray, 1, endDate, "retards_dd")
            .subscribe(observerRetardsDD);

        var observerCounter = Rx.Observer.create(tempNext, tempError, tempCompleted);
        countBordereaux(idArray, beginDate, endDate, "bordereaux")
            .subscribe(observerCounter);

        var observerUndated = Rx.Observer.create(tempNext, tempError, tempCompleted);
        getUndated(idArray, "non_dates")
            .subscribe(observerUndated);
    })

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


function getDashboards() {
    var observable = Rx.Observable.create((observer) => {
        dashboard.findAll()
            .then((data) => {
                observer.onNext(data);
                observer.onCompleted();
            })
            .catch((error) => {
                observer.onError(error);
            })
    });
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
service.getDashboards = getDashboards;
service.getDetailsForSites = getDetailsForSites;
service.getUndated = getUndated;

module.exports = service;
