var mysql = require('mysql');


function connectToMySQL (URL, databaseName) {
    var connection = mysql.CreateConnection({
        host: URL,
        user: "mock",
        password: "mock",
        database: databaseName
    });

    connection.connect();
}

var service = {};
module.exports = service;
