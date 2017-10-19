import React from 'react';
import { connect } from "react-redux";
import * as actions from '../../actions';
import * as apiCalls from '../../actions/api_calls';
import InputGraphPanel from '../inputgraphpanel.component';

function mapStateToProps(state, ownProps) {
    const branchName = ownProps.branchName;
    const idInputPanel = ownProps.idInputPanel;
    return {
        inputArray: state[branchName].inputArray,
        selectedInput: state[branchName].selectedInput,
        id: idInputPanel
    }
};

function mapDispatchToProps(dispatch, ownProps) {
    const onClickActionName = ownProps.onClickActionName;
    const onLoadActionName = ownProps.onLoadActionName;
    return ({
        onClick: (input) => {
            dispatch(actions[onClickActionName](input));
        },
        onLoaded: () => {
            dispatch(apiCalls[onLoadActionName]());
        }
    });
};

const InputGraphPanelContainer = ({inputArray, selectedInput, onClick, onLoaded, id}) => {
    return(
        <InputGraphPanel
            id={id}
            inputArray={inputArray}
            selectedInput={selectedInput}
            onClick={onClick}
            onLoaded={onLoaded}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(InputGraphPanelContainer);
