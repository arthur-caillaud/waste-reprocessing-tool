/*
 * ACTION TYPES
 */
export const CHANGE_SCALE = 'CHANGE_SCALE';
export const CHANGE_URL = 'CHANGE_URL';
export const CHANGE_GRAPH_INPUT = 'CHANGE_GRAPH_INPUT';
export const CHANGE_GRAPH_TYPE = 'CHANGE_GRAPH_TYPE';
export const DISPLAY_TILE_INFOS = 'DISPLAY_TILE_INFOS';
export const DISPLAY_TILE_NOTIFINFOS = 'DISPLAY_TILE_NOTIFINFOS';
export const DISPLAY_GAUGE_INFOS = 'DISPLAY_GAUGE_INFOS';
export const ADD_GRAPH_TAG = 'ADD_GRAPH_TAG';
export const REMOVE_GRAPH_TAG = 'REMOVE_GRAPH_TAG';
export const TOGGLE_LATERALMENU = 'TOGGLE_LATERALMENU';
export const CHANGE_LEFTGAUGE_INPUT = 'CHANGE_LEFTGAUGE_INPUT';

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
    // values is an object containing value and valueBefore
    return {
        type: CHANGE_LEFTGAUGE_INPUT,
        values
    }
}
