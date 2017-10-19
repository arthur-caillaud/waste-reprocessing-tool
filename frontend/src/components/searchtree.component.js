import React, { Component, } from 'react';


import '../styles/searchtree.css';



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
            <div className="searchtree-container">
                <p>SearchTreeContainer</p>
            </div>

        )
    }
}


export default SearchTreeElement;
