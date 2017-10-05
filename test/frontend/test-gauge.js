import React from '../../frontend/node_modules/react';
import {
  renderIntoDocument,
  findRenderedDOMComponentWithClass
} from '../../frontend/node_modules/react-addons-test-utils';
import { expect } from 'chai';

import Gauge from '../../frontend/src/dashboard/gauge.component';

describe('Gauge', () => {

    it('should render a <div> with a <svg> inside, class "svg-content"', () => {
        const component = renderIntoDocument(
          <Gauge/>
        );
        const element = findRenderedDOMComponentWithClass(component, "svg-content");
        expect(element).to.be.ok;
    });
});
