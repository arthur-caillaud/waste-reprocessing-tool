import React, { Component, } from 'react';
import '../styles/containers.css';


const styles = {
  width   : 200,
  height  : 200,
  padding : 2,
  r: 12,
  cx: 30,
  cy: 20,
};



class Gauge extends Component {
      render() {
        return (
            <div>
                <h2>{this.props.title}</h2>

          </div>
      )

      }
}

export default Gauge;
