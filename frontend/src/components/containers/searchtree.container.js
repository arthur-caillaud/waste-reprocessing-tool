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
                    architecture: {
                        nom: null,
                        unite_dependance: null,
                        up_dependance: null,
                        metier_dependance: null
                    }
                }
            ));
            dispatch(actions.updateInputValue(''));
            dispatch(apiCalls.loadPrestataireList(0,"National"));
            dispatch(apiCalls.loadDechetList(0,"National"));
            dispatch(apiCalls.loadPrestataireGraphValues(0,"National"));
        },
        onRenderUpClickHandler: () => {
            dispatch(apiCalls.updateSite({
                    nom: window.store.getState().updateSearchBar.site.architecture.metier_dependance,
                    level: 1,
                    architecture: {
                        nom: null,
                        unite_dependance: null,
                        up_dependance: null,
                        metier_dependance: window.store.getState().updateSearchBar.site.architecture.metier_dependance
                    }
                }
            ));
            dispatch(actions.updateInputValue(window.store.getState().updateSearchBar.site.architecture.metier_dependance));
            dispatch(apiCalls.loadPrestataireList(1,window.store.getState().updateSearchBar.site.architecture.metier_dependance));
            dispatch(apiCalls.loadDechetList(1,window.store.getState().updateSearchBar.site.architecture.metier_dependance));
            dispatch(apiCalls.loadPrestataireGraphValues(1,window.store.getState().updateSearchBar.site.architecture.metier_dependance));
        },
        onRenderUniteClickHandler: () => {
            dispatch(apiCalls.updateSite({
                    nom: window.store.getState().updateSearchBar.site.architecture.up_dependance,
                    level: 2,
                    architecture: {
                        nom: null,
                        unite_dependance: null,
                        up_dependance: window.store.getState().updateSearchBar.site.architecture.up_dependance,
                        metier_dependance: window.store.getState().updateSearchBar.site.architecture.metier_dependance
                    }
                }
            ));
            dispatch(actions.updateInputValue(window.store.getState().updateSearchBar.site.architecture.up_dependance));
            dispatch(apiCalls.loadPrestataireList(2,window.store.getState().updateSearchBar.site.architecture.up_dependance));
            dispatch(apiCalls.loadDechetList(2,window.store.getState().updateSearchBar.site.architecture.up_dependance));
            dispatch(apiCalls.loadPrestataireGraphValues(2,window.store.getState().updateSearchBar.site.architecture.up_dependance));
        },
        onRenderSiteClickHandler: () => {
            dispatch(apiCalls.updateSite({
                    nom: window.store.getState().updateSearchBar.site.architecture.unite_dependance,
                    level: 3,
                    architecture: {
                        nom: null,
                        unite_dependance: window.store.getState().updateSearchBar.site.architecture.unite_dependance,
                        up_dependance: window.store.getState().updateSearchBar.site.architecture.up_dependance,
                        metier_dependance: window.store.getState().updateSearchBar.site.architecture.metier_dependance
                    }
                }
            ));
            dispatch(actions.updateInputValue(window.store.getState().updateSearchBar.site.architecture.unite_dependance));
            dispatch(apiCalls.loadPrestataireList(3,window.store.getState().updateSearchBar.site.architecture.unite_dependance));
            dispatch(apiCalls.loadDechetList(3,window.store.getState().updateSearchBar.site.architecture.unite_dependance));
            dispatch(apiCalls.loadPrestataireGraphValues(3,window.store.getState().updateSearchBar.site.architecture.unite_dependance));
        },
        updateMetier:  (evt) => {
            dispatch(apiCalls.updateSite({
                nom: evt,
                level: 1,
                architecture: {
                    nom: null,
                    unite_dependance: null,
                    up_dependance: null,
                    metier_dependance: evt
                }
            }));
            dispatch(apiCalls.loadPrestataireList(1,evt));
            dispatch(apiCalls.loadDechetList(1,evt));
            dispatch(apiCalls.loadPrestataireGraphValues(1,evt));
        },
        updateUp: (evt) => {
            dispatch(apiCalls.updateSite({
                nom: evt,
                level: 2,
                architecture: {
                    nom: null,
                    unite_dependance: null,
                    up_dependance: evt,
                    metier_dependance: window.store.getState().updateSearchBar.site.architecture.metier_dependance
                }
            }));
            dispatch(apiCalls.loadPrestataireList(2,evt));
            dispatch(apiCalls.loadDechetList(2,evt));
            dispatch(apiCalls.loadPrestataireGraphValues(2,evt));
        },
        updateUnite: (evt) => {
            dispatch(apiCalls.updateSite({
                nom: evt,
                level: 3,
                architecture: {
                    nom: null,
                    unite_dependance: evt,
                    up_dependance: window.store.getState().updateSearchBar.site.architecture.up_dependance,
                    metier_dependance: window.store.getState().updateSearchBar.site.architecture.metier_dependance
                }
            }));
            dispatch(apiCalls.loadPrestataireList(3,evt));
            dispatch(apiCalls.loadDechetList(3,evt));
            dispatch(apiCalls.loadPrestataireGraphValues(3,evt));
        },
        updateSite: (evt) => {
            dispatch(apiCalls.updateSite({
                nom: evt,
                level: 4,
                architecture: {
                    nom: evt,
                    unite_dependance: window.store.getState().updateSearchBar.site.architecture.unite_dependance,
                    up_dependance: window.store.getState().updateSearchBar.site.architecture.up_dependance,
                    metier_dependance: window.store.getState().updateSearchBar.site.architecture.metier_dependance
                }
            }));
            dispatch(apiCalls.loadPrestataireList(4,evt));
            dispatch(apiCalls.loadDechetList(4,evt));
            dispatch(apiCalls.loadPrestataireGraphValues(4,evt));
        },
    }

}

const SearchTree = connect(mapStateToProps, mapDispatchToProps)(SearchTreeElement);
export default SearchTree;
