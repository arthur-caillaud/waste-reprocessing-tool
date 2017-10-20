import React from 'react';
import { connect } from "react-redux";
import * as actions from '../../actions';
import * as apiCalls from '../../actions/api_calls';
import GraphTagsPanel from '../graphtagspanel.component';

function mapStateToProps(state, ownProps) {
    const branchName = ownProps.branchName;
    const idTagsPanel = ownProps.idTagsPanel;
    const searchPlaceholder = ownProps.placeholder;
    return {
        tagsArray: state[branchName].tagsArray,
        inputArray: state[branchName].inputArray,
        isLoading: state[branchName].isLoading,
        id: idTagsPanel
    }
};

function mapDispatchToProps(dispatch, ownProps) {
    const onClickActionName = ownProps.onClickActionName;
    const onRemoveActionName = ownProps.onRemoveActionName;
    const onLoadActionName = ownProps.onLoadActionName;
    return ({
        onTagClick: (tag) => {
            dispatch(actions[onClickActionName](tag));
        },
        onLoaded: () => {
            dispatch(apiCalls[onLoadActionName]());
        },
        onRemove: (tag) => {
            dispatch(actions[onRemoveActionName](tag));
        }
    });
};

const GraphTagsPanelContainer = ({inputArray, tagsArray, onTagClick, onLoaded, onRemove, id, searchPlaceholder, isLoading}) => {
    return(
        <GraphTagsPanel
            id={id}
            inputArray={inputArray}
            tagsArray={tagsArray}
            searchPlaceholder={searchPlaceholder}
            onTagClick={onTagClick}
            onLoaded={onLoaded}
            onRemove={onRemove}
            isLoading={isLoading}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphTagsPanelContainer);
