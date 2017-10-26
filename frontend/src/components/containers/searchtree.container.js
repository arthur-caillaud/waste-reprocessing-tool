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
            dispatch(actions.updateInputValue(''));
            dispatch(apiCalls.loadPrestataireList(0,"National"));
            dispatch(apiCalls.loadDechetList(0,"National"));
            dispatch(apiCalls.loadPrestataireGraphValues(0,"National"));
            dispatch(apiCalls.loadDechetGraphValues(0,"National"));
        },
        onRenderUpClickHandler: () => {
            dispatch(apiCalls.updateSite({
                    nom: window.store.getState().updateSearchBar.site.architecture.metier_dependance.name,
                    level: 1,
                    real_level: 1,
                    architecture: {
                        nom: {name: "", real_level: 0},
                        unite_dependance: {name: "", real_level: 0},
                        up_dependance: {name: "", real_level: 0},
                        metier_dependance: {
                            name: window.store.getState().updateSearchBar.site.architecture.metier_dependance.name,
                            real_level: window.store.getState().updateSearchBar.site.architecture.metier_dependance.real_level
                        }
                    }
                }
            ));
            dispatch(actions.updateInputValue(window.store.getState().updateSearchBar.site.architecture.metier_dependance.name));
            dispatch(apiCalls.loadPrestataireList(
                window.store.getState().updateSearchBar.site.architecture.metier_dependance.real_level,
                window.store.getState().updateSearchBar.site.architecture.metier_dependance.name
            ));
            dispatch(apiCalls.loadDechetList(
                window.store.getState().updateSearchBar.site.architecture.metier_dependance.real_level,
                window.store.getState().updateSearchBar.site.architecture.metier_dependance.name
            ));
            dispatch(apiCalls.loadPrestataireGraphValues(
                window.store.getState().updateSearchBar.site.architecture.metier_dependance.real_level,
                window.store.getState().updateSearchBar.site.architecture.metier_dependance.name
            ));
            dispatch(apiCalls.loadDechetGraphValues(
                window.store.getState().updateSearchBar.site.architecture.metier_dependance.real_level,
                window.store.getState().updateSearchBar.site.architecture.metier_dependance.name
            ));
        },
        onRenderUniteClickHandler: () => {
            dispatch(apiCalls.updateSite({
                    nom: window.store.getState().updateSearchBar.site.architecture.up_dependance.name,
                    level: 2,
                    real_level: 2,
                    architecture: {
                        nom: {name: "", real_level: 0},
                        unite_dependance: {name: "", real_level: 0},
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
            dispatch(actions.updateInputValue(window.store.getState().updateSearchBar.site.architecture.up_dependance.name));
            dispatch(apiCalls.loadPrestataireList(
                window.store.getState().updateSearchBar.site.architecture.metier_dependance.real_level,
                window.store.getState().updateSearchBar.site.architecture.metier_dependance.name
            ));
            dispatch(apiCalls.loadDechetList(
                window.store.getState().updateSearchBar.site.architecture.metier_dependance.real_level,
                window.store.getState().updateSearchBar.site.architecture.metier_dependance.name
            ));
            dispatch(apiCalls.loadPrestataireGraphValues(
                window.store.getState().updateSearchBar.site.architecture.metier_dependance.real_level,
                window.store.getState().updateSearchBar.site.architecture.metier_dependance.name
            ));
            dispatch(apiCalls.loadDechetGraphValues(
                window.store.getState().updateSearchBar.site.architecture.metier_dependance.real_level,
                window.store.getState().updateSearchBar.site.architecture.metier_dependance.name
            ));
        },
        onRenderSiteClickHandler: () => {
            dispatch(apiCalls.updateSite({
                    nom: window.store.getState().updateSearchBar.site.architecture.unite_dependance.name,
                    level: 3,
                    real_level: 3,
                    architecture: {
                        nom: {name: "", real_level: 0},
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
                }
            ));
            dispatch(actions.updateInputValue(window.store.getState().updateSearchBar.site.architecture.unite_dependance.name));
            dispatch(apiCalls.loadPrestataireList(
                window.store.getState().updateSearchBar.site.architecture.metier_dependance.real_level,
                window.store.getState().updateSearchBar.site.architecture.metier_dependance.name
            ));
            dispatch(apiCalls.loadDechetList(
                window.store.getState().updateSearchBar.site.architecture.metier_dependance.real_level,
                window.store.getState().updateSearchBar.site.architecture.metier_dependance.name
            ));
            dispatch(apiCalls.loadPrestataireGraphValues(
                window.store.getState().updateSearchBar.site.architecture.metier_dependance.real_level,
                window.store.getState().updateSearchBar.site.architecture.metier_dependance.name
            ));
            dispatch(apiCalls.loadDechetGraphValues(
                window.store.getState().updateSearchBar.site.architecture.metier_dependance.real_level,
                window.store.getState().updateSearchBar.site.architecture.metier_dependance.name
            ));
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
            dispatch(apiCalls.loadPrestataireList(evt.real_level,evt.name));
            dispatch(apiCalls.loadDechetList(evt.real_level,evt.name));
            dispatch(apiCalls.loadPrestataireGraphValues(evt.real_level,evt.name));
            dispatch(apiCalls.loadDechetGraphValues(evt.real_level,evt.name));
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
            dispatch(apiCalls.loadPrestataireList(evt.real_level,evt.name));
            dispatch(apiCalls.loadDechetList(evt.real_level,evt.name));
            dispatch(apiCalls.loadPrestataireGraphValues(evt.real_level,evt.name));
            dispatch(apiCalls.loadDechetGraphValues(evt.real_level,evt.name));
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
            dispatch(apiCalls.loadPrestataireList(evt.real_level,evt.name));
            dispatch(apiCalls.loadDechetList(evt.real_level,evt.name));
            dispatch(apiCalls.loadPrestataireGraphValues(evt.real_level,evt.name));
            dispatch(apiCalls.loadDechetGraphValues(evt.real_level,evt.name));
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
            dispatch(apiCalls.loadPrestataireList(evt.real_level,evt.name));
            dispatch(apiCalls.loadDechetList(evt.real_level,evt.name));
            dispatch(apiCalls.loadPrestataireGraphValues(evt.real_level,evt.name));
            dispatch(apiCalls.loadDechetGraphValues(evt.real_level,evt.name));
        },
    }
}

const SearchTree = connect(mapStateToProps, mapDispatchToProps)(SearchTreeElement);
export default SearchTree;
