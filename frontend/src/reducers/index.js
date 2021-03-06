import React from "react"
import { combineReducers } from 'redux';
import { searchInArray } from './service';
import * as moment from 'moment';
import {
    SAVE_ARCHITECTURE,
    SAVE_BORDEREAUX_FOR_SITE,
    UPDATE_DATE,
    UPDATE_DASHBOARD_BEGIN,


    DISPLAY_LEFTTILE_INFOS,
    DISPLAY_MIDDLELEFTTILE_INFOS,
    DISPLAY_MIDDLELEFTTILE_ALERTS,
    DISPLAY_MIDDLERIGHTTILE_INFOS,
    DISPLAY_MIDDLERIGHTTILE_ALERTS,
    DISPLAY_RIGHTTILE_INFOS,
    DISPLAY_RIGHTTILE_ALERTS,
    RESET_MOREINFOS_TO_DEFAULT,

    CHANGE_LEFTGAUGE_INPUT,
    CHANGE_MIDDLEGAUGE_INPUT,
    CHANGE_RIGHTGAUGE_INPUT,
    CHANGE_LEFTTILE_INPUT,
    CHANGE_RIGHTTILE_INPUT,
    CHANGE_MIDDLELEFTTILE_INPUT,
    CHANGE_MIDDLERIGHTTILE_INPUT,

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
    UPDATE_BIGGEST_PRESTATAIRE,

    LOAD_DECHETLIST_BEGIN,
    UPDATE_DECHETLIST,
    CLEAR_DECHETS_SEARCHSUGGESTIONS,
    UPDATE_SELECTEDDECHET,
    UPDATE_DECHETPANEL_SEARCHBAR_INPUT,
    UPDATE_BIGGEST_DECHET,

    LOAD_PRESTATAIREGRAPH_TAGS_BEGIN,
    ADD_DECHET_GRAPH_TAG,
    REMOVE_DECHET_GRAPH_TAG,
    UPDATE_DECHETTAGS_INPUTARRAY,
    CLEAN_DECHETS_CHOSENTAGS_ARRAY,

    LOAD_DECHETGRAPH_TAGS_BEGIN,
    ADD_PRESTATAIRE_GRAPH_TAG,
    REMOVE_PRESTATAIRE_GRAPH_TAG,
    UPDATE_PRESTATAIRETAGS_INPUTARRAY,
    CLEAN_PRESTATAIRES_CHOSENTAGS_ARRAY,

    LOAD_PRESTATAIREGRAPH_VALUES_BEGIN,
    UPDATE_PRESTATAIREGRAPH_VALUES,
    LOAD_DECHETGRAPH_VALUES_BEGIN,
    UPDATE_DECHETGRAPH_VALUES,

} from '../actions'

function infosPanelOptions(
    state = {
    leftTileShown: false,
    middleLeftTileShown: false,
    middleLeftTileAlerts: false,
    middleRightTileShown: false,
    middleRightTileAlerts: false,
    rightTileShown: false,
    rightTileAlerts: false,
    },
    action){
    switch (action.type){
        case DISPLAY_LEFTTILE_INFOS:
            return Object.assign({}, state, {
                leftTileShown: !state.leftTileShown,
                middleLeftTileShown: false,
                middleLeftTileAlerts: false,
                middleRightTileShown: false,
                middleRightTileAlerts: false,
                rightTileShown: false,
                rightTileAlerts: false,
            });
        case DISPLAY_MIDDLELEFTTILE_INFOS:
            return Object.assign({}, state, {
                leftTileShown: false,
                middleLeftTileShown: !state.middleLeftTileShown,
                middleLeftTileAlerts: false,
                middleRightTileShown: false,
                middleRightTileAlerts: false,
                rightTileShown: false,
                rightTileAlerts: false,
            });
        case DISPLAY_MIDDLELEFTTILE_ALERTS:
            return Object.assign({}, state, {
                leftTileShown: false,
                middleLeftTileShown: false,
                middleLeftTileAlerts: !state.middleLeftTileAlerts,
                middleRightTileShown: false,
                middleRightTileAlerts: false,
                rightTileShown: false,
                rightTileAlerts: false,
            });
        case DISPLAY_MIDDLERIGHTTILE_INFOS:
            return Object.assign({}, state, {
                leftTileShown: false,
                middleLeftTileShown: false,
                middleLeftTileAlerts: false,
                middleRightTileShown: !state.middleRightTileShown,
                middleRightTileAlerts: false,
                rightTileShown: false,
                rightTileAlerts: false,
            });
        case DISPLAY_MIDDLERIGHTTILE_ALERTS:
            return Object.assign({}, state, {
                leftTileShown: false,
                middleLeftTileShown: false,
                middleLeftTileAlerts: false,
                middleRightTileShown: false,
                middleRightTileAlerts: !state.middleRightTileAlerts,
                rightTileShown: false,
                rightTileAlerts: false,
            });
        case DISPLAY_RIGHTTILE_INFOS:
            return Object.assign({}, state, {
                leftTileShown: false,
                middleLeftTileShown: false,
                middleLeftTileAlerts: false,
                middleRightTileShown: false,
                middleRightTileAlerts: false,
                rightTileShown: !state.rightTileShown,
                rightTileAlerts: false,
            });
        case DISPLAY_RIGHTTILE_ALERTS:
            return Object.assign({}, state, {
                leftTileShown: false,
                middleLeftTileShown: false,
                middleLeftTileAlerts: false,
                middleRightTileShown: false,
                middleRightTileAlerts: false,
                rightTileShown: false,
                rightTileAlerts: !state.rightTileAlerts,
            });


        case RESET_MOREINFOS_TO_DEFAULT:
            return Object.assign({}, state, {
                leftTileShown: false,
                middleLeftTileShown: false,
                middleLeftTileAlerts: false,
                middleRightTileShown: false,
                middleRightTileAlerts: false,
                rightTileShown: false,
                rightTileAlerts: false,
            });
        default:
            return state;
    }
}
function pageOptions(state = {
    architecture: {},
    bordereaux: {},
    date: {
        startDate: moment('2017-01-01'),
        endDate: moment('2017-12-31')
        }
    }, action){
    switch (action.type) {
        case SAVE_ARCHITECTURE:
            return Object.assign({}, state, {architecture: action.architecture});
        case SAVE_BORDEREAUX_FOR_SITE:
            return Object.assign({}, state, {bordereaux: action.bordereaux});
        case UPDATE_DATE:
            console.log(action.type)
            console.log(action.date)
            return Object.assign({}, state, {date: action.date})
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
        rightvalue: 0,
        rightvalueBefore: 0,
        rightvalueAnte: 0,
        rightvalueBeforeAnte: 0,
        v_total: 0,
        v_listeverte: 0,
        bdx: 0,
        details: "",
    }, action
) {
    switch(action.type) {
        case CHANGE_LEFTGAUGE_INPUT:
            return Object.assign({}, state, {
                leftvalue: action.values.leftvalue,
                leftvalueBefore: action.values.leftvalueBefore,
                leftvalueAnte: action.values.leftvalueAnte,
                leftvalueBeforeAnte: action.values.leftvalueBeforeAnte,
                v_listeverte: action.values.v_listeverte,
                details: action.values.details
            });
        case CHANGE_MIDDLEGAUGE_INPUT:

            return Object.assign({}, state, {
                middlevalue: action.values.middlevalue,
                middlevalueBefore: action.values.middlevalueBefore,
                middlevalueAnte: action.values.middlevalueAnte,
                middlevalueBeforeAnte: action.values.middlevalueBeforeAnte,
                v_total: action.values.v_total
            });
        case CHANGE_RIGHTGAUGE_INPUT:

            return Object.assign({}, state, {
                rightvalue: action.values.rightvalue,
                rightvalueBefore: action.values.rightvalueBefore,
                rightvalueAnte: action.values.rightvalueAnte,
                rightvalueBeforeAnte: action.values.rightvalueBeforeAnte,
                bdx: action.values.bdx,
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
        isGrowingLeft: false,
        isGrowingMiddleLeft: false,
        isGrowingMiddleRight: false,
        isGrowingRight: false,
    }, action
) {
    switch(action.type) {
        case CHANGE_LEFTTILE_INPUT:
            return Object.assign({}, state, {
                ecarts_pesee: action.values.ecarts_pesee,
                isGrowingLeft: action.values.isGrowingLeft
            });
        case CHANGE_RIGHTTILE_INPUT:
            return Object.assign({}, state, {
                incoherences_filieres_dd: action.values.incoherences_filieres_dd,
                incoherences_filieres_norm: action.values.incoherences_filieres_norm,
                isGrowingRight: action.values.isGrowingRight
            });
        case CHANGE_MIDDLELEFTTILE_INPUT:
            return Object.assign({}, state, {
                filieres_interdites_norm: action.values.filieres_interdites_norm,
                filieres_interdites_dd: action.values.filieres_interdites_dd,
                isGrowingMiddleLeft: action.values.isGrowingMiddleLeft
            });
        case CHANGE_MIDDLERIGHTTILE_INPUT:
            return Object.assign({}, state, {
                retards_dd: action.values.retards_dd,
                retards_norm: action.values.retards_norm,
                isGrowingMiddleRight: action.values.isGrowingMiddleRight
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
            real_level:0,
            architecture: {
                nom: {name: "", real_level: 0},
                unite_dependance: {name: "", real_level: 0},
                up_dependance: {name: "", real_level: 0},
                metier_dependance: {name: "", real_level: 0},
            },
            suggestions: {
                nom: [],
                unite_dependance: [],
                up_dependance: [],
                metier_dependance: []
            }
        },
        dashboardLoading: false,
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
            if (typeof(action.value) ==='string') {
                return Object.assign({}, state, {
                    value: action.value
                });
            }
            else {
                return Object.assign({}, state, {
                    value: action.value.name
                });
            };

        case UPDATE_DASHBOARD_BEGIN:
            return Object.assign({}, state, {
                dashboardLoading: !state.dashboardLoading
            })

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

function updatePrestataireSelectionPanel(state = {input: '', biggest: '', inputArray: [], isLoading: false, selectedInput: '', suggestion: []}, action){
    switch(action.type){
        case LOAD_PRESTATAIRELIST_BEGIN:
            return Object.assign({}, state, {
                isLoading: true,
                inputArray: [],
                suggestion: [],
                selectedInput: ''
            });
        case UPDATE_PRESTATAIRELIST:
            return Object.assign({}, state, {
                selectedInput: '',
                inputArray: action.json.prestataires,
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
        case UPDATE_BIGGEST_PRESTATAIRE:
            return Object.assign({}, state, {
                biggest: action.prestataire
            })
        case UPDATE_SELECTEDPRESTATAIRE:
            return Object.assign({}, state, {
                selectedInput: action.prestataire
            });
        default :
            return state;
    }
}

function updateDechetSelectionPanel(state = {input: '', biggest: '', inputArray: [], isLoading: false, selectedInput: '', suggestion: []}, action){
    switch(action.type){
        case LOAD_DECHETLIST_BEGIN:
            return Object.assign({}, state, {
                isLoading: true,
                inputArray: [],
                suggestion: [],
                selectedInput: ''
            });
        case UPDATE_DECHETLIST:
            return Object.assign({}, state, {
                selectedInput: '',
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
        case UPDATE_BIGGEST_DECHET:
            return Object.assign({}, state, {
                biggest: action.dechet
            })
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
                isLoading: true,
                tagsArray: [],
                inputArray: []
            })
        case ADD_PRESTATAIRE_GRAPH_TAG:
            let newInputArray = [];
            let newTagsArray = [];
            const newTag = Object.assign({}, action.dechetTag, {
                shortenedName: action.dechetTag.codeinterne +
                ' - ' +
                action.dechetTag.libelle.slice(0,6) +
                '...'
            });
            if(state.tagsArray.includes(newTag)){
                return state;
            }
            else{
                /*
                 * We remove the tag from the inputArray so that we can't click on it anymore
                 */
                newInputArray = [];
                state.inputArray.forEach(input => {
                    if (input.id !== newTag.id){
                        newInputArray.push(input);
                    }
                });
                return Object.assign({}, state, {
                    inputArray: newInputArray,
                    tagsArray: [...state.tagsArray, newTag]
                });
            }
        case REMOVE_PRESTATAIRE_GRAPH_TAG:
            newTagsArray = [];
            state.tagsArray.forEach(tag => {
                if(tag !== action.dechetTag){
                    newTagsArray.push(tag);
                }
            });
            action.dechetTag.nom = action.dechetTag.libelle;
            return Object.assign({}, state, {
                inputArray: [...state.inputArray,action.dechetTag],
                tagsArray: newTagsArray
            });
        case CLEAN_DECHETS_CHOSENTAGS_ARRAY:
            return Object.assign({}, state, {
                tagsArray: [],
                inputArray: [...state.inputArray, ...state.tagsArray]
            });
        case UPDATE_DECHETTAGS_INPUTARRAY:
            newInputArray = action.inputArray.map(tag => {
                return Object.assign({}, tag, {nom: tag.libelle});
            });
            return Object.assign({}, state, {
                isLoading: false,
                inputArray: newInputArray
            });
        default:
            return state;
    }
}

function updateDechetGraphTagsPanel(state = {tagsArray: [], inputArray:[], isLoading: false}, action){
    switch (action.type) {
        case LOAD_DECHETGRAPH_TAGS_BEGIN:
            return Object({}, state, {
                isLoading: true,
                inputArray: [],
                tagsArray: []
            })
        case ADD_DECHET_GRAPH_TAG:
            let newInputArray = [];
            let newTagsArray = [];
            const newTag = Object.assign({}, action.prestataireTag, {
                shortenedName: action.prestataireTag.nom.slice(0,10) + '...'
            });
            if(state.tagsArray.includes(newTag)){
                return state;
            }
            else{
                /*
                 * We remove the tag from the inputArray so that we can't click on it anymore
                 */

                newInputArray = [];
                state.inputArray.forEach(input => {
                    if (input.id !== newTag.id){
                        newInputArray.push(input);
                    }
                });
                return Object.assign({}, state, {
                    inputArray: newInputArray,
                    tagsArray: [...state.tagsArray, newTag]
                });
            }
        case REMOVE_DECHET_GRAPH_TAG:
            newTagsArray = [];
            newInputArray = [];
            state.tagsArray.forEach(tag => {
                if(tag !== action.prestataireTag){
                    newTagsArray.push(tag);
                }
            });
            newInputArray = [...state.inputArray, action.prestataireTag];
            return Object.assign({}, state, {
                inputArray: newInputArray,
                tagsArray: newTagsArray
            });
        case CLEAN_PRESTATAIRES_CHOSENTAGS_ARRAY:
            return Object.assign({}, state, {
                tagsArray: [],
                inputArray: [...state.inputArray, ...state.tagsArray]
            });
        case UPDATE_PRESTATAIRETAGS_INPUTARRAY:
            newInputArray = action.inputArray.map(prestataire => {
                return Object.assign({},prestataire,{codeinterne: prestataire.id});
            });
            return Object.assign({}, state, {
                isLoading: false,
                inputArray: newInputArray
            })
        default:
            return state;
    }
}

function prestataireGraphOptions(state = {title: '', values: [], isLoading: false}, action){
    switch(action.type){
        case LOAD_PRESTATAIREGRAPH_VALUES_BEGIN:
            return Object.assign({}, state, {isLoading: true, values: []});
        case UPDATE_SELECTEDPRESTATAIRE:
            return Object.assign({}, state, {title: action.prestataire.nom});
        case UPDATE_PRESTATAIREGRAPH_VALUES:
            return Object.assign({}, state, {isLoading: false, values: action.valuesArray});
        default:
            return state;
    }
}

function dechetGraphOptions(state = {title: '', values: [], isLoading: false}, action){
    switch(action.type){
        case LOAD_DECHETGRAPH_VALUES_BEGIN:
            return Object.assign({}, state, {isLoading: true, values: []});
        case UPDATE_SELECTEDDECHET:
            return Object.assign({}, state, {title: action.dechet.libelle});
        case UPDATE_DECHETGRAPH_VALUES:
            return Object.assign({}, state, {isLoading: false, values: action.valuesArray});
        default:
            return state;
    }
}


const akkaApp = combineReducers({
    pageOptions,
    infosPanelOptions,
    updateGauge,
    updateTile,
    updateSearchBar,
    updatePrestataireSelectionPanel,
    updateDechetSelectionPanel,
    updatePrestataireGraphTagsPanel,
    updateDechetGraphTagsPanel,
    prestataireGraphOptions,
    dechetGraphOptions
})

export default akkaApp
