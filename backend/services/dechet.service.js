'use strict';
var Rx = require('rx');
var service = {};
var sequelize = require('sequelize');

var models = require('../models/');
var Dechet = models.dechet;

function getAllDechets(queryParameters) {
    /* This function creates an Observable and returns it. It searches for all
     * déchets
     * Args: queryParameters, parameters for the query, in the following form:
     * {attributes: string[], where: {fieldA: string, ...}, order: string[]}
     */
     if (Object.keys(queryParameters).length>0) {
         // modifies the fields in the 'where' statement to put everything in lower
         var where = {};
         for (const key of Object.keys(queryParameters.where)) {
             const val = queryParameters.where[key];
             where[key] = sequelize.where(sequelize.fn('LOWER', sequelize.col(key)), 'LIKE', val)
         }
         queryParameters.where = where; 
     }

     var observable = Rx.Observable.create((observer) => {
         Dechet.findAll(queryParameters)
            .then((dechets) => {
                observer.onNext(dechets);
                observer.onCompleted();
            })
            .catch((error) => {
                observer.onError(error);
            });
     });
     return observable;
}

function getDechetById(id) {
    /* This function creates an Observable and returns it. It should get a
     * single dechet with the corresponding id given in parameters
     * If not found, an error will be raised and handled in the response
     */
     var observable = Rx.Observable.create((observer) => {
         Dechet.findById(id)
            .then((dechet) => {
                if (dechet) {
                    observer.onNext(dechet);
                    observer.onCompleted();
                }
                else {
                    // null response: must raise a NotFound error
                    throw "Resource not found";
                }
            })
            .catch((error) => {
                observer.onError(error);
            })
     });
     return observable;

}

service.getAllDechets = getAllDechets;
service.getDechetById = getDechetById;

module.exports = service;
