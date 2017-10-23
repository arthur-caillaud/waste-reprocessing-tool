import React, {Component} from 'react';
import { connect } from 'react-redux';
import TileElement from '../tile.component';



const mapStateToProps = state => {
    return {value: state.updateTile.ecarts_pesee,
            isGrowing: true,
            notifValue: 0,
            title: "Ecarts de Pesée"
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
