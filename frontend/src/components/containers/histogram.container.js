import { connect } from 'react-redux';
import React from 'react';
import Histogram from '../histogram.component';

function mapStateToProps(state, ownProps) {
    const branchName = ownProps.branchName;
    return {
        title: state[branchName].title,
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
