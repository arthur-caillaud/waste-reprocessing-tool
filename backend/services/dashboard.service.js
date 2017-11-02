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

var env       = process.env.NODE_ENV || 'development';
var dbConfig    = require(__dirname + '/../config/config.json')[env];

var connectionInfo = {
    host: dbConfig.host,
    user: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database
}

var connection = mysql.createConnection(connectionInfo);

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
            if (error) {
                obs.onError(error);
            }
            else {
                obs.onNext([results, label])
                obs.onCompleted()
            }
        })
    })
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
            if (error) {
                obs.onError(error);
            }
            else {
                obs.onNext([results, label]);
                obs.onCompleted();
            }
        })
    })
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
        connection.query(query, (error, results, fields) => {
            if (error) {
                obs.onError(error);
            }
            else {
                obs.onNext([results, label]);
                obs.onCompleted();
            }
        })
    })

    return observable;
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
    "AND transport1.date < ? AND transport1.date >= ? AND transport1.date <= ? AND " +
    "id_site IN (?) AND bordereau_finished = 0";

    var query = {
        sql: queryString,
        nestTables: true,
        values: [dangereux, endDate, beginDate, dateLimitString, idArray]
    };

    var observable = Rx.Observable.create((obs) => {
        connection.query(query, (error, results, fields) => {
            if (error) {
                obs.onError(error);
            }
            else {
                obs.onNext([results, label]);
                obs.onCompleted();
            }
        })
    })
    return observable;
};

function getAllRetardsDetails(idArray, dangereux, date, label) {

    if (dangereux==1) {
        var maxDelay = 30 * 24 * 60 * 60 * 1000;
    }
    else {
        var maxDelay = 60 * 24 * 60 * 60 * 1000;
    }

    var ms = Date.parse(date);
    var lastDate = (new Date(ms-maxDelay));

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
            if (error) {
                obs.onError(error);
            }
            else {
                obs.onNext([results, label]);
                obs.onCompleted();
            }
        })
    })

    return observable;
};

// this function looks for all the bordereaux and sums the total volume
// processed. If no bordereau exists for the given site, returns 0
function getTotalVolume(idArray, beginDate, endDate, label) {

    var queryString = "SELECT quantitee_finale, quantitee_transportee FROM bordereau " +
    "INNER JOIN " +
    "transport ON transport.id = bordereau.id_transport_1 WHERE transport.date < ? " +
    "AND transport.date >= ? AND id_site IN (?)";

    var query = {
        sql: queryString,
        values: [endDate, beginDate, idArray]
    };

    var observable = Rx.Observable.create((obs) => {
        connection.query(query, (error, results, fields) => {
            if (error) {
                obs.onError(error);
            }
            else {
                var sum = 0;
                results.forEach((row) => {
                    if (row.quantitee_finale == 0) {
                        sum += row.quantitee_transportee;
                    }
                    else {
                        sum += row.quantitee_finale;
                    }
                })
                obs.onNext([sum, label]);
                obs.onCompleted();
            }
        })
    })

    return observable;
};



// this function looks for all the bordereaux  with wastes in the green list
// and sums the total volume processed. If no bordereau exists for the given
// site, returns 0
function getTotalVolumeVerte(idArray, beginDate, endDate, label) {

    var queryString = "SELECT quantitee_finale, quantitee_transportee FROM bordereau " +
    "INNER JOIN " +
    "transport ON transport.id = bordereau.id_transport_1 INNER JOIN dechet ON " +
    "dechet.id = bordereau.id_dechet WHERE transport.date < ? " +
    "AND transport.date >= ? AND id_site IN (?) AND dechet.is_listeverte = 1";

    var query = {
        sql: queryString,
        values: [endDate, beginDate, idArray]
    };

    var observable = Rx.Observable.create((obs) => {
        connection.query(query, (error, results, fields) => {
            if (error) {
                obs.onError(error);
            }
            else {
                var sum = 0;
                results.forEach((row) => {
                    if (row.quantitee_finale == 0) {
                        sum += row.quantitee_transportee;
                    }
                    else {
                        sum += row.quantitee_finale;
                    }
                })
                obs.onNext([sum, label]);
                obs.onCompleted();
            }
        })
    })

    return observable;
};



// this function looks for all the bordereaux and sums the total volume
// recycled. If no bordereau exists for the given site, returns 0
function getValorisationTotale(idArray, beginDate, endDate, label) {
    var queryString = "SELECT quantitee_finale, quantitee_transportee FROM bordereau " +
    "INNER JOIN " +
    "type_traitement ON bordereau.id_traitement_prevu = type_traitement.id INNER JOIN " +
    "transport ON transport.id = bordereau.id_transport_1 WHERE transport.date < ? " +
    "AND transport.date >= ? AND id_site IN (?) AND type_traitement.qualification = 'Recyclage'";

    var query = {
        sql: queryString,
        values: [endDate, beginDate, idArray]
    };

    var observable = Rx.Observable.create((obs) => {
        connection.query(query, (error, results, fields) => {
            if (error) {
                obs.onError(error);
            }
            else {
                var sum = 0;
                results.forEach((row) => {
                    if (row.quantitee_finale == 0) {
                        sum += row.quantitee_transportee;
                    }
                    else {
                        sum += row.quantitee_finale;
                    }
                })
                obs.onNext([sum, label]);
                obs.onCompleted();
            }
        })
    })

    return observable;
}



// this function looks for all the bordereaux  with wastes in the green list
// and sums the total volume recycled. If no bordereau exists for the given
// site, returns 0
function getValorisationVerte(idArray, beginDate, endDate, label) {
    var queryString = "SELECT quantitee_finale, quantitee_transportee FROM bordereau " +
    "INNER JOIN " +
    "type_traitement ON bordereau.id_traitement_prevu = type_traitement.id INNER JOIN " +
    "dechet ON dechet.id = bordereau.id_dechet INNER JOIN " +
    "transport ON transport.id = bordereau.id_transport_1 WHERE transport.date < ? " +
    "AND transport.date >= ? AND id_site IN (?) AND type_traitement.qualification = 'Recyclage' " +
    "AND dechet.is_listeverte = 1";

    var query = {
        sql: queryString,
        values: [endDate, beginDate, idArray]
    };

    var observable = Rx.Observable.create((obs) => {
        connection.query(query, (error, results, fields) => {
            if (error) {
                obs.onError(error);
            }
            else {
                var sum = 0;
                results.forEach((row) => {
                    if (row.quantitee_finale == 0) {
                        sum += row.quantitee_transportee;
                    }
                    else {
                        sum += row.quantitee_finale;
                    }
                })
                obs.onNext([sum, label]);
                obs.onCompleted();
            }
        })
    })

    return observable;
}



// this function counts all the bordereaux for a given site
function countBordereaux(idArray, beginDate, endDate, label) {
    /* This function creates an Observable and returns it. It counts all bordereaux
     * Args: queryParameters, parameters for the query, in the following form:
     * {attributes: string[], where: {fieldA: string, ...}, order: string[]}
     */
     var queryString = "SELECT COUNT(*) as sum FROM bordereau INNER JOIN transport ON " +
     "transport.id = bordereau.id_transport_1 WHERE transport.date < ? AND " +
     "transport.date >= ? AND bordereau.id_site IN (?)";

     var query = {
         sql: queryString,
         values: [endDate, beginDate, idArray]
     };

     var observable = Rx.Observable.create(obs => {
         connection.query(query, (error, results, fields) => {
             if (error) {
                 obs.onError(error);
             }
             else {
                 obs.onNext([results[0].sum, label]);
                 obs.onCompleted();
             }
         })
     })

     return observable;
    //  var query = {
    //      include: [
    //          {
    //              model: traitement,
    //              as: 'traitementFinal',
    //              attributes: [],
    //          },
    //          {
    //              model: transport,
    //              as: 'transport1',
    //              attributes: [],
    //              where: {
    //                  date: {
    //                      $lt: endDate,
    //                      $gte: beginDate
    //                  }
    //              }
    //          }
    //      ],
    //      where: {
    //          id_site: {$in: idArray}
    //      }
    //  }
    //
    // var observable = Rx.Observable.create((observer) => {
    //     bordereau.count(query)
    //         .then((n) => {
    //             observer.onNext([n, label]);
    //             observer.onCompleted();
    //         })
    //         .catch ((error) => {
    //             observer.onError(error);
    //         });
    // });
    // return observable;
}


function getUndated(idArray, label) {
    var queryString = "SELECT bordereau.* FROM bordereau LEFT JOIN traitement " +
    "ON traitement.id = bordereau.id_traitement_final INNER JOIN site on site.id " +
    "= bordereau.id_site WHERE (traitement.date_priseencharge IS NULL OR " +
    "id_traitement_final IS NULL) AND id_site " +
    "IN (?)";

    var query = {
        sql: queryString,
        values: [idArray],
        nestTables: true
    }
    var observable = Rx.Observable.create((obs) => {
        connection.query(query, (error, results, fields) => {
            if (error) {
                obs.onError(error)
            }
            else {
                obs.onNext([results, label]);
                obs.onCompleted();
            }
        })
    })

    return observable;
}



// this function returns an observable with all the elements in the table
// matching the provided id and date.
// NOTE: considering the constraints, it should return only one site (or 0)
function getDataForSites(idArray, beginDate, endDate) {
    var query = {
        sql: 'SELECT * FROM dashboard WHERE id_site IN (?) AND date < ? AND date >= ?',
        values: [idArray, endDate, beginDate]
    }

    var observable = Rx.Observable.create((observer) => {
        connection.query(query, (error, results, fields) => {
            if (error) {
                observer.onError(error);
            }
            observer.onNext(results);
            observer.onCompleted();
        })
    })
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
