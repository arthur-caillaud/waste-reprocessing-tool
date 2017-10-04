var excel = require('exceljs');
var Rx = require ('rx');
var config = require('../config.json');
var Sequelize = require('sequelize');
var db = require('./db.js');

//Import data models
var models = require('../models/');
var bordereau = models.bordereau;
var dechet = models.dechet;
var prestataire = models.prestataire;
var site = models.site;
var traitement = models.traitement;
var transport = models.transport;
var transporteur = models.transporteur;
var type_traitement = models.type_traitement;

//
toQualification = function(code_dr){
    if (typeof code_dr == "string"){
        if (code_dr.slice(0,1) == 'D'){
            return "Elimination"
        }
        if (code_dr.slice(0,1) == 'R'){
            return "Recyclage"
        }
    }
    return null;
}
toSequelizeDate = function(excelDate){
    if (excelDate){
        return (new Date(excelDate.toString().slice(6,10),excelDate.toString().slice(3,5),excelDate.toString().slice(0,2)));
    }
    return null;
}
toBordereauFinished = function(etatBordereau){
    if (etatBordereau == 'T'){
        return 1
    }
    if (etatBordereau == 'E'){
        return 0
    }
    return null;
}
toQuantiteeEstimee = function(estimeeBool){
    if(estimeeBool == "E"){
        return 1
    }
    if(estimeeBool == "R"){
        return 0
    }
    return null
}
toIndicateurNationalValorisation = function(indicateurNationalValorisation) {
    if (indicateurNationalValorisation == "Oui"){

    }
}

convertRowIntoDechetSequelize = function(excelRow){
    var newDechet = {
        codeinterne: excelRow[8],
        libelle: excelRow[9],
        code_europeen: excelRow[10],
        categorie: excelRow[11],
        indicateur_national_valorisation: excelRow[12],
        famille: excelRow[13]
    };

    var dechetObservable = Rx.Observable.create(obs => {
        try{
            if (newDechet.libelle){
                dechet.findOrCreate({where: newDechet})
                .spread((dechet, created) => {
                    if (created){
                        console.log("Successfully created new dechet");
                    }
                    obs.onNext(dechet);
                });
            }
            else {
                obs.onNext(null);
            }
        }
        catch(Exception){
            obs.onError(Exception);
        }
    });
    return dechetObservable;
};

convertRowIntoSiteSequelize = function(excelRow){
    var newSite = {
        site_production: excelRow[16],
        unite_dependance: excelRow[17],
        up_dependance: excelRow[18],
        metier_dependance: excelRow[19]
    };

    var siteObservable = Rx.Observable.create(obs => {
        try {
            if(excelRow[15]){
                site.findOrCreate({where: {nom: excelRow[15]}, defaults: newSite})
                .spread((site, created) => {
                    if (created){
                        console.log("Successfully created new site");
                    }
                    obs.onNext(site);
                })
            }
            else{
                obs.onNext(null);
            }
        }
        catch(Exception){
            obs.onError(Exception);
        }
    });
    return siteObservable;
};

convertRowIntoPrestataireSequelize = function(excelRow){
    var newPrestataireInter = {
        nom: excelRow[30],
        localisation: excelRow[31]
    };
    var newPrestataireFinal = {
        nom: excelRow[42],
        localisation: excelRow[43]
    };

    var prestataireObservable = Rx.Observable.create((obs) => {
        try{
            if(excelRow[32]){
                prestataire.findOrCreate({where: {siret: excelRow[32],}, defaults: newPrestataireInter})
                .spread((prestataireInter, created) => {
                    if (created){
                        console.log("Successfully created new prestataire");
                    }
                    obs.onNext({
                        prestataireInter: prestataireInter,
                        prestataireFinal: null
                    })
                })
            }
            else {
                obs.onNext({
                    prestataireInter_isNull: true
                });
            }
            if(excelRow[44]){
                prestataire.findOrCreate({where: {siret: excelRow[44],}, defaults: newPrestataireFinal})
                .spread((prestataireFinal, created) => {
                    if(created){
                        console.log("Successfully created new prestataire");
                    }
                    obs.onNext({
                        prestataireInter: null,
                        prestataireFinal: prestataireFinal
                    });
                });
            }
            else {
                obs.onNext({
                    prestataireFinal_isNull: true
                });
            }
        }
        catch(Exception){
            obs.onError(Exception);
        }
    });
    return prestataireObservable;
};

convertRowIntoTypeTraitementSequelize = function(excelRow){
    var typeTraitementPrevu = {
        code_edf: excelRow[7],
        qualification: toQualification(excelRow[6])
    };
    var typeTraitementFinal = {
        code_edf: excelRow[49],
        qualification: toQualification(excelRow[48])
    };
    var typeTraitementInter = {
        code_edf: excelRow[36],
        qualification: toQualification(excelRow[35])
    };

    var typeTraitementObservable = Rx.Observable.create(obs => {
        try{
            if(excelRow[6]){
                type_traitement.findOrCreate({where: {code_dr: excelRow[6]}, defaults: typeTraitementPrevu})
                .spread((typeTraitementPrevu, created) => {
                    if (created){
                        console.log("Successfully created new type_traitement");
                    }
                    obs.onNext({
                        typeTraitementPrevu: typeTraitementPrevu,
                        typeTraitementInter: null,
                        typeTraitementFinal: null
                    })
                })
            }
            else{
                obs.onNext({
                    typeTraitementPrevu_isNull: true
                });
            }
            if(excelRow[48]){
                type_traitement.findOrCreate({where: {code_dr: excelRow[48]}, defaults: typeTraitementFinal})
                .spread((typeTraitementFinal, created) => {
                    if (created){
                        console.log("Successfully created new type_traitement:");
                    }
                    obs.onNext({
                        typeTraitementPrevu: null,
                        typeTraitementInter: null,
                        typeTraitementFinal: typeTraitementFinal
                    })
                })
            }
            else {
                obs.onNext({
                    typeTraitementFinal_isNull: true
                });
            }
            if(excelRow[36]){
                type_traitement.findOrCreate({where: {code_dr: excelRow[36]}, defaults: typeTraitementInter})
                .spread((typeTraitementInter, created) => {
                    if (created){
                        console.log("Successfully created new type_traitement:");
                    }
                    obs.onNext({
                        typeTraitementPrevu: null,
                        typeTraitementInter: typeTraitementInter,
                        typeTraitementFinal: null
                    })
                })
            }
            else{
                obs.onNext({
                    typeTraitementInter_isNull: true
                });
            }
        }
        catch(Exception){
            obs.onError(Exception);
        }
    });

    return typeTraitementObservable;
}

convertRowIntoTransporteurSequelize = function(excelRow){
    var transporteurObservable = Rx.Observable.create((obs) => {
        try{
            newTransporteur1 = {
                nom: excelRow[22],
                localisation: excelRow[23]
            };
            newTransporteur2 = {
                nom: excelRow[37],
                localisation: excelRow[39]
            }
            if(excelRow[26]){
                transporteur.findOrCreate({where: {siret: excelRow[26]}, defaults: newTransporteur1})
                .spread((transporteur1, created) => {
                    if(created){
                        console.log("Successfully created new transporteur");
                    }
                    obs.onNext({
                        transporteur1: transporteur1,
                        transporteur2: null
                    });
                });
            }
            else{
                obs.onNext({
                    transporteur1_isNull: true
                });
            }
            if(excelRow[40]){
                transporteur.findOrCreate({where: {siret: excelRow[40]}, defaults: newTransporteur2})
                .spread((transporteur2, created) => {
                    if(created){
                        console.log("Successfully created new transporteur");
                    }
                    obs.onNext({
                        transporteur1: null,
                        transporteur2: transporteur2
                    });
                });
            }
            else{
                obs.onNext({
                    transporteur2_isNull: true
                });
            }
        }
        catch(Exception){
            obs.onError(Exception);
        };
    });
    return transporteurObservable;
};

convertRowIntoTransportSequelize = function(excelRow){
    var transport1 = {
        date: toSequelizeDate(excelRow[20]),
        mode: excelRow[21],
        recepisse: excelRow[24],
        immatriculation: excelRow[25],
        adr: excelRow[27]
    };
    var transport2 = {
        date: null,
        mode: excelRow[38],
        recepisse: excelRow[41],
        immatriculation: null,
        adr: null
    };
    var transportObservable = Rx.Observable.create(obs => {
        try{
            var transporteurObservable = convertRowIntoTransporteurSequelize(excelRow);
            transporteurObservable.subscribe({
                onNext: function(value){
                    if(value.transporteur1){
                        transport.findOrCreate({where: transport1, defaults: {id_transporteur: value.transporteur1.dataValues.id}})
                        .spread((transport1, created) => {
                            if(created){
                                console.log("Successfully created new transport");
                            }
                            obs.onNext({
                                transport1: transport1,
                                transport2: null
                            })
                        })
                    }
                    if(value.transporteur1_isNull){
                        obs.onNext({
                            transport1_isNull: true
                        })
                    }
                    if(value.transporteur2){
                        transport.findOrCreate({where: transport2, defaults: {id_transporteur: value.transporteur2.dataValues.id}})
                        .spread((transport2, created) => {
                            if(created){
                                console.log("Successfully created new transport");
                            }
                            obs.onNext({
                                transport1: null,
                                transport2: transport2
                            })
                        })
                    }
                    if(value.transporteur2_isNull){
                        obs.onNext({
                            transport2_isNull: true
                        })
                    }
                },
                onError: err => {
                    console.error(err);
                }
            })
        }
        catch(Exception){
            obs.onError(Exception)
        }
    });

    return transportObservable;
}

convertRowIntoTraitementSequelize = function(excelRow){
    var traitementInter = {
        date_priseencharge: toSequelizeDate(excelRow[33]),
        date_traitement: toSequelizeDate(excelRow[34])
    };
    var traitementFinal = {
        date_priseencharge: toSequelizeDate(excelRow[45]),
        date_traitement: toSequelizeDate(excelRow[47])
    };

    try{
        var traitementObservable = Rx.Observable.create(obs => {
            var typeTraitementObservable = convertRowIntoTypeTraitementSequelize(excelRow);
            var prestataireObservable = convertRowIntoPrestataireSequelize(excelRow);
            typeTraitementObservable.subscribe({
                onNext: value => {
                    if(value.typeTraitementInter){
                        traitementInter.id_type_traitement = value.typeTraitementInter.dataValues.id;
                        if(traitementInter.id_prestataire){
                            traitement.findOrCreate({where: traitementInter})
                            .spread((traitementInter, created) => {
                                if(created){
                                    console.log("Successfully created new traitement");
                                }
                                obs.onNext({
                                    traitementInter: traitementInter,
                                    traitementFinal: null
                                })
                            })
                        }
                    }
                    if(value.typeTraitementInter_isNull){
                        traitementInter.id_type_traitement = null;
                        if(traitementInter.id_prestataire){
                            traitement.findOrCreate({where: traitementInter})
                            .spread((traitementInter, created) => {
                                if(created){
                                    console.log("Successfully created new traitement");
                                }
                                obs.onNext({
                                    traitementInter: traitementInter,
                                    traitementFinal: null
                                })
                            })
                        }
                        if(traitementInter.id_prestataire === null){
                            obs.onNext({
                                traitementInter_isNull: true
                            })
                        }
                    }
                    if(value.typeTraitementFinal){
                        traitementFinal.id_type_traitement = value.typeTraitementFinal.dataValues.id;
                        if(traitementFinal.id_prestataire){
                            traitement.findOrCreate({where: traitementFinal})
                            .spread((traitementFinal, created) => {
                                if(created){
                                    console.log("Successfully created new traitement");
                                }
                                obs.onNext({
                                    traitementInter: null,
                                    traitementFinal: traitementFinal
                                })
                            })
                        }
                    }
                    if(value.typeTraitementFinal_isNull){
                        traitementFinal.id_type_traitement = null;
                        if(traitementFinal.id_prestataire){
                            traitement.findOrCreate({where: traitementFinal})
                            .spread((traitementFinal, created) => {
                                if(created){
                                    console.log("Successfully created new traitement");
                                }
                                obs.onNext({
                                    traitementInter: null,
                                    traitementFinal: traitementFinal
                                })
                            })
                        }
                        if(traitementFinal.id_prestataire === null){
                            obs.onNext({
                                traitementFinal_isNull: true
                            })
                        }
                    }
                },
                onError: err => {
                    console.error(err);
                }
            });
            prestataireObservable.subscribe({
                onNext: function(value){
                    if(value.prestataireInter){
                        traitementInter.id_prestataire = value.prestataireInter.dataValues.id;
                        if (traitementInter.id_type_traitement){
                            traitement.findOrCreate({where: traitementInter})
                            .spread((traitementInter, created) => {
                                if(created){
                                    console.log("Successfully created new traitement");
                                }
                                obs.onNext({
                                    traitementInter: traitementInter,
                                    traitementFinal: null
                                })
                            })
                        }
                    }
                    if(value.prestataireInter_isNull){
                        traitementInter.id_prestataire = null;
                        if (traitementInter.id_type_traitement){
                            traitement.findOrCreate({where: traitementInter})
                            .spread((traitementInter, created) => {
                                if(created){
                                    console.log("Successfully created new traitement");
                                }
                                obs.onNext({
                                    traitementInter: traitementInter,
                                    traitementFinal: null
                                })
                            })
                        }
                        if(traitementInter.id_type_traitement === null){
                            obs.next({
                                traitementInter_isNull: true
                            })
                        }
                    }
                    if(value.prestataireFinal){
                        traitementFinal.id_prestataire = value.prestataireFinal.dataValues.id;
                        if(traitementFinal.id_type_traitement){
                            traitement.findOrCreate({where: traitementFinal})
                            .spread((traitementFinal, created) => {
                                if(created){
                                    console.log("Successfully created new traitement");
                                }
                                obs.onNext({
                                    traitementInter: null,
                                    traitementFinal: traitementFinal
                                })
                            })
                        }
                    }
                    if(value.prestataireFinal_isNull){
                        traitementFinal.id_prestataire = null;
                        if (traitementFinal.id_type_traitement){
                            traitement.findOrCreate({where: traitementFinal})
                            .spread((traitementFinal, created) => {
                                if(created){
                                    console.log("Successfully created new traitement");
                                }
                                obs.onNext({
                                    traitementInter: null,
                                    traitementFinal: traitementFinal
                                })
                            })
                        }
                        if(traitementFinal.id_type_traitement === null){
                            obs.next({
                                traitementFinal_isNull: true
                            })
                        }
                    }
                },
                onError: err => {
                    console.error(err);
                }
            });
        })
    }
    catch(Exception){
        obs.onError(Exception)
    }
    return traitementObservable;
}

convertRowIntoBordereauSequelize = function(excelRow){
    var newBordereau = {
        num_bordereau: excelRow[1],
        cas: excelRow[2],
        nom_emetteur: excelRow[3],
        bordereau_finished: toBordereauFinished(excelRow[4]),
        mode_suivi: excelRow[5],
        ref_dossier: excelRow[14],
        quantitee_transportee: excelRow[28],
        quantitee_finale: excelRow[46],
        quantitee_estimee: toQuantiteeEstimee(excelRow[29])
    }

    const findOrCreateBordereau = function(obs){
        if(newBordereau.id_dechet !== undefined || newBordereau.id_site !== undefined || newBordereau.id_transport_1 !== undefined || newBordereau.id_transport_2 !== undefined || newBordereau.id_traitement_final !== undefined || newBordereau.id_traitement_prevu !== undefined || newBordereau.id_traitement_inter !== undefined ){
            bordereau.findOrCreate({where: newBordereau})
            .spread((bordereau, created) => {
                if (created){
                    console.log("Successfully created new bordereau");
                }
                obs.onNext(bordereau);
            })
        }
    }

    var bordereauObservable = Rx.Observable.create(obs => {
        var traitementObservable = convertRowIntoTraitementSequelize(excelRow);
        var dechetObservable = convertRowIntoDechetSequelize(excelRow);
        var transportObservable = convertRowIntoTransportSequelize(excelRow);
        var siteObservable = convertRowIntoSiteSequelize(excelRow);
        var typeTraitementObservable = convertRowIntoTypeTraitementSequelize(excelRow);

        try{
            traitementObservable.subscribe({
                onNext: value => {
                    if(value.traitementInter){
                        newBordereau.id_traitement_inter = value.traitementInter.dataValues.id;
                        findOrCreateBordereau(obs);
                    }
                    if(value.traitementFinal){
                        newBordereau.id_traitement_final = value.traitementFinal.dataValues.id;
                        findOrCreateBordereau(obs);
                    }
                    if(value.traitementInter_isNull){
                        newBordereau.id_traitement_inter = null;
                        findOrCreateBordereau(obs);
                    }
                    if(value.traitementFinal_isNull){
                        newBordereau.id_traitement_final = null;
                        findOrCreateBordereau(obs);
                    }
                },
                onError: err => {
                    console.error(err);
                }
            });
            dechetObservable.subscribe({
                onNext: value => {
                    if(value){
                        newBordereau.id_dechet = value.dataValues.id;
                        findOrCreateBordereau(obs);
                    }
                    if(value === null){
                        newBordereau.id_dechet = null;
                        findOrCreateBordereau(obs);
                    }
                },
                onError: err => {
                    console.error(err);
                },
                onCompleted: () => {
                }
            });
            transportObservable.subscribe({
                onNext: value => {
                    if(value.transport1){
                        newBordereau.id_transport_1 = value.transport1.dataValues.id;
                        findOrCreateBordereau(obs);
                    }
                    if(value.transport1_isNull){
                        newBordereau.id_transport_1 = null;
                        findOrCreateBordereau(obs);
                    }
                    if(value.transport2){
                        newBordereau.id_transport_2 = value.transport2.dataValues.id;
                        findOrCreateBordereau(obs);
                    }
                    if(value.transport2_isNull){
                        newBordereau.id_transport_2 = null;
                    }
                },
                onError: err => {
                    console.error(err);
                }
            });
            siteObservable.subscribe({
                onNext: value => {
                    if(value){
                        newBordereau.id_site = value.id;
                        findOrCreateBordereau(obs);
                    }
                    if(value === null){
                        newBordereau.id_site = null;
                        findOrCreateBordereau(obs);
                    }
                },
                onError: err => {
                    console.error(err);
                },
                onCompleted: () => {

                }
            });
            typeTraitementObservable.subscribe({
                onNext: value => {
                    if(value.typeTraitementPrevu){
                        newBordereau.id_traitement_prevu = value.typeTraitementPrevu.dataValues.id;
                        findOrCreateBordereau(obs);
                    }
                    if(value.typeTraitementPrevu_isNull){
                        newBordereau.id_traitement_prevu = null;
                        findOrCreateBordereau(obs);
                    }
                },
                onError: err => {
                    console.error(err);
                }
            });
        }
        catch (Exception){
            obs.onError(Exception)
        }
    });
    return bordereauObservable;
}

readXlsx = function (filepath) {
    //The input is an xlsx filepath et the function callbacks a json containing the whole excel data
    //Warning : function only supports .XLSX files

    var workBook = new excel.Workbook();
    var jsonExcel = [];

    var readObservable = Rx.Observable.create(obs => {
        // Using directly the filepath, NOT APPENDING ANYTHING
        workBook.xlsx.readFile(filepath)
            .then(() => {
                // use workbook
                console.log("Start reading excel file...")
                workBook.getWorksheet(config.excel.MAIN_SHEET).eachRow(function(row,rowNumber) {
                    if(rowNumber > config.excel.STARTING_ROW){
                        var newRow = [null];
                        row.values.forEach(cell => {
                            var newCell = cell;
                            if (typeof cell == "string"){
                                newCell = cell.trim();
                            }
                            if (cell == ""){
                                newCell = null;
                            }
                            newRow.push(newCell);
                        })
                        jsonExcel.push(newRow);
                    }
                });
                obs.onNext(jsonExcel);
                obs.onCompleted();
            })
            .catch(error => {
                obs.onError(error);
            })
    });
    return readObservable;
};
writeIntoBdd = function(excelName) {
    //The input is an excelname located in the data/ directory
    //The function enables pushing raw data in the database by converting it to the database model

    var sequelize = db.mySqlConnect();
    sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        var readXlsxObservable = readXlsx(config.excel.DATA_DIR + excelName);
        console.log("readXlsxObservable built");
        readXlsxObservable.subscribe({
                onNext: (jsonExcel) => {
                    console.log("Successfully loaded excel data in RAM");
                    jsonExcel.forEach(row => {
                        var bordereauObservable = convertRowIntoBordereauSequelize(row);
                        bordereauObservable.subscribe({
                            onNext: bordereau => {
                                console.log("Successfully pushed excel whole row into database");
                            },
                            onError: error => {
                                console.error("Error thrown by bordereauObservable", error);
                            },
                        })
                    });
                },
                onError: error => {
                    console.error("Error in writeIntoBdd")
                    console.error(error);
                },
                onCompleted: () => {
                    console.log("readXlsx completed");
                }
            })
    })
    .catch(err => {
        console.error('Database connection lost or unable to start');
    });
};

//Export du service

/*var service = {}
service.readXlsx = readXlsx;
service.writeBordereauIntoBDD = writeBordereauIntoBdd;
service.convertRowIntoSequelize = convertRowIntoSequelize;
module.exports = service;*/


//Phase d'essai

/*readXlsx(config.excel.DATA_DIR + "dataedfmars.xlsx").subscribe({
    onNext: excel => {
        convertRowIntoDechetSequelize(excel[3]).subscribe({
            onNext: value => {
                console.log(value);
            },
            onCompleted: {
            },
            onError: error => {
                console.error(error);
            }
        });
    },
    onError: err => {
        console.error(err);
    },
    onCompleted: () => {
        console.log("completed");
    }
})*/

writeIntoBdd("dataedfmars.xlsx");
