import React, { Component } from 'react';

import { Row, Col, Grid } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as apiCalls from '../actions/api_calls';
import LeftGauge from './leftgauge.component';
import MiddleGauge from './middlegauge.component';
import RightGauge from './rightgauge.component';
import Info from './info.component';
import MoreInfosContainer from './containers/moreinfos.container';
import LeftTile from './containers/lefttile.container';
import RightTile from './containers/righttile.container';
import MiddleRightTile from './containers/middlerighttile.container';
import MiddleLeftTile from './containers/middlelefttile.container';
import { persistStore } from 'redux-persist'
import '../styles/general.css';


class DashboardElement extends Component {
    componentDidMount(){

        this.props.getArchitecture()
    
}

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
                  <Col sm={3}> <LeftTile id="dashboard-tile1"/> </Col>
                  <Col sm={3}> <MiddleLeftTile id="dashboard-tile2"/> </Col>
                  <Col sm={3}> <MiddleRightTile id="dashboard-tile3"/> </Col>
                  <Col sm={3}> <RightTile id="dashboard-tile4"/> </Col>
                </Row>
              </Col>
              <Col sm={3}> <MoreInfosContainer/> </Col>
            </Row>
          </Grid>
        </div>
    </div>
    );
  }
}
const mapStateToProps = (state) => {
    return {

    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getNationalState: () => {
            dispatch(apiCalls.updateSite({
                    nom: "National",
                    level: 0,
                    architecture: {
                        nom: null,
                        unite_dependance: null,
                        up_dependance: null,
                        metier_dependance: null
                    }
                }
            ))
        },
        getArchitecture: () => {
            dispatch(apiCalls.getArchitecture())
        }
    }
}
const Dashboard = connect(mapStateToProps, mapDispatchToProps)(DashboardElement)

export default Dashboard;
