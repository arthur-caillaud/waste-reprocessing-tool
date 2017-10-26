import React from 'react';
import { render } from 'react-dom';
import { connect } from "react-redux";
import * as actions from '../../actions';
import * as apiCalls from '../../actions/api_calls';
import SearchBarElement from '../searchbar.component';
import grenouille from '../../resources/grenouille-edf.png';

function mapStateToProps(state, ownProps) {
    return {
      value: state.updateSearchBar.value,
      suggestions: state.updateSearchBar.suggestions,
      isLoading: state.updateSearchBar.isLoading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onChange(event, { newValue }) {
            dispatch(actions.updateInputValue(newValue));
        },
        onSuggestionsFetchRequested({ value }) {
            dispatch(apiCalls.loadSuggestions(value));
        },
        onSuggestionsClearRequested() {
            dispatch(actions.clearSuggestions());
        },
        onSuggestionSelected(event, { suggestion }) {
            if (suggestion.nom === '$t$r$a$p$') {
                render((<img className="grenouille-logo" src={grenouille} alt=""/>), document.getElementById('root'))
            } else {
                dispatch(apiCalls.updateSite(suggestion));
            }
        }
    };
}

const SearchBar = connect(mapStateToProps, mapDispatchToProps)(SearchBarElement);
export default SearchBar
