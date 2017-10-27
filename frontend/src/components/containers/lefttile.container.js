import { connect } from 'react-redux';
import TileElement from '../tile.component';
import MoreInfosService from '../../actions/showmoreinfos.service';



const mapStateToProps = state => {
    return {value: state.updateTile.ecarts_pesee,
            isGrowing: state.updateTile.isGrowingLeft,
            notifValue: 0,
            title: "Ecarts de Pesée"
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onClickTile: () => {
            dispatch(MoreInfosService.displayLeftTileInfos())
        }
    }
}


const LeftTile = connect(
  mapStateToProps,
  mapDispatchToProps
)(TileElement)

export default LeftTile
