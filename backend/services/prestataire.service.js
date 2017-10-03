'use strict';
var Rx = require('rx');
var service = {};
var sequelize = require('sequelize');

var models = require('../models/');
var Client = models.prestataire;

function getAllClients() {
    /* This function creates an Observable and returns it. It searches for all
    clients */
    var getAllClientsObservable = Rx.Observable.create(function (obs) {
        try {
            Client.findAll().then(function(clients){
                obs.onCompleted(clients);
            })
        }
        catch (error) {
            obs.onError(error);
        };


    });
    return getAllClientsObservable;
}

function getClientByName(clientName){

    /* This function creates an Observable and returns it. It should
    search for all the Clients that have a name containing ClientName
    */
    var getClientByNameObservable = Rx.Observable.create(function (obs) {
        try {
            Client.findAll({
                where: {
                    nom: {$like: '%clientName%'}
                }
            })
            .then(function(clients) {
                obs.onCompleted(clients);
            })

        }
        catch (error) {
            obs.onError(error);
        };
    });
    return getClientByNameObservable;

};

//All exported functionalities
service.getAllClients = getAllClients;
service.getClientByName = getClientByName;

module.exports = service;
