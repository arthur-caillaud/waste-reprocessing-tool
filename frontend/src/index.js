import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import akkaApp from './reducers/index.js'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker';

window.store = createStore(akkaApp/*, anEventualInitialState*/);

render((

    <Provider store={window.store}>
        <App />
    </Provider>),
    document.getElementById('root')
);

// Log the initial state
console.log("Store",window.store.getState());

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
let unsubscribe = window.store.subscribe(() =>
  console.log(window.store.getState())
);

registerServiceWorker();
