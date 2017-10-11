import { combineReducers } from 'redux'
import {
    CHANGE_SCALE,
    CHANGE_PAGE,
    CHANGE_PRESTATAIRE,
    TOGGLE_TILE_INFOS,
    ADD_TAG_FOR_GRAPH,
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
        case CHANGE_PRESTATAIRE:
            return Object.assign({}, state, {
                prestataire: action.prestataire
            });
        case TOGGLE_TILE_INFOS:
            return Object.assign({}, state, {
                tileToBeDescribed: action.tile
            });
        case ADD_TAG_FOR_GRAPH:
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
