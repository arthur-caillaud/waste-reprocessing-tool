import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import akkaApp from './reducers'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker';

let store = createStore(akkaApp/*, anEventualInitialState*/);

render(

    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// Log the initial state
console.log("Store",store.getState());

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
let unsubscribe = store.subscribe(() =>
  console.log(store.getState())
);

registerServiceWorker();
