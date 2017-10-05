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
};

function getAllIncoherencesFilieres(){
    var getAllIncoherencesFilieresObservable = Rx.Observable.create(obs => {
        bordereau.findAll({
            include: [{
                model: traitement,
                required: true
            }]
        })
        .then(bordereaux => {
            let bordereauxAvecIncoherencesFilieres = [];
            bordereaux.forEach(bordereau => {
                let traitementPrevu = bordereau.dataValues.id_traitement_prevu;
                let traitementFinal = bordereau.dataValues.traitement.id_type_traitement;
                if(traitementPrevu != traitementFinal){
                    bordereauxAvecIncoherencesFilieres.push(bordereau);
                }
            })
            obs.onNext(bordereauxAvecIncoherencesFilieres);
        })
        .catch(err => {
            obs.onError(err)
        })
    })
    return getAllIncoherencesFilieresObservable;
};

var service = {}
service.getAllEcartsDePesee = getAllEcartsDePesee;
service.getAllIncoherencesFilieres = getAllIncoherencesFilieres;
module.exports = service;
