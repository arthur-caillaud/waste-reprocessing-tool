/*
 * ACTION TYPES
 */
export const CHANGE_SCALE = 'CHANGE_SCALE';
export const CHANGE_PAGE = 'CHANGE_PAGE';
export const CHANGE_PRESTATAIRE = 'CHANGE_PRESTATAIRE';
export const TOGGLE_TILE_INFOS = 'TOGGLE_TILE_INFOS'

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
export function changeScale(newScale){
    return {
        type: CHANGE_SCALE,
        newScale
    }
}

export function changePage(newUrl){
    return {
        type: CHANGE_PAGE,
        newUrl
    }
}

export function changePrestataire(newPrestataire){
    return {
        type: CHANGE_PRESTATAIRE,
        newPrestataire
    }
}
