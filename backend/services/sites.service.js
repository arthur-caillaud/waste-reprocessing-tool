'use strict';
var Rx = require('rx');
var service = {};
var sequelize = require('sequelize');

var models = require('../models/');
var Site = models.site
var localisation = models.localisation;

var location = require('../utilities/location');
var config = require('../config/config.json');

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
             if (key == "any") {
                 var anyValue = queryParameters.where.any;
                 var anyFilter = {
                     $or: [
                         sequelize.where(sequelize.col('nom'), 'LIKE', anyValue),
                         sequelize.where(sequelize.col('unite_dependance'), 'LIKE', anyValue),
                         sequelize.where(sequelize.col('up_dependance'), 'LIKE', anyValue),
                         sequelize.where(sequelize.col('metier_dependance'), 'LIKE', anyValue),
                     ]
                 };
                 where["any"] = anyFilter;
             }
             else {
                 const val = queryParameters.where[key];
                 where[key] = sequelize.where(sequelize.col(key), 'LIKE', val)
             }
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

function getSitesCloseToSite(name, distanceMax) {
    var result = [];
    var observable = Rx.Observable.create((observer) => {
        Site.findAll({
            where: {
                nom: name,
            },
            include: [
                {
                    model: localisation,
                }
            ]
        })
            .then((givenSites) => {
                var givenSite = givenSites[0];
                if (givenSite) {
                    // gets all the other sites
                    if (givenSite.dataValues.localisation != null) {
                        var latitude = givenSite.dataValues.localisation.dataValues.latitude;
                        var longitude = givenSite.dataValues.localisation.dataValues.longitude;
                        Site.findAll({
                            include: [
                                {
                                    model: localisation,
                                    where: {
                                        id: {$not: null}
                                    }
                                }
                            ]
                        })
                            .then((sites) => {
                                // for each site, only gets the close ones
                                sites.forEach((site) => {
                                    var lat = site.dataValues.localisation.dataValues.latitude;
                                    var long = site.dataValues.localisation.dataValues.longitude;
                                    location.getDistance(longitude, latitude, long, lat, (distance) => {
                                        if (distance < distanceMax) {
                                            site.dataValues.localisation = undefined;
                                            result.push(site);
                                        }
                                    })
                                })
                                observer.onNext(result);
                                observer.onCompleted();
                            })
                            .catch((error) => {
                                throw error;
                            })
                        }
                        else {
                            observer.onNext([givenSite]);
                            observer.onCompleted();
                        }

                }
                else {
                    throw "Resource not found";
                }
            })
            .catch ((error) => {
                observer.onError(error);
            });
    });
    return observable;
}



//All exported functionalities
service.getAllSites = getAllSites;
service.getSiteById = getSiteById;
service.getSitesCloseToSite = getSitesCloseToSite;

module.exports = service;
