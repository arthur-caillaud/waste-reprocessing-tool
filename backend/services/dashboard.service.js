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
var referentiel_dechet = models.referentiel_dechet;

function getAllEcartsDePesee(tolerance, idArray) {
    const query = {
        where: {
            id_site: {$in: idArray}
        }
    };
    var getAllEcartsDePeseeObservable = Rx.Observable.create(obs => {
        bordereau.findAll(query)
            .then(bordereaux => {
                let bordereauxAvecEcartDePesee = [];
                bordereaux.forEach(bordereau => {
                    let quantiteeFinale = bordereau.dataValues.quantitee_finale;
                    let quantiteeTransportee = bordereau.dataValues.quantitee_transportee;
                    let ecartDePesee = Math.abs(quantiteeTransportee - quantiteeFinale);
                    if(ecartDePesee > tolerance){
                        bordereauxAvecEcartDePesee.push(bordereau.dataValues);
                    }
                })
                obs.onNext([bordereauxAvecEcartDePesee, "ecarts_pesee"]);
                obs.onCompleted();
            })
            .catch(err => {
                obs.onError(err);
            });
    });
    return getAllEcartsDePeseeObservable;
}

function getAllIncoherencesFilieres(idArray) {
    var getAllIncoherencesFilieresObservable = Rx.Observable.create(obs => {
        bordereau.findAll({
            where: {
                id_site: {$in: idArray}
            },
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
            });
            obs.onNext([bordereauxAvecIncoherencesFilieres, "incoherences_filieres"]);
            obs.onCompleted();
        })
        .catch(err => {
            obs.onError(err)
        })
    })
    return getAllIncoherencesFilieresObservable;
};

function getAllFilieresInterdites(idArray){

    var getAllFilieresInterditesObservable = Rx.Observable.create(obs => {
        bordereau.findAll({
            include: [
            {
                model: dechet,
                required: true,
                include: {
                    model: referentiel_dechet,
                    required: true,
                    where: {
                        gestion: 'r'
                    }
                }
            },
            {
                model: traitement,
                required: true
            }],
            where: {
                traitement: sequelize.where(sequelize.col('traitement.id_type_traitement'),sequelize.col('dechet->referentiel_dechets.id_type_traitement')),
                id_site: {$in: idArray}
            }
        }).
        then(bordereauxAvecFilieresInterdites => {
            obs.onNext([bordereauxAvecFilieresInterdites, "filieres_interdites"]);
            obs.onCompleted();
        }).
        catch(err => {
            obs.onError(err)
        })
    });
    return getAllFilieresInterditesObservable;
};

function getAllRetards(idArray) {

    var date = new Date();
    const maxDelay = 30 * 60 * 60 * 1000;

    var observable = Rx.Observable.create((obs) => {
        bordereau.findAll({
            include: [{
                model: traitement,
                where: {
                    date_priseencharge: {$lt: (date - maxDelay)}
                }
            }],
            where: {
                id_site: {$in: idArray},
                bordereau_finished: false
            }
        })
        .then((bordereaux) => {
            obs.onNext([bordereaux, "retards"]);
            obs.onCompleted();
        })
        .catch((err) => {
            obs.onError(err);
        })
    });
    return observable;
}

var service = {};

service.getAllEcartsDePesee = getAllEcartsDePesee;
service.getAllIncoherencesFilieres = getAllIncoherencesFilieres;
service.getAllFilieresInterdites = getAllFilieresInterdites;
service.getAllRetards = getAllRetards;

module.exports = service;
