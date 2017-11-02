import { connect } from "react-redux";
import MoreInfos from '../moreinfos.component';

function mapStateToProps(state, ownProps) {
    return {
        leftTileShown: state.infosPanelOptions.leftTileShown,
        middleLeftTileShown: state.infosPanelOptions.middleLeftTileShown,
        middleLeftTileAlerts: state.infosPanelOptions.middleLeftTileAlerts,
        middleRightTileShown: state.infosPanelOptions.middleRightTileShown,
        middleRightTileAlerts: state.infosPanelOptions.middleRightTileAlerts,
        rightTileShown: state.infosPanelOptions.rightTileShown,
        rightTileAlerts: state.infosPanelOptions.rightTileAlerts,
        ecarts_pesee: state.pageOptions.bordereaux.ecarts_pesee,
        filieres_interdites_dd: state.pageOptions.bordereaux.filieres_interdites_dd,
        filieres_interdites_norm: state.pageOptions.bordereaux.filieres_interdites_norm,
        retards_norm: state.pageOptions.bordereaux.retards_norm,
        retards_dd: state.pageOptions.bordereaux.retards_dd,
        incoherences_filieres_dd: state.pageOptions.bordereaux.incoherences_filieres_dd,
        incoherences_filieres_norm: state.pageOptions.bordereaux.incoherences_filieres_norm,
    };
}

function mapDispatchToProps(dispatch) {
    return {

    }
}


const MoreInfosContainer = connect(mapStateToProps, mapDispatchToProps)(MoreInfos)
export default MoreInfosContainer;
