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


//To Implement
function RenderPrestatairesPage(req, res) {
    res.render("renvoyer la page vision prestataires");
};

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

function getAllPrestataires (req, res) {
    var getAllObserver = {
        onError: function (error) {
            console.log(error);
            res.status(400).send(error);
        },
        onCompleted: function(listePrestataires) {
            res.json(listePrestataires);
        }
    }
    prestataireService.getAllPrestataires().subscribe(getAllObserver);
};

function getPrestataireByName (req, res) {
    var getPrestataireObserver = {
        onError: function (error) {
            console.log(error);
            res.status(400).send(error);
        },
        onCompleted: function(listePrestataires) {
            res.json(listePrestataires);
        }
    }
    prestataireService.getPrestataireByName(req.params.prestataireName).subscribe(getPrestataireObserver);
};

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
