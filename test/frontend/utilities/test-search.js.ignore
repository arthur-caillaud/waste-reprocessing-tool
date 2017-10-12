import React from '../../../frontend/node_modules/react';
import ReactDOM from '../../../frontend/node_modules/react-dom';
import {
  renderIntoDocument,
  isCompositeComponent,
  isCompositeComponentWithType,
  findRenderedDOMComponentWithClass,
  findRenderedComponentWithType,
} from '../../../frontend/node_modules/react-addons-test-utils';
import { expect } from 'chai';

import { Form, FormGroup, FormControl, InputGroup } from '../../../frontend/node_modules/react-bootstrap';

import SearchBar from '../../../frontend/src/utilities/search.component';

describe('Default SearchBar', () => {

    it('should be a composite component', () => {
      const component = renderIntoDocument(
        <SearchBar/>
      );
      const result = isCompositeComponent(component);
      expect(result).to.be.ok;
    });

    it('should contain a <Form>', () => {
      const component = renderIntoDocument(
        <SearchBar/>
      );
      const formElements = findRenderedComponentWithType(component, Form);
      expect(formElements).to.be.ok;
    });

    it('shoud contain a <FormGroup>', () => {
      const component = renderIntoDocument(
        <SearchBar/>
      );
      const formElements = findRenderedComponentWithType(component, FormGroup);
      expect(formElements).to.be.ok;
    });

    it('should contain a <InputGroup>', () => {
      const component = renderIntoDocument(
        <SearchBar/>
      );
      const formElements = findRenderedComponentWithType(component, InputGroup);
      expect(formElements).to.be.ok;
    });

    it('should contain a <FormControl>', () => {
      const component = renderIntoDocument(
        <SearchBar/>
      );
      const formElements = findRenderedComponentWithType(component, FormControl);
      expect(formElements).to.be.ok;
    });

    it('should have a placeholder with the default text', () => {
      const component = renderIntoDocument(
        <SearchBar/>
      );
      const element = findRenderedComponentWithType(component, FormControl);
      const placeholder = ReactDOM.findDOMNode(element).placeholder;
      expect(placeholder).to.equal("Default search");
    });

});
