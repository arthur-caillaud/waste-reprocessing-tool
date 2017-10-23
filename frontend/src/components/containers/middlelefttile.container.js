import React, {Component} from 'react';
import { connect } from 'react-redux';
import TileElement from '../tile.component';



const mapStateToProps = state => {
  return {value: state.updateTile.filieres_interdites_norm,
          isGrowing: true,
          notifValue: state.updateTile.filieres_interdites_dd,
          title: "Filières Interdites"
  }
}

const mapDispatchToProps = dispatch => {
  return {

      }
  }


const MiddleLeftTile = connect(
  mapStateToProps,
  mapDispatchToProps
)(TileElement)

export default MiddleLeftTile
