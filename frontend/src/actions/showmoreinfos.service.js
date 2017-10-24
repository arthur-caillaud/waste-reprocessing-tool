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
function displayMiddleRightTileInfos() {
    return dispatch => {
        dispatch(actions.displayMiddleRightTileInfos())
    }
}
function displayMiddleRightTileAlerts() {
    return dispatch => {
        dispatch(actions.displayMiddleRightTileAlerts())
    }
}
function displayRightTileInfos() {
    return dispatch => {
        dispatch(actions.displayRightTileInfos())
    }
}
function displayRightTileAlerts() {
    return dispatch => {
        dispatch(actions.displayRightTileAlerts())
    }
}

MoreInfosService.displayMiddleGaugeInfos = displayMiddleGaugeInfos;
MoreInfosService.displayLeftGaugeInfos = displayLeftGaugeInfos;
MoreInfosService.displayMiddleLeftTileInfos = displayMiddleLeftTileInfos;
MoreInfosService.displayMiddleLeftTileAlerts = displayMiddleLeftTileAlerts;
MoreInfosService.displayLeftTileInfos = displayLeftTileInfos;
MoreInfosService.displayMiddleRightTileAlerts = displayMiddleRightTileAlerts;
MoreInfosService.displayMiddleRightTileInfos = displayMiddleRightTileInfos;
MoreInfosService.displayRightTileAlerts = displayRightTileAlerts;
MoreInfosService.displayRightTileInfos = displayRightTileInfos;
export default MoreInfosService
