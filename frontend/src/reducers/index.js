import { combineReducers } from 'redux';
import {LeftGaugeInfos, MiddleGaugeInfos} from './showmoreinfos.js';

import React from "react";
import {
    CHANGE_SCALE,
    CHANGE_URL,

    CHANGE_GRAPH_INPUT,
    CHANGE_GRAPH_TYPE,
    SAVE_ARCHITECTURE,

    DISPLAY_LEFTGAUGE_INFOS,
    DISPLAY_MIDDLEGAUGE_INFOS,
    RESET_MOREINFOS_TO_DEFAULT,

    CHANGE_LEFTGAUGE_INPUT,
    CHANGE_MIDDLEGAUGE_INPUT,
    CHANGE_LEFTTILE_INPUT,
    CHANGE_RIGHTTILE_INPUT,
    CHANGE_MIDDLELEFTTILE_INPUT,
    CHANGE_MIDDLERIGHTTILE_INPUT,

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
    UPDATE_PRESTATAIREPANEL_INPUT,
    UPDATE_SELECTEDPRESTATAIRE,
    GraphTypes
} from '../actions'

function infosPanelOptions(
    state = {
    defaultBody: <p>Cliquez quelque part pour afficher d'avantage d'informations</p>,
    middleGaugeShown: false,
    leftGaugeShown: false
    },
    action){
    switch (action.type){

        case DISPLAY_LEFTGAUGE_INFOS:
            return Object.assign({}, state, {
                leftGaugeShown: !state.leftGaugeShown,
                middleGaugeShown: false,
                defaultBody: <LeftGaugeInfos />
                });

        case DISPLAY_MIDDLEGAUGE_INFOS:
            return Object.assign({}, state, {
                leftGaugeShown: false,
                middleGaugeShown: !state.middleGaugeShown,
                defaultBody: <MiddleGaugeInfos />
            });
        case RESET_MOREINFOS_TO_DEFAULT:
            return Object.assign({}, state, {
                defaultBody: <p>Cliquez quelque part pour afficher d'avantage d'informations</p>,
                middleGaugeShown: false,
                leftGaugeShown: false
            })
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

function pageOptions(state = {url: '/', scale: {level: 0, name: ''}, architecture: {}, lateralmenuIsVisible: true}, action){
    switch (action.type) {
        case CHANGE_URL:
            return Object.assign({}, state, {url: action.url});
        case CHANGE_SCALE:
            return Object.assign({}, state, {scale: action.scale});
        case SAVE_ARCHITECTURE:
            return Object.assign({}, state, {architecture: action.architecture});
        case TOGGLE_LATERALMENU:
            return Object.assign({}, state, {lateralmenuIsVisible: !state.lateralmenuIsVisible});
        default:
            return state;
    }
}

function updateGauge(
    state= {
        leftvalue: 0,
        leftvalueBefore: 0,
        leftvalueAnte: 0,
        leftvalueBeforeAnte: 0,
        middlevalue: 0,
        middlevalueBefore: 0,
        middlevalueAnte: 0,
        middlevalueBeforeAnte: 0,
        details: "",
    }, action
) {
    switch(action.type) {
        case 'CHANGE_LEFTGAUGE_INPUT':
            return Object.assign({}, state, {
                leftvalue: action.values.leftvalue,
                leftvalueBefore: action.values.leftvalueBefore,
                leftvalueAnte: action.values.leftvalueAnte,
                leftvalueBeforeAnte: action.values.leftvalueBeforeAnte,
                details: action.values.details
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

function updateTile(
    state= {
        ecarts_pesee: 0,
        incoherences_filieres_dd:0,
        incoherences_filieres_norm: 0,
        filieres_interdites_dd: 0,
        filieres_interdites_norm: 0,
        retards_dd: 0,
        retards_norm: 0,
    }, action
) {
    switch(action.type) {
        case 'CHANGE_LEFTTILE_INPUT':
            return Object.assign({}, state, {
                ecarts_pesee: action.values.ecarts_pesee
            });
        case 'CHANGE_RIGHTTILE_INPUT':
            return Object.assign({}, state, {
                incoherences_filieres_dd: action.values.incoherences_filieres_dd,
                incoherences_filieres_norm: action.values.incoherences_filieres_norm,
            });
        case 'CHANGE_MIDDLELEFTTILE_INPUT':
            return Object.assign({}, state, {
                filieres_interdites_norm: action.values.filieres_interdites_norm,
                filieres_interdites_dd: action.values.filieres_interdites_dd
            });
        case 'CHANGE_MIDDLERIGHTTILE_INPUT':
            return Object.assign({}, state, {
                retards_dd: action.values.retards_dd,
                retards_norm: action.values.retards_norm
            });
        default:
            return state;
    }
}

function updateSearchBar(
    state = {
        value: '',
        suggestions: [],
        isLoading: false,
        site: {
            nom: "National",
            level: 0,
            architecture: {
                nom: null,
                unite_dependance: null,
                up_dependance: null,
                metier_dependance: null
            },
            suggestions: {
                nom: [],
                unite_dependance: [],
                up_dependance: [],
                metier_dependance: []
            }
        }
    },
    action) {

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

function updatePrestataireSelectionPanel(state = {input: '', prestatairesList: [], isLoading: false, chosenPrestataire: '', suggestion: []}, action){
    switch(action.type){
        case LOAD_PRESTATAIRELIST_BEGIN:
            return Object.assign({}, state, {
                isLoading: true
            });
        case UPDATE_PRESTATAIRELIST:
            return Object.assign({}, state, {
                prestatairesList: action.json,
                isLoading: false
            });
        case CLEAR_PRESTATAIRES_SEARCHSUGGESTIONS:
            return Object.assign({}, state, {
                suggestion: []
            });
        case UPDATE_PRESTATAIREPANEL_INPUT:
            return Object.assign({}, state, {
                input: action.input
            });
        case UPDATE_SELECTEDPRESTATAIRE:
            return Object.assign({}, state, {
                chosenPrestataire: action.prestataire
            });
        default :
            return state;
    }
}

const akkaApp = combineReducers({
    pageOptions,
    graphOptions,
    infosPanelOptions,
    updateGauge,
    updateTile,
    updateSearchBar,
    updatePrestataireSelectionPanel
})

export default akkaApp
