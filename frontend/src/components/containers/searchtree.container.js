import { connect } from "react-redux";
import * as actions from '../../actions';
import SearchTreeElement from '../searchtree.component'

function mapStateToProps(state) {
    return {
        nom: state.updateSearchBar.site.architecture.nom,
        unite_dependance: state.updateSearchBar.site.architecture.unite_dependance,
        up_dependance: state.updateSearchBar.site.architecture.up_dependance,
        metier_dependance: state.updateSearchBar.site.architecture.metier_dependance,
        id: state.updateSearchBar.site.id
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

const SearchTree = connect(mapStateToProps, mapDispatchToProps)(SearchTreeElement);
export default SearchTree;
