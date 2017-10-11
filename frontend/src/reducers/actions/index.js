/*
 * ACTION TYPES
 */
export const CHANGE_SCALE = 'CHANGE_SCALE';
export const CHANGE_PAGE = 'CHANGE_PAGE';
export const CHANGE_GRAPH_INPUT = 'CHANGE_GRAPH_INPUT';
export const CHANGE_GRAPH_TYPE = 'CHANGE_GRAPH_TYPE';
export const DISPLAY_TILE_INFOS = 'DISPLAY_TILE_INFOS';
export const DISPLAY_TILE_NOTIFINFOS = 'DISPLAY_TILE_NOTIFINFOS';
export const DISPLAY_GAUGE_INFOS = 'DISPLAY_GAUGE_INFOS';
export const ADD_GRAPH_TAG = 'ADD_GRAPH_TAG';
export const REMOVE_GRAPH_TAG = 'REMOVE_GRAPH_TAG';

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
        type: CHANGE_PAGE,
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

export function displayTileNotifInfos(tile){
    return {
        type: DISPLAY_TILE_NOTIFINFOS,
        tile
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
