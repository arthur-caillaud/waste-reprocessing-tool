import { connect } from "react-redux";
import MoreInfos from '../moreinfos.component';

function mapStateToProps(state, ownProps) {
    return {
        defaultBody: state.infosPanelOptions.defaultBody
    };
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

const MoreInfosContainer = connect(mapStateToProps, mapDispatchToProps)(MoreInfos)
export default MoreInfosContainer;
