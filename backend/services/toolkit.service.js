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
            let siteArchitecture = {};
            sites.forEach(site => {
                let metierDependance = site.dataValues.metier_dependance;
                let upDependance = site.dataValues.up_dependance;
                let uniteDependance = site.dataValues.unite_dependance;
                let nomSite = site.dataValues.nom;
                if(!uniteDependance){
                    uniteDependance = nomSite;
                    nomSite = null;
                }
                if(!upDependance){
                    upDependance = uniteDependance;
                    uniteDependance = nomSite;
                    nomSite = null;
                }
                if(!metierDependance){
                    metierDependance = upDependance;
                    upDependance = uniteDependance;
                    uniteDependance = nomSite;
                    nomSite = null;
                }

                if (metierDependance && !siteArchitecture[metierDependance]){
                    siteArchitecture[metierDependance] = {};
                }
                if(upDependance && !siteArchitecture[metierDependance][upDependance]){
                    siteArchitecture[metierDependance][upDependance] = {};
                }
                if(uniteDependance && !siteArchitecture[metierDependance][upDependance][uniteDependance]){
                    siteArchitecture[metierDependance][upDependance][uniteDependance] = {};
                }
                if(nomSite && !siteArchitecture[metierDependance][upDependance][uniteDependance][nomSite]){
                    siteArchitecture[metierDependance][upDependance][uniteDependance][nomSite] = nomSite;
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
