var mysql = require('mysql');
var Sequelize = require('sequelize');
var config = require('../config.json');
var Rx = require('rx');

//Import data models
var models = require('../models/');
var bordereau = models.bordereau;
var dechet = models.dechet;
var prestataire = models.prestataire;
var site = models.site;
var traitement = models.traitement;
var transport = models.transport;
var transporteur = models.transporteur;
var type_traitement = models.type_traitement;

mySqlConnect = function() {
    const sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, {
            host: config.mysql.url,
            dialect: 'mysql',
            pool: {
                max: config.mysql.poolsize,
                min: config.mysql.minimumpoolsize,
                idle: config.mysql.connectionduration
            },
        });
    return sequelize;
};

var mysqlDisconnect = function(){
    sequelize.close();
};

mySqlWipeData = function(){
    /*
    TRUNCATE TABLE 'bordereau';
    TRUNCATE TABLE 'dechet';
    TRUNCATE TABLE 'site';
    TRUNCATE TABLE 'traitement';
    TRUNCATE TABLE 'transport';
    TRUNCATE TABLE 'transporteur';
    TRUNCATE TABLE 'prestataire';
    TRUNCATE TABLE 'type_traitement';
    */
}

service = {}
service.mySqlConnect = mySqlConnect;
service.mysqlDisconnect = mysqlDisconnect;
module.exports = service;
