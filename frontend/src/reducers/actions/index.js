/*
 * ACTION TYPES
 */
export const CHANGE_SCALE = 'CHANGE_SCALE';
export const CHANGE_PAGE = 'CHANGE_PAGE';
export const CHANGE_PRESTATAIRE = 'CHANGE_PRESTATAIRE';
export const TOGGLE_TILE_INFOS = 'TOGGLE_TILE_INFOS';
export const TOGGLE_TILE_NOTIFINFOS = 'TOGGLE_TILE_NOTIFINFOS';
export const TOGGLE_GAUGE_INFOS = 'TOGGLE_GAUGE_INFOS';
export const ADD_TAG_FOR_GRAPH = 'ADD_TAG_FOR_GRAPH';

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

export function changePrestataire(prestataire){
    return {
        type: CHANGE_PRESTATAIRE,
        prestataire
    }
}

export function toggleTileInfos(tile){
    return {
        type: TOGGLE_TILE_INFOS,
        tile
    }
}

export function addTagForGraph(tag){
    return {
        type: ADD_TAG_FOR_GRAPH,
        tag
    }
}
