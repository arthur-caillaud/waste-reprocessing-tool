import React, { Component, } from 'react';
import Autosuggest from 'react-autosuggest';


import '../styles/searchbar.css'

function getSuggestionValue(suggestion) {
    return suggestion.nom;
}

function renderSuggestion(suggestion) {
        return(
            <span>{suggestion.nom}</span>
        );
}


class SearchBarElement extends Component {

    render() {

        const { value,
            suggestions,
            onChange,
            onSuggestionsFetchRequested,
            onSuggestionsClearRequested,
            onSuggestionSelected,
            id,
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
                  id={id}
                  inputProps={inputProps} />


        )
    }
}

export default SearchBarElement;
