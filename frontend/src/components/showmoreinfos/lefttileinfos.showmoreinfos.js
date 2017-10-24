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
    componentWillMount() {
        let data = []
        this.state.ecarts_pesee.forEach(function(element) {
            data.push({
                Num_Bdx: element.num_bordereau.substring(0, 10),
                Qte_estimee: parseFloat(element.quantitee_transportee).toFixed(2),
                Qte_recue: parseFloat(element.quantitee_finale).toFixed(2),
        })
    })
        this.state.data = data

    }

    render() {
        if (window.store.getState().infosPanelOptions.leftTileShown == true){
        return (
            <BootstrapTable data={this.state.data} scrollTop={ 'Top' }>
                <TableHeaderColumn isKey={true} dataField="Num_Bdx" dataAlign="center">#Bdx</TableHeaderColumn>
                <TableHeaderColumn dataField="Qte_estimee" dataAlign="center"> Qté Est.</TableHeaderColumn>
                <TableHeaderColumn dataField="Qte_recue" dataAlign="center">Qté Reç.</TableHeaderColumn>
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
