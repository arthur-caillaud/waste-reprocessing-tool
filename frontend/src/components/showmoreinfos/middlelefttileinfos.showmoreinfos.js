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

export default class MiddleLeftTileInfos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filieres_interdites_norm: window.store.getState().pageOptions.bordereaux.filieres_interdites_norm,
            data: [],
            rowOver: {}
        }
        handleOnRowMouseOver = handleOnRowMouseOver.bind(this)
        handleOnRowMouseOut = handleOnRowMouseOut.bind(this)
    }
    componentWillMount() {
        let data = []
        this.state.filieres_interdites_norm.forEach(function(element) {
            data.push({
                Num_Bdx: element.bordereau.num_bordereau.substring(0, 10),
                Code_Interne: element.dechet.codeinterne.substring(0, 10),
                Site: (element.site.nom).substring(0, 10),
                Nom: element.site.now
        })
    })
        this.setState({data: data});
    }

    render() {
        if (window.store.getState().infosPanelOptions.middleLeftTileShown === true){
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
                    <h5 className="titleshowmoreinfos">Filières Interdites</h5>
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
