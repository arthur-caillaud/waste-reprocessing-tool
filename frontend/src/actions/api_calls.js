import fetch from 'isomorphic-fetch';
import config from '../config.json';
import HelperService from './service';
import * as actions from './index';


/*
Main Search Bar API calls
*/
export function loadSuggestions(value) {
  return dispatch => {
    dispatch(actions.loadSuggestionsBegin())
    return fetch(config.backend.adress+'dashboard/architecture')
        .then(response => response.json())
        .then(json => dispatch(actions.maybeUpdateSuggestions(HelperService.filterByValue(HelperService.getAllLevelNames(json), value), value)))

  };
}

export function updateSite(site) {

    /*Here we get data in order to update the dashboard with new site*/
    let level = site.level
    let name = site.nom
    return dispatch => {
        dispatch(actions.updateSiteName(site))
        return fetch(config.backend.adress+ 'dashboard/'+level+'/'+name+'?tolerance=0&year=2017&month=3')
            .then(response => response.json())
            .then(json => {
                console.log(json)
                let newValues = HelperService.presentDataForNewSite(json[0])

                let leftValues = newValues.dataForLeftGauge;
                let middleValues = newValues.dataForMiddleGauge;


                dispatch(actions.updateLeftGauge(leftValues))
                dispatch(actions.updateMiddleGauge(middleValues))

            })
    };
}


/*
API calls for Prestataire Vision
*/
export function loadPrestataireList(){
    return dispatch => {
        dispatch(actions.loadPrestataireListBegin());
        return fetch(config.backend.adress+'prestataire')
            .then(response => response.json())
            .then(json => dispatch(actions.updatePrestataireList(json)));
    }
}
