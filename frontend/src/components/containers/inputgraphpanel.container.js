import React from 'react';
import { connect } from "react-redux";
import * as actions from '../../actions';
import * as apiCalls from '../../actions/api_calls';
import InputGraphPanel from '../inputgraphpanel.component';

function mapStateToProps(state, ownProps) {
    const branchName = ownProps.branchName;
    const idInputPanel = ownProps.idInputPanel;
    const searchPlaceholder = ownProps.placeholder;
    const emptyContainerMessage = ownProps.emptyContainerMessage;
    return {
        inputArray: state[branchName].inputArray,
        selectedInput: state[branchName].selectedInput,
        suggestion: state[branchName].suggestion,
        isLoading: state[branchName].isLoading,
        id: idInputPanel,
    }
};

function mapDispatchToProps(dispatch, ownProps) {
    const onClickActionName = ownProps.onClickActionName;
    const loadTagsOfInputActionName = ownProps.onLoadActionName;
    const onSearchActionName = ownProps.onSearchActionName;
    const loadGraphValuesActionName = ownProps.loadGraphValuesActionName;
    const cleanActionName = ownProps.cleanActionName;
    return ({
        onClick: (input) => {
            dispatch(actions[onClickActionName](input));
            dispatch(actions[cleanActionName]());
            dispatch(apiCalls[loadTagsOfInputActionName](
                window.store.getState().updateSearchBar.site.real_level,
                window.store.getState().updateSearchBar.site.nom,
                input.id));
            dispatch(apiCalls[loadGraphValuesActionName](
                window.store.getState().updateSearchBar.site.real_level,
                window.store.getState().updateSearchBar.site.nom,
                input));
        },
        onSearch: (input) => {
            dispatch(actions[onSearchActionName](input))
        }
    });
};

const InputGraphPanelContainer = ({inputArray, selectedInput, onClick, onLoaded, onSearch, id, emptyContainerMessage, searchPlaceholder, isLoading, suggestion}) => {
    return(
        <InputGraphPanel
            id={id}
            suggestion={suggestion}
            inputArray={inputArray}
            selectedInput={selectedInput}
            searchPlaceholder={searchPlaceholder}
            onClick={onClick}
            onLoaded={onLoaded}
            onSearch={onSearch}
            isLoading={isLoading}
            emptyContainerMessage={emptyContainerMessage}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(InputGraphPanelContainer);
