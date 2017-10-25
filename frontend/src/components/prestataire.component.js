import React, { Component } from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

import { array } from '../utilities/text-generator.component';

import Histogram from '../components/containers/histogram.container';
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
                    onLoadActionName="loadDechetsConsideringChosenPrestataire"
                    onSearchActionName="updatePrestatairePanelSearchbarInput"
                    loadGraphValuesActionName="loadPrestataireGraphValues"
                    branchName="updatePrestataireSelectionPanel"
                    searchPlaceholder="Rechercher un prestataire"
                    emptyContainerMessage="Aucun prestataire trouvé à cette échelle"
                    cleanActionName="cleanDechetsChosenTagsArray"
                />
              </Col>
              <Col sm={9}>
                <Histogram
                    branchName="prestataireGraphOptions"
                    idGraph="prestataire-histogram-graph"
                />
              </Col>
              <Col sm={9} smOffset={3}>
                 <GraphTagsPanel
                     searchPlaceholder="Ajouter des déchets pour ce prestataire"
                     branchName="updatePrestataireGraphTagsPanel"
                     idInputPanel="dechet-tag-panel"
                     onClickActionName="addPrestataireGraphTag"
                     onRemoveActionName="removePrestataireGraphTag"
                     onLoadActionName="loadDechetsConsideringChosenPrestataire"
                     inputGraphPanelBranch="updatePrestataireSelectionPanel"
                     defaultOnLoadActionName="loadDechetList"
                     emptyContainerMessage="Aucun déchet pour ce prestataire"
                     loadGraphValuesActionName="loadPrestataireGraphValues"
                />
              </Col>
            </Row>
          </Grid>
    </div>
    );
  }
}

export default Prestataire;
