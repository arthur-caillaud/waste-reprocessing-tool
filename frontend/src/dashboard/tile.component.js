import React, { Component } from 'react';

import * as ArrowUp from 'react-icons/lib/go/arrow-up';
import * as ArrowDown from 'react-icons/lib/go/arrow-down';
import '../styles/dashboard.tile.css';

class Tile extends Component {

  constructor(props) {
    super();
    this.state = {
      title: props.title,
      value: props.value,
      isGrowing: props.isGrowing,
      notifValue: props.notifValue,
      height: props.height,
      icon: props.icon,
    };
  }

  render() {
      var arrow = this.state.isGrowing? <ArrowUp className="arrow arrow-up"/> : <ArrowDown className="arrow arrow-down"/>;
      var notifCircle = this.state.notifValue > 0 ? <span className="notifValue">{this.state.notifValue}</span> : null;

      return (
        <div className="dashboard-tile">
          {notifCircle}
          <p className="value">{this.state.value}</p>
          {arrow}
          <h5 className="title"> {this.state.title}</h5>
        </div>
      );
  }
}

export default Tile;
