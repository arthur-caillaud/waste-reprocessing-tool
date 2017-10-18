import fetch from 'isomorphic-fetch';
import config from '../config.json';

import * as actions from './index'

export function loadSuggestions(value) {
  return dispatch => {
      console.log("smthg happened")
    dispatch(actions.loadSuggestionsBegin())
    return fetch(config.backend.adress+'sites/?nom='+value)
        .then(response => response.json())
        .then(json => dispatch(actions.maybeUpdateSuggestions(json, value)))

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
