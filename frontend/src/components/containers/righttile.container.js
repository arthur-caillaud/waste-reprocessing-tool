import React, {Component} from 'react';
import { connect } from 'react-redux';
import TileElement from '../tile.component';



const mapStateToProps = state => {
  return {value: state.updateTile.incoherences_filieres_norm,
          isGrowing: true,
          notifValue: state.updateTile.incoherences_filieres_dd,
          title: "Incohérences Filières"
  }
}

const mapDispatchToProps = dispatch => {
  return {

      }
  }


const RightTile = connect(
  mapStateToProps,
  mapDispatchToProps
)(TileElement)

export default RightTile
