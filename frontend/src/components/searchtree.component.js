import React, { Component, } from 'react';
import { SplitButton, MenuItem } from 'react-bootstrap';

import '../styles/searchtree.css';

function trimString(string, value) {
    return string.substring(0, value);
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

        if (nom) {
        return (
            <div className="searchtree-container">
                <SplitButton bsSize="xsmall" bsStyle='default' title={trimString(metier_dependance, 7)} key={4}>
                    <MenuItem eventKey="1">Action</MenuItem>
                </SplitButton>
                <SplitButton bsSize="xsmall" bsStyle='default' title={trimString(up_dependance, 7)} key={5}>
                    <MenuItem eventKey="1">Action</MenuItem>
                </SplitButton>



            </div>

        )
    } else {
        return (
            <div></div>
        )
    }
    }
}


export default SearchTreeElement;
