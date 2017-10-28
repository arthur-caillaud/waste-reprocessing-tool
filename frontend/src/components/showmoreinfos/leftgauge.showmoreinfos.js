import React, { Component } from "react";

export default class LeftGaugeInfos extends Component {
    render() {
        if (window.store.getState().infosPanelOptions.leftGaugeShown ===true){
        return (
            <div>
                <h3>
                    Valorisation LISTE Verte
                </h3>
                <p>
                    Taux de valorisation de l'année: {window.store.getState().updateGauge.leftvalue.toFixed(2)} %
                </p>
                <p>
                    Taux de valorisation l'an passé: {window.store.getState().updateGauge.leftvalueBefore.toFixed(2)} %
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
