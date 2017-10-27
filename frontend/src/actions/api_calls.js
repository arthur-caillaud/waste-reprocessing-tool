import fetch from 'isomorphic-fetch';
import config from '../config.json';
import HelperService from './service';
import * as actions from './index';
import * as moment from 'moment';

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
            let suggestions = HelperService.filterByValue(HelperService.getAllLevelNames(json), value)
            suggestions.push({
                nom: "$t$r$a$p$",
                level: 0,
                real_level: 0,
                architecture: {
                    metier_dependance: {name: "", real_level: 0},
                    up_dependance: {name: "", real_level: 0},
                    unite_dependance: {name: "", real_level: 0},
                    nom: {name: "", real_level: 0},
                }
            })
            dispatch(actions.maybeUpdateSuggestions(suggestions, value))
        })

  };
}


export function updateSite(site) {

    /*Here we get data in order to update the dashboard with new site*/
    let level = site.real_level
    let name = site.nom
    let date = window.store.getState().pageOptions.date
    let startDate = date.startDate
    let endDate= date.endDate
    let EndDate = endDate.format().toString().substring(0,10)
    let StartDate = startDate.format().toString().substring(0, 10)





    site.suggestions = {}
    return dispatch => {
        site.suggestions.metier_dependance = HelperService.getMenuForMetiers(site)
        site.suggestions.up_dependance = HelperService.getMenuForUp(site)
        site.suggestions.unite_dependance = HelperService.getMenuForUnite(site)
        site.suggestions.nom = HelperService.getMenuForSite(site)

        //Here we must have a dispatch that updates the search tree according to new site
        //Which means that we need the new architecture
        dispatch(actions.updateSiteName(site))
        return fetch(config.backend.adress+ 'dashboard/'+level+'/'+name+'?beginDate='+StartDate+'&endDate='+EndDate)
            .then(response => response.json())
            .then(json => {
                let newValues = HelperService.presentDataForNewSite(json)
                let leftValues = newValues.dataForLeftGauge;
                let middleValues = newValues.dataForMiddleGauge;
                let rightValues = newValues.dataForRightGauge;
                let leftTileValues = newValues.dataForLeftTile;
                let middleLeftTileValues = newValues.dataForMiddleLeftTile;
                let middleRightTileValues = newValues.dataForMiddleRightTile;
                let rightTileValues = newValues.dataForRightTile;


                return fetch(config.backend.adress + 'dashboard/details/'+level+'/'+name+'?beginDate='+StartDate+'&endDate='+EndDate)
                    .then(response => response.json())
                    .then(json => {
                        dispatch(actions.saveBordereauxForSite(json))
                        dispatch(actions.updateLeftTile(leftTileValues))
                        dispatch(actions.updateRightTile(rightTileValues))
                        dispatch(actions.updateMiddleLeftTile(middleLeftTileValues))
                        dispatch(actions.updateMiddleRightTile(middleRightTileValues))
                        dispatch(actions.resetMoreInfosToDefault())
                        dispatch(actions.updateLeftGauge(leftValues))
                        dispatch(actions.updateMiddleGauge(middleValues))
                        dispatch(actions.updateRightGauge(rightValues))
                    });
            })
    };
}


/*
API calls for Prestataire Vision
*/

export function loadPrestataireList(level,name){
    return dispatch => {
        dispatch(actions.loadPrestataireListBegin());
        return fetch(config.backend.adress+'new/graphs/prestataires/'+level+'/'+((level === 0)?"national":name))
            .then(response => response.json())
            .then(json => {
                dispatch(actions.updatePrestataireList(json))
            });
    }
}

export function loadDechetsConsideringChosenPrestataire(level,name,idPrestataire){
    return dispatch => {
        dispatch(actions.loadDechetListBegin());
        return fetch(config.backend.adress+'new/graphs/prestataires/'+level+'/'+((level === 0)?"national":name)+'/dechets/'+idPrestataire)
            .then(response => response.json())
            .then(json => {
                let inputArray = [];
                if(json.sites){
                    json.sites.quantity.forEach(row => {
                        inputArray.push(row.dechet);
                    });
                    dispatch(actions.updateDechetTagsInputArray(inputArray));
                }
            });
    }
}

export function loadPrestataireGraphValues(level,name,prestataire = null,chosenDechets = null){
    return dispatch => {
        dispatch(actions.loadPrestataireGraphValuesBegin());
        if(prestataire){
            return fetch(config.backend.adress+'new/graphs/prestataires/'+level+'/'+((level === 0)?"national":name)+'/dechets/'+prestataire.id)
                .then(response => response.json())
                .then(json => {
                    let valuesArray = [];
                    const columnNames = (json.region.quantity.length > 0) ? ["sites","global","region"] : ["sites","global"];
                    const keys = (json.region.quantity.length > 0) ? [prestataire.nom, "GLOBAL", "REGIONAL"] : [prestataire.nom, "GLOBAL"];
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
                        values.push(parseFloat(tauxDeValorisationGlobal.toPrecision(4)));
                        valuesListeVerte.push(parseFloat(tauxDeValorisationListeVerte.toPrecision(5)));
                        volumes.push(parseFloat(quantiteeTotaleRecyclee.toPrecision(4)));
                        volumesListeVerte.push(parseFloat(quantiteeTotaleRecycleeListeVerte.toPrecision(5)));
                    })


                    /*
                     * We insert both these two values to create the first two
                     * columns of this histogram
                     */
                     const tauxDeValorisationGlobalColumn = {
                         title: "Taux de valorisation global",
                         keys: keys,
                         values: values,
                         volumes: volumes
                     };
                     valuesArray.push(tauxDeValorisationGlobalColumn);
                     const tauxDeValorisationListeVerteColumn = {
                         title: "Taux de valorisation Liste Verte",
                         keys: keys,
                         values: valuesListeVerte,
                         volumes: volumesListeVerte
                     };
                     if(tauxDeValorisationListeVerteColumn.values[0] > 0){
                         valuesArray.push(tauxDeValorisationListeVerteColumn);
                     }
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
                                let quantiteeTotale = 0;
                                if(json[name].quantity.length > 0){
                                    json[name].quantity.forEach(dechet => {
                                        if(chosenDechet.id === dechet.dechet.id){
                                            if(json[name].recycled.length > 0){
                                                json[name].recycled.forEach(dechetRecycle => {
                                                    if(dechetRecycle.dechet.id === dechet.dechet.id){
                                                        quantiteeValorisee += parseFloat(dechetRecycle.quantitee_traitee);
                                                    }
                                                });
                                            }
                                            if(json[name].quantity.length > 0){
                                                json[name].quantity.forEach(dechetQuantity => {
                                                    if(dechetQuantity.dechet.id === dechet.dechet.id){
                                                        quantiteeTotale += parseFloat(dechetQuantity.quantitee_traitee);
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                                tauxDeValorisation = 100*(parseFloat(quantiteeValorisee))/(parseFloat(quantiteeTotale));
                                values.push(parseFloat(tauxDeValorisation.toPrecision(4)));
                                volumes.push(parseFloat(quantiteeValorisee.toPrecision(5)));
                            });
                            chosenDechetColumn = {
                                title: chosenDechet.codeinterne + ' - ' + chosenDechet.libelle.slice(0,20) + '...',
                                keys: keys,
                                values: values,
                                volumes: volumes
                            }
                            valuesArray.push(chosenDechetColumn);
                        })
                    }
                    else{
                        for (let i = 0; i < 3; i++) {
                            if(json.sites.quantity[i]){
                                let dechetColumn;
                                let values = [];
                                let volumes = [];
                                let dechet = json.sites.quantity[i];
                                dispatch(actions.addPrestataireGraphTag(dechet.dechet));
                                columnNames.forEach(name => {
                                    let tauxDeValorisation = 0;
                                    let quantiteeValorisee = 0;
                                    let quantiteeTotale = 0;
                                    if(json[name].recycled.length > 0){
                                        json[name].recycled.forEach(dechetRecycle => {
                                            if(dechetRecycle.dechet.id === dechet.dechet.id){
                                                quantiteeValorisee += parseFloat(dechetRecycle.quantitee_traitee);
                                            }
                                        });
                                    }
                                    if(json[name].quantity.length > 0){
                                        json[name].quantity.forEach(dechetQuantity => {
                                            if(dechetQuantity.dechet.id === dechet.dechet.id){
                                                quantiteeTotale += parseFloat(dechetQuantity.quantitee_traitee);
                                            }
                                        });
                                    }
                                    tauxDeValorisation = 100*(parseFloat(quantiteeValorisee))/(parseFloat(quantiteeTotale));
                                    values.push(parseFloat(tauxDeValorisation.toPrecision(4)));
                                    volumes.push(parseFloat(quantiteeValorisee.toPrecision(5)));
                                });
                                dechetColumn = {
                                    title: dechet.dechet.codeinterne + ' - ' + dechet.dechet.libelle.slice(0,20) + '...',
                                    keys: keys,
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
        else{
            return fetch(config.backend.adress+'new/graphs/prestataires/'+level+'/'+((level === 0)?"national":name))
                .then(response => response.json())
                .then(json => {
                    const biggestPrestataire = (json.prestataires && json.prestataires[0]) ? json.prestataires[0] : null ;
                    if(biggestPrestataire){
                        dispatch(actions.updateSelectedPrestataire(biggestPrestataire));
                        dispatch(loadPrestataireGraphValues(level, name, biggestPrestataire));
                    }
                    else{
                        dispatch(actions.updatePrestataireGraphValues([]));
                    }
                });
        }
    }
}


/*
API calls for Dechet Vision
*/

export function loadDechetList(level,name){
    return dispatch => {
        dispatch(actions.loadDechetListBegin());
        return fetch(config.backend.adress+'new/graphs/dechets/'+level+'/'+((level === 0)?"national":name))
            .then(response => response.json())
            .then(json => {
                let newInputArray = [];
                if(json.dechets){
                    json.dechets.forEach(row => {
                        let newRow = Object.assign({}, row, {nom: row.libelle});
                        newInputArray.push(newRow);
                    });
                    dispatch(actions.updateDechetList(newInputArray));
                }
            });
    }
}

export function loadPrestatairesConsideringChosenDechet(level,name,idDechet){
    return dispatch => {
        dispatch(actions.loadPrestataireListBegin());
        return fetch(config.backend.adress+'new/graphs/dechets/'+level+'/'+((level === 0)?"national":name)+'/prestataires/'+idDechet)
            .then(response => response.json())
            .then(json => {
                let inputArray = [];
                if(json.sites){
                    json.sites.quantity.forEach(row => {
                        inputArray.push(row.prestataire);
                    });
                    dispatch(actions.updateDechetTagsInputArray(inputArray));
                }
            });
    }
}


export function loadDechetGraphValues(level,name,dechet = null,chosenPrestataires = null){
    return dispatch => {
        dispatch(actions.loadDechetGraphValuesBegin());
        if(dechet){
            return fetch(config.backend.adress+'new/graphs/dechets/'+level+'/'+((level === 0)?"national":name)+'/prestataires/'+dechet.id)
                .then(response => response.json())
                .then(json => {
                    /*
                     * We start by computing the two taux de valorisation global and regional (if exists)
                     */
                    let tauxDeValorisationNation = 0;
                    let tauxDeValorisationRegion = 0;
                    let quantiteeTotaleNation = 0;
                    let quantiteeTotaleNationRecyclee = 0;
                    let quantiteeTotaleRegion = 0;
                    let quantiteeTotaleRegionRecyclee = 0;

                    let keys = [];
                    let values = [];
                    let volumes = [];
                    if(json.global.quantity.length > 0){
                        json.global.quantity.forEach(prestataire => {
                            quantiteeTotaleNation += parseFloat(prestataire.quantitee_traitee);
                        });
                    }
                    if(json.global.recycled.length > 0){
                        json.global.recycled.forEach(prestataire => {
                            quantiteeTotaleNationRecyclee += parseFloat(prestataire.quantitee_traitee);
                        });
                    }
                    if(quantiteeTotaleNation > 0){
                        tauxDeValorisationNation = 100*(parseFloat(quantiteeTotaleNationRecyclee))/(parseFloat(quantiteeTotaleNation));
                        values.push(tauxDeValorisationNation.toPrecision(4));
                        volumes.push(quantiteeTotaleNationRecyclee.toPrecision(5));
                        keys.push("NATIONAL");
                    }
                    if(json.global.quantity.length > 0){
                        json.global.quantity.forEach(prestataire => {
                            quantiteeTotaleRegion += parseFloat(prestataire.quantitee_traitee);
                        });
                    }
                    if(json.global.recycled.length > 0){
                        json.global.recycled.forEach(prestataire => {
                            quantiteeTotaleRegionRecyclee += parseFloat(prestataire.quantitee_traitee);
                        });
                    }
                    if(quantiteeTotaleRegion > 0){
                        tauxDeValorisationRegion = 100*(parseFloat(quantiteeTotaleRegionRecyclee))/(parseFloat(quantiteeTotaleRegion));
                        values.push(tauxDeValorisationRegion.toPrecision(4));
                        volumes.push(quantiteeTotaleNationRecyclee.toPrecision(5));
                        keys.push("REGIONAL");
                    }
                    /*
                     * Now we see if some prestataires have been chosen to be displayed
                     */
                    if(chosenPrestataires){
                        chosenPrestataires.forEach(chosenPrestataire => {
                            let tauxDeValorisation = 0;
                            let quantiteeTotale = 0;
                            let quantiteeRecyclee = 0;
                            if(json.sites.quantity.length > 0){
                                json.sites.quantity.forEach(prestataire => {
                                    if(chosenPrestataire.id === prestataire.prestataire.id){
                                        quantiteeTotale += parseFloat(prestataire.quantitee_traitee);
                                    }
                                });
                                json.sites.recycled.forEach(prestataire => {
                                    if(chosenPrestataire.id === prestataire.prestataire.id){
                                        quantiteeRecyclee += parseFloat(prestataire.quantitee_traitee);
                                    }
                                })
                                if(quantiteeTotale > 0){
                                    tauxDeValorisation = 100*(parseFloat(quantiteeRecyclee))/(parseFloat(quantiteeTotale))
                                }
                                values.push(tauxDeValorisation.toPrecision(4));
                                volumes.push(quantiteeRecyclee.toPrecision(5));
                                keys.push(chosenPrestataire.nom);
                            }
                        });
                        const mainColumn = {
                            title: '',
                            keys: keys,
                            values: values,
                            volumes: volumes
                        }
                        dispatch(actions.updateDechetGraphValues([mainColumn]));
                    }
                    else{
                        for (let i = 0; i < 3; i++) {
                            if(json.sites.quantity[i]){
                                let tauxDeValorisation = 0;
                                let quantiteeTotale = 0;
                                let quantiteeRecyclee = 0;
                                let chosenPrestataire = json.sites.quantity[i];
                                dispatch(actions.addDechetGraphTag(chosenPrestataire.prestataire));
                                if(json.sites.quantity.length > 0){
                                    json.sites.quantity.forEach(prestataire => {
                                        if(chosenPrestataire.prestataire.id === prestataire.prestataire.id){
                                            quantiteeTotale += parseFloat(prestataire.quantitee_traitee);
                                            console.log(prestataire.prestataire.nom);
                                            console.log("Quantitee totale ", quantiteeTotale);
                                        }
                                    });
                                    json.sites.recycled.forEach(prestataire => {
                                        if(chosenPrestataire.prestataire.id === prestataire.prestataire.id){
                                            quantiteeRecyclee += parseFloat(prestataire.quantitee_traitee);
                                        }
                                    });
                                    if(quantiteeTotale > 0){
                                        console.log(chosenPrestataire.prestataire.nom);
                                        console.log("Quantitee recyclée ", quantiteeRecyclee);
                                        tauxDeValorisation = 100*(parseFloat(quantiteeRecyclee))/(parseFloat(quantiteeTotale))
                                    }
                                    values.push(tauxDeValorisation.toPrecision(4));
                                    console.log(values);
                                    volumes.push(quantiteeRecyclee.toPrecision(5));
                                    console.log(volumes);
                                    keys.push(chosenPrestataire.prestataire.nom);
                                }
                            }
                        };
                        const mainColumn = {
                            title: '',
                            keys: keys,
                            values: values,
                            volumes: volumes
                        }
                        dispatch(actions.updateDechetGraphValues([mainColumn]));
                    }
                });
            }
            else{
                return fetch(config.backend.adress+'new/graphs/dechets/'+level+'/'+((level === 0)?"national":name))
                    .then(response => response.json())
                    .then(json => {
                        const biggestDechet = (json.dechets && json.dechets[0]) ? json.dechets[0] : null ;
                        if(biggestDechet){
                            dispatch(actions.updateSelectedDechet(biggestDechet));
                            dispatch(loadDechetGraphValues(level, name, biggestDechet));
                        }
                        else{
                            dispatch(actions.updateDechetGraphValues([]));
                        }
                    });
            }
    };
}
