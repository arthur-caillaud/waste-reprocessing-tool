import React, { Component } from 'react';

import { Row, Col, Grid } from 'react-bootstrap';
import LeftGauge from './leftgauge.component';
import MiddleGauge from './middlegauge.component';
import RightGauge from './rightgauge.component';
import MoreInfosContainer from './containers/moreinfos.container';
import LeftTile from './containers/lefttile.container';
import RightTile from './containers/righttile.container';
import MiddleRightTile from './containers/middlerighttile.container';
import MiddleLeftTile from './containers/middlelefttile.container';
import '../styles/general.css';

import grenouille from '../resources/grenouille-edf.png';


class Dashboard extends Component {


  render() {
    return (
      <div>
        <div>
          <Grid fluid>
              <Row>
                  <Col sm={9}>
                    <Row>
                        <div className="row show-grid">
                            <Col sm={4}> <LeftGauge/> </Col>
                            <Col sm={4}> <MiddleGauge/> </Col>
                            <Col sm={4}> <RightGauge/> </Col>
                        </div>


                    </Row>
                    <Row>
                        <div className="row show-grid-tiles">
                            <Col sm={3}> <LeftTile id="dashboard-tile1"/> </Col>
                            <Col sm={3}> <MiddleLeftTile id="dashboard-tile2"/> </Col>
                            <Col sm={3}> <MiddleRightTile id="dashboard-tile3"/> </Col>
                            <Col sm={3}> <RightTile id="dashboard-tile4"/> </Col>
                        </div>

                    </Row>
                </Col>
                <Col sm={3} className="right-col">
                    <Row>
                        <Col sm={12}>
                            <div className="grenouille-logo-wrapper">
                                <img className="grenouille-logo" src={grenouille} alt=""/>
                            </div>
                        </Col>
                        <Col sm={12}>
                            <MoreInfosContainer/>
                        </Col>
                    </Row>
                </Col>
            </Row>
          </Grid>
        </div>
    </div>
    );
  }
}

export default Dashboard;
