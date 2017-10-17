'use strict';
var Rx = require('rx');
var service = {};
var sequelize = require('sequelize');
var async = require('async');

var models = require('../models/');
var bordereau = models.bordereau;
var dashboard = models.dashboard;
var traitement = models.traitement;
var site = models.site;

var DashboardService = require('../services/dashboard.service');
var SitesService = require('../services/sites.service');
var BordereauxService = require('../services/bordereaux.service');

var utilities = require('../utilities/dates');

// TODO faire async, comme dans le script d'Arthur


// function only used to give feedback when operations are done with a site
function printFeedback(siteId, beginDate, endDate, status) {

    // special characters for setting the color in the console
    const FgGreen = "\x1b[32m";
    const FgYellow = "\x1b[33m";
    const FgCyan = "\x1b[36m"
    const Reset = "\x1b[0m";
    const Bright = "\x1b[1m";

    var message = "From " + Bright + beginDate + Reset;
    message += " to " + Bright + endDate + Reset;
    message += " on site " + Bright + siteId + Reset;
    message += " | status: ";
    if (status == "created") {
        message += FgGreen + "Created";
    }
    else if (status == "updated"){
        message += FgYellow + "Updated";
    }
    else {
        message += FgCyan + "Computing";
    }
    message += Reset;
    console.log(message);
}



// computes all the data for a given site identified by its id in the database
function computeForSite(beginDate, endDate, tolerance, siteId) {

    printFeedback(siteId, beginDate, endDate, "computing");

    /** We have to compute 12 asynchronous values. At each iteration, we decrease
        the counter. When it is at 0, we are sure that every processing is done
        We then can exit the function safely and save the result
    */
    var loopsToDo = 12;

    // create the Dashboard element thzat will store all pre computed values
    var computedValues = new dashboard();

    // set the date and siteId for our entry
    // NOTE: a couple (date, id_site) is necessarily unique
    computedValues.date = endDate;
    computedValues.id_site = siteId;

    // we use today's date to compute delays
    const date = new Date();


    var onNextArray = (data) => {
        // this function is used when an observer returns an array.
        // we usually only need its length
        // EXAMPLE: number of delays: we would get all delays, we only need to
        // know how many we have.
        computedValues[data[1]] = data[0].length;
        loopsToDo -= 1;
    };
    var onNextNumber = (data) => {
        // this function is used when an observer returns a number or a string
        // here we can immediately use the value returned
        computedValues[data[1]] = data[0];
        loopsToDo -= 1;
    }
    var onError = (error) => {
        console.log(error);
        throw error;
    };
    var onCompleted = () => {
        if (loopsToDo == 0) {
            // adds a comment to the entry when the bordereau list is empty
            if (computedValues["bordereaux"] == 0) {
                computedValues["details"] += "Aucun bordereau sur la période considérée;";
            }
            else {
                // adds a comment if no waste in green list is present for the entry
                if (computedValues["volume_l_verte"] == 0) {
                    computedValues["details"] += "Aucun déchet en liste verte;";
                }
            }
            // tries to save the entry in the database
            computedValues.save()
                .then((value) => {
                    printFeedback(siteId, beginDate, endDate, "created");
                })
                .catch((err) => {
                    // this error is raised if the entry already exists
                    // if it exists, the couple (date, id_site) would already be
                    // present, and it must be unique
                    if (err="SequelizeUniqueConstraintError") {
                        // if entry already exists, update it instead
                        DashboardService.updateEntry(computedValues)
                            .subscribe(Rx.Observer.create(
                                () => {},
                                (error) => {console.log(error);},
                                () => {
                                    printFeedback(siteId, beginDate, endDate, "updated");
                                }
                            ));
                    }
                    else {
                        console.log(err);
                    }
                })
        }
    };

    // create all the observer that will be used and start them
    var observerEcarts = Rx.Observer.create(onNextArray, onError, onCompleted);
    DashboardService.getAllEcartsDePesee(tolerance, [siteId], beginDate, endDate, "ecarts_pesee")
        .subscribe(observerEcarts);

    var observerIncoherences = Rx.Observer.create(onNextArray, onError, onCompleted);
    DashboardService.getAllIncoherencesFilieres([siteId], 0, beginDate, endDate, "incoherences_filieres_norm")
        .subscribe(observerIncoherences);

    var observerIncoherencesDD = Rx.Observer.create(onNextArray, onError, onCompleted);
    DashboardService.getAllIncoherencesFilieres([siteId], 1, beginDate, endDate, "incoherences_filieres_dd")
        .subscribe(observerIncoherencesDD);

    var observerFilieresInterdites = Rx.Observer.create(onNextArray, onError, onCompleted);
    DashboardService.getAllFilieresInterdites([siteId], 0, beginDate, endDate, "filieres_interdites_norm")
        .subscribe(observerFilieresInterdites);

    var observerFilieresInterditesDD = Rx.Observer.create(onNextArray, onError, onCompleted);
    DashboardService.getAllFilieresInterdites([siteId], 1, beginDate, endDate, "filieres_interdites_dd")
        .subscribe(observerFilieresInterditesDD);

    var observerRetards = Rx.Observer.create(onNextArray, onError, onCompleted);
    DashboardService.getAllRetards([siteId], 0, date, "retards_norm")
        .subscribe(observerRetards);

    var observerRetardsDD = Rx.Observer.create(onNextArray, onError, onCompleted);
    DashboardService.getAllRetards([siteId], 1, date, "retards_dd")
        .subscribe(observerRetardsDD);

    var observerVolume = Rx.Observer.create(onNextNumber, onError, onCompleted);
    DashboardService.getTotalVolume([siteId], beginDate, endDate, "volume_total")
        .subscribe(observerVolume);

    var observerVolumeVerte = Rx.Observer.create(onNextNumber, onError, onCompleted);
    DashboardService.getTotalVolumeVerte([siteId], beginDate, endDate, "volume_l_verte")
        .subscribe(observerVolumeVerte);

    var observerValorisationTot = Rx.Observer.create(onNextNumber, onError, onCompleted);
    DashboardService.getValorisationTotale([siteId], beginDate, endDate, "valorisation_totale")
        .subscribe(observerValorisationTot);

    var observerValorisationVerte = Rx.Observer.create(onNextNumber, onError, onCompleted);
    DashboardService.getValorisationVerte([siteId], beginDate, endDate, "valorisation_l_verte")
        .subscribe(observerValorisationVerte);

    var observerCounter = Rx.Observer.create(onNextNumber, onError, onCompleted);
    DashboardService.countBordereaux([siteId], beginDate, endDate, "bordereaux")
        .subscribe(observerCounter);

}



// given a container and a set of bordereaux, computes the desired values and
// fill the container with them

function preComputeForDate(year, month) {

    // prepare data
    // TODO: use a config file for the tolerance, and not use 0.
    var tolerance = 0;

    // this array will contain all the ids of sites in the database
    var idArray = [];

    var observerId = Rx.Observer.create(
        (id) => {
            // when given the list of ids, put only them in the array
            id.forEach((site) => {
                idArray.push(site["id"]);
            });
        },
        (error) => {
            console.log(error);
            throw error;
        },
        () => {
            // for each value in the array, computes the datas for the given date
            // in the corresponding site
            idArray.forEach((id) => {
                utilities.computeDates(year, month, tolerance, id, computeForSite);
            });

        }
    );
    // with the query provided, we can restrict the fields given to only id
    SitesService.getAllSites({attributes: ['id']}).subscribe(observerId);
}



// this function will make all the preComputing for every site from a given
// date to a max date
// IDEA: put the max date to current date (the case for now)
function preCompute() {

    // oldest possible year
    // TODO: put that value in a config file
    const firstYear = 2017;
    const firstMonth = 1;

    // gets the current date tu be used as last date
    var date = new Date();
    var currentMonth = date.getMonth();
    var currentYear = date.getFullYear();

    // DEPRECATED: used to specify earlier last date for testing purposes
    // currentMonth = 1;
    // currentYear = 2017;

    var year;
    var month;

    let tasksArray = [];

    for (year=firstYear; year<=currentYear; year++) {
        // if we are on the last year, only get to the current month
        if (year == currentYear) {
            for (var month=1; month<=currentMonth; month++) {
                var task = function(callback) {
                    preComputeForDate(year, month);
                    callback(null, null);
                }
                tasksArray.push(task);
            }
        }
        // else go to december
        else {
            for (month=1; month<13; month++) {
                var task = function(callback) {
                    preComputeForDate(year, month);
                    callback(null, null);
                }
                tasksArray.push(task);
            }
        }
    }

    // starting async operations
    asynch.series(tasksArray, (err, res) => {});

// lauch the function when the script is called (it will only be called for that)
preCompute();
