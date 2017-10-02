import React from 'react'
import { render } from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';

import MainRouter from './utilities/router.component';
import Navbar from './utilities/navbar.component';

import { Col, Row } from 'react-bootstrap';

render((
  <div>
    <BrowserRouter>
      <div>
        <Row>
          <Col sm={2}> <Navbar /> </Col>
          <Col sm={8}> <MainRouter /> </Col>
        </Row>
      </div>
    </BrowserRouter>
</div>
), document.getElementById('root'));





registerServiceWorker();
