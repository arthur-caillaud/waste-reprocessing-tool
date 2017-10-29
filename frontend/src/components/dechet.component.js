import React, { Component } from 'react';
import { Grid, Col, Row } from 'react-bootstrap';


import Histogram from '../components/containers/histogram.container';
import InputGraphPanel from '../components/containers/inputgraphpanel.container';
import GraphTagsPanel from '../components/containers/graphtagspanel.container';
import { connect } from "react-redux";
import * as actions from '../actions';
import * as apiCalls from '../actions/api_calls';
class DechetElement extends Component {

  render() {

    return (
      <div>
          <Grid fluid>
            <Row>
                <Col sm={3}>
                  <InputGraphPanel
                      idInputPanel="dechet-selection-panel"
                      onClickActionName="updateSelectedDechet"
                      onLoadActionName="loadPrestatairesConsideringChosenDechet"
                      onSearchActionName="updateDechetPanelSearchbarInput"
                      loadGraphValuesActionName="loadDechetGraphValues"
                      branchName="updateDechetSelectionPanel"
                      searchPlaceholder="Rechercher un déchet"
                      emptyContainerMessage="Aucun déchet trouvé à cette échelle"
                      cleanActionName="cleanPrestatairesChosenTagsArray"
                  />
                </Col>
                <Col sm={9}>
                  <Histogram
                      branchName="dechetGraphOptions"
                      idGraph="dechet-histogram-graph"
                  />
                </Col>
                <Col sm={9} smOffset={3}>
                   <GraphTagsPanel
                       searchPlaceholder="Ajouter des prestataires pour ce déchet"
                       branchName="updateDechetGraphTagsPanel"
                       idInputPanel="prestataire-tag-panel"
                       onClickActionName="addDechetGraphTag"
                       onRemoveActionName="removeDechetGraphTag"
                       onLoadActionName="loadPrestatairesConsideringChosenDechet"
                       inputGraphPanelBranch="updateDechetSelectionPanel"
                       defaultOnLoadActionName="loadPrestataireList"
                       emptyContainerMessage="Aucun prestataire pour ce déchet"
                       loadGraphValuesActionName="loadDechetGraphValues"
                  />
                </Col>
            </Row>
        </Grid>
    </div>
    );
  }
}
function mapStateToProps(state) {
    return {

    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getNationalState: () => {

            dispatch(apiCalls.updateSite({
                    nom: "National",
                    level: 0,
                    real_level:0,
                    architecture: {
                        nom: {name: "", real_level:0},
                        unite_dependance: {name: "", real_level:0},
                        up_dependance: {name: "", real_level:0},
                        metier_dependance: {name: "", real_level:0}
                    }
                }
            ))
        },
        getArchitecture: () => {
            dispatch(apiCalls.getArchitecture())
        }
    }
}

const Dechet = connect(mapStateToProps, mapDispatchToProps)(DechetElement)

export default Dechet;
