import React from 'react'
import { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

import MainRouter from '../utilities/router.component';
import LateralMenu from './lateralmenu.component';
import SearchBar from './containers/searchbar.main.container';
import SearchTree from './containers/searchtree.container';

import { Button } from 'react-bootstrap';
import { Glyphicon } from 'react-bootstrap';
import { Nav, NavItem } from 'react-bootstrap';

import { Col, Row } from 'react-bootstrap';

import '../styles/general.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      navBar: true,
    }
  }

  render() {

      const location = window.location.href;
      const currentPage = location.split('/')[3];
      let activeKey = "1"
      console.log("location", location);
      console.log("currentPage", currentPage);
      if (currentPage === "") {
          activeKey = "1";
      }
      else if(currentPage === "prestataire"){
          activeKey = "2";
      }
      else if(currentPage === "dechet"){
          activeKey = "3";
      }
      console.log("activeKey",activeKey);

      return (
          <div className="biggest-div">
              <BrowserRouter>
                  <div>
                      <Row className="navbar-container">
                          <Nav bsStyle="tabs" justified activeKey={activeKey} onSelect={this.handleSelect}>
                              <NavItem eventKey="1" href="/">Dashboard</NavItem>
                              <NavItem eventKey="2" href="/prestataire">Vision Prestataire</NavItem>
                              <NavItem eventKey="3" href="/dechet">Vision Déchet</NavItem>
                          </Nav>
                          <div className="searchbar-container" >
                              <SearchBar id="MainSearchBar"/>
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

export default App;
