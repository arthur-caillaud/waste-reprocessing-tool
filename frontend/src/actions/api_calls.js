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
                json.quantity.forEach(row => {
                    inputArray.push(row.dechet);
                });
                console.log(inputArray);
                dispatch(actions.updateDechetTagsInputArray(inputArray));
            });
    }
}

export function loadPrestataireGraphValues(level,name,idPrestataire,chosenDechets){
    return dispatch => {
        dispatch(actions.loadPrestataireGraphValuesBegin());
        return fetch(config.backend.adress+'new/graphs/prestataires/'+level+'/'+name+'/dechets/'+idPrestataire)
            .then(response => response.json())
            .then(json => {

            });
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
                json.dechets.forEach(dechet => {
                    const newDechet = Object.assign({}, dechet, {nom: dechet.libelle});
                    newInputArray.push(newDechet);
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
            .then(json => {
                let inputArray = [];
                json.quantity.forEach(row => {
                    inputArray.push(row.prestataire);
                });
                console.log(inputArray);
                dispatch(actions.updatePrestataireTagsInputArray(inputArray));
            });
    }
}
