import React from 'react'
import { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

import MainRouter from '../utilities/router.component';
import LateralMenu from './lateralmenu.component';
import SearchBar from './searchbar.component';

import { Button } from 'react-bootstrap';
import { Glyphicon } from 'react-bootstrap';

import { Col, Row } from 'react-bootstrap';

import '../styles/general.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      navBar: true,
    }
  }

  toggleNavBar() {
    var navBar = this.state.navBar;
    this.setState({navBar: !navBar});
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Row className="row-eq-height">
              <Col sm={2} hidden={!this.state.navBar} className="navBar">
                <Col sm={10}> <LateralMenu/> </Col>
                <Col sm={2}>
                  <Button bsStyle="primary" onClick={() => this.toggleNavBar()}>
                     <Glyphicon glyph="menu-left"/>
                  </Button>
                </Col>
              </Col>
              <Col sm={1} hidden={this.state.navBar}>
                <Button bsStyle="primary" onClick={() => this.toggleNavBar()}>
                   <Glyphicon glyph="menu-right"/>
                </Button>
              </Col>
              <Col sm={10}>
                  <SearchBar/>
                  <MainRouter/>
              </Col>
            </Row>
          </div>
        </BrowserRouter>
      </div>
  )
  }
}

export default App;
