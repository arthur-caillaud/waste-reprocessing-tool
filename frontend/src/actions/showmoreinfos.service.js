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
function displayMiddleLeftTileInfos() {
    return dispatch => {
        dispatch(actions.displayMiddleLeftTileInfos())
    }
}
function displayMiddleLeftTileAlerts() {
    return dispatch => {
        dispatch(actions.displayMiddleLeftTileAlerts())
    }
}

MoreInfosService.displayMiddleGaugeInfos = displayMiddleGaugeInfos;
MoreInfosService.displayLeftGaugeInfos = displayLeftGaugeInfos;
MoreInfosService.displayMiddleLeftTileInfos = displayMiddleLeftTileInfos;
MoreInfosService.displayMiddleLeftTileAlerts = displayMiddleLeftTileAlerts;
MoreInfosService.displayLeftTileInfos = displayLeftTileInfos;
export default MoreInfosService
