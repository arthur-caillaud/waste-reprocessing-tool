'use strict';
var Rx = require('rx');
var service = {};
//All exported functionalities
service.getAllPrestataires = getAllPrestataires;

module.exports = service;


function getAllPrestataires() {
    var getAllPrestatairesObservable = Rx.Observable.create(function (obs) {
        try {
            //db.getAllPrestataires
            obs.complete(prestatairesList);
        }
        catch (error => {
            obs.error();
        });


    });
    return getAllPrestatairesObservable;
}

function getPrestataireByName(prestataireName){
    var getPrestataireByNameObservable = Rx.Observable.create(function (obs) {
        try {
            //db.getPrestataireByName
            obs.complete(prestataire);
        }
        catch (error => {
            obs.error();
        });
    })

};
