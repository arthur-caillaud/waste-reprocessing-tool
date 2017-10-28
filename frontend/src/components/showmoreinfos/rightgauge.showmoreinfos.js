import React, { Component } from "react";

export default class RightGaugeInfos extends Component {
    render() {
        if (window.store.getState().infosPanelOptions.rightGaugeShown ===true){
        return (
            <div>
                <h3>
                    Bordereaux non datés
                </h3>
                <p>
                    Nombre cette année: {window.store.getState().updateGauge.rightvalue.toFixed(2)} %
                </p>
                <p>
                    {window.store.getState().updateGauge.details}
                </p>
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
