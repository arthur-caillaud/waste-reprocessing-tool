import fetch from 'isomorphic-fetch';
import config from '../config.json';
import HelperService from './service';
import * as actions from './index';


export function getArchitecture() {
    return dispatch => {
        return fetch(config.backend.adress+'dashboard/architecture')
            .then(response => response.json())
            .then(json => {
                dispatch(actions.saveArchitecture(json))
            })
    }
}


/*
Main Search Bar API calls
*/
export function loadSuggestions(value) {
  return dispatch => {
    dispatch(actions.loadSuggestionsBegin())
    return fetch(config.backend.adress+'dashboard/architecture')
        .then(response => response.json())
        .then(json => {

            dispatch(actions.maybeUpdateSuggestions(HelperService.filterByValue(HelperService.getAllLevelNames(json), value), value))
        })

  };
}

export function updateSite(site) {

    /*Here we get data in order to update the dashboard with new site*/
    let level = site.level
    let name = site.nom

    site.suggestions = {}
    return dispatch => {
        site.suggestions.metier_dependance = HelperService.getMenuForMetiers()
        site.suggestions.up_dependance = HelperService.getMenuForUp(site)
        site.suggestions.unite_dependance = HelperService.getMenuForUnite(site)
        site.suggestions.nom = HelperService.getMenuForSite(site)

        //Here we must have a dispatch that updates the search tree according to new site
        //Which means that we need the new architecture
        dispatch(actions.updateSiteName(site))
        return fetch(config.backend.adress+ 'dashboard/'+level+'/'+name+'?beginDate=2017-03-01&endDate=2017-04-01')
            .then(response => response.json())
            .then(json => {
                let newValues = HelperService.presentDataForNewSite(json)

                let leftValues = newValues.dataForLeftGauge;
                let middleValues = newValues.dataForMiddleGauge;
                let leftTileValues = newValues.dataForLeftTile;
                let middleLeftTileValues = newValues.dataForMiddleLeftTile;
                let middleRightTileValues = newValues.dataForMiddleRightTile;
                let rightTileValues = newValues.dataForRightTile;

                dispatch(actions.updateLeftGauge(leftValues))
                dispatch(actions.updateMiddleGauge(middleValues))
                dispatch(actions.updateLeftTile(leftTileValues))
                dispatch(actions.updateRightTile(rightTileValues))
                dispatch(actions.updateMiddleLeftTile(middleLeftTileValues))
                dispatch(actions.updateMiddleRightTile(middleRightTileValues))
                dispatch(actions.resetMoreInfosToDefault())

            })
    };
}


/*
API calls for Prestataire Vision
*/

export function loadPrestataireList(level,name){
    return dispatch => {
        dispatch(actions.loadPrestataireListBegin());
        return fetch(config.backend.adress+'new/graphs/prestataires/'+level+'/'+name)
            .then(response => response.json())
            .then(json => dispatch(actions.updatePrestataireList(json)));
    }
}

export function loadDechetsConsideringChosenPrestataire(level,name,idPrestataire){
    return dispatch => {
        dispatch(actions.loadDechetListBegin());
        return fetch(config.backend.adress+'new/graphs/prestataires/'+level+'/'+name+'/dechets/'+idPrestataire)
            .then(response => response.json())
            .then(json => {
                let inputArray = [];
                json.sites.quantity.forEach(row => {
                    inputArray.push(row.dechet);
                });
                console.log(inputArray);
                dispatch(actions.updateDechetTagsInputArray(inputArray));
            });
    }
}

export function loadPrestataireGraphValues(level,name,prestataire = null,chosenDechets = null){
    return dispatch => {
        dispatch(actions.loadPrestataireGraphValuesBegin());
        if(prestataire){
            return fetch(config.backend.adress+'new/graphs/prestataires/'+level+'/'+name+'/dechets/'+prestataire.id)
                .then(response => response.json())
                .then(json => {
                    console.log(json);
                    let valuesArray = [];
                    const columnNames = ["sites","global","region"];
                    /*
                     * We start by computing the two taux de valorisation
                     */
                    let tauxDeValorisationGlobal = 0;
                    let tauxDeValorisationListeVerte = 0;
                    let quantiteeTotale = 0;
                    let quantiteeTotaleListeVerte = 0;
                    let quantiteeTotaleRecyclee = 0;
                    let quantiteeTotaleRecycleeListeVerte = 0;

                    let values = [];
                    let volumes = [];
                    let valuesListeVerte = [];
                    let volumesListeVerte = [];
                    columnNames.forEach(name => {
                        if(json[name].quantity.length > 0){
                            json[name].quantity.forEach(dechet => {
                                quantiteeTotale += parseFloat(dechet.quantitee_traitee);
                                if(dechet.dechet.is_listeverte){
                                    quantiteeTotaleListeVerte += parseFloat(dechet.quantitee_traitee);
                                }
                            })
                        }
                        else{
                            quantiteeTotale = 0.;
                            quantiteeTotaleListeVerte = 0.;
                        }
                        if(json[name].recycled.length > 0){
                            json[name].recycled.forEach(dechet => {
                                quantiteeTotaleRecyclee += parseFloat(dechet.quantitee_traitee);
                                if(dechet.dechet.is_listeverte){
                                    quantiteeTotaleRecycleeListeVerte += parseFloat(dechet.quantitee_traitee);
                                }
                            })
                        }
                        else{
                            quantiteeTotaleRecyclee = 0.;
                            quantiteeTotaleRecycleeListeVerte = 0.;
                        }

                        if(quantiteeTotaleRecyclee > 0 && quantiteeTotale > 0){
                            tauxDeValorisationGlobal = 100*(quantiteeTotaleRecyclee/quantiteeTotale);
                        }
                        else {
                            tauxDeValorisationGlobal = 0;
                        }

                        if(quantiteeTotaleListeVerte > 0 && quantiteeTotaleRecycleeListeVerte > 0){
                            tauxDeValorisationListeVerte = 100*(quantiteeTotaleRecycleeListeVerte/quantiteeTotaleListeVerte);
                        }
                        else {
                            tauxDeValorisationListeVerte = 0;
                        }
                        values.push(tauxDeValorisationGlobal);
                        valuesListeVerte.push(tauxDeValorisationListeVerte);
                        volumes.push(quantiteeTotaleRecyclee);
                        volumesListeVerte.push(quantiteeTotaleRecycleeListeVerte);
                    })


                    /*
                     * We insert both these two values to create the first two
                     * columns of this histogram
                     */
                     const tauxDeValorisationGlobalColumn = {
                         title: "Taux de valorisation global",
                         keys: [prestataire.nom,"GLOBAL","REGIONAL"],
                         values: values,
                         volumes: volumes
                     };
                     valuesArray.push(tauxDeValorisationGlobalColumn);
                     const tauxDeValorisationListeVerteColumn = {
                         title: "Taux de valorisation Liste Verte",
                         keys: [prestataire.nom,"GLOBAL","REGIONAL"],
                         values: valuesListeVerte,
                         volumes: volumesListeVerte
                     };
                     valuesArray.push(tauxDeValorisationListeVerteColumn);
                    /*
                     * Now we see if some dechets have been chosen to be displayed
                     */
                    if(chosenDechets){
                        chosenDechets.forEach(chosenDechet => {
                            let chosenDechetColumn;
                            let values = [];
                            let volumes = [];
                            columnNames.forEach(name => {
                                let tauxDeValorisation = 0;
                                let quantiteeValorisee = 0;
                                if(json[name].quantity.length > 0){
                                    json[name].quantity.forEach(dechet => {
                                        if(chosenDechet.id === dechet.dechet.id){
                                            if(json[name].recycled.length > 0){
                                                json[name].recycled.forEach(dechetRecycle => {
                                                    if(dechetRecycle.dechet.id === dechet.dechet.id){
                                                        tauxDeValorisation = 100*(parseFloat(dechetRecycle.quantitee_traitee))/(parseFloat(dechet.quantitee_traitee));
                                                        quantiteeValorisee = parseFloat(dechetRecycle.quantitee_traitee);
                                                        values.push(tauxDeValorisation);
                                                        volumes.push(quantiteeValorisee);
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                            chosenDechetColumn = {
                                title: chosenDechet.libelle,
                                keys: [prestataire.nom,"GLOBAL","REGIONAL"],
                                values: values,
                                volumes: volumes
                            }
                            valuesArray.push(chosenDechetColumn);
                        })
                    }
                    else{
                        for (let i = 0; i < 3; i++) {
                            let dechetColumn;
                            let values = [];
                            let volumes = [];
                            let dechet = json.sites.quantity[i];
                            if(dechet && json[name] && json[name].quantity[i]){
                                columnNames.forEach(name => {
                                    let tauxDeValorisation = 0;
                                    let quantiteeValorisee = 0;
                                    if(json[name].recycled.length > 0){
                                        json[name].recycled.forEach(dechetRecycle => {
                                            if(dechetRecycle.dechet.id === dechet.dechet.id){
                                                tauxDeValorisation = 100*(parseFloat(dechetRecycle.quantitee_traitee))/(parseFloat(dechet.quantitee_traitee));
                                                quantiteeValorisee = parseFloat(dechetRecycle.quantitee_traitee);
                                                values.push(tauxDeValorisation);
                                                volumes.push(quantiteeValorisee);
                                            };
                                        });
                                    };
                                });
                            }
                            if(dechet){
                                dechetColumn = {
                                    title: dechet.dechet.libelle,
                                    keys: [prestataire.nom,"GLOBAL","REGIONAL"],
                                    values: values,
                                    volumes: volumes
                                };
                                valuesArray.push(dechetColumn);
                            }
                        }
                    }
                    dispatch(actions.updatePrestataireGraphValues(valuesArray));
                });

        }
        /*else{
            return fetch(config.backend.adress+'new/graphs/prestataires/'+level+'/'+name+'/dechets/')
                .then(response => response.json())
                .then(json => {
                });
        }*/
    }
}

/*
API calls for Dechet Vision
*/

export function loadDechetList(level,name){
    return dispatch => {
        dispatch(actions.loadDechetListBegin());
        return fetch(config.backend.adress+'new/graphs/dechets/'+level+'/'+name)
            .then(response => response.json())
            .then(json => {
                let newInputArray = [];
                json.dechets.forEach(row => {
                    let newRow = Object.assign({}, row.dechet, {nom: row.libelle});
                    newInputArray.push(newRow);
                })
                dispatch(actions.updateDechetList(newInputArray));
            });
    }
}

export function loadPrestatairesConsideringChosenDechet(level,name,idDechet){
    return dispatch => {
        dispatch(actions.loadPrestataireListBegin());
        return fetch(config.backend.adress+'new/graphs/dechets/'+level+'/'+name+'/prestataires/'+idDechet)
            .then(response => response.json())
            .then(json => dispatch(actions.updatePrestataireTagsInputArray(json)));
    }
}
