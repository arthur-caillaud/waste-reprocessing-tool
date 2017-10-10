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


/**
  * @api {GET} /dechets Recherche tous les déchets
  * @apiGroup Dechets
  * @apiVersion 1.0.0
  *
  * @apiParam (queryParam) {number} [id] Id des déchets
  * @apiParam (queryParam) {string} [codeinterne] code interne des déchets
  * @apiParam (queryParam) {number} [is_listeverte] Indique si les déchets sont en liste verte
  * @apiParam (queryParam) {number} [is_dangereux] Indique si les déchets sont dangereux (0 ou 1)
  * @apiParam (queryParam) {string} [libelle] libellé des déchets
  * @apiParam (queryParam) {string} [code_europeen] Code européen des déchets
  * @apiParam (queryParam) {string} [categorie] Catégorie des déchets
  * @apiParam (queryParam) {string} [indicateur_national_valorisation] Indicateur national de valorisation des déchets
  * @apiParam (queryParam) {string} [famille] Famille des déchets
  * @apiParam (queryParam) {string} [order] Tri de la liste des résultats
  * @apiParam (queryParam) {string[]} [fields] Sélection des champs
  *
  * @apiExample {curl} Exemple
  *   curl -i http://localhost:4000/api/dechets
  * @apiExample {curl} Exemple avec arguments
  *   curl -i http://localhost:4000/api/dechets/?fields=id,libelle&order=-libelle&is_listeverte=true
  *
  * @apiSuccess {JSONString[]} dechets Liste des dechets corresponant
  * à la recherche
  * @apiError DechetsNotFound Impossible de trouver de déchets
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

/**
  * @api {GET} /dechets/:id Recherche un déchet selon son id
  * @apiGroup Dechets
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
