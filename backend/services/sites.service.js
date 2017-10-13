'use strict';
var Rx = require('rx');
var service = {};
var sequelize = require('sequelize');

var models = require('../models/');
var Site = models.site;

function getAllSites(queryParameters) {
    /* This function creates an Observable and returns it. It searches for all
     * sites
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
        Site.findAll(queryParameters)
            .then((prestataires) => {
                observer.onNext(prestataires);
                observer.onCompleted();
            })
            .catch ((error) => {
                observer.onError(error);
            });
    });
    return observable;
}

function getSiteById(id) {
  /* This function creates an Observable and returns it. It should get a
   * single Site with the corresponding id given in parameters
   * If not found, an error will be raised and handled in the response
   */
   var observable = Rx.Observable.create((observer) => {
      Site.findById(id)
          .then((site) => {
              if (site) {
                  observer.onNext(site);
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
service.getAllSites = getAllSites;
service.getSiteById = getSiteById;

module.exports = service;
