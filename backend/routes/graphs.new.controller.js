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
  * @api {GET} /graphs/prestataires/ A CHANGER
  * @apiGroup Graphs
  * @apiVersion 1.1.0
  *
  * @apiParam (queryParam) {string} [beginDate] première date voulue (format yyyy-mm-dd)
  * @apiParam (queryParam) {string} [endDate] première date voulue (format yyyy-mm-dd)
  * @apiParam (queryParam) {number} [level] niveau voulu dans la hierarchie (allant
  * de 0 : central à 4 : site) default: 0
  * @apiParam (queryParam) {string} [name] nom du lieu voulu dans sa hierarchie
  * (facultatif dans le cas d'une hierarchie 0 (niveau central))
  *
  * @apiExample {curl} Exemple
  *   curl -i http://localhost:4000/api/graphs/prestataires/0
  * @apiExample {curl} Exemple avec arguments
  *   curl -i http://localhost:4000/api/graphs/prestataires/1/SEI/?beginDate=2017-11-11&endDate=2017-03-18&level=1&name=SEI
  *
  * @apiSuccess {JSONString} data Informations nécessaires
  * @apiError ResourceNotFound Impossible de trouver le lieu spécifié
  */


/**
    * @api {GET} /graphs/prestataires/:level/:name/dechets/:id Donne la liste des déchets
    * avec les déchets valorisés pour un prestataire donné sur un lieu donné
    * @apiGroup Graphs
    * @apiVersion 1.1.0
    *
    * @apiParam (queryParam) {string} [beginDate] première date voulue (format yyyy-mm-dd)
    * @apiParam (queryParam) {string} [endDate] première date voulue (format yyyy-mm-dd)
    * @apiParam (queryParam) {number} [level] niveau voulu dans la hierarchie (allant
    * de 0 : central à 4 : site) default: 0
    * @apiParam (queryParam) {string} [name] nom du lieu voulu dans sa hierarchie
    * (facultatif dans le cas d'une hierarchie 0 (niveau central))
    *
    * @apiExample {curl} Exemple
    *   curl -i http://localhost:4000/api/graphs/prestataires/0/dechets/1
    * @apiExample {curl} Exemple avec arguments
    *   curl -i http://localhost:4000/api/graphs/0/prestataires/1/?beginDate=2017-11-11&endDate=2017-03-18&level=1&name=SEI
    *
    * @apiSuccess {JSONString} data Informations nécessaires
    * @apiError ResourceNotFound Impossible de trouver le lieu spécifié
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

    const level = req.params.level;
    const name = req.params.name;

    if (level<0 || level>4 || (level>1 && !(name))) {
        utilities.errorHandler("Invalid arguments", (errorPacket) => {
            res.status(errorPacket.status).send(errorPacket.message);
        });
    }

    const field = hierarchy[level];
    var query = {};

    var loops = 2;

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
            next();
        }

    };

    var observer = Rx.Observer.create((data) => onNext("sites", data), error, complete);
    var subscription = SitesService.getAllSites(query).subscribe(observer);

    var observer2 = Rx.Observer.create((data) => onNext("globalSites", data), error, complete);
    var subscription2 = SitesService.getAllSites({}).subscribe(observer2);

}


function getGlobalPrestataires(req, res) {
    const sites = req.locals.sites;
    const globalSites = req.locals.globalSites;
    const beginDate = req.locals.beginDate;
    const endDate = req.locals.endDate;

    var result = {
        "globalData": {},
        "prestataires": []
    };

    var loops = 5;

    var idArray = [];
    for (var i=0; i<sites.length; i++) {
        idArray.push(sites[i].id);
    }

    var globalArray = [];
    for (var i=0; i<globalSites.length; i++) {
        globalArray.push(globalSites[i].id);
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

    const sites = req.locals.sites;
    const beginDate = req.locals.beginDate;
    const endDate = req.locals.endDate;

    var loops = 2;

    var idArray = [];
    var id = req.params.prestataireId;

    var result = {};

    for (var i=0; i<sites.length; i++) {
        idArray.push(sites[i].id);
    }

    var onNext = (label, data) => {
        result[label] = data;
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

    var observerQuantity = Rx.Observer.create((data) => onNext("quantity", data), onError, onCompleted);
    prestataireService.getDechetsForPrestataire(id, idArray, 0, beginDate, endDate)
        .subscribe(observerQuantity);

    var observerRecycled = Rx.Observer.create((data) => onNext("recycled", data), onError, onCompleted);
    prestataireService.getDechetsForPrestataire(id, idArray, 1, beginDate, endDate)
        .subscribe(observerRecycled);

}


function getGlobalDechets(req, res) {
    const sites = req.locals.sites;
    const globalSites = req.locals.globalSites;
    const beginDate = req.locals.beginDate;
    const endDate = req.locals.endDate;

    var result = {
        "globalData": {},
        "dechets": []
    };

    var loops = 5;

    var idArray = [];
    for (var i=0; i<sites.length; i++) {
        idArray.push(sites[i].id);
    }

    var globalArray = [];
    for (var i=0; i<globalSites.length; i++) {
        globalArray.push(globalSites[i].id);
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
    const beginDate = req.locals.beginDate;
    const endDate = req.locals.endDate;

    var loops = 2;

    var idArray = [];
    var id = req.params.dechetId;

    var result = {};

    for (var i=0; i<sites.length; i++) {
        idArray.push(sites[i].id);
    }

    var onNext = (label, data) => {
        result[label] = data;
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

    var observerQuantity = Rx.Observer.create((data) => onNext("quantity", data), onError, onCompleted);
    DechetService.getPrestatairesForDechet(id, idArray, 0, beginDate, endDate)
        .subscribe(observerQuantity);

    var observerRecycled = Rx.Observer.create((data) => onNext("recycled", data), onError, onCompleted);
    DechetService.getPrestatairesForDechet(id, idArray, 1, beginDate, endDate)
        .subscribe(observerRecycled);

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
