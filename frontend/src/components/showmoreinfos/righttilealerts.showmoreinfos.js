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
    return (<div className='tooltip32 show'><span style={tooltiptitle}>Site: </span><span style={tooltipstyle}>{props.row.Nom}</span></div>)
}

export default class RightTileAlerts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            incoherences_filieres_dd: window.store.getState().pageOptions.bordereaux.incoherences_filieres_dd,
            data: [],
            rowOver:{}
        }
        handleOnRowMouseOver = handleOnRowMouseOver.bind(this)
        handleOnRowMouseOut = handleOnRowMouseOut.bind(this)

    }
    componentWillMount() {

        let data = []
        console.log(window.store.getState().pageOptions.bordereaux);
        this.state.incoherences_filieres_dd.forEach(function(element) {
            data.push({
                Num_Bdx: element.bordereau.num_bordereau.substring(0, 10),
                Code_Interne: element.dechet.codeinterne.substring(0, 10),
                Site: (element.site.nom).substring(0, 10),
                Nom: element.site.nom
        })
    })
        this.setState({data: data});
    }

    render() {
        if (window.store.getState().infosPanelOptions.rightTileAlerts === true){
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
                <BootstrapTable data={this.state.data} scrollTop={ 'Top' } options={ options }>
                    <TableHeaderColumn isKey={true} dataField="Num_Bdx" dataAlign="center">#Brdx</TableHeaderColumn>
                    <TableHeaderColumn dataField="Code_Interne" dataAlign="center">Code</TableHeaderColumn>
                    <TableHeaderColumn dataField="Site" dataAlign="center">Site</TableHeaderColumn>
                </BootstrapTable>
                <div>
                    <h5 className="titleshowmoreinfos">Incohérences Filières DD</h5>
                </div>
            </div>
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
