import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import '../../styles/tile.css';

export default class RightTileAlerts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            incoherences_filieres_dd: window.store.getState().pageOptions.bordereaux.incoherences_filieres_dd,
            data: [],
        }
    }
    componentWillMount() {

        let data = []
        this.state.incoherences_filieres_dd.forEach(function(element) {
            data.push({
                Num_Bdx: element.num_bordereau.substring(0, 10),
                Code_Interne: element.dechet.codeinterne.substring(0, 10),
                Site: parseFloat(element.id_site).toFixed(0),
        })
    })
        this.state.data = data;
    }

    render() {
        if (window.store.getState().infosPanelOptions.rightTileAlerts == true){

        return (
            <BootstrapTable data={this.state.data} scrollTop={ 'Top' }>
                <TableHeaderColumn isKey={true} dataField="Num_Bdx" dataAlign="center">#Bdx</TableHeaderColumn>
                <TableHeaderColumn dataField="Code_Interne" dataAlign="center">CodeInt.</TableHeaderColumn>
                <TableHeaderColumn dataField="Site" dataAlign="center">Site</TableHeaderColumn>
            </BootstrapTable>
        );
    }
        else {
            return(
                <div>
                    <p>Cliquez quelque part pour afficher d'avantage d'informations</p>
                </div>
            )
        }
    }
}
