'use strict';
var Rx = require('rx');
var service = {};
var sequelize = require('sequelize');

//Import required local modules
var models = require('../models/');
var db = require('../datamanagement/db.js');
var bordereau = models.bordereau;
var dechet = models.dechet;
var prestataire = models.prestataire;
var site = models.site;
var traitement = models.traitement;
var transport = models.transport;
var transporteur = models.transporteur;
var type_traitement = models.type_traitement;

function getAllEcartsDePesee(tolerance){
    var getAllEcartsDePeseeObservable = Rx.Observable.create(obs => {
        bordereau.findAll()
        .then(bordereaux => {
            let bordereauxAvecEcartDePesee = [];
            bordereaux.forEach(bordereau => {
                let quantiteeFinale = bordereau.dataValues.quantitee_finale;
                let quantiteeTransportee = bordereau.dataValues.quantitee_transportee;
                let ecartDePesee = Math.abs(quantiteeTransportee - quantiteeFinale);
                if(ecartDePesee >= tolerance){
                    bordereauxAvecEcartDePesee.push(bordereau.dataValues);
                }
            })
            obs.onNext(bordereauxAvecEcartDePesee);
            obs.onCompleted();
        })
        .catch(err => {
            obs.onError(err);
        })
    })
}
