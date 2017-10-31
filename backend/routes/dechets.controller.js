'use strict';
var express = require('express');
var router = express.Router();
var Rx = require('rx');

var dechetService = require('../services/dechet.service');
var utilities = require('../utilities/routes');


/*
This is a controller entirely dedicated to error handling when it comes
to database communication. The functions dealing directly with Sequalize
are written in the services being called in this controller
*/

/*
Only two functions are needed: you don't need to create, modify or delete
anything concerning the dechets
*/


function getAllDechets(req, res) {
    var parsedArgs;
    utilities.queryParser('dechet', req.query, (result) => {parsedArgs = result});
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
    var subscription = dechetService.getAllDechets(parsedArgs).subscribe(observer);
}

function getDechet(req, res) {
    // currently only returns a 200 code with dummy data
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
    var subscription = dechetService.getDechetById(id).subscribe(observer);
}



// routes to the functions
router.get('/', getAllDechets);
router.get('/:id', getDechet);

module.exports = router;
