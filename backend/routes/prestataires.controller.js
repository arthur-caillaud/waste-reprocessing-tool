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
}


function getAllPrestataires (req, res) {
    var getAllObserver = {
        error: function (error) {
            console.error(error);
        },
        complete: function(listePrestataires) {
            console.log("finished loading all prestataires")
            res.json(listePrestataires);
        }
    }
    prestataireService.getAllPrestataires().subscribe(getAllObserver);
}

//routes to above functions
router.get('/prestataires', getAllPrestataires);
router.get('/', RenderPrestatairesPage);

//Exporting module
module.exports = router;
