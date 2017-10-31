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

function getDashboard(req, res, next) {

  // checks if the args are in range
  var level = req.params.level;
  var name = req.params.name; //undefined if not provided
  var beginDate = req.query.beginDate;
  var endDate = req.query.endDate;

  // var fs = require('fs');
  // fs.writeFileSync("tmp/request", req.join(','), 'utf-8');

  // when we check if name, we actually check if it is defined
  if (level<0 || level>4 || (level>0 && !(name)) || !(endDate) || !(beginDate)) {
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
    DashboardService.getDashboards().subscribe(observer);
}

function getNecessarySites(req, res, next) {
    // gets the corresponding sites to be used after
    const hierarchy = ["DPIH", "metier_dependance", "up_dependance", "unite_dependance", "nom"];

    const field = hierarchy[req.params.level];
    const name = req.params.name
    var query = {};

    if (req.params.level == 0) {
        var where = {};
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
    var beginDate = req.query.beginDate;
    var endDate = req.query.endDate;

    var result = {};
    var loopsToDo = 4;

    if (sites.length == 0) {
        res.status(404).send("Unknown sites");
    }

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
    var onCompleted = () => {
    };

    var observer = Rx.Observer.create(onNext, onError, onCompleted);
    DashboardService.getDataForSites(idArray, beginDate, endDate).subscribe(observer);
}


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
    var idArray = [];
    var beginDate = req.query.beginDate;
    var endDate = req.query.endDate;

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

    var observer = Rx.Observer.create(onNext, onError, onCompleted);
    DashboardService.getDetailsForSites(beginDate, endDate, idArray)
        .subscribe(observer);

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
