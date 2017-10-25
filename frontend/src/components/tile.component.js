import React, { Component } from 'react';
import HelperService from '../actions/service';
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
      var notifCircle = notifValue > 0 ? (<div>
          <span className="notifValue" onClick={onClickNotif}>{HelperService.trimAbove99(notifValue)}</span>
          <span className="notifDD"onClick={onClickNotif}>DD</span>
      </div>
  ) : null;


      return (
        <div>
          {notifCircle}
          <div ref="tile" className="dashboard-tile" onClick={onClickTile}>
          <div className="valueTitle">
              <span className="value">{value}</span>
              {this.getArrow(isGrowing)}
          </div>
          <h5 className="title"> {title}</h5>
      </div>
        </div>
      );
  }
}

export default TileElement;
