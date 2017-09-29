import React, { Component } from 'react';
import { Nav, NavItem, Button } from 'react-bootstrap';

class Navbar extends Component {
  render() {
    return (
      <div>
        <div>
          <h2>Navbar</h2>
        </div>
        <Nav bsStyle="pills" activeKey={1}>
          <NavItem eventKey={1} href="/">Dashboard</NavItem>
          <NavItem eventKey={2} href="/client">Prestataire</NavItem>
          <NavItem eventKey={3} href="/trash">Déchet</NavItem>
        </Nav>
      </div>
    );
  }
}

export default Navbar;

// this comment is useless
