import React, { Component } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class Navbar extends Component {

  render() {
    return (
      <div>
        <div>
          <h2>Navbar</h2>
        </div>
        <Nav bsStyle="pills" stacked='true' activeHref={this.props.location.pathname}>
          <NavItem eventKey={1} href="/">Dashboard</NavItem>
          <NavItem eventKey={2} href="/client">Prestataire</NavItem>
          <NavItem eventKey={3} href="/trash">Déchet</NavItem>
        </Nav>
      </div>
    );
  }
}

export default withRouter(Navbar);
