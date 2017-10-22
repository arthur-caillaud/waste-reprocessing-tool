import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'


import Prestataire from '../components/prestataire.component';
import Dashboard from '../components/dashboard.component';
import Dechet from '../components/dechet.component';

const Root = () => (

      <Router>
        <div className="main-app">
          <Route exact path='/' component={Dashboard}/>
          <Route path='/prestataire' component={Prestataire}/>
          <Route path='/dechet' component={Dechet}/>
        </div>
    </Router>

)

export default Root
