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
var BordereauxService = require('../services/bordereaux.service');

var utilities = require('../utilities/dates');

// computes all the data for a given site identified by its id in the database
function computeForSite(beginDate, endDate, tolerance, siteId) {

    console.log("computing for site " + siteId);

    var loopsToDo = 12;
    var bordereaux; //useful to know if it is an empty set.

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

        computedValues[data[1]] = data[0];
        loopsToDo -= 1;
    }
    var onError = (error) => {
        console.log(error);
        throw error;
    };
    var onCompleted = () => {
        if (loopsToDo == 0) {
            // if no bordereaux: does not divide by 0
            if (computedValues["bordereaux"] == 0) {
                computedValues["details"] += "Aucun bordereau sur la période considérée;";
            }
            else {
                if (computedValues["volume_l_verte"] == 0) {
                    computedValues["details"] += "Aucun déchet en liste verte;";
                }
            }
            computedValues.save()
                .then((value) => {
                    console.log("site " + siteId + " from " + beginDate + " to " + endDate + ": Created");
                })
                .catch((err) => {
                    if (err="SequelizeUniqueConstraintError") {
                        // if entry already exists, update it instead
                        DashboardService.updateEntry(computedValues)
                            .subscribe(Rx.Observer.create(
                                () => {},
                                (error) => {console.log(error);},
                                () => {
                                    console.log("site " + siteId + " from " + beginDate + " to " + endDate + ": Updated");
                                }
                            ));
                    }
                    else {
                        console.log(err);
                    }
                })
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
                utilities.computeDates(year, month, tolerance, id, computeForSite);
            })

        }
    );
    SitesService.getAllSites({attributes: ['id']}).subscribe(observerId);
}

// tests the function
function preCompute() {

    // oldest possible year
    const firstYear = 2017;
    const firstMonth = 1;

    // gets the current date
    var date = new Date();
    var currentMonth = date.getMonth();
    var currentYear = date.getFullYear();

    // currentMonth = 1;
    // currentYear = 2017;

    var year;
    var month;

    for (year=firstYear; year<=currentYear; year++) {
        // if we are on the last year, only get to the current month
        if (year == currentYear) {
            for (var month=1; month<=currentMonth; month++) {
                preComputeForDate(year, month);
            }
        }
        // else go to december
        else {
            for (month=1; month<13; month++) {
                preComputeForDate(year, month);
            }
        }
    }
}

preCompute();
