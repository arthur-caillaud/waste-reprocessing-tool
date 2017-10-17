import React, { Component, } from 'react';
import Autosuggest from 'react-autosuggest';
import { connect } from "react-redux";
import * as actions from '../actions';
import akkaApp from '../reducers/index.js';

import '../styles/searchbar.css'


function getSuggestionValue(suggestion) {
    return suggestion.name;
}
function renderSuggestion(suggestion) {
    return(
        <span>{suggestion.name}</span>
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
            dispatch(actions.loadSuggestions(value));
        },
        onSuggestionsClearRequested() {
            dispatch(actions.clearSuggestions());
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
            onSuggestionsClearRequested
        } = this.props;
        const inputProps = {
            placeholder: "France",
            value: value,
            onChange: onChange
        };



        return (
            <div>
                <div className="status">
                </div>
                <Autosuggest
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={onSuggestionsClearRequested}
                  getSuggestionValue={getSuggestionValue}
                  renderSuggestion={renderSuggestion}
                  inputProps={inputProps} />
            </div>

        )
    }
}
const SearchBar = connect(mapStateToProps, mapDispatchToProps)(SearchBarElement);
export default SearchBar;
