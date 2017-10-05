'use strict';
var Rx = require('rx');
var service = {};
var sequelize = require('sequelize');

var models = require('../models/');
var Prestataire = models.prestataire;
var Distance = models.distance;

function getAllPrestataires() {
    /* This function creates an Observable and returns it. It searches for all
    prestataires */
    var getAllPrestatairesObservable = Rx.Observable.create(function (obs) {
            Prestataire.findAll()
            .then(function(prestataires){
                obs.onCompleted(prestataires);
            })
            .catch (function(error) {
                obs.onError(error);
            });


    });
    return getAllPrestatairesObservable;
}

function getPrestataireByName(prestataireName){

    /* This function creates an Observable and returns it. It should
    search for all the Prestataires that have a name containing PrestataireName
    */
    var getPrestataireByNameObservable = Rx.Observable.create(function (obs) {
        Prestataire.findAll({
            where: {
                nom: {$like: '%prestataireName%'}
            }
        })
        .then(function(prestataires) {
            obs.onCompleted(prestataires);
        })
        .catch (function(error) {
            obs.onError(error);
        });
    });
    return getPrestataireByNameObservable;

};

function getPrestatairesCloseToPrestataire(prestataireName, givenDistance) {
    /* This function creates an Observable and returns it. It should searches
    for all the Prestataires that are close enough to the selected Prestataire
    */
    var getClosePrestatairesObservable = Rx.Observable.create(function(obs) {
        Distance.findAll({
            where: {
                $or: [
                    {
                        prestataire1: {$like: '%prestataireName%'}
                    },
                    {
                        prestataire2: {$like: '%prestataireName%'},
                    }
                ],
                distance: {$lte: givenDistance}
            }
        })
        .then(function(prestataires) {
            /*
            careful, this sends back objects looking like
            {prestataireName, ClosePrestataire, Distance}
            */
            obs.onCompleted(prestataires);
        })
        .catch(function(error) {
            obs.onError(error);
        });
    });
    return getClosePrestatairesObservable;
};


//All exported functionalities
service.getAllPrestataires = getAllPrestataires;
service.getPrestataireByName = getPrestataireByName;
service.getPrestatairesCloseToPrestataire = getPrestatairesCloseToPrestataire;

module.exports = service;
