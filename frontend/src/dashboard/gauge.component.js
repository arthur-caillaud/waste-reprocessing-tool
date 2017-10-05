import React, { Component, } from 'react';
import d3 from 'd3';
import '../styles/containers.css';
import GaugeJSX from './jsxelements/gauge.jsx';


const styles = {
  width   : 200,
  height  : 200,
  padding : 20,
  r: 12,
};



class Gauge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [(12,12)] };
      }

      render() {
        return <div>
          <h2>{this.props.title}</h2>
          <GaugeJSX {...this.state} {...styles} />
          </div>

      }
}

export default Gauge;
