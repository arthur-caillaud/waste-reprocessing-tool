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
    if (!(prestataire) || !(dechet)) {
        utilities.errorHandler("Invalid arguments", (errorPacket) => {
            res.status(errorPacket.status).send(errorPacket.message);
        });
    }
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

    req.locals = dates;
    next();
}


/**
Now that we know that the args are valid, we can use this function to get the
needed data
It will send send the data for a prestataire and a dechet, in the given timeframe
if no timeframe given, will go from 01-01 of this year to current date
**/
function getGraphsData(req, res) {

    const idPrestataire = req.params.prestataire;
    const idDechet = req.params.dechet;
    const beginDate = req.locals.beginDate;
    const endDate = req.locals.endDate;

    var result = {};
    var loops = 2;

    var onNext = (data) => {
        result[data[1]] = data[0];
    }
    var onCompleted = () => {
        loops -= 1;
        if (loops==0) {
            res.json(result);
        }
    }
    var onError = (error) => {
        utilities.errorHandler(error, (errorPacket) => {
            res.status(errorPacket.status).send(errorPacket.message);
        });
    };

    var observerQantity = Rx.Observer.create(onNext, onError, onCompleted);
    GraphsService.getQuantity(idPrestataire, idDechet, beginDate, endDate, "quantity")
        .subscribe(observerQantity);

    var observerRecycled = Rx.Observer.create(onNext, onError, onCompleted);
    GraphsService.getRecycledQuantity(idPrestataire, idDechet, beginDate, endDate, "recycled")
        .subscribe(observerRecycled);



}


// routes association
router.get('/:prestataire/:dechet', verifyParameters);
router.get('/:prestataire/:dechet', getGraphsData);

module.exports = router;
