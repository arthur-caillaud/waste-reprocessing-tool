import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import '../../styles/tile.css';

function handleOnRowMouseOver(row) {
    this.setState({rowOver:row})
}
function handleOnRowMouseOut() {
    this.setState({rowOver:{}})
}

var tooltipstyle = {
    color: 'red',
    textAlign: 'left'
}
var tooltiptitle = {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
}
function ToolTip(props){
    if(props.row.Num_Bdx === undefined){
        return (<div className='tooltip32'></div>)
    }
    console.log(props.row)
    return (<div className='tooltip32 show'><span style={tooltiptitle}>Site: </span><span style={tooltipstyle}>{props.row.Site}</span></div>)
}

export default class LeftTileInfos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ecarts_pesee: window.store.getState().pageOptions.bordereaux.ecarts_pesee,
            data: [],
            rowOver:{}
        }
        handleOnRowMouseOver = handleOnRowMouseOver.bind(this)
        handleOnRowMouseOut = handleOnRowMouseOut.bind(this)
    }



    componentWillMount() {
        let data = []
        this.state.ecarts_pesee.forEach(function(element) {
            data.push({
                Num_Bdx: element.num_bordereau.substring(0, 10),
                Qte_estimee: parseFloat(element.quantitee_transportee).toFixed(2),
                Qte_recue: parseFloat(element.quantitee_finale).toFixed(2),
                Site: element.site.nom

        })
    })
        this.setState({data: data});

    }

    render() {
        if (window.store.getState().infosPanelOptions.leftTileShown === true){

            const options = {
                onRowMouseOver: function(row, e) {
                    handleOnRowMouseOver(row)
                },
                onRowMouseOut: function() {
                    handleOnRowMouseOut()
                }
            }

        return (
            <div>
                <ToolTip row={this.state.rowOver}/>
                <div className="tooltiparrow"></div>
                <BootstrapTable data={this.state.data} scrollTop={ 'Top' } options={ options }>
                    <TableHeaderColumn isKey={true} dataField="Num_Bdx" dataAlign="center">#Bdx</TableHeaderColumn>
                    <TableHeaderColumn dataField="Qte_estimee" dataAlign="center"> Qté Est.</TableHeaderColumn>
                    <TableHeaderColumn dataField="Qte_recue" dataAlign="center">Qté Reç.</TableHeaderColumn>
                </BootstrapTable>

            </div>
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
