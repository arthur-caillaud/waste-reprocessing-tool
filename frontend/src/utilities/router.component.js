import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Client from '../client/client.component';
import Dashboard from '../dashboard/dashboard.component';
import Trash from '../trash/trash.component';


const MainRouter = () => (
  <main-router>
    <Switch>
      <Route exact path='/' component={Dashboard}/>
      <Route path='/client' component={Client}/>
      <Route path='/trash' component={Trash}/>
    </Switch>
  </main-router>
)

export default MainRouter
