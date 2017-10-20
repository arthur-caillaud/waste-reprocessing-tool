import React, {Component} from 'react';
import { connect } from 'react-redux';
import Tile from '../tile.component';



const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = dispatch => {
  return {

      }
  }


const ReduxTile = connect(
  mapStateToProps,
  mapDispatchToProps
)(Tile)

export default ReduxTile
