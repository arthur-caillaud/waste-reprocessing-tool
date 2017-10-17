'use strict';
var Rx = require('rx');
var service = {};
var sequelize = require('sequelize');

var models = require('../models/');
var Prestataire = models.prestataire;
var Distance = models.distance;

function getAllPrestataires(queryParameters) {
    /* This function creates an Observable and returns it. It searches for all
     * prestataires
     * Args: queryParameters, parameters for the query, in the following form:
     * {attributes: string[], where: {fieldA: string, ...}, order: string[]}
     */
     if (Object.keys(queryParameters).length>0) { // checks if queryParams have actually been provided
         // modifies the fields in the 'where' statement to put everything in lower
         var where = {};
         if (typeof queryParameters["where"] != 'undefined') {
             for (const key of Object.keys(queryParameters.where)) {
                 const val = queryParameters.where[key];
                 where[key] = sequelize.where(sequelize.fn('LOWER', sequelize.col(key)), 'LIKE', val)
             }
             queryParameters.where = where;
         }
     }

    var getAllPrestatairesObservable = Rx.Observable.create((observer) => {
        Prestataire.findAll(queryParameters)
            .then((prestataires) => {
                observer.onNext(prestataires);
                observer.onCompleted();
            })
            .catch ((error) => {
                observer.onError(error);
            });
    });
    return getAllPrestatairesObservable;
}

function getPrestataireById(prestataireId) {
  /* This function creates an Observable and returns it. It should get a
   * single Prestataire with the corresponding id given in parameters
   * If not found, an error will be raised and handled in the response
   */
   var observable = Rx.Observable.create((observer) => {
      Prestataire.findById(prestataireId)
          .then((prestataire) => {
              if (prestataire) {
                  observer.onNext(prestataire);
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

function getPrestataireByName(prestataireName){

    /* This function creates an Observable and returns it. It should
    search for all the Prestataires that have a name containing PrestataireName
    */
    var getPrestataireByNameObservable = Rx.Observable.create(function (obs) {
        Prestataire.findAll({
            where: {
                nom: {$like: '%prestataireName%'}
            }
        })
        .then(function(prestataires) {
            obs.onCompleted(prestataires);
        })
        .catch (function(error) {
            obs.onError(error);
        });
    });
    return getPrestataireByNameObservable;

};

function getPrestatairesCloseToPrestataire(prestataireName, givenDistance) {
    /* This function creates an Observable and returns it. It should searches
    for all the Prestataires that are close enough to the selected Prestataire
    */
    var getClosePrestatairesObservable = Rx.Observable.create(function(obs) {
        Distance.findAll({
            where: {
                $or: [
                    {
                        prestataire1: {$like: '%prestataireName%'}
                    },
                    {
                        prestataire2: {$like: '%prestataireName%'},
                    }
                ],
                distance: {$lte: givenDistance}
            }
        })
        .then(function(prestataires) {
            /*
            careful, this sends back objects looking like
            {prestataireName, ClosePrestataire, Distance}
            */
            obs.onCompleted(prestataires);
        })
        .catch(function(error) {
            obs.onError(error);
        });
    });
    return getClosePrestatairesObservable;
};


//All exported functionalities
service.getAllPrestataires = getAllPrestataires;
service.getPrestataireById = getPrestataireById;
service.getPrestataireByName = getPrestataireByName;
service.getPrestatairesCloseToPrestataire = getPrestatairesCloseToPrestataire;

module.exports = service;
