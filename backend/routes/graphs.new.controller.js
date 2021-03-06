'use strict';
var express = require('express');
var router = express.Router();
var Rx = require('rx');

var utilities = require('../utilities/routes');
var dates = require('../utilities/dates');

var prestataireService = require('../services/prestataire.service');
var DashboardService = require('../services/dashboard.service');
var SitesService = require('../services/sites.service');
var ToolkitService = require('../services/toolkit.service');
var GraphsService = require('../services/graphs.service');
var DechetService = require('../services/dechet.service');

/*
This is a controller entirely dedicated to error handling when it comes
to database communication. The functions dealing directly with Sequelize
are written in the services being called in this controller
*/

/*
Only one function is needed: you don't need to create, modify or delete
anything concerning the graphs
*/


/**
This function is first called upon request. It verifies that all necessary
arguments are provided and returns an error if not the case
If the request is correct, the next function will be called
*/
function verifyParameters(req, res, next) {

    const prestataire = req.params.prestataire;
    const dechet = req.params.dechet;
    const beginDate = req.query.beginDate;
    const endDate = req.query.endDate;

    // required parameters not provided
    // if (!(prestataire) || !(dechet)) {
    //     utilities.errorHandler("Invalid arguments", (errorPacket) => {
    //         res.status(errorPacket.status).send(errorPacket.message);
    //     });
    // }

    // both endDate and beginDate are not required, but must be valid
    try {
        if (typeof beginDate != 'undefined') {
            const tempDate = new Date(beginDate);
            if (tempDate == "Invalid Date") { throw "Invalid Date"}
        }
        if (typeof endDate != 'undefined') {
            const tempDate = new Date(endDate);
            if (tempDate == "Invalid Date") { throw "Invalid Date"}
        }
    }
    catch (err) {
        utilities.errorHandler("Invalid arguments", (errorPacket) => {
            res.status(errorPacket.status).send(errorPacket.message);
        });
    }

    // sets the necessary dates if not provided, then goes to the next function
    var dates = {};
    const currentDate = new Date();
    if (typeof beginDate == 'undefined') {
        var date = currentDate.getFullYear() + '-01-01';
        var previousDate = (currentDate.getFullYear() - 1) + '01-01';
        dates["beginDate"] = date;
    }
    else {
        dates["beginDate"] = beginDate;
    }
    if (typeof endDate == 'undefined') {
        var month = currentDate.getMonth();
        var date = currentDate.getFullYear() + '-' + (parseInt(month)+1) + '-01';
        dates["endDate"] = date;
    }
    else {
        dates["endDate"] = endDate;
    }

    var tempBeginDate = new Date(dates["beginDate"]);
    var year = tempBeginDate.getFullYear();
    year -= 1;
    var month = tempBeginDate.getMonth();
    month += 1;
    if (month < 10) {
        month = '0' + month;
    }
    var day = tempBeginDate.getDate();
    if (day < 10) {
        day = '0' + day;
    }
    var previousBeginDate = year + '-' + month + '-' + day;

    var tempEndDate = new Date(dates["endDate"]);
    var year = tempEndDate.getFullYear();
    year -= 1;
    var month = tempEndDate.getMonth();
    month += 1;
    if (month < 10) {
        month = '0' + month;
    }
    var day = tempEndDate.getDate();
    if (day < 10) {
        day = '0' + day;
    }
    var previousEndDate = year + '-' + month + '-' + day;

    dates["previousBeginDate"] = previousBeginDate;
    dates["previousEndDate"] = previousEndDate;

    req.locals = dates;
    next();
}

// We still need to get the necessary sites to be used in the request
function getNecessarySites(req, res, next) {
    // gets the corresponding sites to be used after
    const hierarchy = ["DPIH", "metier_dependance", "up_dependance", "unite_dependance", "nom"];

    const distance = 300;

    const level = req.params.level;
    const name = req.params.name;

    if (level<0 || level>4 || (level>0 && !(name))) {
        utilities.errorHandler("Invalid arguments", (errorPacket) => {
            res.status(errorPacket.status).send(errorPacket.message);
        });
    }

    const field = hierarchy[level];
    var query = {};

    var loops = 3;

    if (typeof field != "undefined") {
        if (req.params.level == 0) {
            const where = {};
        }
        else {
            var where = {};
            where[field] = name;
            query.where = where;
        }
    }

    var onNext = (label, data) => {
        req.locals[label] = data;
    };
    var error = (error) => {
        utilities.errorHandler(error, (errorPacket) => {
            res.status(errorPacket.status).send(errorPacket.message);
        });
    };
    var complete = () => {
        loops -= 1;
        if (loops == 0) {
            if (req.locals.sites.length == 0) {
                res.status(404).send("Unknown sites");
            }
            else {
                next();
            }
        }

    };

    var observer = Rx.Observer.create((data) => onNext("sites", data), error, complete);
    var subscription = SitesService.getAllSites(query).subscribe(observer);

    var observer2 = Rx.Observer.create((data) => onNext("globalSites", data), error, complete);
    var subscription2 = SitesService.getAllSites({}).subscribe(observer2);

    if (level == 4) {
        var observer3 = Rx.Observer.create((data) => onNext("regionSites", data), error, complete);
        var subscription2 = SitesService.getSitesCloseToSite(name, distance).subscribe(observer3);
    }
    else {
        complete();
    }

}


function getGlobalPrestataires(req, res) {
    const sites = req.locals.sites;
    const globalSites = req.locals.globalSites;
    const regionSites = req.locals.regionSites;
    const beginDate = req.locals.beginDate;
    const endDate = req.locals.endDate;

    var result = {
        "globalData": {},
        "prestataires": []
    };

    var loops = 9;

    var idArray = [];
    for (var i=0; i<sites.length; i++) {
        idArray.push(sites[i].id);
    }

    var globalArray = [];
    for (var i=0; i<globalSites.length; i++) {
        globalArray.push(globalSites[i].id);
    }

    var regionArray = [];
    if (typeof regionSites != 'undefined') {
        for (var i=0; i<regionSites.length; i++) {
            regionArray.push(regionSites[i].id);
        }
    }

    var onNext = (data) => {
        result.globalData[data[1][0]] = data[0];
    }
    var onCompleted = () => {
        loops -= 1;
        if (loops==0) {
            res.json(result);
        }
    }
    var onError = (error) => {
        utilities.errorHandler(error, (errorPacket) => {
            console.log(error);
            res.status(errorPacket.status).send(errorPacket.message);
        });
    };

    var observerQantity = Rx.Observer.create(onNext, onError, onCompleted);
    DashboardService.getTotalVolume(globalArray, beginDate, endDate, ["volume_total", "globalData"])
        .subscribe(observerQantity);

    var observerRecycled = Rx.Observer.create(onNext, onError, onCompleted);
    DashboardService.getValorisationTotale(globalArray, beginDate, endDate, ["valorisation_totale", "globalData"])
        .subscribe(observerRecycled);

    var observerQantityVerte = Rx.Observer.create(onNext, onError, onCompleted);
    DashboardService.getTotalVolumeVerte(globalArray, beginDate, endDate, ["volume_l_verte", "globalData"])
        .subscribe(observerQantityVerte);

    var observerRecycledVerte = Rx.Observer.create(onNext, onError, onCompleted);
    DashboardService.getValorisationVerte(globalArray, beginDate, endDate, ["valorisation_l_verte", "globalData"])
        .subscribe(observerRecycledVerte);

    if (regionArray.length>0) {
        var observerRegionQuantity = Rx.Observer.create(onNext, onError, onCompleted);
        DashboardService.getTotalVolume(regionArray, beginDate, endDate, ["volume_region", "globalData"])
            .subscribe(observerRegionQuantity);

        var observerRegionRecycled = Rx.Observer.create(onNext, onError, onCompleted);
        DashboardService.getValorisationTotale(regionArray, beginDate, endDate, ["valorisation_region", "globalData"])
            .subscribe(observerRegionRecycled);

        var observerRegionQuantityVerte = Rx.Observer.create(onNext, onError, onCompleted);
        DashboardService.getTotalVolumeVerte(regionArray, beginDate, endDate, ["volume_l_verte_region", "globalData"])
            .subscribe(observerRegionQuantityVerte);

        var observerRegionRecycledVerte = Rx.Observer.create(onNext, onError, onCompleted);
        DashboardService.getValorisationVerte(regionArray, beginDate, endDate, ["valorisation_l_verte_region", "globalData"])
            .subscribe(observerRegionRecycledVerte);
    }
    else {
        loops -= 3;
        onCompleted();
    }

    var observerPrestataires = Rx.Observer.create(
        (data) => {
            result.prestataires = data;
        },
        onError,
        onCompleted
    );
    prestataireService.getPrestatairesForSites(idArray, beginDate, endDate)
        .subscribe(observerPrestataires);
}


function getDataForPrestataire(req, res) {

    const globalSites = req.locals.globalSites;
    const regionSites = req.locals.regionSites;
    const sites = req.locals.sites;

    const beginDate = req.locals.beginDate;
    const endDate = req.locals.endDate;

    var loops = 6;

    var idArray = [];
    var id = req.params.prestataireId;

    var result = {
        "sites": {
            "quantity": [],
            "recycled": []
        },
        "global": {
            "quantity": [],
            "recycled": []
        },
        "region": {
            "quantity": [],
            "recycled": []
        }
    };

    for (var i=0; i<sites.length; i++) {
        idArray.push(sites[i].id);
    }

    var regionArray = [];
    if (typeof regionSites != 'undefined') {
        for (var i=0; i<regionSites.length; i++) {
            regionArray.push(regionSites[i].id);
        }
    }

    var globalArray = [];
    for (var i=0; i<globalSites.length; i++) {
        globalArray.push(globalSites[i].id);
    }

    var onNext = (label, data) => {
        result[label[0]][label[1]] = data;
    }

    var onCompleted = () => {
        loops -= 1;
        if (loops == 0) {
            filterResult();
        }
    }

    var onError = (error) => {
        utilities.errorHandler(error, (errorPacket) => {
            console.log(error);
            res.status(errorPacket.status).send(errorPacket.message);
        });
    };

    var observerQuantity = Rx.Observer.create((data) => onNext(["sites", "quantity"], data), onError, onCompleted);
    prestataireService.getDechetsForPrestataire(id, idArray, 0, beginDate, endDate)
        .subscribe(observerQuantity);

    var observerRecycled = Rx.Observer.create((data) => onNext(["sites", "recycled"], data), onError, onCompleted);
    prestataireService.getDechetsForPrestataire(id, idArray, 1, beginDate, endDate)
        .subscribe(observerRecycled);

    var observerGlobalQuantity = Rx.Observer.create((data) => onNext(["global", "quantity"], data), onError, onCompleted);
    prestataireService.getDechetsForPrestataire(undefined, globalArray, 0, beginDate, endDate)
        .subscribe(observerGlobalQuantity);

    var observerGlobalRecycled = Rx.Observer.create((data) => onNext(["global", "recycled"], data), onError, onCompleted);
    prestataireService.getDechetsForPrestataire(undefined, globalArray, 1, beginDate, endDate)
        .subscribe(observerGlobalRecycled);

    if (regionArray.length > 0) {

        var observerRegionQuantity = Rx.Observer.create((data) => onNext(["region", "quantity"], data), onError, onCompleted);
        prestataireService.getDechetsForPrestataire(undefined, regionArray, 0, beginDate, endDate)
            .subscribe(observerRegionQuantity);

        var observerRegionRecycled = Rx.Observer.create((data) => onNext(["region", "recycled"], data), onError, onCompleted);
        prestataireService.getDechetsForPrestataire(undefined, regionArray, 1, beginDate, endDate)
            .subscribe(observerRegionRecycled);
    }
    else {
        loops -= 1;
        onCompleted();
    }

    var filterResult = () => {
        res.json(result);
    }

}


function getGlobalDechets(req, res) {
    const sites = req.locals.sites;
    const globalSites = req.locals.globalSites;
    const regionSites = req.locals.regionSites;
    const beginDate = req.locals.beginDate;
    const endDate = req.locals.endDate;

    var result = {
        "globalData": {},
        "dechets": []
    };

    var loops = 9;

    var idArray = [];
    for (var i=0; i<sites.length; i++) {
        idArray.push(sites[i].id);
    }

    var globalArray = [];
    for (var i=0; i<globalSites.length; i++) {
        globalArray.push(globalSites[i].id);
    }

    var regionArray = [];
    if (typeof regionSites != 'undefined') {
        for (var i=0; i<regionSites.length; i++) {
            regionArray.push(regionSites[i].id);
        }
    }

    var onNext = (data) => {
        result.globalData[data[1][0]] = data[0];
    }
    var onCompleted = () => {
        loops -= 1;
        if (loops==0) {
            res.json(result);
        }
    }
    var onError = (error) => {
        utilities.errorHandler(error, (errorPacket) => {
            console.log(error);
            res.status(errorPacket.status).send(errorPacket.message);
        });
    };

    var observerQantity = Rx.Observer.create(onNext, onError, onCompleted);
    DashboardService.getTotalVolume(globalArray, beginDate, endDate, ["volume_total", "globalData"])
        .subscribe(observerQantity);

    var observerRecycled = Rx.Observer.create(onNext, onError, onCompleted);
    DashboardService.getValorisationTotale(globalArray, beginDate, endDate, ["valorisation_totale", "globalData"])
        .subscribe(observerRecycled);

    var observerQantityVerte = Rx.Observer.create(onNext, onError, onCompleted);
    DashboardService.getTotalVolumeVerte(globalArray, beginDate, endDate, ["volume_l_verte", "globalData"])
        .subscribe(observerQantityVerte);

    var observerRecycledVerte = Rx.Observer.create(onNext, onError, onCompleted);
    DashboardService.getValorisationVerte(globalArray, beginDate, endDate, ["valorisation_l_verte", "globalData"])
        .subscribe(observerRecycledVerte);

    if (regionArray.length>0) {
        var observerRegionQuantity = Rx.Observer.create(onNext, onError, onCompleted);
        DashboardService.getTotalVolume(regionArray, beginDate, endDate, ["volume_region", "globalData"])
            .subscribe(observerRegionQuantity);

        var observerRegionRecycled = Rx.Observer.create(onNext, onError, onCompleted);
        DashboardService.getValorisationTotale(regionArray, beginDate, endDate, ["valorisation_region", "globalData"])
            .subscribe(observerRegionRecycled);

        var observerRegionQuantityVerte = Rx.Observer.create(onNext, onError, onCompleted);
        DashboardService.getTotalVolumeVerte(regionArray, beginDate, endDate, ["volume_l_verte_region", "globalData"])
            .subscribe(observerRegionQuantityVerte);

        var observerRegionRecycledVerte = Rx.Observer.create(onNext, onError, onCompleted);
        DashboardService.getValorisationVerte(regionArray, beginDate, endDate, ["valorisation_l_verte_region", "globalData"])
            .subscribe(observerRegionRecycledVerte);
    }
    else {
        loops -= 3;
        onCompleted();
    }

    var observerDechets = Rx.Observer.create(
        (data) => {
            result.dechets = data;
        },
        onError,
        onCompleted
    );
    DechetService.getDechetsForSites(idArray, beginDate, endDate)
        .subscribe(observerDechets);
}


function getDataForDechet(req, res) {

    const sites = req.locals.sites;
    const globalSites = req.locals.globalSites;
    const regionSites = req.locals.regionSites;
    const beginDate = req.locals.beginDate;
    const endDate = req.locals.endDate;

    var loops = 6;

    var idArray = [];
    var id = req.params.dechetId;

    var result = {
        "sites": {
            "quantity": [],
            "recycled": []
        },
        "global": {
            "quantity": [],
            "recycled": []
        },
        "region": {
            "quantity": [],
            "recycled": []
        }
    };

    for (var i=0; i<sites.length; i++) {
        idArray.push(sites[i].id);
    }

    var globalArray = [];
    for (var i=0; i<globalSites.length; i++) {
        globalArray.push(globalSites[i].id);
    }

    var regionArray = [];
    if (typeof regionSites != 'undefined') {
        for (var i=0; i<regionSites.length; i++) {
            regionArray.push(regionSites[i].id);
        }
    }

    var onNext = (label, data) => {
        result[label[0]][label[1]] = data;
    }

    var onCompleted = () => {
        loops -= 1;
        if (loops == 0) {
            res.json(result);
        }
    }

    var onError = (error) => {
        utilities.errorHandler(error, (errorPacket) => {
            console.log(error);
            res.status(errorPacket.status).send(errorPacket.message);
        });
    };

    var observerQuantity = Rx.Observer.create((data) => onNext(["sites", "quantity"], data), onError, onCompleted);
    DechetService.getPrestatairesForDechet(id, idArray, 0, beginDate, endDate)
        .subscribe(observerQuantity);

    var observerRecycled = Rx.Observer.create((data) => onNext(["sites", "recycled"], data), onError, onCompleted);
    DechetService.getPrestatairesForDechet(id, idArray, 1, beginDate, endDate)
        .subscribe(observerRecycled);

    var observerGlobalQuantity = Rx.Observer.create((data) => onNext(["global", "quantity"], data), onError, onCompleted);
    DechetService.getPrestatairesForDechet(id, globalArray, 0, beginDate, endDate)
        .subscribe(observerGlobalQuantity);

    var observerGlobalRecycled = Rx.Observer.create((data) => onNext(["global", "recycled"], data), onError, onCompleted);
    DechetService.getPrestatairesForDechet(id, globalArray, 1, beginDate, endDate)
        .subscribe(observerGlobalRecycled);

    if (regionArray.length > 0) {

        var observerRegionQuantity = Rx.Observer.create((data) => onNext(["region", "quantity"], data), onError, onCompleted);
        DechetService.getPrestatairesForDechet(id, regionArray, 0, beginDate, endDate)
            .subscribe(observerRegionQuantity);

        var observerRegionRecycled = Rx.Observer.create((data) => onNext(["region", "recycled"], data), onError, onCompleted);
        DechetService.getPrestatairesForDechet(id, regionArray, 1, beginDate, endDate)
            .subscribe(observerRegionRecycled);

    }

    else {
        loops -= 1;
        onCompleted();
    }

}


router.get('/prestataires/', verifyParameters);
router.get('/prestataires/', getNecessarySites);
router.get('/prestataires/', getGlobalPrestataires);

router.get('/prestataires/:level/', verifyParameters);
router.get('/prestataires/:level/', getNecessarySites);
router.get('/prestataires/:level/', getGlobalPrestataires);

router.get('/prestataires/:level/dechets/:prestataireId', verifyParameters);
router.get('/prestataires/:level/dechets/:prestataireId', getNecessarySites);
router.get('/prestataires/:level/dechets/:prestataireId', getDataForPrestataire);

router.get('/prestataires/:level/:name', verifyParameters);
router.get('/prestataires/:level/:name', getNecessarySites);
router.get('/prestataires/:level/:name', getGlobalPrestataires);

router.get('/prestataires/:level/:name/dechets/:prestataireId', verifyParameters);
router.get('/prestataires/:level/:name/dechets/:prestataireId', getNecessarySites);
router.get('/prestataires/:level/:name/dechets/:prestataireId', getDataForPrestataire);


router.get('/dechets/', verifyParameters);
router.get('/dechets/', getNecessarySites);
router.get('/dechets/', getGlobalDechets);

router.get('/dechets/:level/', verifyParameters);
router.get('/dechets/:level/', getNecessarySites);
router.get('/dechets/:level/', getGlobalDechets);

router.get('/dechets/:level/prestataires/:dechetId', verifyParameters);
router.get('/dechets/:level/prestataires/:dechetId', getNecessarySites);
router.get('/dechets/:level/prestataires/:dechetId', getDataForDechet);

router.get('/dechets/:level/:name', verifyParameters);
router.get('/dechets/:level/:name', getNecessarySites);
router.get('/dechets/:level/:name', getGlobalDechets);

router.get('/dechets/:level/:name/prestataires/:dechetId', verifyParameters);
router.get('/dechets/:level/:name/prestataires/:dechetId', getNecessarySites);
router.get('/dechets/:level/:name/prestataires/:dechetId', getDataForDechet);

module.exports = router;
