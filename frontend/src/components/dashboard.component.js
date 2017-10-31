import React, { Component } from 'react';

import { Row, Col, Grid } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as apiCalls from '../actions/api_calls';
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


class DashboardElement extends Component {
    componentDidMount(){

        this.props.getArchitecture()
        this.props.getNationalState()

}

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
                    real_level:0,
                    architecture: {
                        nom: {name: "", real_level:0},
                        unite_dependance: {name: "", real_level:0},
                        up_dependance: {name: "", real_level:0},
                        metier_dependance: {name: "", real_level:0}
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
