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
anything concerning the bordereaux
*/


/**
  * @api {GET} /bordereaux Recherche tous les bordereaux
  * @apiGroup Bordereaux
  * @apiVersion 1.0.0
  *
  * @apiExample {curl} Exemple
  *   curl -i http://localhost:4000/api/bordereaux
  *
  * @apiSuccess {JSONString[]} bordereaux Liste des bordereaux corresponant
  * à la recherche
  * @apiError BordereauxNotFound Impossible de trouver de bordereaux
  */
function getAllBordereaux(req, res) {
    // currently only returns a 200 code with dummy data
    var dummyResponse = {"message": "OK"};
    res.json(dummyResponse);
}


/**
  * @api {GET} /bordereaux/:id Recherche un bordereau selon son id
  * @apiGroup Bordereaux
  * @apiVersion 1.0.0
  * @apiParam {number} id Id du bordereau recherché
  *
  * @apiExample {curl} Exemple
  *   curl -i http://localhost:4000/api/bordereaux/42
  *
  * @apiSuccess {JSONString} bordereau Bordereau recherché
  * @apiError BordereauNotFound Bordereau recherché inexistant
  */
function getBordereau(req, res) {
  // currently only returns a 200 code with dummy data
  // the data will contain the id that was requested
  var id = req.params.id;
  var dummyResponse = {"message": "OK", "id": id};
  res.json(dummyResponse);
}


// routes to the functions
router.get('/', getAllBordereaux);
router.get('/:id', getBordereau);

module.exports = router;
