import { connect } from "react-redux";
import * as actions from '../../actions';
import * as apiCalls from '../../actions/api_calls';
import MoreInfos from '../moreinfos.component';

function mapStateToProps(state, ownProps) {
    return {
        title: state.infosPanelOptions.title,
        defaultBody: state.infosPanelOptions.defaultBody
    };
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

const MoreInfosContainer = connect(mapStateToProps, mapDispatchToProps)(MoreInfos)
export default MoreInfosContainer;
