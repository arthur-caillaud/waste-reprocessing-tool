import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import {persistStore, autoRehydrate } from 'redux-persist';
import {REHYDRATE} from 'redux-persist/constants';
import {SAVE_ARCHITECTURE} from './actions';
import createActionBuffer from 'redux-action-buffer';
import akkaApp from './reducers/index.js';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
window.store = composeEnhancers(autoRehydrate(), applyMiddleware(thunkMiddleware, createActionBuffer(REHYDRATE, SAVE_ARCHITECTURE)))(createStore)(akkaApp)
persistStore(window.store).purge();
render((
    <Provider store={window.store}>
        <App/>
    </Provider>),
    document.getElementById('root')
);
registerServiceWorker();
