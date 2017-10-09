// This file contains various utilities functions for the route
// For now: error handler and a query parameters parser

var utilities = {};

function errorHandler(error, callback) {
    if (error == "Resource not found") {
        var status = 404;
        var message = "Resource not found";
    }
    else {
        // All other errors that are not currently defined
        var status = 500; // TODO modify to adapt to various possible errors
        var message = "internal server error";
    }
    callback({status: status, message: message});
}

function queryParser(type, args, callback) {
    // Parse all the query parameters into a usable object for the service
    parsedArgs = {}

    // parse the fields selectors array
    var fields = args.fields;
        if (fields) {
          // only considers the fields if some are provided
          fields = fields.split(',');
          parsedArgs.fields = fields;
        }

    // parse the search parameters
    // array of all searchable fields
    const searchFields = {
      prestataire: ['id', 'nom', 'localisation', 'siret'],
    };
    var where = {};
    for (var searchIndex in searchFields[type]) {
        // only checks if possible fields are present in the query
        var field = searchFields[type][searchIndex];
        if (args[field]) {
            var search = args[field];
            where[field] = '%' + search + '%';
        }
    }
    if (Object.keys(where).length>0) {
        // checks if args have been added to the search parameters
        parsedArgs.where = where;
    }

    // parse the sorting parameters
    if (args.order) {
        var order = [args.order, 'ASC'];
        if (args.order[0]=='-') {
            // if the order is in the form '-xx', add the descending order, but
            // do not put the '-' in the order parameter
            order[0] = args.order.substring(1);
            order[1] = 'DESC';
        }
        // for sequelize, the order field must contain an array
        parsedArgs.order = [order];
    }

    callback(parsedArgs)
    // it is possible to add the possibility to make a pagination, but in the
    // case of the current project, it is not usefull
}

utilities.errorHandler = errorHandler;
utilities.queryParser = queryParser;

module.exports = utilities;
