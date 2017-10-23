import React, {Component} from 'react';
import { connect } from 'react-redux';
import TileElement from '../tile.component';



const mapStateToProps = state => {
  return {value: state.updateTile.retards_norm,
          isGrowing: true,
          notifValue: state.updateTile.retards_dd,
          title: "Retards de Bordereaux"
  }
}

const mapDispatchToProps = dispatch => {
  return {

      }
  }


const MiddleRightTile = connect(
  mapStateToProps,
  mapDispatchToProps
)(TileElement)

export default MiddleRightTile
