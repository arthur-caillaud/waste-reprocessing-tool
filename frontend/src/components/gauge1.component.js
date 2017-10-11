import React, { Component, } from 'react';
import '../styles/containers.css';
import GaugeJSX from './jsxelements/gauge1.js';


const styles = {
  width   : 200,
  height  : 200,
  padding : 2,

};


class Gauge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 87,
            valueBefore: 90,
        }
    }

    getInfoForSiteChange() {
        const main = this;
        fetch('someURL')
            .then(results => {
                results.json();
                this.setState({
                    value: 82,
                })
            })
    }

      render() {
        return (
            <div>
                <h2>{this.props.title}</h2>
            <GaugeJSX {...styles} value={this.state.value} valueBefore={this.state.valueBefore} />
          </div>
      )

      }
}

export default Gauge;
