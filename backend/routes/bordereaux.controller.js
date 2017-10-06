'use strict';
var express = require('express');
var router = express.Router();
var Rx = require('rx');


/*
This is a controller entirely dedicated to error handling when it comes
to database communication. The functions dealing directly with Sequalize
are written in the services being called in this controller
*/


/**
  * @api {get} /bordereaux Recherche tous les bordereaux
  * @apiGroup Bordereaux
  * @apiVersion 1.0.0
  *
  * @apiExample {curl} Exemple
  *   curl -i http://localhost/api/bordereaux
  *
  * @apiSuccess {JSONString[]} bordereaux Liste des bordereaux corresponant
  * à la recherche
  * @apiError BordereauxNotFound Impossible de trouver de bordereaux
  */
function getAllBordereaux(req, res) {

}


/**
  * @api {get} /bordereaux/:id Recherche un bordereau selon son id
  * @apiGroup Bordereaux
  * @apiVersion 1.0.0
  * @apiParam {number} id Id du bordereau recherché
  *
  * @apiExample {curl} Exemple
  *   curl -i http://localhost/api/bordereaux/42
  *
  * @apiSuccess {JSONString} bordereau Bordereau recherché
  * @apiError BordereauNotFound Bordereau recherché inexistant
  */
function getBordereau(req, res) {

}
