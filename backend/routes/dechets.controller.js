'use strict';
var express = require('express');
var router = express.Router();
var Rx = require('rx');


/*
This is a controller entirely dedicated to error handling when it comes
to database communication. The functions dealing directly with Sequalize
are written in the services being called in this controller
*/

/*
Only two functions are needed: you don't need to create, modify or delete
anything concerning the trashes
*/


/**
  * @api {GET} /dechets Recherche tous les déchets
  * @apiGroup Déchets
  * @apiVersion 1.0.0
  *
  * @apiExample {curl} Exemple
  *   curl -i http://localhost:4000/api/dechets
  *
  * @apiSuccess {JSONString[]} dechets Liste des dechets corresponant
  * à la recherche
  * @apiError DechetsNotFound Impossible de trouver de déchets
  */
function getAllDechets(req, res) {
    // currently only returns a 200 code with dummy data
    var dummyResponse = {"message": "OK"};
    res.json(dummyResponse);
}


/**
  * @api {GET} /dechets/:id Recherche un déchet selon son id
  * @apiGroup Déchets
  * @apiVersion 1.0.0
  * @apiParam {number} id Id du déchet recherché
  *
  * @apiExample {curl} Exemple
  *   curl -i http://localhost:4000/api/dechets/42
  *
  * @apiSuccess {JSONString} dechet Déchet recherché
  * @apiError DechetNotFound Déchet recherché inexistant
  */
function getDechet(req, res) {
  // currently only returns a 200 code with dummy data
  // the data will contain the id that was requested
  var id = req.params.id;
  var dummyResponse = {"message": "OK", "id": id};
  res.json(dummyResponse);
}


// routes to the functions
router.get('/', getAllDechets);
router.get('/:id', getDechet);

module.exports = router;
