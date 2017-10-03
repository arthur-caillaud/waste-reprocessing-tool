import React, { Component } from 'react';

import { sentence } from '../utilities/text-generator.component'

class Tile extends Component {

  constructor(props) {
    super();
    this.state = {
      title: props.title,
    };
  }

  render() {
    return (
      <div>
        <h2> { this.state.title } </h2>
        <div> { sentence } </div>
      </div>
    )
  }
}

export default Tile;
