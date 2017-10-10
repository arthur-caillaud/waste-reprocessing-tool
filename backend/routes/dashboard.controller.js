'use strict';
var express = require('express');
var router = express.Router();
var Rx = require('rx');
var utilities = require('../utilities/routes');

var prestataireService = require('../services/prestataire.service');
var DashboardService = require('../services/dashboard.service');
var SitesService = require('../services/sites.service');


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
  *
  * @apiExample {curl} Exemple
  *   curl -i http://localhost:4000/api/dashboard/2/42
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

  // when we check if name, we actually check if it is defined
  if (level<0 || level>4 || (level>1 && !(name))) {
      utilities.errorHandler("Invalid arguments", (errorPacket) => {
          res.status(errorPacket.status).send(errorPacket.message);
      });
  }
  else {
      // continues the processing
      next();
  }
}

function getNecessarySites(req, res, next) {
    // gets the corresponding sites to be used after
    const hierarchy = ["DPIH", "metier_dependance", "up_dependance", "unite_dependance", "nom"];

    const field = hierarchy[req.params.level];
    const name = req.params.name
    var query = {};

    if (req.params.level == 0) {
        const where = {};
    }
    else {
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

    var observer = Rx.Observer.create(onNext, error, complete);
    var subscription = SitesService.getAllSites(query).subscribe(observer);
}

function processDashboardData(req, res) {
    // list of all the sites that will be used
    var sites = req.locals;
    var idArray = [];

    var result = {};
    var loopsToDo = 3;

    for (var i=0; i<sites.length; i++) {
        idArray.push(sites[i].id);
    }

    var onNext = (data) => {
        result[data[1]] = data[0];
    };
    var error = (error) => {
        utilities.errorHandler(error, (errorPacket) => {
            res.status(errorPacket.status).send(errorPacket.message);
        });
    };
    var complete = () => {
        loopsToDo -= 1;
        if (loopsToDo == 0) {
            res.json(result);
        }
    };

    var observerIncoherences = Rx.Observer.create(onNext, error, complete);
    var observerEcarts = Rx.Observer.create(onNext, error, complete);
    var observerInterdites = Rx.Observer.create(onNext, error, complete);

    DashboardService.getAllIncoherencesFilieres(idArray).subscribe(observerIncoherences);
    DashboardService.getAllEcartsDePesee(0, idArray).subscribe(observerEcarts);
    DashboardService.getAllFilieresInterdites(idArray).subscribe(observerInterdites);

}


// routes to the functions
router.get('/:level/:name', getDashboard);
router.get('/:level', getDashboard);
router.get('/:level/:name', getNecessarySites);
router.get('/:level', getNecessarySites);
router.get('/:level/:name', processDashboardData);
router.get('/:level', processDashboardData);

module.exports = router;
