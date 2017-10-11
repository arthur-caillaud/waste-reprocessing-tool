import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Prestataire from '../containers/prestataire.component';
import Dashboard from '../containers/dashboard.component';
import Dechet from '../containers/dechet.component';


const MainRouter = () => (
  <main-router>
    <Switch>
      <Route exact path='/' component={Dashboard}/>
      <Route path='/prestataire' component={Prestataire}/>
      <Route path='/dechet' component={Dechet}/>
    </Switch>
  </main-router>
)

export default MainRouter
