var mysql = require('mysql');
var Sequelize = require('sequelize');
var config = require('../config.json');
var Rx = require('rx');

mySqlConnect = function() {
    const sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, {
            host: config.mysql.url,
            dialect: 'mysql',
            pool: {
                max: 20,
                min: 0,
                idle: 10000
            }
        });
    return sequelize;
};

mysqlDisconnect = function(){
    sequelize.close();
};

service = {}
service.mySqlConnect = mySqlConnect;
service.mysqlDisconnect = mysqlDisconnect;
module.exports = service;
