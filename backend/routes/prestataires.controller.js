'use strict';
var express = require('express');
var router = express.Router();
// var config = require('config.json');
var prestataireService = require('../services/prestataire.service');

/*
This is a controller entirely dedicated to error handling when it comes
to database communication. The functions dealing directly with MongoClient
are written in the services being called in this controller
*/


//To Implement
function RenderPrestatairesPage(req, res) {
    res.render("renvoyer la page vision prestataires");
}


function getAllPrestataires (req, res) {
    prestataireService.getAllPrestataires()
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        })

}

//routes to above functions
router.get('/prestataires', getAllPrestataires);
router.get('/', RenderPrestatairesPage);

//Exporting module
module.exports = router;
