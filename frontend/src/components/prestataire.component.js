import React, { Component } from 'react';
import { Grid, Col, Row } from 'react-bootstrap';

import Histogram from '../components/containers/histogram.container';
import InputGraphPanel from '../components/containers/inputgraphpanel.container';
import GraphTagsPanel from '../components/containers/graphtagspanel.container';
import { connect } from "react-redux";
import * as actions from '../actions';
import * as apiCalls from '../actions/api_calls';
class PrestataireElement extends Component {
    componentDidMount(){

        this.props.getArchitecture()
        this.props.getNationalState()

    }
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

const Prestataire = connect(mapStateToProps, mapDispatchToProps)(PrestataireElement)
export default Prestataire;
