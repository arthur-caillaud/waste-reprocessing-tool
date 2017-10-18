var HelperService = {}


function getAllLevelNames(architecture) {
    console.log(architecture)
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
    console.log(Liste)
    return Liste
}

HelperService.filterByValue = filterByValue;
HelperService.getAllLevelNames = getAllLevelNames;
export default HelperService;
