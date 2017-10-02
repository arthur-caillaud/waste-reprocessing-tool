import React from 'react'
import { render } from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';

import MainRouter from './utilities/router.component';
import Navbar from './utilities/navbar.component';

render((
  <div>
    <BrowserRouter>
      <div>
        <Navbar />
        <MainRouter />
      </div>
    </BrowserRouter>
</div>
), document.getElementById('root'));





registerServiceWorker();
