import React, { Component, } from 'react';
import { SplitButton, MenuItem, ButtonToolbar } from 'react-bootstrap';

import '../styles/searchtree.css';

function trimString(string, value, defaultString) {
    return string === '' ? defaultString : string.substring(0, value)+'...';
}

class SearchTreeElement extends Component {


    render() {

        const {
            site,
            unite_dependance,
            up_dependance,
            metier_dependance,
            suggestions,
            onRenderMetierClickHandler,
            onRenderUpClickHandler,
            onRenderUniteClickHandler,
            onRenderSiteClickHandler,
            updateMetier,
            updateUp,
            updateUnite,
            updateSite
        } = this.props;


        /*
        Clicking on the dropdown arrow should display a list of items.
        Clicking on the button is supposed to reset the entire display to one level higher
        */
        var RenderMetier = <SplitButton
                                bsSize="small"
                                bsStyle='default'
                                onClick={onRenderMetierClickHandler}
                                title={trimString(metier_dependance.name, 8, 'National')}
                                key={1}
                                id={1}>
                                {suggestions.metier_dependance.map(function(metier, i){
                                    return <MenuItem eventKey={metier} key={i} onSelect={updateMetier}>{metier.name}</MenuItem>
                                })}
                            </SplitButton>;

        var RenderUp = <SplitButton
                            bsSize="small"
                            bsStyle='default'
                            onClick={onRenderUpClickHandler}
                            title={trimString(up_dependance.name, 8, 'Choix Up')}
                            key={2}
                            id={2}>
                            {suggestions.up_dependance.map(function(up, i){
                                return <MenuItem eventKey={up} key={i} onSelect={updateUp}>{up.name}</MenuItem>
                            })}
                        </SplitButton>;

        var RenderUnite = <SplitButton
                                bsSize="small"
                                bsStyle='default'
                                onClick={onRenderUniteClickHandler}
                                title={trimString(unite_dependance.name, 8, 'ChxUnite')}
                                key={3}
                                id={3}>
                                {suggestions.unite_dependance.map(function(unite, i){
                                    return <MenuItem eventKey={unite} key={i} onSelect={updateUnite}>{unite.name}</MenuItem>
                                })}
                            </SplitButton>;

        var RenderSite = <SplitButton
                            bsSize="small"
                            bsStyle='default'
                            onClick={onRenderSiteClickHandler}
                            title={trimString(site.name, 8, 'Nom Site')}
                            key={4}
                            id={4}>
                            {suggestions.nom.map(function(site, i){
                                return <MenuItem eventKey={site} key={i} onSelect={updateSite}>{site.name}</MenuItem>
                            })}
                        </SplitButton>;

        //We define different renders to display things accordingly

        if (site.name ==="" && unite_dependance.name ==="" && up_dependance.name ==="" && metier_dependance.name ==="") {
            return (
                <div className="searchtree-container">
                    <ButtonToolbar>
                        {RenderMetier}
                    </ButtonToolbar>
                </div>
            )
        } else if (site.name ==="" && unite_dependance.name ==="" && up_dependance.name ==="" && metier_dependance.name!=="") {
            return (
                <div className="searchtree-container">
                    <ButtonToolbar>
                        {RenderMetier}
                        {RenderUp}
                    </ButtonToolbar>
                </div>
            )
        } else if (site.name ==="" && unite_dependance.name ==="" && up_dependance.name!=="" && metier_dependance.name!=="") {
            return (
                <div className="searchtree-container">
                    <ButtonToolbar>
                        {RenderMetier}
                        {RenderUp}
                        {RenderUnite}
                    </ButtonToolbar>
                </div>
            )
        } else {
            return (
                <div className="searchtree-container">
                    <ButtonToolbar>
                        {RenderMetier}
                        {RenderUp}
                        {RenderUnite}
                        {RenderSite}
                    </ButtonToolbar>

                </div>

            )
        }

    }
}


export default SearchTreeElement;
