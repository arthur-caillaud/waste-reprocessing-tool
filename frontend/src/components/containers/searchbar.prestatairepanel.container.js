import { connect } from "react-redux";
import * as actions from '../../actions';
import * as apiCalls from '../../actions/api_calls';
import SearchBarElement from '../searchbar.component'

function mapStateToProps(state, ownProps) {
    return {
      value: state.updatePrestataireSelectionPanel.chosenPrestataire,
      suggestions: state.updatePrestataireSelectionPanel.suggestions,
      isLoading: state.updatePrestataireSelectionPanel.isLoading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onChange(event, { newValue }) {
            dispatch(actions.updatePrestatairePanelInput(newValue));
        },
        onSuggestionsFetchRequested({ value }) {
            dispatch(apiCalls.loadPrestataireList(value));
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
