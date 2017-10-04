import React, { Component, } from 'react';
import d3 from 'd3';
import '../styles/containers.css';


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
        <div className="svg-container">
          <svg className="svg-content">

          </svg>
        </div>
      </div>
    )
  }
}

export default Gauge;
