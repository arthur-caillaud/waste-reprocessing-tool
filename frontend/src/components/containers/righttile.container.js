import { connect } from 'react-redux';
import TileElement from '../tile.component';
import MoreInfosService from '../../actions/showmoreinfos.service';



const mapStateToProps = state => {
  return {value: state.updateTile.incoherences_filieres_norm,
          isGrowing: state.updateTile.isGrowingRight,
          notifValue: state.updateTile.incoherences_filieres_dd,
          title: "Incohérences Filières"
  }
}

const mapDispatchToProps = dispatch => {
    return {
        onClickTile: () => {
            dispatch(MoreInfosService.displayRightTileInfos())
        },
        onClickNotif: () => {
            dispatch(MoreInfosService.displayRightTileAlerts())
        },
    }
}


const RightTile = connect(
  mapStateToProps,
  mapDispatchToProps
)(TileElement)

export default RightTile
