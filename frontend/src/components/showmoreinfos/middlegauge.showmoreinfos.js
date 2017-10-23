import React, { Component } from "react";




export default class MiddleGaugeInfos extends Component {
    render () {
        if (window.store.getState().infosPanelOptions.middleGaugeShown == true){
        return (
            <div>
                <h3>
                    Valorisation Globale
                </h3>
                <p>
                    Taux de valorisation de l'année: {window.store.getState().updateGauge.middlevalue.toFixed(2)} %
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
