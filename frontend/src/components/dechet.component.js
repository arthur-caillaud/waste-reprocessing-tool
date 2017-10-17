import React, { Component } from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

import { array } from '../utilities/text-generator.component';

import Histogram from '../components/histogram.component';
import DechetSearchBar from './search.component';

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
              <Col sm={2}>
                <Row>
                  <DechetSearchBar/>
                </Row>
                <Row>
                  <ListGroup>
                    { list }
                  </ListGroup>
                </Row>
              </Col>
              <Col sm={10}>
                <Row>
                    <Histogram title="EMBALLAGE PAPIER-CARTON" id="dechet-hist" />
                </Row>
              </Col>
            </Row>
          </Grid>
        </div>
    </div>
    );
  }
}

export default Dechet;
