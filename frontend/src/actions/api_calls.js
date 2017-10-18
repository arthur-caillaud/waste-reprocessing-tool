import fetch from 'isomorphic-fetch';
import config from '../config.json';
import HelperService from './service';
import * as actions from './index';

export function loadSuggestions(value) {
  return dispatch => {
    dispatch(actions.loadSuggestionsBegin())
    return fetch(config.backend.adress+'dashboard/architecture')
        .then(response => response.json())
        .then(json => dispatch(actions.maybeUpdateSuggestions(HelperService.filterByValue(HelperService.getAllLevelNames(json), value), value)))

  };
}

export function updateSite(site) {
    return dispatch => {
        dispatch(actions.updateSiteName(site))
        return fetch(config.backend.adress+ 'dashboard/4/'+site.id+'?tolerance=0&year=2017&month=3')
            .then(response => console.log(response))
    };
}

export function loadPrestataireList(){
    return dispatch => {
        dispatch(actions.loadPrestataireListBegin());
        return fetch(config.backend.adress+'prestataire')
            .then(response => response.json())
            .then(json => dispatch(actions.updatePrestataireList(json)));
    }
}
