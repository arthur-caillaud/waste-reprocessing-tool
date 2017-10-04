import React, { Component, } from 'react';
import d3 from 'd3';

class Gauge extends Component {
  constructor(props) {
    super();
    var value = Math.floor(Math.random()*100);
    this.state = {
      title: props.title,
      maxValue: 100,
      value: value,
    }
  }

  render() {
    return (
      <div>
        <h2>Gauge {this.state.title}</h2>
        <svg width="300" height="300" style={{border: "1px solid"}}>

        </svg>
      </div>
    )
  }
}

export default Gauge;
