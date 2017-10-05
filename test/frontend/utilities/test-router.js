import React from '../../../frontend/node_modules/react';
import ReactDOM from '../../../frontend/node_modules/react-dom';
import { BrowserRouter, Switch, Route } from '../../../frontend/node_modules/react-router-dom';

import {
  renderIntoDocument,
  isCompositeComponent,
  isCompositeComponentWithType,
  scryRenderedDOMComponentsWithTag,
  findRenderedComponentWithType,
  scryRenderedComponentsWithType,
  findAllInRenderedTree,
} from '../../../frontend/node_modules/react-addons-test-utils';
import { expect } from 'chai';

import MainRouter from '../../../frontend/src/utilities/router.component';

describe('MainRouter', () => {

    it("should contain a <Switch>", () => {
      const component = renderIntoDocument(
        <BrowserRouter><MainRouter/></BrowserRouter>
      );
      const result = findRenderedComponentWithType(component, Switch);
      expect(result).to.be.ok;
    });

    it("should contain 3 <Route>", () => {
      const component = renderIntoDocument(
        <BrowserRouter><MainRouter/></BrowserRouter>
      );
      const mainSwitch = findRenderedComponentWithType(component, Switch);
      const routes = mainSwitch.props.children;
      expect(routes.length).to.equal(3);
    });

    it("should contain the wanted routes", () => {
      const component = renderIntoDocument(
        <BrowserRouter><MainRouter/></BrowserRouter>
      );
      const mainSwitch = findRenderedComponentWithType(component, Switch);
      const routes = mainSwitch.props.children;
      const route1 = routes[0].props.path;
      const route2 = routes[1].props.path;
      const route3 = routes[2].props.path;
      const exact = routes[0].props.exact;

      expect(route1).to.equal('/');
      expect(route2).to.equal('/client');
      expect(route3).to.equal('/trash');
      expect(exact).to.equal(true);
    });
});
