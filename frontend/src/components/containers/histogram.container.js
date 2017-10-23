import { connect } from "react-redux"
import * as actions from '../actions'

function mapStateToProps(state, ownProps) {
    const branchName = ownProps.branchName;
    const idGraph = ownProps.idGraph;
    return {
        title: state[branchName].graphTitle,
        values: state[branchName].graphValues
    }
};

function mapDispatchToProps(dispatch, ownProps) {
    return {showMoreInfos: () => dispatch(actions.updateLeftGauge({
        value: Math.random()*100,
        valueBefore:Math.random()*100,
        valueAnte: valueAnteG,
        valueBeforeAnte: valueBeforeAnteG
    }))

    }
};

const LeftGauge = ({showMoreInfos, value, valueBefore, valueBeforeAnte, valueAnte}) => {
    return(
        <div onClick={showMoreInfos}>
            <LeftGauged3 id="leftgauge" value={value} valueBefore={valueBefore} valueAnte={valueAnte} valueBeforeAnte={valueBeforeAnte}/>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftGauge);
