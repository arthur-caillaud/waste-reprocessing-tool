import React, { Component } from 'react';

import * as ArrowUp from 'react-icons/lib/go/arrow-up';
import * as ArrowDown from 'react-icons/lib/go/arrow-down';
import '../styles/tile.css';

class TileElement extends Component {


  getArrow(isGrowing){
      return (
          isGrowing? <ArrowUp className="arrow arrow-up"/> : <ArrowDown className="arrow arrow-down"/>
      );
  }

  render() {

      const { value,
          isGrowing,
          notifValue,
          title,
          onClickNotif,
          onClickTile,
      } = this.props;
      var notifCircle = notifValue > 0 ? <span className="notifValue" onClick={onClickNotif}>{notifValue}</span> : null;


      return (
        <div ref="tile" className="dashboard-tile" onClick={onClickTile}>
          {notifCircle}
          <div className="valueTitle">
              <span className="value">{value}</span>
              {this.getArrow(isGrowing)}
          </div>
          <h5 className="title"> {title}</h5>
        </div>
      );
  }
}

export default TileElement;
