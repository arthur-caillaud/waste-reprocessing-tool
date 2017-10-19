import React, { Component } from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

import { array } from '../utilities/text-generator.component';

//import PrestataireSearchBar from './search.component';
import Histogram from '../components/histogram.component';
import InputGraphPanel from '../components/inputgraphpanel.component';

class Prestataire extends Component {
  render() {
    var i = 0;
    var list = [];
    for (i=0; i<array.length; i++) {
      list.push(<ListGroupItem>{array[i]}</ListGroupItem>);
    }

    return (
      <div>
          <Grid fluid>
            <Row>
              <Col sm={2}>
                <InputGraphPanel onClick={() => {alert("Element clicked")}} inputArray={[{nom: "VEOLIA"},{nom: "EDF"},{nom: "ARCELOR MITTAL"},
                {nom:"SOCIETE MARTINIQUAISE DE VALORISATION"},{nom:"NOVERGIE (VEDENE)"},{nom:"SAICA"}]}/>
              </Col>
              <Col sm={10}>
                <Row>
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
                </Row>
              </Col>
            </Row>
            <Row>
                <Col sm={4}>
                    <div>
                        Searchbar
                    </div>
                </Col>
                <Col sm={8}>
                    Fouzy les tags ici
                </Col>
            </Row>
          </Grid>
    </div>
    );
  }
}

export default Prestataire;
