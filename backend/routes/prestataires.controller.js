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
  * @apiVersion 1.0.0
  * @apiDeprecated use now version 1.1.0
  * @apiGroup Prestataires
  */
//TODO To Implement
function RenderPrestatairesPage(req, res) {
    res.json("renvoyer la page vision prestataires");
};


/**
  * @api {GET} /getPrestatairesCloseToPrestataire Recherche les prestataires à proximité
  * @apiVersion 1.0.0
  * @apiDeprecated use now version 1.1.0
  * @apiGroup Prestataires
  * @apiParam (Body) {JSONString} prestataireName Nom du prestataire au centre de
  *                                               la recherche
  */
function getPrestatairesCloseToPrestataire(req, res) {
/*
    Note that this function expects req.body to be filled with a json.strinkgify using
    the fetch module.
*/
    prestataire = req.body.prestataireName;
    distance = req.body.distance;
    var getClosePrestatairesObserver = {
        onError: function(error) {
            console.log(error);
            res.status(400).send(error);
        },
        onCompleted: function(listePrestataires) {
            res.json(listePrestataires);
        }
    }
    prestataireService.getPrestatairesCloseToPrestataire(prestataire, distance).subscribe(getClosePrestatairesObserver);
};


/**
  * @api {GET} /getPrestataires Récupère tous les prestataires
  * @apiVersion 1.0.0
  * @apiDeprecated use now version 1.1.0
  * @apiGroup Prestataires
  */
function getAllPrestataires (req, res) {
    var getAllObserver = {
        onError: function (error) {
            console.log(error);
            res.status(400).send(error);
        },
        onCompleted: (listePrestataires) => {
          console.log(listePrestataires);
            res.json(listePrestataires);
        }
    }
    prestataireService.getAllPrestataires().subscribe(getAllObserver);
};


/**
  * @api {GET} /getPrestataire/:prestataireName Récupère les prestataires selon leur nom
  * @apiVersion 1.0.0
  * @apiDeprecated use now version 1.1.0
  * @apiGroup Prestataires
  * @apiParam (Paramètres) {String} prestataireName Nom du prestataire
  */
function getPrestataireByName (req, res) {
    var getPrestataireObserver = {
        onError: function (error) {
            console.log("error");
            res.status(400).send(error);
        },
        onCompleted: function(listePrestataires) {
            res.json(listePrestataires);
        }
    }
    prestataireService.getPrestataireByName(req.params.prestataireName).subscribe(getPrestataireObserver);
};


/**
  * @api {GET} /getIndicatorsForPrestataire Récupères les indicateurs pour un prestataire
  *
  * @apiVersion 1.0.0
  * @apiDeprecated use now version 1.1.0
  * @apiGroup Prestataires
  * @apiParam (Body) {JSONString} prestataireName Nom du prestataire
  */
function getIndicatorsForPrestataire (req, res) {

    //to be completed
    prestataire = req.body.prestataireName;

}


//routes to above functions
router.get('/getPrestatairesCloseToPrestataire', getPrestatairesCloseToPrestataire);
router.get('/getPrestataires', getAllPrestataires);
router.get('/getPrestataire/:prestataireName', getPrestataireByName);
router.get('/', RenderPrestatairesPage);
router.get('/getIndicatorsForPrestataire', getIndicatorsForPrestataire);

//Exporting module
module.exports = router;
