import React, { Component, } from 'react';
import { connect } from "react-redux";
import * as actions from '../actions';

import '../styles/searchtree.css';

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

class SearchTreeElement extends Component {
    render() {
        const {
            nom,
            site_production,
            unite_dependance,
            up_dependance,
            metier_dependance,
            id
        } = this.props;


        return (
            <div></div>

        )
    }
}

const SearchTree = connect(mapStateToProps, mapDispatchToProps)(SearchTreeElement);
export default SearchTree;
