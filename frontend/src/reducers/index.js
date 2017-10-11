import { combineReducers } from 'redux'
import {
    CHANGE_SCALE,
    CHANGE_PAGE,
    CHANGE_GRAPH_INPUT,
    CHANGE_GRAPH_TYPE,
    DISPLAY_TILE_INFOS,
    DISPLAY_TILE_NOTIFINFOS,
    DISPLAY_GAUGE_INFOS,
    ADD_GRAPH_TAG,
    REMOVE_GRAPH_TAG,
    GraphTypes
} from './actions'

const initialState = {
    pageUrl: '/',
    navScale: {
        hierarchyLevel: 0,
        value: null
    }
}

function akkaApp(state = initialState, action){
    switch (action.type){
        case CHANGE_PAGE:
            return Object.assign({}, state, {
                pageUrl: action.url
            });
        case CHANGE_SCALE:
            return Object.assign({}, state, {
                navScale: action.scale
            });
        case CHANGE_GRAPH_INPUT:
            return Object.assign({}, state, {
                prestataire: action.prestataire
            });
        case DISPLAY_TILE_INFOS:
            return Object.assign({}, state, {
                tileToBeDescribed: action.tile
            });
        case ADD_GRAPH_TAG:
            return Object.assign({}, state, {
                graphTags: [
                    ...state.graphTags, action.tag
                ]
            });
        default:
            return state;
    }
}

export default akkaApp
