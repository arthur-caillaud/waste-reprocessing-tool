var HelperService = {}

function trimAbove99(value) {
    if (value > 99) {
        return "99+"
    } else {
        return value
    }
}

function getAllLevelNames(architecture) {
    /*
    When typing something in the main searchbar, we can search any type of level in EDF Structure
    This means that we must load the entire EDF architecture, and go through it to get
    the names of All the different levels.
    */
    let levelNames = []

    for (let metier_dependance in architecture) {
        if (metier_dependance!=="niveau") {
            let metier = architecture[metier_dependance]
            levelNames.push({
                nom: metier_dependance,
                architecture: {
                    metier_dependance: {name: metier_dependance, real_level: metier.niveau},
                    up_dependance: {name:"", real_level:0},
                    unite_dependance: {name:"", real_level:0},
                    nom: {name:"", real_level:0}
                },
                level: 1,
                real_level: metier.niveau
            })



            for (let up_dependance in metier) {
                if(up_dependance !=="niveau") {
                    let up = metier[up_dependance]
                    levelNames.push({
                        nom: up_dependance,
                        architecture: {
                            metier_dependance: {name: metier_dependance, real_level: metier.niveau},
                            up_dependance: {name: up_dependance, real_level: up.niveau},
                            unite_dependance: {name:"", real_level:0},
                            nom: {name:"", real_level:0}
                        },
                        level: 2,
                        real_level: up.niveau
                    })


                    for (let unite_dependance in up) {
                        if(unite_dependance!=="niveau") {
                            let unite = up[unite_dependance]
                            levelNames.push({
                                nom: unite_dependance,
                                architecture: {
                                    metier_dependance: {name: metier_dependance, real_level: metier.niveau},
                                    up_dependance: {name: up_dependance, real_level: up.niveau},
                                    unite_dependance: {name: unite_dependance, real_level: unite.niveau},
                                    nom: {name:"", real_level:0}
                                },
                                level: 3,
                                real_level: unite.niveau
                            })


                            for (let site in unite) {
                                if(site!=="niveau") {
                                    levelNames.push({
                                        nom: site,
                                        architecture: {
                                            metier_dependance: {name: metier_dependance, real_level: metier.niveau},
                                            up_dependance: {name: up_dependance, real_level: up.niveau},
                                            unite_dependance: {name: up_dependance, real_level: up.niveau},
                                            nom: {name: site, real_level: site.niveau}
                                        },
                                        level: 4,
                                        real_level: 4
                                    })

                                }


                            }
                        }

                    }
                }

            }
        }

    }

    return levelNames;
}


function getMenuForMetiers(site) {
    let menuMetier = [];
    let architecture = window.store.getState().pageOptions.architecture;
    let entries = Object.entries(architecture)
    entries.splice(0, 1)
    entries.forEach(function(element) {
        menuMetier.push({name: element[0], real_level: element[1].niveau})
    })
    return menuMetier;
}

function getMenuForUp(site) {
    let menuUp = [];
    let architecture = window.store.getState().pageOptions.architecture;
    let entries = Object.entries(architecture)
    entries.splice(0, 1)
    entries.forEach(function(element) {
        if (element[0] === site.architecture.metier_dependance.name) {
            let entries2 = Object.entries(element[1]);
            entries2.splice(0, 1);
            entries2.forEach(function(element2) {
                menuUp.push({name: element2[0], real_level: element2[1].niveau})
            })
        }

    })

    return menuUp
}

function getMenuForUnite(site) {
    let menuUnite = []
    let architecture = window.store.getState().pageOptions.architecture;
    let entries = Object.entries(architecture)
    entries.splice(0, 1)
    entries.forEach(function(element) {
        if (element[0] === site.architecture.metier_dependance.name) {
            let entries2 = Object.entries(element[1]);
            entries2.splice(0, 1);
            entries2.forEach(function(element2) {
                if (element2[0] === site.architecture.up_dependance.name) {
                    let entries3 = Object.entries(element2[1])

                    entries3.splice(0,1);
                    entries3.forEach(function(element3) {
                        menuUnite.push({name: element3[0], real_level: element3[1].niveau})
                    })
                }
            })
        }

    })

    return menuUnite
}

function getMenuForSite(site) {
    let menuSite = []
    let architecture = window.store.getState().pageOptions.architecture;
    let entries = Object.entries(architecture)
    entries.splice(0, 1)
    entries.forEach(function(element) {
        if (element[0] === site.architecture.metier_dependance.name) {
            let entries2 = Object.entries(element[1]);
            entries2.splice(0, 1);
            entries2.forEach(function(element2) {
                if (element2[0] === site.architecture.up_dependance.name) {
                    let entries3 = Object.entries(element2[1])
                    entries3.splice(0,1);
                    entries3.forEach(function(element3) {
                        if (element3[0] === site.architecture.unite_dependance.name) {
                            let entries4 = Object.entries(element3[1]);
                            entries4.splice(0, 1);
                            entries4.forEach(function(element4) {
                                menuSite.push({name: element4[0], real_level: element4[1].niveau})
                            })
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
    let volume_listeverte = 0.0000;
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
        volume_listeverte += parseFloat(element.volume_l_verte);
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

    let dataForLeftGauge = {leftvalue: 0, leftvalueBefore: 0, leftvalueAnte: 0, leftvalueBeforeAnte: 0, details: "", v_listeverte: 0};
    let dataForMiddleGauge = {middlevalue: 0, middlevalueBefore: 0, middlevalueAnte: 0, middlevalueBeforeAnte: 0, v_total: 0};
    //let dataForRightGauge = {};
    let dataForLeftTile = {};
    let dataForMiddleLeftTile = {};
    let dataForMiddleRightTile = {};
    let dataForRightTile = {};


    dataForLeftTile.ecarts_pesee = ecarts_pesee;
    dataForRightTile.incoherences_filieres_dd = incoherences_filieres_dd;
    dataForRightTile.incoherences_filieres_norm = incoherences_filieres_norm + incoherences_filieres_dd;
    dataForMiddleLeftTile.filieres_interdites_dd = filieres_interdites_dd;
    dataForMiddleLeftTile.filieres_interdites_norm = filieres_interdites_norm + filieres_interdites_dd;
    dataForMiddleRightTile.retards_dd = retards_dd;
    dataForMiddleRightTile.retards_norm = retards_norm + retards_dd;


    if (!(volume_total === 0.0000)) {

        dataForLeftGauge.leftvalue = valorisation_l_verte*100/volume_total
        dataForLeftGauge.leftvalueBefore = 12
        dataForLeftGauge.leftvalueAnte = window.store.getState().updateGauge.leftvalue
        dataForLeftGauge.leftvalueBeforeAnte = window.store.getState().updateGauge.leftvalueBefore
        dataForLeftGauge.v_listeverte = volume_listeverte

        dataForMiddleGauge.middlevalue = valorisation_totale*100/volume_total
        dataForMiddleGauge.middlevalueBefore = 12
        dataForMiddleGauge.middlevalueAnte = window.store.getState().updateGauge.middlevalue
        dataForMiddleGauge.middlevalueBeforeAnte = window.store.getState().updateGauge.middlevalueBefore
        dataForMiddleGauge.v_total = volume_total


    } else {
         dataForLeftGauge.details = "Pas de Bordereaux sur la période sélectionnée"
         dataForMiddleGauge.details = "Pas de Bordereaux sur la période sélectionnée"
         dataForLeftGauge.leftvalue = 100
         dataForLeftGauge.leftvalueBefore = 12
         dataForLeftGauge.leftvalueAnte = 0
         dataForLeftGauge.leftvalueBeforeAnte = 0
         dataForLeftGauge.v_listeverte = volume_listeverte
         dataForMiddleGauge.middlevalue = 100
         dataForMiddleGauge.middlevalueBefore = 12
         dataForMiddleGauge.middlevalueAnte = 0
         dataForMiddleGauge.middlevalueBeforeAnte = 0
         dataForMiddleGauge.v_total = volume_total
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




HelperService.trimAbove99 = trimAbove99;
HelperService.getMenuForMetiers = getMenuForMetiers;
HelperService.getMenuForUp = getMenuForUp;
HelperService.getMenuForUnite = getMenuForUnite;
HelperService.getMenuForSite = getMenuForSite;
HelperService.presentDataForNewSite = presentDataForNewSite;
HelperService.filterByValue = filterByValue;
HelperService.getAllLevelNames = getAllLevelNames;
export default HelperService;
