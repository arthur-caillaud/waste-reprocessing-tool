'use strict';

var Q = require('q');
var database = require('../database')
var mongoose = require('mongoose');
var dataSchemas = require('./data/dataSchemas');
var Bordereau = mongoose.model('Bordereau', dataSchemas.bordereauSchema);

var service = {};
//All exported functionalities


module.exports = service;


function getAllPrestataires() {
    var deferred = Q.defer();
    Bordereau.distinct({ "traitementFinal.nom" }, function (err, PrestatairesListe) {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }
        else {
            deferred.resolve(PrestatairesListe);
        }
    });
    return deferred.promise;
}
