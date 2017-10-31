import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import '../../styles/tile.css';

export default class MiddleRightTileInfos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            retards_norm: window.store.getState().pageOptions.bordereaux.retards_norm,
            data: []
        }
    }
    componentWillMount() {
        let data = []
        this.state.retards_norm.forEach(function(element) {
            data.push({
                Num_Bdx: element.num_bordereau.substring(0, 10),
                Code_Interne: element.dechet.codeinterne.substring(0, 10),
                Site: parseFloat(element.id_site).toFixed(0),
        })
    })
        this.setState({data: data});
    }

    render() {
        if (window.store.getState().infosPanelOptions.middleRightTileShown === true){

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
                    <center>Cliquez quelque part pour afficher d'avantage d'informations</center>
                </div>
            )
        }
    }
}
