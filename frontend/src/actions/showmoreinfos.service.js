import * as actions from './index';
var MoreInfosService = {}

function displayLeftGaugeInfos() {
    return dispatch => {
        dispatch(actions.displayLeftGaugeInfos())
    }
}

function displayMiddleGaugeInfos() {
    return dispatch => {
        dispatch(actions.displayMiddleGaugeInfos())
    }
}
function displayLeftTileInfos() {
    return dispatch => {
        dispatch(actions.displayLeftTileInfos())
    }
}
function displayLeftTileAlerts() {
    return dispatch => {
        dispatch(actions.displayLeftTileAlerts())
    }
}

MoreInfosService.displayMiddleGaugeInfos = displayMiddleGaugeInfos;
MoreInfosService.displayLeftGaugeInfos = displayLeftGaugeInfos;
MoreInfosService.displayLeftTileAlerts = displayLeftTileAlerts;
MoreInfosService.displayLeftTileInfos = displayLeftTileInfos;
export default MoreInfosService
