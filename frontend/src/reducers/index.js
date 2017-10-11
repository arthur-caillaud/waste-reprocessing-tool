import { combineReducers } from 'redux'
import {
    CHANGE_SCALE,
    CHANGE_PAGE,
    CHANGE_PRESTATAIRE,
    TOGGLE_TILE_INFOS,
    GraphTypes
} from './actions'

const initialState = {
    pageUrl: '/',
    navScale: {
        hierarchyLevel: 0,
        value: 'DPEH'
    }
}

const akkaApp = combineReducers({
})

export default akkaApp
