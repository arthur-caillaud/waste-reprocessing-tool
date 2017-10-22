import React, { Component } from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

import { array } from '../utilities/text-generator.component';

import Histogram from '../components/histogram.component';
import InputGraphPanel from '../components/containers/inputgraphpanel.container';
import GraphTagsPanel from '../components/containers/graphtagspanel.container';

class Dechet extends Component {

  render() {

    return (
      <div>
        <div>
          <Grid fluid>
            <Row>
                <Col sm={3}>
                    <InputGraphPanel
                        idInputPanel="dechet-selection-panel"
                        onClickActionName="updateSelectedDechet"
                        onLoadActionName="loadDechetList"
                        onSearchActionName="updateDechetPanelSearchbarInput"
                        branchName="updateDechetSelectionPanel"
                        searchPlaceholder="Rechercher un déchet"
                    />
                </Col>
                <Col sm={9}>
                    <Histogram title="EMBALLAGE PAPIER-CARTON" id="dechet-hist" values={[{
                        title: 'Taux de valorisation global',
                        keys: ['VEOLIA','GLOBAL','REGIONAL'],
                        values: [78,82,73]
                    },{
                        title: 'Fer et acier',
                        keys: ['VEOLIA','GLOBAL','REGIONAL'],
                        values: [54,65,43]
                    },{
                        title: 'Carton',
                        keys: ['VEOLIA','GLOBAL','REGIONAL'],
                        values: [90,95,86]
                    },{
                        title: "Aluminium",
                        keys: ['VEOLIA','GLOBAL','REGIONAL'],
                        values: [10,65,90]
                    },{
                        title: "Déchets dangereux",
                        keys: ['VEOLIA','GLOBAL','REGIONAL'],
                        values: [30,40,33]
                    }]}/>
                </Col>
                <Col sm={9} smOffset={3}>
                     <GraphTagsPanel
                         searchPlaceholder="Ajouter des prestataires pour ce déchet"
                         branchName="updateDechetGraphTagsPanel"
                         idInputPanel="prestataire-tag-panel"
                         onClickActionName="addDechetGraphTag"
                         onRemoveActionName="removeDechetGraphTag"
                         onLoadActionName="loadPrestatairesConsideringChosenDechet"
                    />
                </Col>
            </Row>
        </Grid>
        </div>
    </div>
    );
  }
}

export default Dechet;
