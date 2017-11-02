import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import '../styles/general.css';
import '../styles/tile.css';

var tooltipstyle = {
    color: 'red',
    textAlign: 'left'
}
var tooltiptitle = {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
}

function handleOnRowMouseOver(row) {
    this.setState({rowOver:row})
}

function handleOnRowMouseOut() {
    this.setState({rowOver:{}})
}

function ToolTip(props){
    if(props.row.Num_Bdx === undefined){
        return (<div className='tooltip32'></div>)
    }
    return (<div className='tooltip32 show'><span style={tooltiptitle}>Site: </span><span style={tooltipstyle}>{props.row.Site}</span></div>)
}


class MoreInfos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ecarts_pesee: window.store.getState().pageOptions.bordereaux.ecarts_pesee,
            rowOver:{}
        }
        handleOnRowMouseOver = handleOnRowMouseOver.bind(this)
        handleOnRowMouseOut = handleOnRowMouseOut.bind(this)
    }

    render() {

        const {
            leftTileShown,
            middleLeftTileShown,
            middleLeftTileAlerts,
            middleRightTileShown,
            middleRightTileAlerts,
            rightTileShown,
            rightTileAlerts,
            ecarts_pesee,
            filieres_interdites_dd,
            filieres_interdites_norm,
            retards_dd,
            retards_norm,
            incoherences_filieres_dd,
            incoherences_filieres_norm
        } = this.props;

        const options = {
            onRowMouseOver: function(row, e) {
                handleOnRowMouseOver(row)
            },
            onRowMouseOut: function() {
                handleOnRowMouseOut()
            }
        }



        if (leftTileShown === true){

            let data = []
            if (this.props.ecarts_pesee !== undefined) {
                this.props.ecarts_pesee.forEach(function(element) {
                    data.push({
                        Num_Bdx: element.bordereau.num_bordereau.substring(0, 10),
                        Qte_estimee: parseFloat(element.bordereau.quantitee_transportee).toFixed(2),
                        Qte_recue: parseFloat(element.bordereau.quantitee_finale).toFixed(2),
                        Site: element.site.nom

                })
            })
        }
        return (
            <div>

                <ToolTip row={this.state.rowOver}/>
                <BootstrapTable data={data} scrollTop={ 'Top' } options={ options }>
                    <TableHeaderColumn isKey={true} dataField="Num_Bdx" dataAlign="center">#Brdx</TableHeaderColumn>
                    <TableHeaderColumn dataField="Qte_estimee" dataAlign="center"> QtéEst.</TableHeaderColumn>
                    <TableHeaderColumn dataField="Qte_recue" dataAlign="center">QtéReç.</TableHeaderColumn>
                </BootstrapTable>
                <div>
                    <h5 className="titleshowmoreinfos">Ecarts de Pesée</h5>
                </div>


            </div>
        );
    }
    else if (middleLeftTileAlerts === true){
        let data = []
        if (this.props.filieres_interdites_dd !== undefined) {
            this.props.filieres_interdites_dd.forEach(function(element) {
                data.push({
                    Num_Bdx: element.bordereau.num_bordereau.substring(0, 10),
                    Code_Interne: element.dechet.codeinterne.substring(0, 10),
                    Site: (element.site.nom).substring(0, 10),
                    Nom: element.site.nom
                })
            })
        }
        return(
        <div>
            <ToolTip row={this.state.rowOver}/>
            <BootstrapTable data={data} scrollTop={ 'Top' } options={ options }>
                <TableHeaderColumn isKey={true} dataField="Num_Bdx" dataAlign="center">#Brdx</TableHeaderColumn>
                <TableHeaderColumn dataField="Code_Interne" dataAlign="center">Code</TableHeaderColumn>
                <TableHeaderColumn dataField="Site" dataAlign="center">Site</TableHeaderColumn>
            </BootstrapTable>
            <div>
                <h5 className="titleshowmoreinfos">Filières Interdites DD</h5>
            </div>
        </div>

        );

    }
    else if (middleLeftTileShown === true) {
        let data = []
        if (this.props.filieres_interdites_norm !== undefined) {
            this.props.filieres_interdites_norm.forEach(function(element) {
                data.push({
                    Num_Bdx: element.bordereau.num_bordereau.substring(0, 10),
                    Code_Interne: element.dechet.codeinterne.substring(0, 10),
                    Site: (element.site.nom).substring(0, 10),
                    Nom: element.site.nom
                })
            })
        }
        return(
        <div>
            <ToolTip row={this.state.rowOver}/>
            <BootstrapTable data={data} scrollTop={ 'Top' } options={ options }>
                <TableHeaderColumn isKey={true} dataField="Num_Bdx" dataAlign="center">#Brdx</TableHeaderColumn>
                <TableHeaderColumn dataField="Code_Interne" dataAlign="center">Code</TableHeaderColumn>
                <TableHeaderColumn dataField="Site" dataAlign="center">Site</TableHeaderColumn>
            </BootstrapTable>
            <div>
                <h5 className="titleshowmoreinfos">Filières Interdites Norm</h5>
            </div>
        </div>

        );

    }
    else if (middleRightTileShown === true) {
        let data = []
        if (this.props.retards_norm !== undefined) {
            this.props.retards_norm.forEach(function(element) {
                data.push({
                    Num_Bdx: element.bordereau.num_bordereau.substring(0, 10),
                    Code_Interne: element.dechet.codeinterne.substring(0, 10),
                    Site: (element.site.nom).substring(0, 10),
                    Nom: element.site.nom
                })
            })
        }
        return(
        <div>
            <ToolTip row={this.state.rowOver}/>
            <BootstrapTable data={data} scrollTop={ 'Top' } options={ options }>
                <TableHeaderColumn isKey={true} dataField="Num_Bdx" dataAlign="center">#Brdx</TableHeaderColumn>
                <TableHeaderColumn dataField="Code_Interne" dataAlign="center">Code</TableHeaderColumn>
                <TableHeaderColumn dataField="Site" dataAlign="center">Site</TableHeaderColumn>
            </BootstrapTable>
            <div>
                <h5 className="titleshowmoreinfos">Retards Bordereaux Norm</h5>
            </div>
        </div>

        );

    }
    else if (middleRightTileAlerts === true) {
        let data = []
        if (this.props.retards_dd !== undefined) {
            this.props.retards_dd.forEach(function(element) {
                data.push({
                    Num_Bdx: element.bordereau.num_bordereau.substring(0, 10),
                    Code_Interne: element.dechet.codeinterne.substring(0, 10),
                    Site: (element.site.nom).substring(0, 10),
                    Nom: element.site.nom
                })
            })
        }
        return(
        <div>
            <ToolTip row={this.state.rowOver}/>
            <BootstrapTable data={data} scrollTop={ 'Top' } options={ options }>
                <TableHeaderColumn isKey={true} dataField="Num_Bdx" dataAlign="center">#Brdx</TableHeaderColumn>
                <TableHeaderColumn dataField="Code_Interne" dataAlign="center">Code</TableHeaderColumn>
                <TableHeaderColumn dataField="Site" dataAlign="center">Site</TableHeaderColumn>
            </BootstrapTable>
            <div>
                <h5 className="titleshowmoreinfos">Retards Bordereaux DD</h5>
            </div>
        </div>

        );

    }
    else if (rightTileShown === true) {
        let data = []
        if (this.props.incoherences_filieres_norm !== undefined) {
            this.props.incoherences_filieres_norm.forEach(function(element) {
                data.push({
                    Num_Bdx: element.bordereau.num_bordereau.substring(0, 10),
                    Code_Interne: element.dechet.codeinterne.substring(0, 10),
                    Site: (element.site.nom).substring(0, 10),
                    Nom: element.site.nom
                })
            })
        }
        return(
        <div>
            <ToolTip row={this.state.rowOver}/>
            <BootstrapTable data={data} scrollTop={ 'Top' } options={ options }>
                <TableHeaderColumn isKey={true} dataField="Num_Bdx" dataAlign="center">#Brdx</TableHeaderColumn>
                <TableHeaderColumn dataField="Code_Interne" dataAlign="center">Code</TableHeaderColumn>
                <TableHeaderColumn dataField="Site" dataAlign="center">Site</TableHeaderColumn>
            </BootstrapTable>
            <div>
                <h5 className="titleshowmoreinfos">Incohérences Filières Norm</h5>
            </div>
        </div>

        );

    }
    else if (middleRightTileShown === true) {
        let data = []
        if (this.props.retards_norm !== undefined) {
            this.props.retards_norm.forEach(function(element) {
                data.push({
                    Num_Bdx: element.bordereau.num_bordereau.substring(0, 10),
                    Code_Interne: element.dechet.codeinterne.substring(0, 10),
                    Site: (element.site.nom).substring(0, 10),
                    Nom: element.site.nom
                })
            })
        }
        return(
        <div>
            <ToolTip row={this.state.rowOver}/>
            <BootstrapTable data={data} scrollTop={ 'Top' } options={ options }>
                <TableHeaderColumn isKey={true} dataField="Num_Bdx" dataAlign="center">#Brdx</TableHeaderColumn>
                <TableHeaderColumn dataField="Code_Interne" dataAlign="center">Code</TableHeaderColumn>
                <TableHeaderColumn dataField="Site" dataAlign="center">Site</TableHeaderColumn>
            </BootstrapTable>
            <div>
                <h5 className="titleshowmoreinfos">Retards Bordereaux Norm</h5>
            </div>
        </div>

        );

    }
    else if (rightTileAlerts === true) {
        let data = []
        if (this.props.incoherences_filieres_dd !== undefined) {
            this.props.incoherences_filieres_dd.forEach(function(element) {
                data.push({
                    Num_Bdx: element.bordereau.num_bordereau.substring(0, 10),
                    Code_Interne: element.dechet.codeinterne.substring(0, 10),
                    Site: (element.site.nom).substring(0, 10),
                    Nom: element.site.nom
                })
            })
        }
        return(
        <div>
            <ToolTip row={this.state.rowOver}/>
            <BootstrapTable data={data} scrollTop={ 'Top' } options={ options }>
                <TableHeaderColumn isKey={true} dataField="Num_Bdx" dataAlign="center">#Brdx</TableHeaderColumn>
                <TableHeaderColumn dataField="Code_Interne" dataAlign="center">Code</TableHeaderColumn>
                <TableHeaderColumn dataField="Site" dataAlign="center">Site</TableHeaderColumn>
            </BootstrapTable>
            <div className="titleshowmoreinfos">
                <h5>Incohérences Filières DD</h5>
            </div>
        </div>

        );

    }



        return (
            <div className="more-infos">
                    <center>Cliquez quelque part pour obtenir plus d'informations</center>
            </div>
        )
    }
}
export default MoreInfos;
