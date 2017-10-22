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
    var i = 0;
    var list = [];
    for (i=0; i<array.length; i++) {
      list.push(<ListGroupItem>{array[i]}</ListGroupItem>);
    }

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
                <Row>
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
                </Row>
              </Col>
              <Col sm={9} smOffset={3}>
                 <GraphTagsPanel
                     searchPlaceholder="Ajouter des prestataires"
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
