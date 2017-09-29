import React from 'react'
import { render } from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';

import MainRouter from './router.component';

render((
  <div>
    <h2>Main title</h2>
    <BrowserRouter>
      <MainRouter />
    </BrowserRouter>
</div>
), document.getElementById('root'));





registerServiceWorker();
