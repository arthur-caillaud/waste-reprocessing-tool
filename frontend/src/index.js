import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import akkaApp from './reducers/index.js';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const loggerMiddleware = createLogger();
window.store = createStore(akkaApp, composeEnhancers(applyMiddleware(thunkMiddleware)));

render((

    <Provider store={window.store}>
        <App />
    </Provider>),
    document.getElementById('root')
);

// Log the initial state
//console.log("Store",window.store.getState());

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
let unsubscribe = window.store.subscribe(() =>
  {}
);

registerServiceWorker();
