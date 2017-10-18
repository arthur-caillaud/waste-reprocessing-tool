import React, { Component, } from 'react';
import Autosuggest from 'react-autosuggest';
import { connect } from "react-redux";
import * as actions from '../actions';
import * as apiCalls from '../actions/api_calls'
import akkaApp from '../reducers/index.js';


import '../styles/searchbar.css'


function getSuggestionValue(suggestion) {
    return suggestion.nom;
}
function renderSuggestion(suggestion) {
    return(
        <span>{suggestion.nom}</span>
    );
}

function mapStateToProps(state) {
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
            dispatch(apiCalls.updateSite(suggestion));
        }
    };
}

class SearchBarElement extends Component {



    render() {

        const { value,
            suggestions,
            isLoading,
            onChange,
            onSuggestionsFetchRequested,
            onSuggestionsClearRequested,
            onSuggestionSelected,
        } = this.props;
        const inputProps = {
            placeholder: "Région/Site/...",
            value: value,
            onChange: onChange
        };

        return (

                <Autosuggest

                  suggestions={suggestions}
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={onSuggestionsClearRequested}
                  onSuggestionSelected={onSuggestionSelected}
                  getSuggestionValue={getSuggestionValue}
                  renderSuggestion={renderSuggestion}
                  inputProps={inputProps} />


        )
    }
}
const SearchBar = connect(mapStateToProps, mapDispatchToProps)(SearchBarElement);
export default SearchBar;
