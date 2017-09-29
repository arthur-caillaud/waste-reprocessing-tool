var mysql = require('mysql');
var sequelize = require('sequelize');

mySqlConnect = function(){
    const sequelize = new Sequelize('database', 'username', 'password', {
        host: 'localhost',
        dialect: 'mysql'|'sqlite'|'postgres'|'mssql',
        pool: {
            max: 10,
            min: 0,
            idle: 10000
        },
    }
}
