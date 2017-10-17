import fetch from 'isomorphic-fetch';

/*
 * ACTION TYPES
 */
export const CHANGE_SCALE = 'CHANGE_SCALE';
export const CHANGE_URL = 'CHANGE_URL';
export const REQUEST_SITE_CHANGE = 'REQUEST_SITE_CHANGE'; //This is the action triggered when the site is changed in the navbar.

export const CHANGE_GRAPH_INPUT = 'CHANGE_GRAPH_INPUT';
export const CHANGE_GRAPH_TYPE = 'CHANGE_GRAPH_TYPE';
export const DISPLAY_TILE_INFOS = 'DISPLAY_TILE_INFOS';
export const DISPLAY_TILE_NOTIFINFOS = 'DISPLAY_TILE_NOTIFINFOS';
export const DISPLAY_GAUGE_INFOS = 'DISPLAY_GAUGE_INFOS';
export const ADD_GRAPH_TAG = 'ADD_GRAPH_TAG';
export const REMOVE_GRAPH_TAG = 'REMOVE_GRAPH_TAG';

export const TOGGLE_LATERALMENU = 'TOGGLE_LATERALMENU';

export const CHANGE_LEFTGAUGE_INPUT = 'CHANGE_LEFTGAUGE_INPUT';

export const UPDATE_INPUT_VALUE = 'UPDATE_INPUT_VALUE';
export const CLEAR_SUGGESTIONS = 'CLEAR_SUGGESTIONS';
export const LOAD_SUGGESTIONS_BEGIN = 'LOAD_SUGGESTIONS_BEGIN';
export const MAYBE_UPDATE_SUGGESTIONS = 'MAYBE_UPDATE_SUGGESTIONS';
export const UPDATE_SITE = 'UPDATE_SITE';
/*
 * other constants
 */
 export const GraphTypes = {
     WEB_GRAPH: 'WEB_GRAPH',
     HISTOGRAM_GRAPH: 'HISTOGRAM_GRAPH',
     CURVE_GRAPH: 'CURVE_GRAPH',
 }
/*
 * action creators
 */
export function changeScale(scale){
    return {
        type: CHANGE_SCALE,
        scale
    }
}




export function requestSiteChange(newSite) {
    return {
        type: REQUEST_SITE_CHANGE,
        newSite
    }
}





export function changePage(url){
    return {
        type: CHANGE_URL,
        url
    }
}

export function changeGraphInput(prestataire){
    return {
        type: CHANGE_GRAPH_INPUT,
        prestataire
    }
}

export function changeGraphType(graphType){
    return {
        type: CHANGE_GRAPH_TYPE,
        graphType
    }
}

export function displayTileInfos(tile){
    return {
        type: DISPLAY_TILE_INFOS,
        tile
    }
}

export function displayTileNotifInfos(tileNotifs){
    return {
        type: DISPLAY_TILE_NOTIFINFOS,
        tileNotifs
    }
}

export function displayGaugeInfos(gauge){
    return {
        type: DISPLAY_GAUGE_INFOS,
        gauge
    }
}

export function addGraphTag(tag){
    return {
        type: ADD_GRAPH_TAG,
        tag
    }
}

export function removeGraphTag(tag){
    return {
        type: REMOVE_GRAPH_TAG,
        tag
    }
}

export function toggleLateralMenu(isVisible){
    return {
        type: TOGGLE_LATERALMENU,
        isVisible
    }
}

export function updateLeftGauge(values) {
    // values is an object containing value and valueBefore, valueAnte and valueBeforeAnte
    return {
        type: CHANGE_LEFTGAUGE_INPUT,
        values
    }
}


//SearchBar

export function loadSuggestions(value) {
  return dispatch => {
      console.log("smthg happened")
    dispatch(loadSuggestionsBegin())
    return fetch('http://localhost:4000/api/sites/?nom='+value)
        .then(response => response.json())
        .then(json => dispatch(maybeUpdateSuggestions(json, value)))

  };
}

function getLevelFromSite(site) {

}

export function updateSite(site) {
    return dispatch => {
        dispatch(updateSiteName(site))
        return fetch('http://localhost:4000/api/dashboard/4/'+site.id+'?tolerance=0&year=2017&month=3')
            .then(response => console.log(response))
            
    };
}

export function updateSiteName(site) {
    return {
        type: UPDATE_SITE,
        site
    }
}

export function updateInputValue(value) {
  return {
    type: UPDATE_INPUT_VALUE,
    value
  };
}

export function clearSuggestions() {
  return {
    type: CLEAR_SUGGESTIONS
  };
}

export function loadSuggestionsBegin() {
  return {
    type: LOAD_SUGGESTIONS_BEGIN
  };
}

export function maybeUpdateSuggestions(suggestions, value) {
  return {
    type: MAYBE_UPDATE_SUGGESTIONS,
    suggestions,
    value
  };
}
