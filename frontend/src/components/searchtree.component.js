import React, { Component, } from 'react';
import { SplitButton, MenuItem, ButtonToolbar } from 'react-bootstrap';

import '../styles/searchtree.css';

function trimString(string, value, defaultString) {

    return string == null ? defaultString : string.substring(0, value)+'...';
}

class SearchTreeElement extends Component {


    render() {

        const {
            site,
            unite_dependance,
            up_dependance,
            metier_dependance,
            id,
            suggestions,
            onRenderMetierClickHandler,
            onRenderUpClickHandler,
            onRenderUniteClickHandler,
            onRenderSiteClickHandler,
            updateMetier
        } = this.props;

        /*
        Clicking on the dropdown arrow should display a list of items.
        Clicking on the button is supposed to reset the entire display to one level higher
        */
        var RenderMetier = <SplitButton
                                bsSize="small"
                                bsStyle='default'
                                onClick={onRenderMetierClickHandler}
                                title={trimString(metier_dependance, 8, 'National')}
                                key={1}>
                                <MenuItem eventKey="SEI" onSelect={updateMetier}>SEI</MenuItem>
                                <MenuItem eventKey="ENEDIS" onSelect={updateMetier}>ENEDIS</MenuItem>
                                <MenuItem eventKey="DPN" onSelect={updateMetier}>DPN</MenuItem>
                                <MenuItem eventKey="DPIH" onSelect={updateMetier}>DPIH</MenuItem>
                                <MenuItem eventKey="DPIT" onSelect={updateMetier}>DPIT</MenuItem>
                                <MenuItem eventKey="DIPNN" onSelect={updateMetier}>DIPNN</MenuItem>
                            </SplitButton>;

        var RenderUp = <SplitButton
                            bsSize="small"
                            bsStyle='default'
                            onClick={onRenderUpClickHandler}
                            title={trimString(up_dependance, 8, 'Choix Up')}
                            key={2}>
                            <MenuItem eventKey="1">Action</MenuItem>
                        </SplitButton>;

        var RenderUnite = <SplitButton
                                bsSize="small"
                                bsStyle='default'
                                onClick={onRenderUniteClickHandler}
                                title={trimString(unite_dependance, 8, 'ChxUnite')}
                                key={3}>
                                <MenuItem eventKey="1">Action</MenuItem>
                            </SplitButton>;

        var RenderSite = <SplitButton
                            bsSize="small"
                            bsStyle='default'
                            onClick={onRenderSiteClickHandler}
                            title={trimString(site, 8, 'Nom Site')}
                            key={4}>
                            <MenuItem eventKey="1">Action</MenuItem>
                        </SplitButton>;

        //We define different renders to display things accordingly

        if (site ==null && unite_dependance==null && up_dependance==null && metier_dependance==null) {
            return (
                <div className="searchtree-container">
                    <ButtonToolbar>
                        {RenderMetier}
                    </ButtonToolbar>
                </div>
            )
        } else if (site ==null && unite_dependance==null && up_dependance==null && metier_dependance!=null) {
            return (
                <div className="searchtree-container">
                    <ButtonToolbar>
                        {RenderMetier}
                        {RenderUp}
                    </ButtonToolbar>
                </div>
            )
        } else if (site ==null && unite_dependance==null && up_dependance!=null && metier_dependance!=null) {
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
