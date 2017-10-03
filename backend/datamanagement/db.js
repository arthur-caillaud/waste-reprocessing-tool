var mysql = require('mysql');
var Sequelize = require('sequelize');
var config = require('../config.json');
var Rx = require('rx');

mySqlConnect = function() {
    var connectionObservable = Rx.Observable.create(obs => {
        const sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, {
            host: config.mysql.url,
            dialect: 'mysql',
            pool: {
                max: 20,
                min: 0,
                idle: 10000
            },
        });
        sequelize.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
            obs.onCompleted();
        })
        .catch(err => {
            console.error('Unable to connect to the database');
            obs.onError(err);
        });
    });

    return connectionObservable;
};

mysqlDisconnect = function(){
    sequelize.close();
};

service = {}
service.mySqlConnect = mySqlConnect;
service.mysqlDisconnect = mysqlDisconnect;
module.exports = service;
