import { connect } from "react-redux";
import * as actions from '../../actions';
import * as apiCalls from '../../actions/api_calls';
import SearchBarElement from '../searchbar.component'

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
            dispatch(apiCalls.updateSite(suggestion));
        }
    };
}

const SearchBar = connect(mapStateToProps, mapDispatchToProps)(SearchBarElement);
export default SearchBar
