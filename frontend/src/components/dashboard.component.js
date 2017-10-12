import React, { Component } from 'react';

import { Row, Col, Grid } from 'react-bootstrap';

import Gauge from './gauge.component';
import Info from './info.component';
import Tile from './tile.component';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <div>
          <Grid fluid>
            <Row className="show-grid">
<<<<<<< HEAD:frontend/src/containers/dashboard.component.js
              <Col sm={3}> <Gauge id="leftgauge" title="Valorisation Globale" value={80} valueBefore={85}/> </Col>
              <Col sm={3}> <Gauge id= "middlegauge" title="Valorisation Liste Verte" value={87} valueBefore={85}/> </Col>
              <Col sm={3}> <Gauge id="rightgauge" title="Volume Déchets" value={35} valueBefore={30}/> </Col>
=======
<<<<<<< HEAD:frontend/src/components/dashboard.component.js
              <Col sm={3}> <Gauge id="leftgauge" title="Valorisation Globale" value={80} valueBefore={85}/> </Col>
              <Col sm={3}> <Gauge id= "middlegauge" title="Valorisation Liste Verte" value={87} valueBefore={85}/> </Col>
              <Col sm={3}> <Gauge id="rightgauge" title="Volume Déchets" value={35} valueBefore={30}/> </Col>
=======
              <Col sm={3}> <Gauge title="Valorisation Globale" value={80} valueBefore={85}/> </Col>
              <Col sm={3}> <Gauge title="Valorisation Liste Verte" value={87} valueBefore={85}/> </Col>
              <Col sm={3}> <Gauge title="Volume Déchets" value={35} valueBefore={30}/> </Col>
              <Col sm={3}> <Gauge id="leftgauge" title="Valorisation Globale"/> </Col>
              <Col sm={3}> <Gauge id= "middlegauge" title="Valorisation Liste Verte"/> </Col>
              <Col sm={3}> <Gauge id="rightgauge" title="Volume Déchets"/> </Col>
>>>>>>> e568192165ef44c6aae6562f487205fd932e9b30:frontend/src/containers/dashboard.component.js
>>>>>>> e748d4ad57d68ad09e919b7a4192a5fda0e174f9:frontend/src/components/dashboard.component.js
              <Col sm={3}> <Info paragraphs="1" /> </Col>
            </Row>


            <Row className="show-grid">
              <Col sm={9}>
                <Row>
                  <Col sm={3}> <Tile title="Ecarts de pesée relevés" value="6" isGrowing={true} /> </Col>
                  <Col sm={3}> <Tile title="Incohérences filières" value="7" isGrowing={true} notifValue="2"/> </Col>
                  <Col sm={3}> <Tile title="Bordereaux de retour en retard" value="11" isGrowing={false} notifValue="4"/> </Col>
                  <Col sm={3}> <Tile title="Bordereaux en filière interdite" value="4" isGrowing={true}/> </Col>
                </Row>
                <Row className="show-grid">
                  <Col sm={3}> <Tile title="Prestataire perf" value="+30%" isGrowing={true}/> </Col>
                  <Col sm={3}> <Tile title="Prestataire perf" value="+20%" isGrowing={false}/> </Col>
                  <Col sm={3}> <Tile title="Prestataire perf" value="-10%" isGrowing={false}/> </Col>
                  <Col sm={3}> <Tile title="Prestataire perf" value="+5%" isGrowing={false}/> </Col>
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
