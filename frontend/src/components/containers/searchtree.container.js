import { connect } from "react-redux";
import * as actions from '../../actions';
import SearchTreeElement from '../searchtree.component'

function mapStateToProps(state) {
    return {
        nom: state.updateSearchBar.site.nom,
        site_production: state.updateSearchBar.site.site_production,
        unite_dependance: state.updateSearchBar.site.unite_dependance,
        up_dependance: state.updateSearchBar.site.up_dependance,
        metier_dependance: state.updateSearchBar.site.metier_dependance,
        id: state.updateSearchBar.site.id
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

const SearchTree = connect(mapStateToProps, mapDispatchToProps)(SearchTreeElement);
export default SearchTreeElement;
