'use strict';
var express = require('express');
var router = express.Router();
var Rx = require('rx');
var sitesService = require('../services/sites.service');
var utilities = require('../utilities/routes');
var config = require('../config/config.json');

/*
This is a controller entirely dedicated to error handling when it comes
to database communication. The functions dealing directly with Sequalize
are written in the services being called in this controller
*/

/*
Only two functions are needed: you don't need to create, modify or delete
anything concerning the prestataires
*/

function getAllSites(req, res) {
    // Returns all the prestataires, currently returns a 500 error code when
    // an error is raised
    var parsedArgs;
    utilities.queryParser('site', req.query, (result) => {parsedArgs = result});
    var next = (data) => {
        res.json(data);
    };
    var error = (error) => {
        utilities.errorHandler(error, (errorPacket) => {
            res.status(errorPacket.status).send(errorPacket.message);
        });
    };
    var complete = () => {};
    var observer = Rx.Observer.create(next, error, complete);
    var subscription = sitesService.getAllSites(parsedArgs).subscribe(observer);
}

function getSiteById(req, res) {
    var id = req.params.id;
    var next = (data) => {
        res.json(data);
    };
    var error = (error) => {
        utilities.errorHandler(error, (errorPacket) => {
            res.status(errorPacket.status).send(errorPacket.message);
        });
    };
    var complete = () => {};
    var observer = Rx.Observer.create(next, error, complete);
    var subscription = sitesService.getSiteById(id).subscribe(observer);
}


function getSitesCloseToSite(req, res) {
    if (typeof req.query.distance != 'undefined') {
        var distance = req.query.distance;
    }
    else {
        var distance = config.computing.maxDistance;
    }
    var id = req.params.id;
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
    sitesService.getSitesCloseToSite(id, distance).subscribe(observer);
}

// Routes to functions
router.get('/', getAllSites);
router.get('/region/:id', getSitesCloseToSite);
router.get('/:id', getSiteById);

//exporting router
module.exports = router;
