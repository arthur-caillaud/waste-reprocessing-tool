'use strict';
var Rx = require('rx');
var service = {};
var sequelize = require('sequelize');

var models = require('../models/');
var Bordereau = models.bordereau;

function getAllBordereaux(queryParameters) {
    /* This function creates an Observable and returns it. It searches for all
     * bordereaux
     * Args: queryParameters, parameters for the query, in the following form:
     * {attributes: string[], where: {fieldA: string, ...}, order: string[]}
     */
     if (Object.keys(queryParameters).length>0 && typeof queryParameters.where != "undefined") { // checks if queryParams have actually been provided
         // modifies the fields in the 'where' statement to put everything in lower
         var where = {};
         for (const key of Object.keys(queryParameters.where)) {
             const val = queryParameters.where[key];
             where[key] = sequelize.where(sequelize.fn('LOWER', sequelize.col(key)), 'LIKE', val)
         }
         queryParameters.where = where;
     }

    var observable = Rx.Observable.create((observer) => {
        Bordereau.count(queryParameters)
            .then((bordereaux) => {
                observer.onNext(bordereaux);
                observer.onCompleted();
            })
            .catch ((error) => {
                observer.onError(error);
            });
    });
    return observable;
}

function getBordereauById(id) {
  /* This function creates an Observable and returns it. It should get a
   * single Bordereau with the corresponding id given in parameters
   * If not found, an error will be raised and handled in the response
   */
   var observable = Rx.Observable.create((observer) => {
      Bordereau.findById(id)
          .then((bordereau) => {
              if (bordereau) {
                  observer.onNext(bordereau);
                  observer.onCompleted();
              }
              else {
                // null response: must raise a NotFound error
                throw "Resource not found";
              }
          })
          .catch ((error) => {
              observer.onError(error);
          })
   });
   return observable;
}



//All exported functionalities
service.getAllBordereaux = getAllBordereaux;
service.getBordereauById = getBordereauById;

module.exports = service;
