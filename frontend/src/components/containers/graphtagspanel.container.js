import React from 'react';
import { connect } from "react-redux";
import * as actions from '../../actions';
import * as apiCalls from '../../actions/api_calls';
import GraphTagsPanel from '../graphtagspanel.component';

function mapStateToProps(state, ownProps) {
    const branchName = ownProps.branchName;
    const idTagsPanel = ownProps.idTagsPanel;
    const searchPlaceholder = ownProps.placeholder;
    const emptyContainerMessage = ownProps.emptyContainerMessage;
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
    const branchName = ownProps.branchName;
    const onLoadActionName = ownProps.onLoadActionName;
    const defaultOnLoadActionName = ownProps.defaultOnLoadActionName;
    const inputGraphPanelBranch = ownProps.inputGraphPanelBranch;
    const loadGraphValuesActionName = ownProps.loadGraphValuesActionName;
    return ({
        onTagClick: (tag) => {
            dispatch(actions[onClickActionName](tag));
            dispatch(apiCalls[loadGraphValuesActionName](
                window.store.getState().updateSearchBar.site.level,
                window.store.getState().updateSearchBar.site.nom,
                window.store.getState()[inputGraphPanelBranch].selectedInput,
                window.store.getState()[branchName].tagsArray));
        },
        onRemove: (tag) => {
            dispatch(actions[onRemoveActionName](tag));
            dispatch(apiCalls[loadGraphValuesActionName](
                window.store.getState().updateSearchBar.site.level,
                window.store.getState().updateSearchBar.site.nom,
                window.store.getState()[inputGraphPanelBranch].selectedInput,
                window.store.getState()[branchName].tagsArray));
        }
    });
};

const GraphTagsPanelContainer = ({inputArray, tagsArray, id, searchPlaceholder, emptyContainerMessage, isLoading, onTagClick, onLoaded, onRemove}) => {
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
            emptyContainerMessage={emptyContainerMessage}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphTagsPanelContainer);
