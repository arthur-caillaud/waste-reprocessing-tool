import "es6-promise/auto";
import axios from 'axios';
import config from '../config.json';
import HelperService from './service';
import * as actions from './index';
import * as moment from 'moment';

export function getArchitecture() {

    /*
    This function get the architecture of EDF sites and store it in the Redux Store
    */
    return dispatch => {
        return axios.get(config.backend.adress+'dashboard/architecture')
            .then(json => {
                dispatch(actions.saveArchitecture(json.data))
            })
    }
}
/*
Main Search Bar API calls
*/
export function loadSuggestions(value) {

    /*
    This function is activated on key down on the main search bar. It browses through the architecture
    and retrieve any thing that contains the value in the main search bar.
    */
  return dispatch => {
    dispatch(actions.loadSuggestionsBegin())
    return axios.get(config.backend.adress+'dashboard/architecture')
        .then(json => {
            let suggestions = HelperService.filterByValue(HelperService.getAllLevelNames(json.data), value)
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
            });
            dispatch(actions.maybeUpdateSuggestions(suggestions, value))
        });
  };
}

function substractYear(date){
    /*
    This just substracts one year to the given date
    */
    let split = date.split('-');
    split[0] -= 1
    return split.join('-')
}
export function updateSite(site) {
    /*
    This is the app's main function. It updates everything when a new site is selected in the selection tree
    or the searchbar. The "if" sections are made to optimize performance based on the page we are on, it's three times the same requests,
    but in a different order.
    */
    /*Here we get data in order to update the dashboard with new site*/
    let level = site.real_level;
    let name = site.nom;

    let date = window.store.getState().pageOptions.date;
    if (typeof date.startDate === 'string') {
        date= {
            startDate: moment(date.startDate),
            endDate: moment(date.endDate)
        }
    }
    let startDate = date.startDate;
    let endDate= date.endDate;
    let EndDate = endDate.format().toString().substring(0,10);
    let StartDate = startDate.format().toString().substring(0, 10);

    site.suggestions = {}
    return dispatch => {
        /*
        This updates the search tree based on the new given site
        */
        site.suggestions.metier_dependance = HelperService.getMenuForMetiers(site)
        site.suggestions.up_dependance = HelperService.getMenuForUp(site)
        site.suggestions.unite_dependance = HelperService.getMenuForUnite(site)
        site.suggestions.nom = HelperService.getMenuForSite(site)




        //Here we must have a dispatch that updates the search tree according to new site
        //Which means that we need the new architecture
        dispatch(actions.updateSiteName(site));
        dispatch(actions.updateDashboardBegin());
        if (window.location.href.split('/')[3] === "") {
            /*
                Here we are on the dashboard page, so the first request gets the informations for the dashboard,
                for this year and for last year. Then we call presentDataForNewSite, a function that redistributes the values requested
                in the different components
            */

            return axios.get(config.backend.adress+ 'dashboard/'+level+'/'+name+'?beginDate='+StartDate+'&endDate='+EndDate)
                .then(json => {
                    const actualJson = json.data;
                    return axios.get(config.backend.adress + 'dashboard/'+level+'/'+name+'?beginDate='+substractYear(StartDate)+'&endDate='+substractYear(EndDate))
                        .then(json => {

                            const lastYearJson = json.data
                            let newValues = HelperService.presentDataForNewSite(actualJson, lastYearJson)
                            let leftValues = newValues.dataForLeftGauge;
                            let middleValues = newValues.dataForMiddleGauge;
                            let rightValues = newValues.dataForRightGauge;
                            let leftTileValues = newValues.dataForLeftTile;
                            let middleLeftTileValues = newValues.dataForMiddleLeftTile;
                            let middleRightTileValues = newValues.dataForMiddleRightTile;
                            let rightTileValues = newValues.dataForRightTile;

                            dispatch(actions.updateLeftTile(leftTileValues))
                            dispatch(actions.updateRightTile(rightTileValues))
                            dispatch(actions.updateMiddleLeftTile(middleLeftTileValues))
                            dispatch(actions.updateMiddleRightTile(middleRightTileValues))
                            dispatch(actions.resetMoreInfosToDefault())
                            dispatch(actions.updateLeftGauge(leftValues))
                            dispatch(actions.updateMiddleGauge(middleValues))
                            dispatch(actions.updateRightGauge(rightValues))

                            return axios.get(config.backend.adress + 'dashboard/details/'+level+'/'+name+'?beginDate='+StartDate+'&endDate='+EndDate)

                                .then(json => {
                                    /*
                                    Finally we call for informations for the other pages, they will be loaded after the display.
                                    */
                                    dispatch(actions.saveBordereauxForSite(json.data))
                                    dispatch(loadPrestataireList(site.real_level,site.nom));
                                    dispatch(loadDechetList(site.real_level,site.nom));
                                });
                        });
                })
        }
        else if (window.location.href.split('/')[3] === "prestataire") {
            /*
            Gotta add here dispatch for prestataire page
            */

            dispatch(loadPrestataireList(site.real_level,site.nom));

            return axios.get(config.backend.adress+ 'dashboard/'+level+'/'+name+'?beginDate='+StartDate+'&endDate='+EndDate)
                .then(json => {
                    const actualJson = json.data;
                    return axios.get(config.backend.adress + 'dashboard/'+level+'/'+name+'?beginDate='+substractYear(StartDate)+'&endDate='+substractYear(EndDate))
                        .then(json => {

                            const lastYearJson = json.data
                            let newValues = HelperService.presentDataForNewSite(actualJson, lastYearJson)
                            let leftValues = newValues.dataForLeftGauge;
                            let middleValues = newValues.dataForMiddleGauge;
                            let rightValues = newValues.dataForRightGauge;
                            let leftTileValues = newValues.dataForLeftTile;
                            let middleLeftTileValues = newValues.dataForMiddleLeftTile;
                            let middleRightTileValues = newValues.dataForMiddleRightTile;
                            let rightTileValues = newValues.dataForRightTile;

                            dispatch(actions.updateLeftTile(leftTileValues))
                            dispatch(actions.updateRightTile(rightTileValues))
                            dispatch(actions.updateMiddleLeftTile(middleLeftTileValues))
                            dispatch(actions.updateMiddleRightTile(middleRightTileValues))
                            dispatch(actions.resetMoreInfosToDefault())
                            dispatch(actions.updateLeftGauge(leftValues))
                            dispatch(actions.updateMiddleGauge(middleValues))
                            dispatch(actions.updateRightGauge(rightValues))

                            return axios.get(config.backend.adress + 'dashboard/details/'+level+'/'+name+'?beginDate='+StartDate+'&endDate='+EndDate)
                                .then(json => {
                                    dispatch(actions.saveBordereauxForSite(json.data))
                                    dispatch(loadDechetList(site.real_level,site.nom));
                                })
                        });
                })

        } else {

            dispatch(loadDechetList(site.real_level,site.nom));

            /*
            Gotta add here dispatchs for dechet vision
            */
            return axios.get(config.backend.adress+ 'dashboard/'+level+'/'+name+'?beginDate='+StartDate+'&endDate='+EndDate)
                .then(json => {
                    const actualJson = json.data;
                    return axios.get(config.backend.adress + 'dashboard/'+level+'/'+name+'?beginDate='+substractYear(StartDate)+'&endDate='+substractYear(EndDate))
                        .then(json => {

                            const lastYearJson = json.data
                            let newValues = HelperService.presentDataForNewSite(actualJson, lastYearJson)
                            let leftValues = newValues.dataForLeftGauge;
                            let middleValues = newValues.dataForMiddleGauge;
                            let rightValues = newValues.dataForRightGauge;
                            let leftTileValues = newValues.dataForLeftTile;
                            let middleLeftTileValues = newValues.dataForMiddleLeftTile;
                            let middleRightTileValues = newValues.dataForMiddleRightTile;
                            let rightTileValues = newValues.dataForRightTile;

                            dispatch(actions.updateLeftTile(leftTileValues))
                            dispatch(actions.updateRightTile(rightTileValues))
                            dispatch(actions.updateMiddleLeftTile(middleLeftTileValues))
                            dispatch(actions.updateMiddleRightTile(middleRightTileValues))
                            dispatch(actions.resetMoreInfosToDefault())
                            dispatch(actions.updateLeftGauge(leftValues))
                            dispatch(actions.updateMiddleGauge(middleValues))
                            dispatch(actions.updateRightGauge(rightValues))

                            return axios.get(config.backend.adress + 'dashboard/details/'+level+'/'+name+'?beginDate='+StartDate+'&endDate='+EndDate)
                                .then(json => {
                                    dispatch(actions.saveBordereauxForSite(json.data))
                                    dispatch(loadPrestataireList(site.real_level,site.nom));
                                })


                        });
                })
        }

    };
}



export function updateDate(date) {
    return dispatch => dispatch(actions.updateDate())
}
/*
API calls for Prestataire Vision
*/

export function loadPrestataireList(level,name){
    return dispatch => {
        dispatch(actions.loadPrestataireListBegin());
        dispatch(actions.cleanDechetsChosenTagsArray());
        return axios.get(config.backend.adress+'new/graphs/prestataires/'+level+'/'+((level === 0)?"national":name))
            .then(json => {
                dispatch(actions.updateBiggestPrestataire(json.data.prestataires[0]));
                dispatch(actions.updatePrestataireList(json.data));
                dispatch(loadPrestataireGraphValues(level,name, json.data.prestataires[0]));
            });
    }
}

export function loadDechetsConsideringChosenPrestataire(level,name,idPrestataire){
    return dispatch => {
        dispatch(actions.loadDechetListBegin());
        return axios.get(config.backend.adress+'new/graphs/prestataires/'+level+'/'+((level === 0)?"national":name)+'/dechets/'+idPrestataire)
            .then(json => {
                let inputArray = [];
                if(json.data.sites){
                    json.data.sites.quantity.forEach(row => {
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
            dispatch(actions.updateSelectedPrestataire(prestataire));

            let date = window.store.getState().pageOptions.date;
            if (typeof date.startDate === 'string') {
                date= {
                    startDate: moment(date.startDate),
                    endDate: moment(date.endDate)
                }
            }
            const startDate = date.startDate.format().toString().substring(0, 10);
            const endDate = date.endDate.format().toString().substring(0,10);

            return axios.get(config.backend.adress+'new/graphs/prestataires/'+level+'/'+((level === 0)?"national":name)+'/dechets/'+prestataire.id+'?beginDate='+startDate+'&endDate='+endDate)
                .then(json => {
                    let valuesArray = [];
                    const columnNames = (json.data.region.quantity.length > 0) ? ["sites","global","region"] : ["sites","global"];
                    const keys = (json.data.region.quantity.length > 0) ? [prestataire.nom, "GLOBAL", "REGIONAL"] : [prestataire.nom, "GLOBAL"];
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
                        if(json.data[name].quantity.length > 0){
                            json.data[name].quantity.forEach(dechet => {
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
                        if(json.data[name].recycled.length > 0){
                            json.data[name].recycled.forEach(dechet => {
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
                        volumes.push(parseFloat(quantiteeTotale.toPrecision(4)));
                        volumesListeVerte.push(parseFloat(quantiteeTotaleListeVerte.toPrecision(5)));
                    });


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
                                if(json.data[name].quantity.length > 0){
                                    json.data[name].quantity.forEach(dechet => {
                                        if(chosenDechet.id === dechet.dechet.id){
                                            if(json.data[name].recycled.length > 0){
                                                json.data[name].recycled.forEach(dechetRecycle => {
                                                    if(dechetRecycle.dechet.id === dechet.dechet.id){
                                                        quantiteeValorisee += parseFloat(dechetRecycle.quantitee_traitee);
                                                    }
                                                });
                                            }
                                            if(json.data[name].quantity.length > 0){
                                                json.data[name].quantity.forEach(dechetQuantity => {
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
                                volumes.push(parseFloat(quantiteeTotale.toPrecision(5)));
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
                            if(json.data.sites.quantity[i]){
                                let dechetColumn;
                                let values = [];
                                let volumes = [];
                                let dechet = json.data.sites.quantity[i];
                                dispatch(actions.addPrestataireGraphTag(dechet.dechet));
                                columnNames.forEach(name => {
                                    let tauxDeValorisation = 0;
                                    let quantiteeValorisee = 0;
                                    let quantiteeTotale = 0;
                                    if(json.data[name].recycled.length > 0){
                                        json.data[name].recycled.forEach(dechetRecycle => {
                                            if(dechetRecycle.dechet.id === dechet.dechet.id){
                                                quantiteeValorisee += parseFloat(dechetRecycle.quantitee_traitee);
                                            }
                                        });
                                    }
                                    if(json.data[name].quantity.length > 0){
                                        json.data[name].quantity.forEach(dechetQuantity => {
                                            if(dechetQuantity.dechet.id === dechet.dechet.id){
                                                quantiteeTotale += parseFloat(dechetQuantity.quantitee_traitee);
                                            }
                                        });
                                    }
                                    tauxDeValorisation = 100*(parseFloat(quantiteeValorisee))/(parseFloat(quantiteeTotale));
                                    values.push(parseFloat(tauxDeValorisation.toPrecision(4)));
                                    volumes.push(parseFloat(quantiteeTotale.toPrecision(5)));
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
            let date = window.store.getState().pageOptions.date;
            if (typeof date.startDate === 'string') {
                date= {
                    startDate: moment(date.startDate),
                    endDate: moment(date.endDate)
                }
            }
            const startDate = date.startDate.format().toString().substring(0, 10);
            const endDate = date.endDate.format().toString().substring(0,10);

            return axios.get(config.backend.adress+'new/graphs/prestataires/'+level+'/'+((level === 0)?"national":name)+'?beginDate='+startDate+'&endDate='+endDate)
                .then(json => {
                    const biggestPrestataire = (json.data.prestataires && json.data.prestataires[0]) ? json.data.prestataires[0] : null ;
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
        dispatch(actions.cleanPrestatairesChosenTagsArray());
        return axios.get(config.backend.adress+'new/graphs/dechets/'+level+'/'+((level === 0)?"national":name))
            .then(json => {
                let newInputArray = [];
                if(json.data.dechets){
                    json.data.dechets.forEach(row => {
                        let newRow = Object.assign({}, row, {nom: row.libelle});
                        newInputArray.push(newRow);
                    });
                    dispatch(actions.updateBiggestDechet(json.data.dechets[0]));
                    dispatch(actions.updateDechetList(newInputArray));
                    dispatch(loadDechetGraphValues(level,name,json.data.dechets[0]));
                }
            });
    }
}

export function loadPrestatairesConsideringChosenDechet(level,name,idDechet){
    return dispatch => {
        dispatch(actions.loadPrestataireListBegin());
        return axios.get(config.backend.adress+'new/graphs/dechets/'+level+'/'+((level === 0)?"national":name)+'/prestataires/'+idDechet)
            .then(json => {
                let inputArray = [];
                if(json.data.sites){
                    json.data.sites.quantity.forEach(row => {
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
            dispatch(actions.updateSelectedDechet(dechet));

            let date = window.store.getState().pageOptions.date;
            if (typeof date.startDate === 'string') {
                date= {
                    startDate: moment(date.startDate),
                    endDate: moment(date.endDate)
                }
            }
            const startDate = date.startDate.format().toString().substring(0, 10);
            const endDate = date.endDate.format().toString().substring(0,10);

            return axios.get(config.backend.adress+'new/graphs/dechets/'+level+'/'+((level === 0)?"national":name)+'/prestataires/'+dechet.id+'?beginDate='+startDate+'&endDate='+endDate)
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
                    if(json.data.global.quantity.length > 0){
                        json.data.global.quantity.forEach(prestataire => {
                            quantiteeTotaleNation += parseFloat(prestataire.quantitee_traitee);
                        });
                    }
                    if(json.data.global.recycled.length > 0){
                        json.data.global.recycled.forEach(prestataire => {
                            quantiteeTotaleNationRecyclee += parseFloat(prestataire.quantitee_traitee);
                        });
                    }
                    if(quantiteeTotaleNation > 0){
                        tauxDeValorisationNation = 100*(parseFloat(quantiteeTotaleNationRecyclee))/(parseFloat(quantiteeTotaleNation));
                        values.push(tauxDeValorisationNation.toPrecision(4));
                        volumes.push(quantiteeTotaleNation.toPrecision(5));
                        keys.push("NATIONAL");
                    }
                    if(json.data.region.quantity.length > 0){
                        json.data.region.quantity.forEach(prestataire => {
                            quantiteeTotaleRegion += parseFloat(prestataire.quantitee_traitee);
                        });
                    }
                    if(json.data.region.recycled.length > 0){
                        json.data.region.recycled.forEach(prestataire => {
                            quantiteeTotaleRegionRecyclee += parseFloat(prestataire.quantitee_traitee);
                        });
                    }
                    if(quantiteeTotaleRegion > 0){
                        tauxDeValorisationRegion = 100*(parseFloat(quantiteeTotaleRegionRecyclee))/(parseFloat(quantiteeTotaleRegion));
                        values.push(tauxDeValorisationRegion.toPrecision(4));
                        volumes.push(quantiteeTotaleRegion.toPrecision(5));
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
                            if(json.data.sites.quantity.length > 0){
                                json.data.sites.quantity.forEach(prestataire => {
                                    if(chosenPrestataire.id === prestataire.prestataire.id){
                                        quantiteeTotale += parseFloat(prestataire.quantitee_traitee);
                                    }
                                });
                                json.data.sites.recycled.forEach(prestataire => {
                                    if(chosenPrestataire.id === prestataire.prestataire.id){
                                        quantiteeRecyclee += parseFloat(prestataire.quantitee_traitee);
                                    }
                                })
                                if(quantiteeTotale > 0){
                                    tauxDeValorisation = 100*(parseFloat(quantiteeRecyclee))/(parseFloat(quantiteeTotale))
                                }
                                values.push(tauxDeValorisation.toPrecision(4));
                                volumes.push(quantiteeTotale.toPrecision(5));
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
                            if(json.data.sites.quantity[i]){
                                let tauxDeValorisation = 0;
                                let quantiteeTotale = 0;
                                let quantiteeRecyclee = 0;
                                let chosenPrestataire = json.data.sites.quantity[i];
                                dispatch(actions.addDechetGraphTag(chosenPrestataire.prestataire));
                                if(json.data.sites.quantity.length > 0){
                                    json.data.sites.quantity.forEach(prestataire => {
                                        if(chosenPrestataire.prestataire.id === prestataire.prestataire.id){
                                            quantiteeTotale += parseFloat(prestataire.quantitee_traitee);

                                        }
                                    });
                                    json.data.sites.recycled.forEach(prestataire => {
                                        if(chosenPrestataire.prestataire.id === prestataire.prestataire.id){
                                            quantiteeRecyclee += parseFloat(prestataire.quantitee_traitee);
                                        }
                                    });
                                    if(quantiteeTotale > 0){
                                        tauxDeValorisation = 100*(parseFloat(quantiteeRecyclee))/(parseFloat(quantiteeTotale))
                                    }
                                    values.push(tauxDeValorisation.toPrecision(4));
                                    volumes.push(quantiteeTotale.toPrecision(5));
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

                let date = window.store.getState().pageOptions.date;
                if (typeof date.startDate === 'string') {
                    date= {
                        startDate: moment(date.startDate),
                        endDate: moment(date.endDate)
                    }
                }
                const startDate = date.startDate.format().toString().substring(0, 10);
                const endDate = date.endDate.format().toString().substring(0,10);

                return axios.get(config.backend.adress+'new/graphs/dechets/'+level+'/'+((level === 0)?"national":name)+'?beginDate='+startDate+'&endDate='+endDate)
                    .then(json => {
                        const biggestDechet = (json.data.dechets && json.data.dechets[0]) ? json.data.dechets[0] : null ;
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
