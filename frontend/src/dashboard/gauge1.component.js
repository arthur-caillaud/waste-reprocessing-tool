import React, { Component, } from 'react';
import d3 from 'd3';
import '../styles/containers.css';
import GaugeJSX from './jsxelements/gauge1.jsx';


const styles = {
  width   : 150,
  height  : 200,
  padding : 2,

};



class Gauge extends Component {
      render() {
        return (
            <div>
                <h2>{this.props.title}</h2>
                <GaugeJSX {...styles} />
          </div>
      )

      }
}

export default Gauge;
