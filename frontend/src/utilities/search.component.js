import React, { Component, } from 'react';

import { Form, FormControl, FormGroup, InputGroup } from 'react-bootstrap';
import { Glyphicon } from 'react-bootstrap';

class SearchBar extends Component {

  constructor() {
    super();
    this.state = {
      placeholder: "Default search"
    }
  }

  updateParent(newState) {
    this.setState(newState);
  }

  render() {
    return (
      <Form>
        <FormGroup controlId="searchClient">
          <InputGroup>
            <FormControl type="text" placeholder={this.state.placeholder} />
            <InputGroup.Addon>
              <Glyphicon glyph="search"/>
            </InputGroup.Addon>
          </InputGroup>
        </FormGroup>
      </Form>
    )
  }
}

export default SearchBar;
