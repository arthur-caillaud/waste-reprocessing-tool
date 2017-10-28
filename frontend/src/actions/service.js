var HelperService = {}

function trimAbove99(value) {
    if (value > 99) {
        return "99+"
    } else {
        return value
    }
}
function substractYear(date){
    let split = date.split('-');
    split[0] -= 1
    return split.join('-')
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

function presentDataForNewSite(actualJson, lastYearJson) {
    /*
    values for current year
    */
    let volume_total_actual = 0.0000;
    let volume_listeverte_actual = 0.0000;
    let valorisation_l_verte_actual = 0.0000;
    let valorisation_totale_actual = 0.0000;
    let ecarts_pesee_actual = 0;
    let filieres_interdites_dd_actual = 0;
    let filieres_interdites_norm_actual = 0;
    let incoherences_filieres_dd_actual = 0;
    let incoherences_filieres_norm_actual = 0;
    let retards_dd_actual = 0;
    let retards_norm_actual = 0;
    let total_bdx_actual = 0;
    let total_lost_actual = 0;
    let date = actualJson[0].date

    let volume_total_before = 0.0000;
    let volume_listeverte_before = 0.0000;
    let valorisation_l_verte_before = 0.0000;
    let valorisation_totale_before = 0.0000;
    let ecarts_pesee_before = 0;
    let filieres_interdites_dd_before = 0;
    let filieres_interdites_norm_before = 0;
    let incoherences_filieres_dd_before = 0;
    let incoherences_filieres_norm_before = 0;
    let retards_dd_before = 0;
    let retards_norm_before = 0;
    let total_bdx_before = 0;
    let total_lost_before = 0;
    console.log(lastYearJson)
    let dateBefore = (lastYearJson.length !== 0) ? lastYearJson[0].date : date



    actualJson.forEach(function(element) {
        volume_total_actual += parseFloat(element.volume_total);
        volume_listeverte_actual += parseFloat(element.volume_l_verte);
        valorisation_l_verte_actual += parseFloat(element.valorisation_l_verte);
        valorisation_totale_actual += parseFloat(element.valorisation_totale);
        ecarts_pesee_actual += parseFloat(element.ecarts_pesee);
        filieres_interdites_dd_actual += parseFloat(element.filieres_interdites_dd);
        filieres_interdites_norm_actual += parseFloat(element.filieres_interdites_norm);
        incoherences_filieres_dd_actual += parseFloat(element.incoherences_filieres_dd);
        incoherences_filieres_norm_actual += parseFloat(element.incoherences_filieres_norm);
        retards_dd_actual += parseFloat(element.retards_dd);
        retards_norm_actual += parseFloat(element.retards_norm);
        if (element.date === date) {
            total_lost_actual += parseFloat(element.non_dates);
        }
        total_bdx_actual += parseFloat(element.bordereaux);

    });

    lastYearJson.forEach(function(element) {
        volume_total_before += parseFloat(element.volume_total);
        volume_listeverte_before += parseFloat(element.volume_l_verte);
        valorisation_l_verte_before += parseFloat(element.valorisation_l_verte);
        valorisation_totale_before += parseFloat(element.valorisation_totale);
        ecarts_pesee_before += parseFloat(element.ecarts_pesee);
        filieres_interdites_dd_before += parseFloat(element.filieres_interdites_dd);
        filieres_interdites_norm_before += parseFloat(element.filieres_interdites_norm);
        incoherences_filieres_dd_before += parseFloat(element.incoherences_filieres_dd);
        incoherences_filieres_norm_before += parseFloat(element.incoherences_filieres_norm);
        retards_dd_before += parseFloat(element.retards_dd);
        retards_norm_before += parseFloat(element.retards_norm);
        if (element.date === dateBefore) {
            total_lost_before += parseFloat(element.non_dates);
        }
        total_bdx_before += parseFloat(element.bordereaux);

    });

    /*
        Data Receivers for each component
    */
    let dataForLeftGauge = {leftvalue: 0, leftvalueBefore: 0, leftvalueAnte: 0, leftvalueBeforeAnte: 0, details: "", v_listeverte: 0};
    let dataForMiddleGauge = {middlevalue: 0, middlevalueBefore: 0, middlevalueAnte: 0, middlevalueBeforeAnte: 0, v_total: 0};
    let dataForRightGauge = {rightvalue: 0, rightvalueBefore: 0, rightvalueAnte: 0, rightvalueBeforeAnte: 0, bdx: 0};
    let dataForLeftTile = {};
    let dataForMiddleLeftTile = {};
    let dataForMiddleRightTile = {};
    let dataForRightTile = {};


    dataForLeftTile.ecarts_pesee = ecarts_pesee_actual;
    dataForRightTile.incoherences_filieres_dd = incoherences_filieres_dd_actual;
    dataForRightTile.incoherences_filieres_norm = incoherences_filieres_norm_actual + incoherences_filieres_dd_actual;
    dataForMiddleLeftTile.filieres_interdites_dd = filieres_interdites_dd_actual;
    dataForMiddleLeftTile.filieres_interdites_norm = filieres_interdites_norm_actual + filieres_interdites_dd_actual;
    dataForMiddleRightTile.retards_dd = retards_dd_actual;
    dataForMiddleRightTile.retards_norm = retards_norm_actual + retards_dd_actual;

    dataForLeftTile.isGrowingLeft = (ecarts_pesee_actual >= ecarts_pesee_before) ? true : false;
    dataForRightTile.isGrowingRight = (incoherences_filieres_norm_actual + incoherences_filieres_dd_actual >= incoherences_filieres_norm_before + incoherences_filieres_dd_before) ? true : false;
    dataForMiddleLeftTile.isGrowingMiddleLeft = (filieres_interdites_norm_actual + filieres_interdites_dd_actual >= filieres_interdites_norm_before + filieres_interdites_dd_before) ? true : false;
    dataForMiddleRightTile.isGrowingMiddleRight = (retards_norm_actual + retards_dd_actual >= retards_norm_before + retards_dd_before) ? true : false;


    if (!(volume_total_actual === 0.0000)) {

        dataForLeftGauge.leftvalue = valorisation_l_verte_actual*100/volume_listeverte_actual
        if(!(volume_total_before === 0.0000)) {
            dataForLeftGauge.leftvalueBefore = 88//valorisation_l_verte_before*100/volume_listeverte_before
        } else {
            dataForLeftGauge.leftvalueBefore = 88//0
        }
        dataForLeftGauge.leftvalueAnte = window.store.getState().updateGauge.leftvalue
        dataForLeftGauge.leftvalueBeforeAnte = window.store.getState().updateGauge.leftvalueBefore
        dataForLeftGauge.v_listeverte = volume_listeverte_actual

        dataForRightGauge.rightvalue = 100 - (total_lost_actual*100/(total_bdx_actual + total_lost_actual))
        if(!(total_bdx_before + total_lost_before === 0.0000)) {
            dataForRightGauge.rightvalueBefore = 78//100 - (total_lost_before*100/(total_bdx_before + total_lost_before))
        } else {
            dataForRightGauge.rightvalueBefore = 78//0
        }
        dataForRightGauge.rightvalueAnte = window.store.getState().updateGauge.rightvalue
        dataForRightGauge.rightvalueBeforeAnte = window.store.getState().updateGauge.rightvalueBefore
        dataForRightGauge.bdx = total_lost_actual

        dataForMiddleGauge.middlevalue = valorisation_totale_actual*100/volume_total_actual
        if (!(volume_total_before === 0.0000)) {
            dataForMiddleGauge.middlevalueBefore = 81//valorisation_totale_before*100/volume_total_before
        } else {
            dataForMiddleGauge.middlevalueBefore = 81//0
        }

        dataForMiddleGauge.middlevalueAnte = window.store.getState().updateGauge.middlevalue
        dataForMiddleGauge.middlevalueBeforeAnte = window.store.getState().updateGauge.middlevalueBefore
        dataForMiddleGauge.v_total = volume_total_actual


    } else {
         dataForLeftGauge.details = "Pas de Bordereaux sur la période sélectionnée"
         dataForMiddleGauge.details = "Pas de Bordereaux sur la période sélectionnée"
         dataForLeftGauge.leftvalue = 100
         dataForLeftGauge.leftvalueBefore = 100
         dataForLeftGauge.leftvalueAnte = 0
         dataForLeftGauge.leftvalueBeforeAnte = 0
         dataForLeftGauge.v_listeverte = volume_listeverte_actual
         dataForMiddleGauge.middlevalue = 100
         dataForMiddleGauge.middlevalueBefore = 100
         dataForMiddleGauge.middlevalueAnte = 0
         dataForMiddleGauge.middlevalueBeforeAnte = 0
         dataForMiddleGauge.v_total = volume_total_actual
         dataForRightGauge.rightvalue = 100 - (total_lost_actual*100/(total_bdx_actual + total_lost_actual))
         dataForRightGauge.rightvalueBefore = 100 - (total_lost_before*100/(total_bdx_before + total_lost_before))
         dataForRightGauge.rightvalueAnte = window.store.getState().updateGauge.rightvalue
         dataForRightGauge.rightvalueBeforeAnte = window.store.getState().updateGauge.rightvalueBefore
         dataForRightGauge.bdx = total_lost_actual
     }

    let response = {
        dataForLeftGauge: dataForLeftGauge,
        dataForMiddleGauge: dataForMiddleGauge,
        dataForRightGauge: dataForRightGauge,
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
