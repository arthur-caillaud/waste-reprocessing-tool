import * as actions from './index';
var HelperService = {}


function getAllLevelNames(architecture) {
    /*
    When typing something in the main searchbar, we can search any type of level in EDF Structure
    This means that we must load the entire EDF architecture, and go through it to get
    the names of All the different levels.
    */
    let levelNames = []

    for (let metier_dependance in architecture) {
        levelNames.push({
            nom: metier_dependance,
            architecture: {
                metier_dependance: metier_dependance,
                up_dependance: null,
                unite_dependance: null,
                site: null
            },
            level: 1
        })
        let metier = architecture[metier_dependance]

        for (let up_dependance in metier) {
            levelNames.push({
                nom: up_dependance,
                architecture: {
                    metier_dependance: metier_dependance,
                    up_dependance: up_dependance,
                    unite_dependance: null,
                    site: null
                },
                level: 2
            })
            let up = metier[up_dependance]

            for (let unite_dependance in up) {
                levelNames.push({
                    nom: unite_dependance,
                    architecture: {
                        metier_dependance: metier_dependance,
                        up_dependance: up_dependance,
                        unite_dependance: unite_dependance,
                        site: null
                    },
                    level: 3
                })
                let unite = up[unite_dependance]

                for (let site in unite) {
                    levelNames.push({
                        nom: site,
                        architecture: {
                            metier_dependance: metier_dependance,
                            up_dependance: up_dependance,
                            unite_dependance: unite_dependance,
                            site: site
                        },
                        level: 4
                    })

                }
            }
        }
    }
    return levelNames;
}


function getMenuForMetiers() {
    let menuMetier = [];
    let architecture = window.store.getState().pageOptions.architecture;
    console.log(architecture)
    for(let metier in architecture) {
        menuMetier.push(metier)
    }
    return menuMetier;
}

function filterByValue(array, value) {


    let Liste = []
    array.forEach(function (element) {

        if (element.nom.toLowerCase().includes(value.toLowerCase())) {

            Liste.push(element)

        }
    });
    return Liste
}

function presentDataForNewSite(json) {
    let volume_total = 0.0000;
    let valorisation_l_verte = 0.0000;
    let valorisation_totale = 0.0000;

    json.forEach(function(element) {

        volume_total += parseFloat(element.volume_total)
        valorisation_l_verte += parseFloat(element.valorisation_l_verte)
        valorisation_totale += parseFloat(element.valorisation_totale)
    });

    let dataForLeftGauge = {leftvalue: 0, leftvalueBefore: 0, leftvalueAnte: 0, leftvalueBeforeAnte: 0, details: ""};
    let dataForMiddleGauge = {middlevalue: 0, middlevalueBefore: 0, middlevalueAnte: 0, middlevalueBeforeAnte: 0};
    let dataForRightGauge = {};

    //TO MODIFY WITH INTELLECT
    dataForLeftGauge.details = json[0].details
    if (!(volume_total == 0.0000)) {

        dataForLeftGauge.leftvalue = valorisation_l_verte*100/volume_total
        dataForLeftGauge.leftvalueBefore = 12
        dataForLeftGauge.leftvalueAnte = window.store.getState().updateGauge.leftvalue
        dataForLeftGauge.leftvalueBeforeAnte = window.store.getState().updateGauge.leftvalueBefore

        dataForMiddleGauge.middlevalue = valorisation_totale*100/volume_total
        dataForMiddleGauge.middlevalueBefore = 12
        dataForMiddleGauge.middlevalueAnte = window.store.getState().updateGauge.middlevalue
        dataForMiddleGauge.middlevalueBeforeAnte = window.store.getState().updateGauge.middlevalueBefore

    }

    let response = {
        dataForLeftGauge: dataForLeftGauge,
        dataForMiddleGauge: dataForMiddleGauge,

    }
    return response

}

function displayLeftGaugeInfos() {
    return dispatch => {
        dispatch(actions.displayLeftGaugeInfos())
    }
}

function displayMiddleGaugeInfos() {
    return dispatch => {
        dispatch(actions.displayMiddleGaugeInfos())
    }
}

HelperService.getMenuForMetiers = getMenuForMetiers;
HelperService.displayMiddleGaugeInfos = displayMiddleGaugeInfos;
HelperService.displayLeftGaugeInfos = displayLeftGaugeInfos;
HelperService.presentDataForNewSite = presentDataForNewSite;
HelperService.filterByValue = filterByValue;
HelperService.getAllLevelNames = getAllLevelNames;
export default HelperService;
