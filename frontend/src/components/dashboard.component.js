import React, { Component } from 'react';

import { Row, Col, Grid } from 'react-bootstrap';

import LeftGauge from './leftgauge.component';
import MiddleGauge from './middlegauge.component';
import RightGauge from './rightgauge.component';
import Info from './info.component';
import Tile from './tile.component';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <div>
          <Grid fluid>
            <Row className="show-grid">

              <Col sm={3}> <LeftGauge/> </Col>
              <Col sm={3}> <MiddleGauge/> </Col>
              <Col sm={3}> <RightGauge/> </Col>

              <Col sm={3}> <Info paragraphs="1" /> </Col>
            </Row>


            <Row className="show-grid">
              <Col sm={9}>
                <Row>
                  <Col sm={3}> <Tile id="dashboard-tile1" title="Ecarts de pesée relevés" value="6" isGrowing={true} /> </Col>
                  <Col sm={3}> <Tile id="dashboard-tile2" title="Incohérences filières" value="7" isGrowing={true} notifValue="2"/> </Col>
                  <Col sm={3}> <Tile id="dashboard-tile3" title="Bordereaux de retour en retard" value="11" isGrowing={false} notifValue="4"/> </Col>
                  <Col sm={3}> <Tile id="dashboard-tile4" title="Bordereaux en filière interdite" value="4" isGrowing={true}/> </Col>
                </Row>
                <Row className="show-grid">
                  <Col sm={3}> <Tile id="dashboard-tile5" title="Prestataire perf" value="+30%" isGrowing={true}/> </Col>
                  <Col sm={3}> <Tile id="dashboard-tile6" title="Prestataire perf" value="+20%" isGrowing={false}/> </Col>
                  <Col sm={3}> <Tile id="dashboard-tile7" title="Prestataire perf" value="-10%" isGrowing={false}/> </Col>
                  <Col sm={3}> <Tile id="dashboard-tile8" title="Prestataire perf" value="+5%" isGrowing={false}/> </Col>
                </Row>
              </Col>
              <Col sm={3}> <Info paragraphs="2" /> </Col>
            </Row>

          </Grid>
        </div>
    </div>
    );
  }
}

export default Dashboard;
