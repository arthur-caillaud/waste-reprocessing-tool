import 'babel-polyfill';
import React, {Component} from 'react';
import ReactDOM from 'react-dom'
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


class AppProvider extends Component {

  constructor(props) {
    super(props)
    this.state = { rehydrated: false }
  }

  componentWillMount(){
    persistStore(window.store, {}, () => {
        console.log(this.state)
      this.setState({ rehydrated: true })
    })
  }

  render() {
    if(!this.state.rehydrated){
      return <div>Loading...</div>
    }
    return (
      <Provider store={window.store}>
          {()=><App />}
      </Provider>
    )
  }
}

ReactDOM.render(<AppProvider/>, document.getElementById('root'))


// Log the initial state
//console.log("Store",window.store.getState());

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
let unsubscribe = window.store.subscribe(() =>
  {}
);

registerServiceWorker();
