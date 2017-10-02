import React, { Component } from 'react';

import { Row, Col } from 'react-bootstrap';

import Gauge from './gauge.component';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <div>
          <h2>Dashboard</h2>
        </div>
        <div>
          <Row>
            <Col sm={3}> <Gauge number="1" /></Col>
            <Col sm={3}> <Gauge number="2" /></Col>
            <Col sm={3}> <Gauge number="3" /></Col>
          </Row>
        </div>
    </div>
    );
  }
}

export default Dashboard;
