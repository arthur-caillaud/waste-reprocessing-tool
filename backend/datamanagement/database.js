var mongoose = require('mongoose');
var dataSchemas = require('./dataSchemas.js')

var service = {}

mongooseConnect = function(mongoBaseUrl,callback) {
    mongoose.connect(mongoBaseUrl,{
        useMongoClient: true
    });
    var database = mongoose.connection;
    database.on('error', console.error.bind(console, 'connection error:'));
    database.once('open', function(){
        console.log("Connection to database successfully achieved");
        callback();
    })
}

service.mongooseConnect = mongooseConnect;
module.exports = service;
