import { combineReducers } from 'redux'
import {
    CHANGE_SCALE,
    CHANGE_URL,
    CHANGE_GRAPH_INPUT,
    CHANGE_GRAPH_TYPE,
    DISPLAY_TILE_INFOS,
    DISPLAY_TILE_NOTIFINFOS,
    DISPLAY_GAUGE_INFOS,
    ADD_GRAPH_TAG,
    REMOVE_GRAPH_TAG,
    GraphTypes
} from './actions'

function displayInfos(state = {title: "", defaultBody: "Afficher d'avantage d'informations"}, action){
    switch (action.type){
        case DISPLAY_TILE_INFOS:
            return Object.assign({}, state, action.tile);
        case DISPLAY_GAUGE_INFOS:
            return Object.assign({}, state, action.gauge);
        case DISPLAY_TILE_NOTIFINFOS:
            return Object.assign({}, state, action.tilenotifs);
        default:
            return state;
    }
}

function graphOptions(state = {type: GraphTypes.HISTOGRAM_GRAPH, input: '', tags:[]}, action){
    switch (action.type) {
        case CHANGE_GRAPH_INPUT:
            return Object.assign({}, state, {input: action.prestataire});
        case CHANGE_GRAPH_TYPE:
            return Object.assign({}, state, {type: action.graphType});
        case ADD_GRAPH_TAG:
            return Object.assign({}, state, {tags: [...state.tags, action.tag]});
        default:
            return state;
    }
}

function pageOptions(state = {url: '/', scale: {level: 0, name: ''}}, action){
    switch (action.type) {
        case CHANGE_URL:
            return Object.assign({}, state, {url: action.url});
        case CHANGE_SCALE:
            return Object.assign({}, state, {scale: action.scale});
        default:
            return state;
    }
}

const akkaApp = combineReducers({
    pageOptions,
    graphOptions,
    displayInfos
})

export default akkaApp
