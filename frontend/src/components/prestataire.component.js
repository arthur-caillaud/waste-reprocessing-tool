import React, { Component } from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

import { array } from '../utilities/text-generator.component';

import Histogram from '../components/histogram.component';
import InputGraphPanel from '../components/containers/inputgraphpanel.container';
import GraphTagsPanel from '../components/containers/graphtagspanel.container';

class Prestataire extends Component {

  render() {

    return (
      <div>
          <Grid fluid>
            <Row>
              <Col sm={3}>
                <InputGraphPanel
                    idInputPanel="prestataire-selection-panel"
                    onClickActionName="updateSelectedPrestataire"
                    onLoadActionName="loadPrestataireList"
                    onSearchActionName="updatePrestatairePanelSearchbarInput"
                    branchName="updatePrestataireSelectionPanel"
                    searchPlaceholder="Rechercher un prestataire"
                />
              </Col>
              <Col sm={9}>
                <Histogram title="VEOLIA" id="prestataire-hist" values={[{
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
                     searchPlaceholder="Ajouter des déchets pour ce prestataire"
                     branchName="updatePrestataireGraphTagsPanel"
                     idInputPanel="dechet-tag-panel"
                     onClickActionName="addPrestataireGraphTag"
                     onRemoveActionName="removePrestataireGraphTag"
                     onLoadActionName="loadDechetsConsideringChosenPrestataire"
                />
              </Col>
            </Row>
          </Grid>
    </div>
    );
  }
}

export default Prestataire;
