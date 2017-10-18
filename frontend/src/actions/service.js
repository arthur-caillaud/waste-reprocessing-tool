var HelperService = {}


function getAllLevelNames(architecture) {
    /*
    When typing something in the main searchbar, we can search any type of level in EDF Structure
    This means that we must load the entire EDF architecture, and go through it to get
    the names of All the different levels.
    */
    let levelNames = []

    for (let metier_dependance in architecture) {
        levelNames.push({ nom: metier_dependance, level: 1 })
        let metier = architecture[metier_dependance]

        for (let up_dependance in metier) {
            levelNames.push({ nom: up_dependance, level: 2 })
            let up = metier[up_dependance]

            for (let unite_dependance in up) {
                levelNames.push({ nom: unite_dependance, level: 3 })
                let unite = up[unite_dependance]

                for (let site in unite) {
                    levelNames.push({ nom: site, level: 4 })

                }
            }
        }

    }
    return levelNames;
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
    let dataForLeftGauge = {leftvalue: 0, leftvalueBefore: 0, leftvalueAnte: 0, leftvalueBeforeAnte: 0}
    let dataForMiddleGauge = {middlevalue: 0, middlevalueBefore: 0, middlevalueAnte: 0, middlevalueBeforeAnte: 0}
    let dataForRightGauge = {}
    if (!(json.volume_total == "0.0000")) {

        dataForLeftGauge.leftvalue = parseInt(json.valorisation_l_verte)*100/parseInt(json.volume_total)
        dataForLeftGauge.leftvalueBefore = 12
        dataForLeftGauge.leftvalueAnte = window.store.getState().updateGauge.leftvalue
        dataForLeftGauge.leftvalueBeforeAnte = window.store.getState().updateGauge.leftvalueBefore

        dataForMiddleGauge.middlevalue = parseInt(json.valorisation_totale)*100/parseInt(json.volume_total)
        dataForMiddleGauge.middlevalueBefore = 12
        dataForMiddleGauge.middlevalueAnte = window.store.getState().updateGauge.middlevalue
        dataForMiddleGauge.middlevalueBeforeAnte = window.store.getState().updateGauge.middlevalueBefore
    }

    let response = { dataForLeftGauge: dataForLeftGauge, dataForMiddleGauge: dataForMiddleGauge }
    return response

}


HelperService.presentDataForNewSite = presentDataForNewSite;
HelperService.filterByValue = filterByValue;
HelperService.getAllLevelNames = getAllLevelNames;
export default HelperService;
