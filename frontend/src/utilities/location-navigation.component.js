import React, { Component } from 'react';

import { Nav, NavItem } from 'react-bootstrap';

class LocationNavigation extends Component {
  render() {
    return (
      <Nav bsStyle="pills">
        <NavItem> DPIH </NavItem>
        <NavItem> Unité de production Centre </NavItem>
        <NavItem> GEH Limoge </NavItem>
        <NavItem> Groupement de Maulde-Taurio </NavItem>
      </Nav>
    )
  }
}

export default LocationNavigation;
