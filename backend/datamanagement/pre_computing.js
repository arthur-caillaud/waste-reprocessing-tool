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

    var loopsToDo = 12;
    var volumeLVerte = 0;
    var bordereaux; //useful to know if it is an empty set.

    // creates a new dashboard element to be filled
    // all values are to their default value of 0
    // values will be incremented by the function
    var computedValues = new dashboard();
    computedValues.date = endDate;
    console.log(endDate);
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
        else if (data[1]=="bordereaux") {
            bordereaux = data[0];
        }
        else {
            computedValues[data[1]] = data[0];
        }
        loopsToDo -= 1;
    }
    var onError = (error) => {
        // console.log(error);
        throw error;
    };
    var onCompleted = () => {
        if (loopsToDo == 0) {
            // if no bordereaux: does not divide by 0
            if (bordereaux == 0) {
                computedValues["taux_valorisation_total"] = 1;
                computedValues["taux_valorisation_l_verte"] = 1;
                computedValues["details"] += "Aucun bordereau sur la période considérée;";
            }
            else {
                computedValues["taux_valorisation_total"] /= computedValues["volume_total"];
                if (volumeLVerte == 0) {
                    computedValues["taux_valorisation_l_verte"] = 1;
                    computedValues["details"] += "Aucun déchet en liste verte;";
                }
                else {
                    computedValues["taux_valorisation_l_verte"] /= volumeLVerte;
                }
            }

            // console.log(computedValues.dataValues);
            computedValues.save()
                .then((value) => {
                    console.log("done");
                })
                .catch((err) => {
                    // console.error(err);
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
    DashboardService.getTotalVolumeVerte([siteId], beginDate, endDate, "volume_verte")
        .subscribe(observerVolumeVerte);

    var observerValorisationTot = Rx.Observer.create(onNextNumber, onError, onCompleted);
    DashboardService.getValorisationTotale([siteId], beginDate, endDate, "taux_valorisation_total")
        .subscribe(observerValorisationTot);

    var observerValorisationVerte = Rx.Observer.create(onNextNumber, onError, onCompleted);
    DashboardService.getValorisationVerte([siteId], beginDate, endDate, "taux_valorisation_l_verte")
        .subscribe(observerValorisationVerte);

    var observerCounter = Rx.Observer.create(onNextNumber, onError, onCompleted);
    DashboardService.countBordereaux([siteId], beginDate, endDate, "bordereaux")
        .subscribe(observerCounter);

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
            // console.log(error);
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
preCompute();
