import { combineReducers } from 'redux'
import { searchInArray } from './service';
import {
    CHANGE_SCALE,
    CHANGE_URL,
    REQUEST_SITE_CHANGE,
    CHANGE_GRAPH_INPUT,
    CHANGE_GRAPH_TYPE,
    DISPLAY_TILE_INFOS,
    DISPLAY_TILE_NOTIFINFOS,
    DISPLAY_LEFTGAUGE_INFOS,

    CHANGE_LEFTGAUGE_INPUT,
    CHANGE_MIDDLEGAUGE_INPUT,

    ADD_GRAPH_TAG,
    REMOVE_GRAPH_TAG,
    TOGGLE_LATERALMENU,

    UPDATE_INPUT_VALUE,
    CLEAR_SUGGESTIONS,
    LOAD_SUGGESTIONS_BEGIN,
    MAYBE_UPDATE_SUGGESTIONS,
    UPDATE_SITE,

    LOAD_PRESTATAIRELIST_BEGIN,
    UPDATE_PRESTATAIRELIST,
    CLEAR_PRESTATAIRES_SEARCHSUGGESTIONS,
    UPDATE_SELECTEDPRESTATAIRE,
    UPDATE_PRESTATAIREPANEL_SEARCHBAR_INPUT,

    LOAD_DECHETLIST_BEGIN,
    UPDATE_DECHETLIST,
    CLEAR_DECHETS_SEARCHSUGGESTIONS,
    UPDATE_SELECTEDDECHET,
    UPDATE_DECHETPANEL_SEARCHBAR_INPUT,

    LOAD_PRESTATAIREGRAPH_TAGS_BEGIN,
    ADD_DECHET_GRAPH_TAG,
    REMOVE_DECHET_GRAPH_TAG,
    UPDATE_DECHETTAGS_INPUTARRAY,

    LOAD_DECHETGRAPH_TAGS_BEGIN,
    ADD_PRESTATAIRE_GRAPH_TAG,
    REMOVE_PRESTATAIRE_GRAPH_TAG,
    UPDATE_PRESTATAIRETAGS_INPUTARRAY,

    GraphTypes
} from '../actions'

function infosPanelOptions(state = {title: "eoufghz", defaultBody: "Afficher d'avantage d'informations"}, action){
    switch (action.type){
        case DISPLAY_TILE_INFOS:
            return Object.assign({}, state, action.tile);
        case DISPLAY_LEFTGAUGE_INFOS:
            return Object.assign({}, state, action.defaultBody);
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

function updateGauge(state= {
        leftvalue: 0,
        leftvalueBefore: 0,
        leftvalueAnte: 0,
        leftvalueBeforeAnte: 0,
        middlevalue: 0,
        middlevalueBefore: 0,
        middlevalueAnte: 0,
        middlevalueBeforeAnte: 0
    }, action) {
    switch(action.type) {
        case 'CHANGE_LEFTGAUGE_INPUT':
            return Object.assign({}, state, {
                leftvalue: action.values.leftvalue,
                leftvalueBefore: action.values.leftvalueBefore,
                leftvalueAnte: action.values.leftvalueAnte,
                leftvalueBeforeAnte: action.values.leftvalueBeforeAnte
            });
        case 'CHANGE_MIDDLEGAUGE_INPUT':
            return Object.assign({}, state, {
                middlevalue: action.values.middlevalue,
                middlevalueBefore: action.values.middlevalueBefore,
                middlevalueAnte: action.values.middlevalueAnte,
                middlevalueBeforeAnte: action.values.middlevalueBeforeAnte
            });
        default:
            return state;
    }
}

function updateSearchBar(state = {value: '', suggestions: [], isLoading: false, site:'National'}, action) {

/*
The data cycle is the following :
When the user types something in the main searchbar, the first call is UPDATE_INPUT_VALUE
AutoSuggest then detects a change in input value and start LOAD_SUGGESTIONS_BEGIN
isLoading is set to True, and the API call starts. (See explanation in HelperService in the action folder)
When they are loaded, isLoading is set to False and the suggestions are displayed.
On Suggestion Selection, we change the Input Value, CLEAR_SUGGESTIONS (to close the suggestion list)
And UPDATE_SITE (see HelperService again)
*/

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
        case UPDATE_SITE:
            return Object.assign({}, state, {
                site: action.site
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

function updatePrestataireSelectionPanel(state = {input: '', inputArray: [], isLoading: false, selectedInput: '', suggestion: []}, action){
    switch(action.type){
        case LOAD_PRESTATAIRELIST_BEGIN:
            return Object.assign({}, state, {
                isLoading: true
            });
        case UPDATE_PRESTATAIRELIST:
            return Object.assign({}, state, {
                inputArray: action.json,
                isLoading: false
            });
        case CLEAR_PRESTATAIRES_SEARCHSUGGESTIONS:
            return Object.assign({}, state, {
                suggestion: []
            });
        case UPDATE_PRESTATAIREPANEL_SEARCHBAR_INPUT:
        const input = action.input;
        const arrayInWhichToSearch = state.inputArray;
        const foundElementsArray = searchInArray(arrayInWhichToSearch, input);
        return Object.assign({}, state, {
            input: action.input,
            suggestion: foundElementsArray,
        });
        case UPDATE_SELECTEDPRESTATAIRE:
            return Object.assign({}, state, {
                selectedInput: action.prestataire
            });
        default :
            return state;
    }
}

function updateDechetSelectionPanel(state = {input: '', inputArray: [], isLoading: false, selectedInput: '', suggestion: []}, action){
    switch(action.type){
        case LOAD_DECHETLIST_BEGIN:
            return Object.assign({}, state, {
                isLoading: true
            });
        case UPDATE_DECHETLIST:
            return Object.assign({}, state, {
                inputArray: action.json,
                isLoading: false
            });
        case CLEAR_DECHETS_SEARCHSUGGESTIONS:
            return Object.assign({}, state, {
                suggestion: []
            });
        case UPDATE_DECHETPANEL_SEARCHBAR_INPUT:
            const input = action.input;
            const arrayInWhichToSearch = state.inputArray;
            const foundElementsArray = searchInArray(arrayInWhichToSearch, input);
            return Object.assign({}, state, {
                input: action.input,
                suggestion: foundElementsArray,
            });
        case UPDATE_SELECTEDDECHET:
            return Object.assign({}, state, {
                selectedInput: action.dechet
            });
        default :
            return state;
    }
}

function updatePrestataireGraphTagsPanel(state = {tagsArray: [], inputArray:[], isLoading: false}, action){
    switch (action.type) {
        case LOAD_PRESTATAIREGRAPH_TAGS_BEGIN:
            return Object({}, state, {
                isLoading: true
            })
        case ADD_PRESTATAIRE_GRAPH_TAG:
            return Object.assign({}, state, {
                tagsArray: [...state.tagsArray, action.dechetTag]
            });
        case REMOVE_PRESTATAIRE_GRAPH_TAG:
            let newTagsArray = []
            state.tagsArray.forEach(tag => {
                if(tag !== action.dechetTag){
                    newTagsArray.push(tag);
                }
            });
            return Object.assign({}, state, {
                tagsArray: newTagsArray
            });
        case UPDATE_DECHETTAGS_INPUTARRAY:
            return Object.assign({}, state, {
                inputArray: action.inputArray
            })
        default:
            return state;
    }
}

function updateDechetGraphTagsPanel(state = {tagsArray: [], inputArray:[], isLoading: false}, action){
    switch (action.type) {
        case LOAD_DECHETGRAPH_TAGS_BEGIN:
            return Object({}, state, {
                isLoading: true
            })
        case ADD_DECHET_GRAPH_TAG:
            return Object.assign({}, state, {
                tagsArray: [...state.tagsArray, action.prestataireTag]
            });
        case REMOVE_DECHET_GRAPH_TAG:
            let newTagsArray = []
            state.tagsArray.forEach(tag => {
                if(tag !== action.prestataireTag){
                    newTagsArray.push(tag);
                }
            });
            return Object.assign({}, state, {
                tagsArray: newTagsArray
            })
        case UPDATE_PRESTATAIRETAGS_INPUTARRAY:
            const newInputArray = action.inputArray.map(prestataire => {
                return Object.assign({},prestataire,{codeinterne: prestataire.id});
            });
            return Object.assign({}, state, {
                inputArray: newInputArray
            })
        default:
            return state;
    }
}

const akkaApp = combineReducers({
    pageOptions,
    graphOptions,
    infosPanelOptions,
    updateGauge,
    updateSearchBar,
    updatePrestataireSelectionPanel,
    updateDechetSelectionPanel,
    updatePrestataireGraphTagsPanel,
    updateDechetGraphTagsPanel
})

export default akkaApp
