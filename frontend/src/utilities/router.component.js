import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import { Provider } from 'react-redux';

import Prestataire from '../components/prestataire.component';
import Dashboard from '../components/dashboard.component';
import Dechet from '../components/dechet.component';

const Root = ({ store }) => (
  <Provider store={store}>
      <Router>
        <div>
          <Route exact path='/' component={Dashboard}/>
          <Route path='/prestataire' component={Prestataire}/>
          <Route path='/dechet' component={Dechet}/>
        </div>
    </Router>
  </Provider>
)



export default Root
