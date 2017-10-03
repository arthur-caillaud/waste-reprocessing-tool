import React, { Component } from 'react';

import { Row, Col, Grid } from 'react-bootstrap';

import Gauge from './gauge.component';
import Info from './info.component';
import Tile from './tile.component';
import LocationNavigation from '../utilities/location-navigation.component';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <div>
          <LocationNavigation/>
          <h2>Dashboard</h2>
        </div>
        <div>
          <Grid fluid>
            <Row className="show-grid">
              <Col sm={3}> <Gauge number="1" /> </Col>
              <Col sm={3}> <Gauge number="2" /> </Col>
              <Col sm={3}> <Gauge number="3" /> </Col>
              <Col sm={3}> <Info paragraphs="1" /> </Col>
            </Row>
            <Row className="show-grid">
              <Col sm={8}>
                <Row>
                  <Col sm={3}> <Tile title="Hellow" /> </Col>
                  <Col sm={3}> <Tile title="Hellow" /> </Col>
                  <Col sm={3}> <Tile title="Hellow" /> </Col>
                  <Col sm={3}> <Tile title="Hellow" /> </Col>
                </Row>
                <Row className="show-grid">
                  <Col sm={3}> <Tile title="Hellow" /> </Col>
                  <Col sm={3}> <Tile title="Hellow" /> </Col>
                  <Col sm={3}> <Tile title="Hellow" /> </Col>
                  <Col sm={3}> <Tile title="Hellow" /> </Col>
                </Row>
              </Col>
              <Col sm={4}> <Info paragraphs="2" /> </Col>
            </Row>

          </Grid>
        </div>
    </div>
    );
  }
}

export default Dashboard;
