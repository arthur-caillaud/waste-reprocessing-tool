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

  // forgetPercentage(value) {
  //     if(value.slice(-1) === "%"){
  //         return(
  //             <div className="valueTitle">
  //                 <div style={{position:"relative"}}>
  //                     <span className="value">{value.slice(0,-1)}</span><span className="percentage">%</span>
  //                     {this.getArrow(isGrowing)}
  //                 </div>
  //             </div>
  //         )
  //     }
  //     return(
  //         <div className="valueTitle">
  //             <span className="value">{value}</span>
  //             {this.getArrow(isGrowing)}
  //         </div>
  //     )
  // }

  render() {

      const { value,
          isGrowing,
          notifValue,
          title
      } = this.props;
      var notifCircle = notifValue > 0 ? <span className="notifValue" >{notifValue}</span> : null;


      return (
        <div ref="tile" className="dashboard-tile" >
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
