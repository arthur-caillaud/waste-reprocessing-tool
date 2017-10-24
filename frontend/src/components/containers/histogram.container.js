import { connect } from 'react-redux';
import React from 'react';
import * as actions from '../../actions';
import Histogram from '../histogram.component';

function mapStateToProps(state, ownProps) {
    const branchName = ownProps.branchName;
    const idGraph = ownProps.idGraph;
    return {
        title: state[branchName].graphTitle,
        values: state[branchName].values,
        isLoading: state[branchName].isLoading
    }
};

function mapDispatchToProps(dispatch, ownProps) {
    return {

    }
};

const HistogramContainer = ({title, values, idGraph, isLoading}) => {
    return(
        <Histogram
            id={idGraph}
            title={title}
            values={values}
            isLoading={isLoading}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(HistogramContainer);
