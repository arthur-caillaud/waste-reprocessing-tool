'use strict';
var express = require('express');
var router = express.Router();
var Rx = require('rx');
var prestataireService = require('../services/prestataire.service');
var utilities = require('../utilities/routes');

/*
This is a controller entirely dedicated to error handling when it comes
to database communication. The functions dealing directly with Sequalize
are written in the services being called in this controller
*/

/*
Only two functions are needed: you don't need to create, modify or delete
anything concerning the prestataires
*/

function getAllPrestataires(req, res) {
    // Returns all the prestataires, currently returns a 500 error code when
    // an error is raised
    var parsedArgs;
    utilities.queryParser('prestataire', req.query, (result) => {parsedArgs = result});
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
    var subscription = prestataireService.getAllPrestataires(parsedArgs).subscribe(observer);
}


function getPrestataire(req, res) {
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
    var subscription = prestataireService.getPrestataireById(id).subscribe(observer);
}

// Routes to functions
router.get('/', getAllPrestataires);
router.get('/:id', getPrestataire);

//exporting router
module.exports = router;
