import { connect } from "react-redux"
import * as actions from '../actions'
import * as apiCalls from '../actions/api_calls'

function mapStateToProps(state) {
    return {
        values: state.updateGauge.value,
        valueBefore: state.updateGauge.valueBefore,
        valueAnte: state.updateGauge.valueAnte,
        valueBeforeAnte: state.updateGauge.valueBeforeAnte
    }
};

function mapDispatchToProps(dispatch) {
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
