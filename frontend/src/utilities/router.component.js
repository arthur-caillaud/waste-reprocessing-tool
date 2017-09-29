import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Client from '../client/client.component';
import Dashboard from '../dashboard/dashboard.component';


const MainRouter = () => (
  <main-router>
    <Switch>
      <Route path='/dashboard' component={Dashboard}/>
      <Route path='/client' component={Client}/>
    </Switch>
  </main-router>
)

export default MainRouter
