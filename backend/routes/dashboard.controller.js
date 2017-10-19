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


/*
This is a controller entirely dedicated to error handling when it comes
to database communication. The functions dealing directly with Sequelize
are written in the services being called in this controller
*/

/*
Only one function is needed: you don't need to create, modify or delete
anything concerning the dashboard
*/


/**
  * @api {GET} /dashboard/:level/:id Recherche les informations nécessaires pour
  * construire la dashboard en fonction de l'endroit voulu.
  * @apiGroup Dashboard
  * @apiVersion 1.0.0
  * @apiParam (queryArgs) {number} level niveau voulu dans la hierarchie (allant
  * de 0 : central à 4 : site)
  * @apiParam (queryArgs) {string} name nom du lieu voulu dans sa hierarchie
  * (facultatif dans le cas d'une hierarchie 1 (niveau central))
  * @apiParam (queryParam) {number} tolerance niveau de tolérance pour les écarts
  * de pesée
  * @apiParam (queryParam) {number} year année choisie
  * @apiParam (queryParam) {number} month mois choisi
  *
  * @apiExample {curl} Exemple
  *   curl -i http://localhost:4000/api/dashboard/2/42?tolerance=12
  *
  * @apiSuccess {JSONString} dashboard Informations nécessaires à la construction
  * de la dashboard sur le site voulu
  * @apiError ResourceNotFound Impossible de trouver le lieu spécifié
  */
function getDashboard(req, res, next) {
  // currently only returns a 200 code with dummy data

  // checks if the args are in range
  var level = req.params.level;
  var name = req.params.name; //undefined if not provided
  var tolerance = req.query.tolerance;
  var year = req.query.year;
  var month = req.query.month;

  // when we check if name, we actually check if it is defined
  if (level<0 || level>4 || (level>1 && !(name)) || !(tolerance) || !(year) || !(month)) {
      utilities.errorHandler("Invalid arguments", (errorPacket) => {
          res.status(errorPacket.status).send(errorPacket.message);
      });
  }
  else {
      // continues the processing
      next();
  }
}


function getAllDashboards(req, res) {
    var onNext = (data) => {
        res.json(data);
    };
    var onError = (error) => {
        console.error(error);
        utilities.errorHandler(error, (errorPacket) => {
            res.status(errorPacket.status).send(errorPacket.message);
        });
    };
    var onCompleted = () => {

    };

    var observer = Rx.Observer.create(onNext, onError, onCompleted);
    console.log(DashboardService);
    DashboardService.getDashboards().subscribe(observer);
}

function getNecessarySites(req, res, next) {
    // gets the corresponding sites to be used after
    const hierarchy = ["DPIH", "metier_dependance", "up_dependance", "unite_dependance", "nom"];

    console.log(req.params);

    const field = hierarchy[req.params.level];
    const name = req.params.name
    var query = {};

    console.log(req.params.level);

    if (req.params.level == 0) {
        console.log("lolwat");
        var where = {};
    }
    else {
        console.log("wtf");
        var where = {};
        where[field] = name;
        query.where = where;
    }

    var onNext = (data) => {
        req.locals = data;
    };
    var error = (error) => {
        utilities.errorHandler(error, (errorPacket) => {
            res.status(errorPacket.status).send(errorPacket.message);
        });
    };
    var complete = () => {
        next();
    };

    console.log("tiens la query c'est ");
    console.log(query);

    var observer = Rx.Observer.create(onNext, error, complete);
    var subscription = SitesService.getAllSites(query).subscribe(observer);
}

function processDashboardData(req, res) {
    // list of all the sites that will be used
    var sites = req.locals;
    var tolerance = req.query.tolerance;
    var idArray = [];

    var result = {};
    var loopsToDo = 4;

    for (var i=0; i<sites.length; i++) {
        idArray.push(sites[i].id);
    }

    var onNext = (data) => {
        res.json(data);
    };
    var onError = (error) => {
        utilities.errorHandler(error, (errorPacket) => {
            res.status(errorPacket.status).send(errorPacket.message);
        });
    };
    var onCompleted = () => {};

    const year = req.query.year;
    var month = req.query.month;

    if (month<10) {
        month = "0" + month;
    }

    const date = year + '-' + month + '-01';

    var observer = Rx.Observer.create(onNext, onError, onCompleted);
    DashboardService.getDataForSites(idArray, date).subscribe(observer);
}

/**
  * @api {GET} /architecture/ Récupère l'architecture globale de l'organisation
  * de tous les sites possibles
  * @apiGroup Dashboard
  * @apiVersion 1.0.0
  *
  * @apiExample {curl} Exemple
  *   curl -i http://localhost:4000/api/dashboard/dashboard
  *
  * @apiSuccess {JSONString} dashboard Architecture du site
  * @apiError ResourceNotFound Impossible de trouver le lieu spécifié
  */
function getArchitecture(req, res) {

    var onNext = (data) => {
        res.json(data);
    };
    var onError = (error) => {
        utilities.errorHandler(error, (errorPacket) => {
            res.status(errorPacket.status).send(errorPacket.message);
        });
    };
    var onCompleted = () => {
    };
    var observer = Rx.Observer.create(onNext, onError, onCompleted);
    ToolkitService.getSiteArchitecture().subscribe(observer);
}


function processDetailedData(req, res) {
    // list of all the sites that will be used
    var sites = req.locals;
    var tolerance = req.query.tolerance;
    var idArray = [];
    var month = req.query.month;
    var year = req.query.year;

    var result = {};

    var result = {};
    var loopsToDo = 4;

    for (var i=0; i<sites.length; i++) {
        idArray.push(sites[i].id);
    }

    var onNext = (data) => {
        res.json(data);
    };
    var onError = (error) => {
        utilities.errorHandler(error, (errorPacket) => {
            res.status(errorPacket.status).send(errorPacket.message);
        });
    };
    var onCompleted = () => {};

    dates.computeDates(year, month, tolerance, idArray, (beginDate, endDate, tolerance, siteId, arg) => {
        var observer = Rx.Observer.create(onNext, onError, onCompleted);
        DashboardService.getDetailsForSites(beginDate, endDate, tolerance, idArray)
            .subscribe(observer);
    }, null);
}


// routes to the functions
router.get('/', getAllDashboards);
router.get('/architecture', getArchitecture);
router.get('/details', (req, res) => res.status(404).send("Invalid query"));

router.get('/details/:level/:name', getDashboard);
router.get('/details/:level', getDashboard);

router.get('/details/:level/:name/', getNecessarySites);
router.get('/details/:level/', getNecessarySites);

router.get('/details/:level/', processDetailedData);
router.get('/details/:level/:name', processDetailedData);

router.get('/:level/:name', getDashboard);
router.get('/:level', getDashboard);

router.get('/:level/:name/', getNecessarySites);
router.get('/:level/', getNecessarySites);

router.get('/:level/:name', processDashboardData);
router.get('/:level', processDashboardData);


module.exports = router;
