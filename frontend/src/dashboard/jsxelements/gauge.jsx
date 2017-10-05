import React, {Component, }        from 'react';
import d3           from 'd3';


class GaugeJSX extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: props.width,
            height: props.height,
            r: props.r
        }
    }

    render() {
        return <svg width={this.state.width} height={this.state.height}>
          <g><circle r={this.state.r} /> </g>
        </svg>
    }
}

export default GaugeJSX;
