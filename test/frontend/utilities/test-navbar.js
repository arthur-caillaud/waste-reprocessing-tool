import React from '../../../frontend/node_modules/react';
import ReactDOM from '../../../frontend/node_modules/react-dom';
import { BrowserRouter, Switch, Route } from '../../../frontend/node_modules/react-router-dom';

import { Nav, NavItem } from '../../../frontend/node_modules/react-bootstrap';

import stubRouterContext from '../../stub-router-context';

import {
  renderIntoDocument,
  isCompositeComponent,
  isCompositeComponentWithType,
  scryRenderedDOMComponentsWithClass,
  findRenderedComponentWithType,
  scryRenderedComponentsWithType,
  findAllInRenderedTree,
} from '../../../frontend/node_modules/react-addons-test-utils';
import { expect } from 'chai';

import SiteNavbar from '../../../frontend/src/utilities/navbar.component';

describe("Side Navbar", () => {

    it("should contain a <Nav> element", () => {
      const component = renderIntoDocument(<BrowserRouter><SiteNavbar/></BrowserRouter>);
      const navComponent = findRenderedComponentWithType(component, Nav);
      expect(navComponent).to.be.ok;
    });

    it("should contain 3 <NavItems", () => {
      const component = renderIntoDocument(<BrowserRouter><SiteNavbar/></BrowserRouter>);
      const navItems = scryRenderedComponentsWithType(component, NavItem);
      expect(navItems.length).to.equal(3);
    });

    it("should contain the right links", () => {
      const component = renderIntoDocument(<BrowserRouter><SiteNavbar/></BrowserRouter>);
      const navItems = scryRenderedComponentsWithType(component, NavItem);
      const route1 = navItems[0].props;
      const route2 = navItems[1].props;
      const route3 = navItems[2].props;

      expect(route1.href).to.equal("/");
      expect(route2.href).to.equal("/client");
      expect(route3.href).to.equal("/trash");
      expect(route1.children).to.equal("Dashboard");
      expect(route2.children).to.equal("Prestataire");
      expect(route3.children).to.equal("Déchet");
    })
})
