var mongoose = require('mongoose');
var dataSchemas = require('./db_schemas.js');

mongooseConnect = function(mongoBaseUrl,callback) {
    mongoose.connect(mongoBaseUrl,{
        useMongoClient: true
    });
    var database = mongoose.connection;
    database.on('error', console.error.bind(console, 'connection error:'));
    database.once('open', function(){
        console.log("Connection to database successfully opened");
        callback();
    });
};

mongooseDisconnect = function(callback) {
    var database = mongoose.connection;
    database.disconnect(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Connection to database successfully closed");
            callback();
        }
    });
};

//Export du service
var service = {}
service.mongooseConnect = mongooseConnect;
service.mongooseDisconnect = mongooseDisconnect;
module.exports = service;
