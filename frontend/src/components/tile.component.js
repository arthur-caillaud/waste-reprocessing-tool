import React, { Component } from 'react';

import * as ArrowUp from 'react-icons/lib/go/arrow-up';
import * as ArrowDown from 'react-icons/lib/go/arrow-down';
import '../styles/tile.css';

class Tile extends Component {

  constructor(props) {
    super();
    this.state = {
      title: props.title,
      value: props.value,
      isGrowing: props.isGrowing,
      notifValue: props.notifValue,
      icon: props.icon,
    };
  }

  getArrow(isGrowing){
      return (
          this.state.isGrowing? <ArrowUp className="arrow arrow-up"/> : <ArrowDown className="arrow arrow-down"/>
      );
  }

  forgetPercentage(value) {
      if(value.slice(-1) === "%"){
          return(
              <div className="valueTitle">
                  <div style={{position:"relative"}}>
                      <span className="value">{this.state.value.slice(0,-1)}</span><span className="percentage">%</span>
                      {this.getArrow(this.state.isGrowing)}
                  </div>
              </div>
          )
      }
      return(
          <div className="valueTitle">
              <span className="value">{this.state.value}</span>
              {this.getArrow(this.state.isGrowing)}
          </div>
      )
  }

  render() {
      var notifCircle = this.state.notifValue > 0 ? <span className="notifValue" onClick={this.props.onNotifClick(this.props.id)}>{this.state.notifValue}</span> : null;
      var value = this.forgetPercentage(this.state.value);

      return (
        <div ref="tile" className="dashboard-tile" onClick={this.props.onTileClick(this.props.id)}>
          {notifCircle}
          {value}
          <h5 className="title"> {this.state.title}</h5>
        </div>
      );
  }
}

export default Tile;
