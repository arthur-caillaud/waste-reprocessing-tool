import React, { Component, } from 'react';

class Gauge extends Component {
  constructor(props) {
    super();
    this.state = {
      text: props.number,
    }
  }

  render() {
    return (
      <div>
        <h2>Gauge {this.state.text}</h2>
      </div>
    )
  }
}

export default Gauge;
