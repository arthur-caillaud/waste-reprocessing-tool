import React from 'react'
import { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as apiCalls from '../actions/api_calls';

import MainRouter from '../utilities/router.component';
import LateralMenu from './lateralmenu.component';
import SearchBar from './containers/searchbar.main.container';
import SearchTree from './containers/searchtree.container';

import { Button } from 'react-bootstrap';
import { Glyphicon } from 'react-bootstrap';
import { Nav, NavItem, Navbar } from 'react-bootstrap';

import { Col, Row } from 'react-bootstrap';

import '../styles/general.css';

class AppElement extends Component {
  constructor() {
    super();
    this.state = {
      navBar: true,
    }
  }
  componentDidMount() {

      this.props.getArchitecture();
      this.props.getNationalState();
  }

  render() {

      const location = window.location.href;
      const currentPage = location.split('/')[3];
      let activeKey = "1"
      if (currentPage === "") {
          activeKey = "1";
      }
      else if(currentPage === "prestataire"){
          activeKey = "2";
      }
      else if(currentPage === "dechet"){
          activeKey = "3";
      }


      return (
          <div>
              <BrowserRouter>
                  <div>
                      <Row>
                          <Navbar staticTop>
                          <Nav bsStyle="tabs" justified activeKey={activeKey} onSelect={this.handleSelect}>
                              <NavItem eventKey="1" href="/">Dashboard</NavItem>
                              <NavItem eventKey="2" href="/prestataire">Vision Prestataire</NavItem>
                              <NavItem eventKey="3" href="/dechet">Vision Déchet</NavItem>
                          </Nav>
                          </Navbar>
                      </Row>
                      <Row>
                          <div className="searchbar-container" >
                              <Col sm={6}>
                                  <SearchTree/>
                              </Col>
                              <Col sm={6}>
                                  <SearchBar id="MainSearchBar"/>
                              </Col>
                          </div>
                      </Row>
                      <Row className="row-eq-height">
                          <Col sm={12}>
                              <MainRouter className="main-container" />
                          </Col>
                      </Row>
                  </div>
              </BrowserRouter>
          </div>
  )
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
const App = connect(mapStateToProps, mapDispatchToProps)(AppElement)

export default App;
