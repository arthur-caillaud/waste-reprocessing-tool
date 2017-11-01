import React, { Component, } from 'react';
import { MenuItem, ButtonToolbar, DropdownButton, Button } from 'react-bootstrap';

import '../styles/searchtree.css';

function trimString(string, value, defaultString) {
    return (string === '') ? defaultString : ((string.length < value) ? string : string.substring(0, value)+'...');
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
        var NationalButton = (
        <Button
            bsSize="small"
            bsStyle='primary'
            onClick={onRenderMetierClickHandler}
            key={1}
            id={1}>
            National
        </Button>);

        var RenderMetier = (suggestions.metier_dependance.length > 0) ? (
            <DropdownButton
                bsSize="small"
                bsStyle={(metier_dependance.name) ? 'primary' : 'default'}
                onClick={onRenderUpClickHandler}
                title={trimString(metier_dependance.name, 10, 'Choix métier')}
                key={2}
                id={2}>
                {suggestions.metier_dependance.map(function(metier, i){
                    return <MenuItem eventKey={metier} key={i} onSelect={updateMetier}>{metier.name}</MenuItem>
                })}
            </DropdownButton>) : (<div></div>);

        var RenderUp = (suggestions.up_dependance.length > 0) ? (
            <DropdownButton
                bsSize="small"
                bsStyle={(up_dependance.name) ? 'primary' : 'default'}
                onClick={onRenderUniteClickHandler}
                title={trimString(up_dependance.name, 10, 'Choix UP')}
                key={3}
                id={3}>
                {suggestions.up_dependance.map(function(up, i){
                    return <MenuItem eventKey={up} key={i} onSelect={updateUp}>{up.name}</MenuItem>
                })}
            </DropdownButton>) : (<div></div>);

        var RenderUnite = (suggestions.unite_dependance.length > 0) ? (
            <DropdownButton
                bsSize="small"
                bsStyle={(unite_dependance.name) ? 'primary' : 'default'}
                onClick={onRenderSiteClickHandler}
                title={trimString(unite_dependance.name, 10, 'Choix unité')}
                key={4}
                id={4}>
                {suggestions.unite_dependance.map(function(unite, i){
                    return <MenuItem eventKey={unite} key={i} onSelect={updateUnite}>{unite.name}</MenuItem>
                })}
            </DropdownButton>) : (<div></div>);

        var RenderSite = (suggestions.nom.length > 0) ? (
            <DropdownButton
                bsSize="small"
                bsStyle={(site.name) ? 'primary' : 'default'}
                title={trimString(site.name, 18, 'Choix site')}
                key={5}
                id={5}>
                {suggestions.nom.map(function(site, i){
                    return <MenuItem eventKey={site} key={i} onSelect={updateSite}>{site.name}</MenuItem>
                })}
            </DropdownButton>) : (<div></div>);

        //We define different renders to display things accordingly

        if (site.name === "" && unite_dependance.name === "" && up_dependance.name === "" && metier_dependance.name === "") {
            return (
                <div className="searchtree-container">
                    <ButtonToolbar>
                        {NationalButton}
                        {RenderMetier}
                    </ButtonToolbar>
                </div>
            );
        }
        else if (site.name ==="" && unite_dependance.name ==="" && up_dependance.name ==="" && metier_dependance.name!=="") {
            return (
                <div className="searchtree-container">
                    <ButtonToolbar>
                        {NationalButton}
                        {RenderMetier}
                        {RenderUp}
                    </ButtonToolbar>
                </div>
            );
        }
        else if (site.name ==="" && unite_dependance.name ==="" && up_dependance.name!=="" && metier_dependance.name!=="") {
            return (
                <div className="searchtree-container">
                    <ButtonToolbar>
                        {NationalButton}
                        {RenderMetier}
                        {RenderUp}
                        {RenderUnite}
                    </ButtonToolbar>
                </div>
            );
        }
        else{
            return (
                <div className="searchtree-container">
                    <ButtonToolbar>
                        {NationalButton}
                        {RenderMetier}
                        {RenderUp}
                        {RenderUnite}
                        {RenderSite}
                    </ButtonToolbar>
                </div>
            );
        }
    }
}


export default SearchTreeElement;
