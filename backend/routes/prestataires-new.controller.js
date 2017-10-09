'use strict';
var express = require('express');
var router = express.Router();
var Rx = require('rx');
var prestataireService = require('../services/prestataire.service');
var utilities = require('../utilities/routes.js');

/*
This is a controller entirely dedicated to error handling when it comes
to database communication. The functions dealing directly with Sequalize
are written in the services being called in this controller
*/

// Function dedicated to handle various errors
// Returns the error status and the message to be displayed
function errorHandler(error, callback) {
  if (error == "Resource not found") {
    var status = 404;
    var message = "Resource not found";
  }
  else {
    // All other errors that are not currently defined
    var status = 500; // TODO modify to adapt to various possible errors
    var message = "internal server error";
    console.error(error);
  }
  callback({status: status, message: message});
}

/**
  * @api {GET} /prestataires Recherche tous les prestataires
  * @apiGroup Prestataires
  * @apiVersion 1.1.0
  *
  * @apiExample {curl} Exemple
  *   curl -i http://localhost:4000/api/prestataires
  *
  * @apiSuccess {JSONString[]} prestataires Liste des prestataires
  * correspondant à la recherche
  * @apiError PrestatairesNotFound Impossible de trouver les prestataires
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
        errorHandler(error, (errorPacket) => {
            res.status(errorPacket.status).send(errorPacket.message);
        });
    };
    var complete = () => {};
    var observer = Rx.Observer.create(next, error, complete);
    var subscription = prestataireService.getAllPrestataires(parsedArgs).subscribe(observer);
}

/**
  * @api {GET} /prestataires/:id Recherche un prestataire selon son id
  * @apiGroup Prestataires
  * @apiVersion 1.1.0
  *
  * @apiExample {curl} Exemple
  *   curl -i http://localhost:4000/api/prestataires/42
  * @apiSuccess {JSONString} prestataire Prestataire recherché
  * @apiError PrestataireNotFound Prestataire introuvable
  */
function getPrestataire(req, res) {
  var id = req.params.id;
  var next = (data) => {
    res.json(data);
  };
  var error = (error) => {
    errorHandler(error, (errorPacket) => {
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
