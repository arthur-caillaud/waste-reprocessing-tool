import React from 'react'
import { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'react-dates/initialize';


import MainRouter from '../utilities/router.component';
import LateralMenu from './lateralmenu.component';
import SearchBar from './containers/searchbar.main.container';
import SearchTree from './containers/searchtree.container';

import { Button } from 'react-bootstrap';
import { Glyphicon } from 'react-bootstrap';
import { Nav, NavItem, Navbar } from 'react-bootstrap';
import { Col, Row } from 'react-bootstrap';

import { DateRangePicker } from 'react-dates';

import '../styles/general.css';
import 'react-dates/lib/css/_datepicker.css';

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
      if (currentPage === "") {
          activeKey = "1";
      }
      else if(currentPage === "prestataire"){
          activeKey = "2";
      }
      else if(currentPage === "dechet"){
          activeKey = "3";
      }


      return (<div>
              <BrowserRouter>
                  <div>
                      <Row>
                          <Navbar style={{marginBottom: "0"}} staticTop>
                          <Nav bsStyle="tabs" justified activeKey={activeKey} onSelect={this.handleSelect}>
                              <NavItem style={{height: "2vh"}} eventKey="1" href="/">Dashboard</NavItem>
                              <NavItem style={{height: "2vh"}} eventKey="2" href="/prestataire">Vision Prestataire</NavItem>
                              <NavItem style={{height: "2vh"}} eventKey="3" href="/dechet">Vision Déchet</NavItem>
                          </Nav>
                          </Navbar>
                      </Row>
                      <Row>
                          <div className="searchbar-container" >
                              <Col sm={4}>
                                  <SearchTree/>
                              </Col>
                              <Col sm={4}>
                                  <SearchBar id="MainSearchBar"/>
                              </Col>
                              <Col sm={4}>
                                  <DateRangePicker
                                      startDate={this.state.startDate} // momentPropTypes.momentObj or null,
                                      endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                                      onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
                                      focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                                      onFocusChange={focusedInput => this.setState({ focusedInput })}
                                  />
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
          </div>)
  }
}



export default App;
