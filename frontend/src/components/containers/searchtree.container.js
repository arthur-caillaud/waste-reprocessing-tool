import { connect } from "react-redux";
import * as actions from '../../actions';
import * as apiCalls from '../../actions/api_calls';
import SearchTreeElement from '../searchtree.component'

function mapStateToProps(state) {
    return {
        site: state.updateSearchBar.site.architecture.site,
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
            ))
            dispatch(actions.updateInputValue(''))
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
            ))
            dispatch(actions.updateInputValue(window.store.getState().updateSearchBar.site.architecture.metier_dependance))
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
            ))
            dispatch(actions.updateInputValue(window.store.getState().updateSearchBar.site.architecture.up_dependance))
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
            ))
            dispatch(actions.updateInputValue(window.store.getState().updateSearchBar.site.architecture.unite_dependance))
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

            }))
        }
    }

}

const SearchTree = connect(mapStateToProps, mapDispatchToProps)(SearchTreeElement);
export default SearchTree;
