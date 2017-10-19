import React from 'react';
import { connect } from "react-redux";
import * as actions from '../../actions';
import * as apiCalls from '../../actions/api_calls';
import InputGraphPanel from '../inputgraphpanel.component';

function mapStateToProps(state, ownProps) {
    const branchName = ownProps.branchName;
    const idInputPanel = ownProps.idInputPanel;
    const searchPlaceholder = ownProps.placeholder;
    return {
        inputArray: state[branchName].inputArray,
        selectedInput: state[branchName].selectedInput,
        suggestion: state[branchName].suggestion,
        id: idInputPanel
    }
};

function mapDispatchToProps(dispatch, ownProps) {
    const onClickActionName = ownProps.onClickActionName;
    const onLoadActionName = ownProps.onLoadActionName;
    const onSearchActionName = ownProps.onSearchActionName;
    return ({
        onClick: (input) => {
            dispatch(actions[onClickActionName](input));
        },
        onLoaded: () => {
            dispatch(apiCalls[onLoadActionName]());
        },
        onSearch: (input) => {
            dispatch(actions[onSearchActionName](input))
        }
    });
};

const InputGraphPanelContainer = ({inputArray, selectedInput, onClick, onLoaded, onSearch, id, searchPlaceholder, suggestion}) => {
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
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(InputGraphPanelContainer);
