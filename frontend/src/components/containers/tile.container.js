import React, {Component} from 'react';
import { connect } from 'react-redux';
import Tile from '../tile.component';

import {displayTileInfos, displayTileNotifInfos} from '../../actions'

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = dispatch => {
  return {
      onTileClick: id => {
          displayTileInfos(id);
      },
      onNotifClick: id => {
          displayTileNotifInfos(id);
      }
  }
}

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(Tile)

export default VisibleTodoList
