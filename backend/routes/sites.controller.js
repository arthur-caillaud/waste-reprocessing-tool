'use strict';
var express = require('express');
var router = express.Router();
var Rx = require('rx');
var sitesService = require('../services/sites.service');
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

/**
  * @api {GET} /sites Recherche tous les sites
  * @apiGroup Sites
  * @apiVersion 1.0.0
  *
  * @apiParam (queryParam) {string} [nom] Noms des sites
  * @apiParam (queryParam) {number} [id] Id des sites
  * @apiParam (queryParam) {string} [site_production] je sais pas ce que c'est
  * @apiParam (queryParam) {string} [unite_dependance] unité de dépendance des sites
  * @apiParam (queryParam) {string} [up_dependance] aucune idée non plus
  * @apiParam (queryParam) {string} [metier_dependance] métier de dépendance des sites
  * @apiParam (queryParam) {string} [order] Tri de la liste des résultats
  * @apiParam (queryParam) {string[]} [fields] Sélection des champs
  *
  * @apiExample {curl} Exemple sans argument
  *   curl -i http://localhost:4000/api/sites
  * @apiExample {curl} Exemple avec arguments
  *   curl -i http://localhost:4000/api/sites/?fields=id,nom&order=-nom
  *
  * @apiSuccess {JSONString[]} prestataires Liste des sites
  * correspondant à la recherche
  * @apiError PrestatairesNotFound Impossible de trouver les prestataires
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

/**
  * @api {GET} /sites/:id Recherche un site selon son id
  * @apiGroup Sites
  * @apiVersion 1.1.0
  *
  * @apiExample {curl} Exemple
  *   curl -i http://localhost:4000/api/sites/42
  * @apiSuccess {JSONString} prestataire Prestataire recherché
  * @apiError PrestataireNotFound Prestataire introuvable
  */
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

// Routes to functions
router.get('/', getAllSites);
router.get('/:id', getSiteById);

//exporting router
module.exports = router;
