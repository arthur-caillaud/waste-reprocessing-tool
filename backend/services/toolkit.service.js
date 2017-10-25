'use strict';
//Import required node_modules
var Rx = require('rx');
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

function getSiteArchitecture(){
    var getSiteArchitectureObservable = Rx.Observable.create(obs => {
        site.findAll()
        .then(sites => {
            let siteArchitecture = {niveau: 0};
            sites.forEach(site => {
                let metierDependance = site.dataValues.metier_dependance;
                let upDependance = site.dataValues.up_dependance;
                let uniteDependance = site.dataValues.unite_dependance;
                let nomSite = site.dataValues.nom;
                let niveaux = [];
                let values = [];

                if (metierDependance) {
                    niveaux.push(1);
                    values.push(metierDependance);
                }
                if (upDependance) {
                    niveaux.push(2);
                    values.push(upDependance);
                }
                if (uniteDependance) {
                    niveaux.push(3);
                    values.push(uniteDependance)
                }
                if (nomSite) {
                    niveaux.push(4);
                    values.push(nomSite);
                }

                const n = niveaux.length;

                if (n>0) {
                    if (!siteArchitecture[values[0]]) {
                        siteArchitecture[values[0]] = {niveau: niveaux[0]}
                    }
                }

                if (n>1) {
                    if (!siteArchitecture[values[0]][values[1]]) {
                        siteArchitecture[values[0]][values[1]] = {niveau: niveaux[1]}
                    }
                }

                if (n>2) {
                    if (!siteArchitecture[values[0]][values[1]][values[2]]) {
                        siteArchitecture[values[0]][values[1]][values[2]] = {niveau: niveaux[2]}
                    }
                }

                if (n>3) {
                    if (!siteArchitecture[values[0]][values[1]][values[2]][values[3]]) {
                        siteArchitecture[values[0]][values[1]][values[2]][values[3]] = {niveau: niveaux[3]}
                    }
                }

            })
            obs.onNext(siteArchitecture);
            obs.onCompleted();
        })
        .catch(err => {
            obs.onError(err)
        })
    })
    return getSiteArchitectureObservable;
}

var service = {}
service.getSiteArchitecture = getSiteArchitecture;
module.exports = service;
