import React, { Component } from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

import { array } from '../utilities/text-generator.component';

import Zone from '../graphics/zone.component';
import PrestataireSearchBar from '../components/search.component';

class Prestataire extends Component {
  render() {
    var i = 0;
    var list = [];
    for (i=0; i<array.length; i++) {
      list.push(<ListGroupItem>{array[i]}</ListGroupItem>);
    }

    return (
      <div>
        <div>
          <h2>Vision prestataire</h2>
        </div>
        <div>
          <Grid fluid>
            <Row>
              <Col sm={2}>
                <Row>
                  <PrestataireSearchBar/>
                </Row>
                <Row>
                  <ListGroup>
                    { list }
                  </ListGroup>
                </Row>
              </Col>
              <Col sm={10}>
                <Row>
                  <Col sm={9}><h2>VEOLIA</h2></Col>
                  <Col sm={1}>A</Col>
                  <Col sm={1}>B</Col>
                  <Col sm={1}>C</Col>
                </Row>
                <Row>
                  <Zone />
                </Row>
                <Row>
                  <Col sm={3}>
                    <PrestataireSearchBar/>
                  </Col>
                  <Col sm={9}>
                    <Button>Tag 1</Button>
                    <Button>Tag 2</Button>
                    <Button>Tag 3</Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Grid>
        </div>
    </div>
    );
  }
}

export default Prestataire;