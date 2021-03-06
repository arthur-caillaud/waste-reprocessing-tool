import { connect } from "react-redux";
import * as actions from '../../actions';
import * as apiCalls from '../../actions/api_calls';
import SearchTreeElement from '../searchtree.component'

function mapStateToProps(state) {
    return {
        site: state.updateSearchBar.site.architecture.nom,
        unite_dependance: state.updateSearchBar.site.architecture.unite_dependance,
        up_dependance: state.updateSearchBar.site.architecture.up_dependance,
        metier_dependance: state.updateSearchBar.site.architecture.metier_dependance,
        id: state.updateSearchBar.site.id,
        suggestions: state.updateSearchBar.site.suggestions
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onRenderMetierClickHandler: () => {
            dispatch(actions.updateInputValue(''));
            dispatch(apiCalls.updateSite({
                    nom: "National",
                    level: 0,
                    real_level: 0,
                    architecture: {
                        nom: {name: "", real_level: 0},
                        unite_dependance: {name: "", real_level: 0},
                        up_dependance: {name: "", real_level: 0},
                        metier_dependance: {name: "", real_level: 0}
                    }
                }
            ));
        },
        onRenderUpClickHandler: () => {
            const nom = window.store.getState().updateSearchBar.site.architecture.metier_dependance.name;
            if(nom){
                dispatch(actions.updateInputValue(nom));
                dispatch(apiCalls.updateSite({
                        nom: nom,
                        level: 1,
                        real_level: window.store.getState().updateSearchBar.site.architecture.metier_dependance.real_level,
                        architecture: {
                            nom: {name: "", real_level: 0},
                            unite_dependance: {name: "", real_level: 0},
                            up_dependance: {name: "", real_level: 0},
                            metier_dependance: {
                                name: nom,
                                real_level: window.store.getState().updateSearchBar.site.architecture.metier_dependance.real_level
                            }
                        }
                    }
                ));
            }
        },
        onRenderUniteClickHandler: () => {
            const nom = window.store.getState().updateSearchBar.site.architecture.up_dependance.name;
            if(nom){
                dispatch(actions.updateInputValue(nom));
                dispatch(apiCalls.updateSite({
                        nom: nom,
                        level: 2,
                        real_level: window.store.getState().updateSearchBar.site.architecture.up_dependance.real_level,
                        architecture: {
                            nom: {name: "", real_level: 0},
                            unite_dependance: {name: "", real_level: 0},
                            up_dependance: {
                                name: nom,
                                real_level: window.store.getState().updateSearchBar.site.architecture.up_dependance.real_level,
                            },
                            metier_dependance: {
                                name: window.store.getState().updateSearchBar.site.architecture.metier_dependance.name,
                                real_level: window.store.getState().updateSearchBar.site.architecture.metier_dependance.real_level,
                            }
                        }
                    }
                ));
            }
        },
        onRenderSiteClickHandler: () => {
            const nom = window.store.getState().updateSearchBar.site.architecture.unite_dependance.name;
            if(nom){
                dispatch(actions.updateInputValue(nom));
                dispatch(apiCalls.updateSite({
                        nom: nom,
                        level: 3,
                        real_level: window.store.getState().updateSearchBar.site.architecture.unite_dependance.real_level,
                        architecture: {
                            nom: {name: "", real_level: 0},
                            unite_dependance: {
                                name: nom,
                                real_level: window.store.getState().updateSearchBar.site.architecture.unite_dependance.real_level,
                            },
                            up_dependance: {
                                name: window.store.getState().updateSearchBar.site.architecture.up_dependance.name,
                                real_level: window.store.getState().updateSearchBar.site.architecture.up_dependance.real_level,
                            },
                            metier_dependance: {
                                name: window.store.getState().updateSearchBar.site.architecture.metier_dependance.name,
                                real_level: window.store.getState().updateSearchBar.site.architecture.metier_dependance.real_level,
                            }
                        }
                    }
                ));
            }
        },
        updateMetier:  (evt) => {
            dispatch(apiCalls.updateSite({
                nom: evt.name,
                level: 1,
                real_level: evt.real_level,
                architecture: {
                    nom: {name: "", real_level: 0},
                    unite_dependance: {name: "", real_level: 0},
                    up_dependance: {name: "", real_level: 0},
                    metier_dependance: {name: evt.name, real_level: evt.real_level},
                }
            }));
            dispatch(actions.updateInputValue(evt.name))
        },
        updateUp: (evt) => {
            dispatch(apiCalls.updateSite({
                nom: evt.name,
                level: 2,
                real_level: evt.real_level,
                architecture: {
                    nom: {name: "", real_level: 0},
                    unite_dependance: {name: "", real_level: 0},
                    up_dependance: {name: evt.name, real_level: evt.real_level},
                    metier_dependance: {
                        name: window.store.getState().updateSearchBar.site.architecture.metier_dependance.name,
                        real_level: window.store.getState().updateSearchBar.site.architecture.metier_dependance.real_level,
                    },
                }
            }));
            dispatch(actions.updateInputValue(evt.name))
        },
        updateUnite: (evt) => {
            dispatch(apiCalls.updateSite({
                nom: evt.name,
                level: 3,
                real_level: evt.real_level,
                architecture: {
                    nom: {name: "", real_level: 0},
                    unite_dependance: {name: evt.name, real_level: evt.real_level},
                    up_dependance: {
                        name: window.store.getState().updateSearchBar.site.architecture.up_dependance.name,
                        real_level: window.store.getState().updateSearchBar.site.architecture.up_dependance.real_level,
                    },
                    metier_dependance: {
                        name: window.store.getState().updateSearchBar.site.architecture.metier_dependance.name,
                        real_level: window.store.getState().updateSearchBar.site.architecture.metier_dependance.real_level,
                }
                }
            }));
            dispatch(actions.updateInputValue(evt.name))
        },
        updateSite: (evt) => {
            dispatch(apiCalls.updateSite({
                nom: evt.name,
                level: 4,
                real_level: evt.real_level,
                architecture: {
                    nom: {name: evt.name, real_level: evt.real_level},
                    unite_dependance: {
                        name: window.store.getState().updateSearchBar.site.architecture.unite_dependance.name,
                        real_level: window.store.getState().updateSearchBar.site.architecture.unite_dependance.real_level,
                    },
                    up_dependance: {
                        name: window.store.getState().updateSearchBar.site.architecture.up_dependance.name,
                        real_level: window.store.getState().updateSearchBar.site.architecture.up_dependance.real_level,
                    },
                    metier_dependance: {
                        name: window.store.getState().updateSearchBar.site.architecture.metier_dependance.name,
                        real_level: window.store.getState().updateSearchBar.site.architecture.metier_dependance.real_level,
                }
                }
            }));
            dispatch(actions.updateInputValue(evt.name))
        },
    }
}

const SearchTree = connect(mapStateToProps, mapDispatchToProps)(SearchTreeElement);
export default SearchTree;
