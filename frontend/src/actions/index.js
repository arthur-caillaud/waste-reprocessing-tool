/*
 * ACTION TYPES
 */
export const CHANGE_SCALE = 'CHANGE_SCALE';
export const CHANGE_URL = 'CHANGE_URL';
export const SAVE_ARCHITECTURE = 'SAVE_ARCHITECTURE';
export const SAVE_BORDEREAUX_FOR_SITE = 'SAVE_BORDEREAUX_FOR_SITE';

export const CHANGE_GRAPH_INPUT = 'CHANGE_GRAPH_INPUT';
export const CHANGE_GRAPH_TYPE = 'CHANGE_GRAPH_TYPE';

export const RESET_MOREINFOS_TO_DEFAULT = 'RESET_MOREINFOS_TO_DEFAULT'
export const DISPLAY_LEFTGAUGE_INFOS = 'DISPLAY_LEFTGAUGE_INFOS';
export const DISPLAY_MIDDLEGAUGE_INFOS = 'DISPLAY_MIDDLEGAUGE_INFOS';
export const DISPLAY_LEFTTILE_INFOS = 'DISPLAY_LEFTTILE_INFOS';
export const DISPLAY_MIDDLELEFTTILE_INFOS = 'DISPLAY_MIDDLELEFTTILE_INFOS';
export const DISPLAY_MIDDLELEFTTILE_ALERTS = 'DISPLAY_MIDDLELEFTTILE_ALERTS';


export const ADD_GRAPH_TAG = 'ADD_GRAPH_TAG';
export const REMOVE_GRAPH_TAG = 'REMOVE_GRAPH_TAG';

export const TOGGLE_LATERALMENU = 'TOGGLE_LATERALMENU';

export const CHANGE_LEFTGAUGE_INPUT = 'CHANGE_LEFTGAUGE_INPUT';
export const CHANGE_MIDDLEGAUGE_INPUT = 'CHANGE_MIDDLEGAUGE_INPUT';
export const CHANGE_LEFTTILE_INPUT = 'CHANGE_LEFTTILE_INPUT';
export const CHANGE_RIGHTTILE_INPUT = 'CHANGE_RIGHTTILE_INPUT';
export const CHANGE_MIDDLELEFTTILE_INPUT = 'CHANGE_MIDDLELEFTTILE_INPUT';
export const CHANGE_MIDDLERIGHTTILE_INPUT = 'CHANGE_MIDDLERIGHTTILE_INPUT';




export const UPDATE_INPUT_VALUE = 'UPDATE_INPUT_VALUE';
export const CLEAR_SUGGESTIONS = 'CLEAR_SUGGESTIONS';
export const LOAD_SUGGESTIONS_BEGIN = 'LOAD_SUGGESTIONS_BEGIN';
export const MAYBE_UPDATE_SUGGESTIONS = 'MAYBE_UPDATE_SUGGESTIONS';
export const UPDATE_SITE = 'UPDATE_SITE';

export const LOAD_PRESTATAIRELIST_BEGIN = 'LOAD_PRESTATAIRELIST_BEGIN';
export const UPDATE_PRESTATAIRELIST = 'UPDATE_PRESTATAIRELIST';
export const CLEAR_PRESTATAIRES_SEARCHSUGGESTIONS = 'CLEAR_PRESTATAIRES_SEARCHSUGGESTIONS';
export const UPDATE_SELECTEDPRESTATAIRE = 'UPDATE_SELECTEDPRESTATAIRE';
export const UPDATE_PRESTATAIREPANEL_SEARCHBAR_INPUT = 'UPDATE_PRESTATAIREPANEL_SEARCHBAR_INPUT';

export const LOAD_DECHETLIST_BEGIN = 'LOAD_DECHETLIST_BEGIN';
export const UPDATE_DECHETLIST = 'UPDATE_DECHETLIST';
export const CLEAR_DECHETS_SEARCHSUGGESTIONS = 'CLEAR_DECHETS_SEARCHSUGGESTIONS';
export const UPDATE_SELECTEDDECHET = 'UPDATE_SELECTEDDECHET';
export const UPDATE_DECHETPANEL_SEARCHBAR_INPUT = 'UPDATE_DECHETPANEL_SEARCHBAR_INPUT';

export const LOAD_PRESTATAIREGRAPH_TAGS_BEGIN = "LOAD_PRESTATAIREGRAPH_TAGS";
export const ADD_DECHET_GRAPH_TAG = "ADD_DECHET_GRAPH_TAG";
export const REMOVE_DECHET_GRAPH_TAG = "REMOVE_DECHET_GRAPH_TAG";
export const UPDATE_DECHETTAGS_INPUTARRAY = "UPDATE_DECHETTAGS_INPUTARRAY";

export const LOAD_DECHETGRAPH_TAGS_BEGIN = "LOAD_DECHETGRAPH_TAGS";
export const ADD_PRESTATAIRE_GRAPH_TAG = "ADD_DECHET_GRAPH_TAG";
export const REMOVE_PRESTATAIRE_GRAPH_TAG = "REMOVE_DECHET_GRAPH_TAG";
export const UPDATE_PRESTATAIRETAGS_INPUTARRAY = "UPDATE_PRESTATAIRETAGS_INPUTARRAY";

export const LOAD_PRESTATAIREGRAPH_VALUES_BEGIN = "LOAD_PRESTATAIREGRAPH_VALUES_BEGIN";
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

export function saveArchitecture(architecture) {
    return {
        type: SAVE_ARCHITECTURE,
        architecture
    }
}
export function saveBordereauxForSite(bordereaux) {
    return {
        type: SAVE_BORDEREAUX_FOR_SITE,
        bordereaux
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
export function updateMiddleGauge(values) {
    return {
        type: CHANGE_MIDDLEGAUGE_INPUT,
        values
    }
}
export function updateLeftTile(values) {
    return {
        type: CHANGE_LEFTTILE_INPUT,
        values
    }
}
export function updateMiddleLeftTile(values) {
    return {
        type: CHANGE_MIDDLELEFTTILE_INPUT,
        values
    }
}
export function updateMiddleRightTile(values) {
    return {
        type: CHANGE_MIDDLERIGHTTILE_INPUT,
        values
    }
}
export function updateRightTile(values) {
    return {
        type: CHANGE_RIGHTTILE_INPUT,
        values
    }
}





export function displayLeftGaugeInfos(){
    return {
        type: DISPLAY_LEFTGAUGE_INFOS
    }
}
export function displayMiddleGaugeInfos(){
    return {
        type: DISPLAY_MIDDLEGAUGE_INFOS
    }
}
export function displayLeftTileInfos(){
    return {
        type: DISPLAY_LEFTTILE_INFOS
    }
}
export function displayMiddleLeftTileInfos(){
    return {
        type: DISPLAY_MIDDLELEFTTILE_INFOS
    }
}
export function displayMiddleLeftTileAlerts(){
    return {
        type: DISPLAY_MIDDLELEFTTILE_ALERTS
    }
}


export function resetMoreInfosToDefault() {
    return {
        type: RESET_MOREINFOS_TO_DEFAULT
    }
}



/*
 * SearchBar (present on every frontpage)
 */


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

/*
 * Prestataire Input Panel (present in '/prestataire' page)
 */

export function loadPrestataireListBegin(){
    return {
        type: LOAD_PRESTATAIRELIST_BEGIN
    }
}

export function updatePrestataireList(json){
    return {
        type: UPDATE_PRESTATAIRELIST,
        json
    }
}

export function clearPrestatairesSearchSuggestions(){
    return {
        type: CLEAR_PRESTATAIRES_SEARCHSUGGESTIONS
    }
}

export function updatePrestatairePanelSearchbarInput(input){
    return {
        type: UPDATE_PRESTATAIREPANEL_SEARCHBAR_INPUT,
        input
    }
}

export function updateSelectedPrestataire(prestataire){
    return {
        type: UPDATE_SELECTEDPRESTATAIRE,
        prestataire
    }
}

/*
 * Dechet Input Panel (present in '/dechet' page)
 */

export function loadDechetListBegin(){
    return {
        type: LOAD_DECHETLIST_BEGIN
    }
}

export function updateDechetList(json){
    return {
        type: UPDATE_DECHETLIST,
        json
    }
}

export function clearDechetsSearchSuggestions(){
    return {
        type: CLEAR_DECHETS_SEARCHSUGGESTIONS
    }
}

export function updateDechetPanelSearchbarInput(input){
    return {
        type: UPDATE_DECHETPANEL_SEARCHBAR_INPUT,
        input
    }
}

export function updateSelectedDechet(dechet){
    return {
        type: UPDATE_SELECTEDDECHET,
        dechet
    }
}

/*
 * Prestataire vision : add graph tag Panel
 */

export function loadPrestataireGraphTagsBegin() {
    return {
        type: LOAD_PRESTATAIREGRAPH_TAGS_BEGIN
    }
}

export function addPrestataireGraphTag(dechetTag){
    return {
        type: ADD_PRESTATAIRE_GRAPH_TAG,
        dechetTag
    }
}

export function removePrestataireGraphTag(dechetTag){
    return {
        type: REMOVE_PRESTATAIRE_GRAPH_TAG,
        dechetTag
    }
}

export function updateDechetTagsInputArray(inputArray){
    return {
        type: UPDATE_DECHETTAGS_INPUTARRAY,
        inputArray
    }
}

/*
 * Dechet vision : add graph tag Panel
 */

export function loadDechetGraphTagsBegin(){
    return {
        type: LOAD_DECHETGRAPH_TAGS_BEGIN
    }
}

export function addDechetGraphTag(prestataireTag){
    return {
        type: ADD_DECHET_GRAPH_TAG,
        prestataireTag
    }
}

export function removeDechetGraphTag(prestataireTag){
    return {
        type: REMOVE_DECHET_GRAPH_TAG,
        prestataireTag
    }
}

export function updatePrestataireTagsInputArray(inputArray){
    return {
        type: UPDATE_PRESTATAIRETAGS_INPUTARRAY,
        inputArray
    }
}

export function loadPrestataireGraphValuesBegin(){
    return {
        type: LOAD_PRESTATAIREGRAPH_VALUES_BEGIN
    }
}
