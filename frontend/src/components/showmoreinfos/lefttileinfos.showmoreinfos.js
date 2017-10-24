import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import '../../styles/tile.css';

export default class LeftTileInfos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ecarts_pesee: window.store.getState().pageOptions.bordereaux.ecarts_pesee,
            data: []
        }
    }
    componentWillUpdate() {
        let data = []
        this.state.ecarts_pesee.forEach(function(element) {
            data.push({
                Num_Bdx: element.num_bordereau,
                Qte_estimee: parseFloat(element.quantitee_transportee).toFixed(2),
                Qte_recue: parseFloat(element.quantitee_finale).toFixed(2),
        })
    })
        this.state.data = data
        console.log(data)
    }

    render() {
        if (window.store.getState().infosPanelOptions.leftTileShown == true){
            console.log(this.state.data)
        return (
            <BootstrapTable data={this.state.data} striped hover condensed bordered={false}>
                <TableHeaderColumn isKey={true} dataField="Num_Bdx">#Bdx</TableHeaderColumn>
                <TableHeaderColumn dataField="Qte_estimee"> Qté Estimée</TableHeaderColumn>
                <TableHeaderColumn dataField="Qte_recue">Qté_reçue</TableHeaderColumn>
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
