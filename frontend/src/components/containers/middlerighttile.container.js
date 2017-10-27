import { connect } from 'react-redux';
import TileElement from '../tile.component';
import MoreInfosService from '../../actions/showmoreinfos.service';


const mapStateToProps = state => {
  return {value: state.updateTile.retards_norm,
          isGrowing: state.updateTile.isGrowingMiddleRight,
          notifValue: state.updateTile.retards_dd,
          title: "Retards de Bordereaux"
  }
}

const mapDispatchToProps = dispatch => {
    return {
        onClickTile: () => {
            dispatch(MoreInfosService.displayMiddleRightTileInfos())
        },
        onClickNotif: () => {
            dispatch(MoreInfosService.displayMiddleRightTileAlerts())
        },
    }
}


const MiddleRightTile = connect(
  mapStateToProps,
  mapDispatchToProps
)(TileElement)

export default MiddleRightTile
