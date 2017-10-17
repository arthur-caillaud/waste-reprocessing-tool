import { combineReducers } from 'redux'
import {
    CHANGE_SCALE,
    CHANGE_URL,
    REQUEST_SITE_CHANGE,
    CHANGE_GRAPH_INPUT,
    CHANGE_GRAPH_TYPE,
    DISPLAY_TILE_INFOS,
    DISPLAY_TILE_NOTIFINFOS,
    DISPLAY_GAUGE_INFOS,
    CHANGE_LEFTGAUGE_INPUT,
    ADD_GRAPH_TAG,
    REMOVE_GRAPH_TAG,
    TOGGLE_LATERALMENU,
    UPDATE_INPUT_VALUE,
    CLEAR_SUGGESTIONS,
    LOAD_SUGGESTIONS_BEGIN,
    MAYBE_UPDATE_SUGGESTIONS,
    GraphTypes
} from '../actions'

function infosPanelOptions(state = {title: "eoufghz", defaultBody: "Afficher d'avantage d'informations"}, action){
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
        case REMOVE_GRAPH_TAG:
            var newTagsArray = [];
            state.tags.forEach(tag => {
                if(action.tag !== tag){
                    newTagsArray.push(tag)
                }
            });
            return Object.assign({}, state, {tags: newTagsArray});
        default:
            return state;
    }
}

function pageOptions(state = {url: '/', scale: {level: 0, name: ''}, lateralmenuIsVisible: true}, action){
    switch (action.type) {
        case CHANGE_URL:
            return Object.assign({}, state, {url: action.url});
        case CHANGE_SCALE:
            return Object.assign({}, state, {scale: action.scale});
        case TOGGLE_LATERALMENU:
            return Object.assign({}, state, {lateralmenuIsVisible: !state.lateralmenuIsVisible});
        default:
            return state;
    }
}

function updateGauge(state= {value: 0, valueBefore: 0, valueAnte:0, valueBeforeAnte:0}, action) {
    switch(action.type) {
        case 'CHANGE_LEFTGAUGE_INPUT':
            return Object.assign({}, state, {
                value: action.values.value,
                valueBefore: action.values.valueBefore,
                valueAnte: action.values.valueAnte,
                valueBeforeAnte: action.values.valueBeforeAnte
            });
        default:
            return state;
    }
}

function updateSearchBar(state = {value: '', suggestions: [], isLoading: false}, action) {
    switch (action.type) {
        case UPDATE_INPUT_VALUE:
            return Object.assign({}, state, {
                value: action.value
            });

        case CLEAR_SUGGESTIONS:
            return Object.assign({}, state, {
                suggestions: []
            });

        case LOAD_SUGGESTIONS_BEGIN:
            return Object.assign({}, state, {
                isLoading: true
        });

        case MAYBE_UPDATE_SUGGESTIONS:
        // Ignore suggestions if input value changed
            if (action.value !== state.value) {
                return Object.assign({}, state, {
                    isLoading: false
                });
            }

            return Object.assign({}, state, {
                suggestions: action.suggestions,
                isLoading: false
            });

        default:
            return state;
        }
}

const akkaApp = combineReducers({
    pageOptions,
    graphOptions,
    infosPanelOptions,
    updateGauge,
    updateSearchBar
})

export default akkaApp
