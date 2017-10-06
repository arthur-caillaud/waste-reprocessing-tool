'use strict';
var express = require('express');
var router = express.Router();
var Rx = require('rx');
var prestataireService = require('../services/prestataire.service');

/*
This is a controller entirely dedicated to error handling when it comes
to database communication. The functions dealing directly with Sequalize
are written in the services being called in this controller
*/

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
  // currently only returns a 200 code with dummy data
  var dummyResponse = {"message": "OK"};
  res.json(dummyResponse);
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
  // currently only returns a 200 code with dummy data
  // the data will contain the id that was requested
  var id = req.params.id;
  var dummyResponse = {"message": "OK", "id": id};
  res.json(dummyResponse);
}
