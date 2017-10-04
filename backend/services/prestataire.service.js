'use strict';
var Rx = require('rx');
var service = {};
var sequelize = require('sequelize');

var models = require('../models/');
var Client = models.prestataire;
var Distance = models.distance;

function getAllClients() {
    /* This function creates an Observable and returns it. It searches for all
    clients */
    var getAllClientsObservable = Rx.Observable.create(function (obs) {
            Client.findAll()
            .then(function(clients){
                obs.onCompleted(clients);
            })
            .catch (function(error) {
                obs.onError(error);
            });


    });
    return getAllClientsObservable;
}

function getClientByName(clientName){

    /* This function creates an Observable and returns it. It should
    search for all the Clients that have a name containing ClientName
    */
    var getClientByNameObservable = Rx.Observable.create(function (obs) {
        Client.findAll({
            where: {
                nom: {$like: '%clientName%'}
            }
        })
        .then(function(clients) {
            obs.onCompleted(clients);
        })
        .catch (function(error) {
            obs.onError(error);
        });
    });
    return getClientByNameObservable;

};

function getClientsCloseToClient(clientName, givenDistance) {
    /* This function creates an Observable and returns it. It should searches
    for all the Clients that are close enough to the selected Client
    */
    var getCloseClientsObservable = Rx.Observable.create(function(obs) {
        Distance.findAll({
            where: {
                $or: [
                    {
                        prestataire1: {$like: '%clientName%'}
                    },
                    {
                        prestataire2: {$like: '%clientName%'},
                    }
                ],
                distance: {$lte: givenDistance}
            }
        })
        .then(function(clients) {
            /*
            careful, this sends back objects looking like
            {clientName, ClosePrestataire, Distance}
            */
            obs.onCompleted(clients);
        })
        .catch(function(error) {
            obs.onError(error);
        });
    });
    return getCloseClientsObservable;
};


//All exported functionalities
service.getAllClients = getAllClients;
service.getClientByName = getClientByName;
service.getClientsCloseToClient = getClientsCloseToClient;

module.exports = service;
