'use strict';
var Rx = require('rx');
var service = {};
var sequelize = require('sequelize');

var models = require('../models/');
var bordereau = models.bordereau;
var dashboard = models.dashboard;
var traitement = models.traitement;

var DashboardService = require('../services/dashboard.service');


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

    var loopsToDo = 1;

    // creates a new dashboard element to be filled
    // all values are to their default value of 0
    // values will be incremented by the function
    var computedValues = new dashboard();
    computedValues.date = endDate;
    computedValues.id_site = siteId;

    var onNext = (data) => {
        computedValues[data[1]] = data[0];
    };
    var onError = (error) => {
        console.log(error);
        throw error;
    };
    var onCompleted = () => {
        console.log(computedValues.dataValues);
    };

    var observerEcarts = Rx.Observer.create(onNext, onError, onCompleted);
    DashboardService.getAllEcartsDePesee(tolerance, [siteId], beginDate, endDate, "ecarts_pesee")
        .subscribe(observerEcarts);

    var observerIncoherences = Rx.Observer.create(onNext, onError, onCompleted);
    DashboardService.getAllIncoherencesFilieres([siteId], 0, beginDate, endDate, "incoherences_filieres")
        .subscribe(observerIncoherences);

    var observerIncoherencesDD = Rx.Observer.create(onNext, onError, onCompleted);
    DashboardService.getAllIncoherencesFilieres([siteId], 1, beginDate, endDate, "incoherences_filieres_dd")
        .subscribe(observerIncoherencesDD);

}

// given a container and a set of bordereaux, computes the desired values and
// fill the container with them

function preCompute() {
    // will later get all the id
    var id = 3;

    // prepare data
    var year = 2017;
    var month = 2;
    var tolerance = 0;

    computeDates(year, month, tolerance, id, computeForSite);
}

// tests the function
preCompute();
