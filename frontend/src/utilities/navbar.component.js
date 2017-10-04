import React, { Component } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import '../styles/navBar.css';

class SiteNavbar extends Component {
  constructor() {
    super();
    this.state = {
      hidden: false,
    };
  }

  toggleBar() {
    var hidden = this.state.hidden;
    this.setState({hidden: !hidden});
  }

  render() {
    console.log(this.state.hidden);
    return (
      <div>
          <h3> Navigation </h3>
          <Nav bsStyle="pills" stacked activeHref={this.props.location.pathname}>
            <NavItem eventKey={1} href="/">Dashboard</NavItem>
            <NavItem eventKey={2} href="/client">Prestataire</NavItem>
            <NavItem eventKey={3} href="/trash">Déchet</NavItem>
          </Nav>
      </div>
    );
  }
}

export default withRouter(SiteNavbar);
