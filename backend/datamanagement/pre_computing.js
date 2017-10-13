'use strict';
var Rx = require('rx');
var service = {};
var sequelize = require('sequelize');

var models = require('../models/');
var bordereau = models.bordereau;
var dashboard = models.dashboard;
var traitement = models.traitement;
var site = models.site;

var DashboardService = require('../services/dashboard.service');
var SitesService = require('../services/sites.service');


// returns the first and last date of the selected month
// year and month are to be given as numbers
function computeDates(year, month, tolerance, siteId, callback) {
    // throw and error if invalid date provided
    if (month%1!=0 || year%1!=0 || month<1 || month>12) {
        throw "Invalid date format \n expected yyyy, mm (example 2017, 03)";
    }

    if (month==12) {
        var endYear = year + 1;
        var endMonth = 1;
    }
    else {
        var endYear = year;
        var endMonth = month + 1;
    }

    if (month<10) {
        month = "0" + month;
    }
    if (endMonth<10) {
        endMonth = "0" + endMonth;
    }

    const beginDate = year + '-' + month + '-01';
    const endDate = endYear + '-' + endMonth + '-01';

    return callback(beginDate, endDate, tolerance, siteId);
}

// computes all the data for a given site identified by its id in the database
function computeForSite(beginDate, endDate, tolerance, siteId) {

    var loopsToDo = 11;
    var volumeLVerte = 0;

    // creates a new dashboard element to be filled
    // all values are to their default value of 0
    // values will be incremented by the function
    var computedValues = new dashboard();
    computedValues.date = endDate;
    computedValues.id_site = siteId;
    // date that will be used in the delays calculation
    var date = new Date();

    var onNextArray = (data) => {
        // an array is returned, we just need the length
        computedValues[data[1]] = data[0].length;
        loopsToDo -= 1;
    };
    var onNextNumber = (data) => {
        // here, a number is returned
        if (data[1]=="volume_verte") {
            volumeLVerte = data[0];
        }
        else {
            computedValues[data[1]] = data[0];
        }
        loopsToDo -= 1;
    }
    var onError = (error) => {
        console.log(error);
        throw error;
    };
    var onCompleted = () => {
        if (loopsToDo == 0) {
            computedValues["taux_valorisation_total"] /= computedValues["volume_total"];
            computedValues["taux_valorisation_l_verte"] /= volumeLVerte;
            // to be modified, corrects an error in the database
            if (isNaN(computedValues["taux_valorisation_l_verte"])) {
                computedValues["taux_valorisation_l_verte"] = 0;
            }
            console.log(computedValues.dataValues);
            // computedValues.save()
            //     .then((value) => {
            //         console.log("done");
            //     })
            //     .catch((err) => {
            //         console.error(err);
            //     })
        }
    };

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
    DashboardService.getTotalVolumeVerte([siteId], beginDate, endDate, "volume_verte")
        .subscribe(observerVolumeVerte);

    var observerValorisationTot = Rx.Observer.create(onNextNumber, onError, onCompleted);
    DashboardService.getValorisationTotale([siteId], beginDate, endDate, "taux_valorisation_total")
        .subscribe(observerValorisationTot);

    var observerValorisationVerte = Rx.Observer.create(onNextNumber, onError, onCompleted);
    DashboardService.getValorisationVerte([siteId], beginDate, endDate, "taux_valorisation_l_verte")
        .subscribe(observerValorisationVerte);

}

// given a container and a set of bordereaux, computes the desired values and
// fill the container with them

function preCompute() {

    // prepare data
    var year = 2017;
    var month = 2;
    var tolerance = 0;

    var idArray = [];
    var observerId = Rx.Observer.create(
        (id) => {
            id.forEach((site) => {
                idArray.push(site.dataValues.id);
            });
        },
        (error) => {
            console.log(error);
            throw error;
        },
        () => {
            idArray.forEach((id) => {
                computeDates(year, month, tolerance, id, computeForSite);
            })

        }
    );
    SitesService.getAllSites({attributes: ['id']}).subscribe(observerId);    
}

// tests the function
preCompute();
