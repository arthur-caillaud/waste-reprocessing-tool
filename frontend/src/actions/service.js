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

    for(let metier in architecture) {
        menuMetier.push(metier)
    }
    return menuMetier;
}

function getMenuForUp(site) {
    let menuUp = [];
    let architecture = window.store.getState().pageOptions.architecture;

    let entries = Object.entries(architecture)
    entries.forEach(function(element) {
        if (element[0] === site.architecture.metier_dependance) {

            for (let up in element[1]) {
                menuUp.push(up)
            }
        }

    })

    return menuUp
}

function getMenuForUnite(site) {
    let menuUnite = []
    let entries = Object.entries(window.store.getState().pageOptions.architecture)
    entries.forEach(function(element) {
        if (element[0] === site.architecture.metier_dependance) {
            let entries2 = Object.entries(element[1])
            entries2.forEach(function(element2) {
                if (element2[0] === site.architecture.up_dependance) {
                    for (let unite in element2[1]) {
                        menuUnite.push(unite)
                    }
                }
            })
        }
    })
    return menuUnite
}

function getMenuForSite(site) {
    let menuSite = []
    let entries = Object.entries(window.store.getState().pageOptions.architecture)
    entries.forEach(function(element) {
        if (element[0] === site.architecture.metier_dependance) {
            let entries2 = Object.entries(element[1])
            entries2.forEach(function(element2) {
                if (element2[0] === site.architecture.up_dependance) {
                    let entries3 = Object.entries(element2[1])
                    entries3.forEach(function(element3) {
                        if (element3[0] === site.architecture.unite_dependance) {
                            for (let site in element3[1]) {
                                menuSite.push(site)
                            }
                        }
                    })
                }
            })
        }
    })
    return menuSite
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
    let ecarts_pesee = 0;
    let filieres_interdites_dd = 0;
    let filieres_interdites_norm = 0;
    let incoherences_filieres_dd = 0;
    let incoherences_filieres_norm = 0;
    let retards_dd = 0;
    let retards_norm = 0;

    json.forEach(function(element) {
        volume_total += parseFloat(element.volume_total);
        valorisation_l_verte += parseFloat(element.valorisation_l_verte);
        valorisation_totale += parseFloat(element.valorisation_totale);
        ecarts_pesee += parseFloat(element.ecarts_pesee);
        filieres_interdites_dd += parseFloat(element.filieres_interdites_dd);
        filieres_interdites_norm += parseFloat(element.filieres_interdites_norm);
        incoherences_filieres_dd += parseFloat(element.incoherences_filieres_dd);
        incoherences_filieres_norm += parseFloat(element.incoherences_filieres_norm);
        retards_dd += parseFloat(element.retards_dd);
        retards_norm += parseFloat(element.retards_norm);
    });

    let dataForLeftGauge = {leftvalue: 0, leftvalueBefore: 0, leftvalueAnte: 0, leftvalueBeforeAnte: 0, details: ""};
    let dataForMiddleGauge = {middlevalue: 0, middlevalueBefore: 0, middlevalueAnte: 0, middlevalueBeforeAnte: 0};
    let dataForRightGauge = {};
    let dataForLeftTile = {};
    let dataForMiddleLeftTile = {};
    let dataForMiddleRightTile = {};
    let dataForRightTile = {};

    //TO MODIFY WITH INTELLECT
    dataForLeftGauge.details = json[0].details;

    dataForLeftTile.ecarts_pesee = ecarts_pesee;
    dataForRightTile.incoherences_filieres_dd = incoherences_filieres_dd;
    dataForRightTile.incoherences_filieres_norm = incoherences_filieres_norm;
    dataForMiddleLeftTile.filieres_interdites_dd = filieres_interdites_dd;
    dataForMiddleLeftTile.filieres_interdites_norm = filieres_interdites_norm;
    dataForMiddleRightTile.retards_dd = retards_dd;
    dataForMiddleRightTile.retards_norm = retards_norm;


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
        dataForLeftTile: dataForLeftTile,
        dataForRightTile: dataForRightTile,
        dataForMiddleRightTile: dataForMiddleRightTile,
        dataForMiddleLeftTile:  dataForMiddleLeftTile

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
HelperService.getMenuForUp = getMenuForUp;
HelperService.getMenuForUnite = getMenuForUnite;
HelperService.getMenuForSite = getMenuForSite;
HelperService.displayMiddleGaugeInfos = displayMiddleGaugeInfos;
HelperService.displayLeftGaugeInfos = displayLeftGaugeInfos;
HelperService.presentDataForNewSite = presentDataForNewSite;
HelperService.filterByValue = filterByValue;
HelperService.getAllLevelNames = getAllLevelNames;
export default HelperService;
