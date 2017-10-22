import React, {Component} from 'react';
import { connect } from 'react-redux';
import TileElement from '../tile.component';



const mapStateToProps = state => {
    return {value: 12,
            isGrowing: true,
            notifValue: 1,
            title: "lol"
    }
}

const mapDispatchToProps = dispatch => {
    return {

    }
}


const LeftTile = connect(
  mapStateToProps,
  mapDispatchToProps
)(TileElement)

export default LeftTile
