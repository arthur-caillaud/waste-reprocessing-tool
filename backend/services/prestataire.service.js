'use strict';

<<<<<<< HEAD
var Rx = require('rx');
var database = require('../database')

=======
var database = require('../database')
var mongoose = require('mongoose');
// var dataSchemas = require('./data/dataSchemas');
// var Bordereau = mongoose.model('Bordereau', dataSchemas.bordereauSchema);
>>>>>>> 1edc45259386bcf0181dc723707f81c6f321c9b9

var service = {};
//All exported functionalities
service.getAllPrestataires = getAllPrestataires;

module.exports = service;


function getAllPrestataires() {
<<<<<<< HEAD
    
}

function getPrestataireByName(prestataireName){

=======
    return none
>>>>>>> 1edc45259386bcf0181dc723707f81c6f321c9b9
}
