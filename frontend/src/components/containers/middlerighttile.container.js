import React, {Component} from 'react';
import { connect } from 'react-redux';
import TileElement from '../tile.component';



const mapStateToProps = state => {
  return {
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
