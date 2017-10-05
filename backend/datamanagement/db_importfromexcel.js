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
var toQualification = function(code_dr){
    if (code_dr.slice(0,1) == 'D'){
        return "Elimination"
    }
    if (code_dr.slice(0,1) == 'R'){
        return "Recyclage"
    }
    else {
        return null;
    }
}
var toSequelizeDate = function(excelDate){
    if (excelDate){
        return (new Date(excelDate.toString().slice(6,10),excelDate.toString().slice(3,5),excelDate.toString().slice(0,2)));
    }
    return null;
}
var toBordereauFinished = function(etatBordereau){
    if (etatBordereau == 'T'){
        return 1
    }
    if (etatBordereau == 'E'){
        return 0
    }
    return null;
}
var toQuantiteeEstimee = function(estimeeBool){
    if(estimeeBool == "E"){
        return 1
    }
    if(estimeeBool == "R"){
        return 0
    }
    return null
}

var convertRowIntoDechetSequelize = function(excelRow){
    var newDechet = {
        libelle: excelRow[9],
        code_europeen: excelRow[10],
        categorie: excelRow[11],
        indicateur_national_valorisation: excelRow[12],
        famille: excelRow[13]
    };

    var dechetObservable = Rx.Observable.create(obs => {
        dechet.findOrCreate({where: {codeinterne: excelRow[8]}, defaults: newDechet})
        .spread((dechet, created) => {
            if (created){
                console.log("Successfully created new dechet:");
                console.log(dechet);
            }
            obs.onNext(dechet);
        })
    });

    return dechetObservable;
};
var convertRowIntoSiteSequelize = function(excelRow){
    var newSite = {
        site_production: excelRow[16],
        unite_dependance: excelRow[17],
        up_dependance: excelRow[18],
        metier_dependance: excelRow[19]
    };

    var siteObservable = Rx.Observable.create(obs => {
        site.findOrCreate({where: {nom: excelRow[15]}, defaults: newSite})
        .spread((site, created) => {
            if (created){
                console.log("Successfully created new site:");
                console.log(site);
            }
            obs.onNext(site)
        })
    });

    return siteObservable;
};
var convertRowIntoPrestataireSequelize = function(excelRow){
    var newPrestataireInter = {
        nom: excelRow[30],
        localisation: excelRow[31]
    };

    var newPrestataireFinal = {
        nom: excelRow[42],
        localisation: excelRow[43]
    };

    var prestataireObservable = Rx.Observable.create((obs) => {
        prestataire.findOrCreate({where: {siret: excelRow[32],}, defaults: newPrestataireInter})
        .spread((prestataireInter, created) => {
            if (created){
                console.log("Successfully created new prestataire:");
                console.log(prestataireInter);
            }
            obs.onNext({
                prestataireInter: prestataireInter,
                prestataireFinal: null
            })
        })
        prestataire.findOrCreate({where: {siret: excelRow[44],}, defaults: newPrestataireFinal})
        .spread((prestataireFinal, created) => {
            if(created){
                console.log("Successfully created new prestataire");
                console.log(prestataireFinal);
            }
            obs.onNext({
                prestataireInter: null,
                prestataireFinal: prestataireFinal
            })
        })
    });

    return prestataireObservable;
};
var convertRowIntoTypeTraitementSequelize = function(excelRow){
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
        type_traitement.findOrCreate({where: {code_dr: excelRow[6]}, defaults: typeTraitementPrevu})
        .spread((typeTraitementPrevu, created) => {
            console.log(typeTraitementPrevu);
            if (created){
                console.log("Successfully created new type_traitement:");
            }
            obs.onNext({
                typeTraitementPrevu: typeTraitementPrevu,
                typeTraitementInter: null,
                typeTraitementFinal: null
            })
        })
        type_traitement.findOrCreate({where: {code_dr: excelRow[48]}, defaults: typeTraitementFinal})
        .spread((typeTraitementFinal, created) => {
            console.log(typeTraitementFinal);
            if (created){
                console.log("Successfully created new type_traitement:");
            }
            obs.onNext({
                typeTraitementPrevu: null,
                typeTraitementInter: null,
                typeTraitementFinal: typeTraitementFinal
            })
        })
        type_traitement.findOrCreate({where: {code_dr: excelRow[36]}, defaults: typeTraitementInter})
        .spread((typeTraitementInter, created) => {
            if (created){
                console.log("Successfully created new type_traitement:");
                console.log(typeTraitementInter);
            }
            obs.onNext({
                typeTraitementPrevu: null,
                typeTraitementInter: typeTraitementInter,
                typeTraitementFinal: null
            })
        })
    });

    return typeTraitementObservable;
}
var convertRowIntoTransporteurSequelize = function(excelRow){
    console.log("Building TransporteurObservable...");
    var transporteurObservable = Rx.Observable.create((obs) => {
        newTransporteur1 = {
            nom: excelRow[22],
            localisation: excelRow[23]
        };
        newTransporteur2 = {
            nom: excelRow[37],
            localisation: excelRow[39]
        }
        transporteur.findOrCreate({where: {siret: excelRow[26]}, defaults: newTransporteur1})
        .spread((transporteur1, created) => {
            if(created){
                console.log("Successfully created new transporteur:");
                console.log(transporteur1);
            }
            obs.onNext({
                transporteur1: transporteur1,
                transporteur2: null
            });
        });

        transporteur.findOrCreate({where: {siret: excelRow[40]}, defaults: newTransporteur2})
        .spread((transporteur2, created) => {
            if(created){
                console.log("Successfully created new transporteur:");
                console.log(transporteur2);
            }
            obs.onNext({
                transporteur1: null,
                transporteur2: transporteur2
            });
        });
    });
    console.log("Successfully built transporteurObservable");
    return transporteurObservable;
}
var convertRowIntoTransportSequelize = function(excelRow){
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

    console.log("Building transportObservable...");
    var transportObservable = Rx.Observable.create(obs => {
        var transporteurObservable = convertRowIntoTransporteurSequelize(excelRow);
        transporteurObservable.subscribe({
            onNext: function(value){
                if(value.transporteur1){
                    transport.findOrCreate({where: transport1, defaults: {id_transporteur: value.transporteur1.id}})
                    .spread((transport1, created) => {
                        if(created){
                            console.log("Successfully created new transport:");
                            console.log(transport1);
                        }
                        obs.onNext({
                            transport1: transport1,
                            transport2: null
                        })
                    })
                }
                if(value.transporteur2){
                    transport.findOrCreate({where: transport2, defaults: {id_transporteur: value.transporteur2.id}})
                    .spread((transport2, created) => {
                        if(created){
                            console.log("Successfully created new transport:");
                            console.log(transport2);
                        }
                        obs.onNext({
                            transport1: null,
                            transport2: transport2
                        })
                    })
                }
            }
        })
    });
    console.log("Successfully built transportObservable");

    return transportObservable;
}
var convertRowIntoTraitementSequelize = function(excelRow){
    var traitementInter = {
        date_priseencharge: toSequelizeDate(excelRow[33]),
        date_traitement: toSequelizeDate(excelRow[34])
    };
    var traitementFinal = {
        date_priseencharge: toSequelizeDate(excelRow[45]),
        date_traitement: toSequelizeDate(excelRow[47])
    };

    console.log("Building traitementObservable...");
    var traitementObservable = Rx.Observable.create(obs => {
        var typeTraitementObservable = convertRowIntoTypeTraitementSequelize(excelRow);
        var prestataireObservable = convertRowIntoPrestataireSequelize(excelRow);
        typeTraitementObservable.subscribe({
            onNext: function(value){
                if(value.typeTraitementInter){
                    traitementInter.id_type_traitement = value.typeTraitementInter.id;
                    if(traitementInter.id_prestataire){
                        traitement.findOrCreate({where: traitementInter})
                        .spread((traitementInter, created) => {
                            if(created){
                                console.log("Successfully created new traitement:");
                                console.log(traitementInter);
                            }
                            obs.onNext({
                                traitementInter: traitementInter,
                                traitementFinal: null
                            })
                        })
                    }
                }
                if(value.typeTraitementFinal){
                    traitementFinal.id_type_traitement = value.typeTraitementFinal.id;
                    if(traitementFinal.id_prestataire){
                        traitement.findOrCreate({where: traitementFinal})
                        .spread((traitementFinal, created) => {
                            if(created){
                                console.log("Successfully created new traitement:");
                                console.log(traitementFinal);
                            }
                            obs.onNext({
                                traitementInter: null,
                                traitementFinal: traitementFinal
                            })
                        })
                    }
                }
            }
        });
        prestataireObservable.subscribe({
            onNext: function(value){
                if(value.prestataireInter){
                    traitementInter.id_prestataire = value.prestataireInter.id;
                    if (traitementInter.id_type_traitement){
                        traitement.findOrCreate({where: traitementInter})
                        .spread((traitementInter, created) => {
                            if(created){
                                console.log("Successfully created new traitement:");
                                console.log(traitementInter);
                            }
                            obs.onNext({
                                traitementInter: traitementInter,
                                traitementFinal: null
                            })
                        })
                    }
                }
                if(value.prestataireFinal){
                    traitementFinal.id_prestataire = value.prestataireFinal.id;
                    if(traitementFinal.id_type_traitement){
                        traitementFinal.findOrCreate({where: traitementFinal})
                        .spread((traitementFinal, created) => {
                            if(created){
                                console.log("Successfully created new traitement:");
                                console.log(traitementFinal);
                            }
                            obs.onNext({
                                traitementInter: null,
                                traitementFinal: traitementFinal
                            })
                        })
                    }
                }
            }
        });
    })
    console.log("Successfully built traitementObservable");
    return traitementObservable;
}
var convertRowIntoBordereauSequelize = function(excelRow){
    var bordereau = {
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

    const findOrCreateBordereau = function(){
        if(bordereau.id_dechet || bordereau.id_site || bordereau.id_transport_1 || bordereau.id_transport_2 || bordereau.id_traitement_final || bordereau.id_traitement_prevu || bordereau.id_traitement_inter){
            bordereau.findOrCreate({where: bordereau})
            .spread((bordereau, created) => {
                if (created){
                    console.log("Successfully created new bordereau");
                    console.log(bordereau);
                }
                obs.onNext(bordereau);
            })
        }
    }

    console.log("Building bordereauObservable...");
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
                        bordereau.id_traitement_inter = value.traitementInter.id;
                        findOrCreateBordereau();
                    }
                    if(value.traitementFinal){
                        bordereau.id_traitement_final = value.traitementFinal.id;
                        findOrCreateBordereau();
                    }
                }
            });
            dechetObservable.subscribe({
                onNext: value => {
                    bordereau.id_dechet = value.id;
                    findOrCreateBordereau();
                }
            });
            transportObservable.subscribe({
                onNext: value => {
                    if(value.transport1){
                        bordereau.id_transport_1 = value.transport1.id;
                        findOrCreateBordereau();
                    }
                    if(value.transport2){
                        bordereau.id_transport_2 = value.transport2.id;
                        findOrCreateBordereau();
                    }
                }
            });
            siteObservable.subscribe({
                onNext: value => {
                    bordereau.id_site = value.id;
                    findOrCreateBordereau();
                }
            });
            typeTraitementObservable.subscribe({
                onNext: value => {
                    if(value.typeTraitementPrevu){
                        bordereau.id_traitement_prevu = value.typeTraitementPrevu.id;
                        findOrCreateBordereau();
                    }
                }
            });
        }
        catch (Exception){
            obs.onError(Exception)
        }
    });
    console.log("Successfully built bordereauObservable");

    return bordereauObservable;
}

/*
_old_convertRowIntoSequelize = function(excelRow) {
    //The input is a json read from an xlsx file using readXlsx function
    //The output is a ready to be pushed in the mySql db

    jsonBordereau = {};
    jsonBordereau.numeroBordereau = excelRow[1];
    jsonBordereau.cas = excelRow[2];
    jsonBordereau.nomEmetteur = excelRow[3];
    jsonBordereau.etatBordereau = excelRow[4];
    jsonBordereau.modeSuivi = excelRow[5];
    jsonBordereau.codeFiliereDRPrevu = excelRow[6];
    jsonBordereau.codeFiliereEDFPrevu = excelRow[7];
    jsonBordereau.dechet = {
        codeInterneDechet: excelRow[8],
        libelleDechet: excelRow[9],
        codeEuropeenDechet: excelRow[10],
        categorieDechet: excelRow[11],
        indicateurNationalValorisation: excelRow[12],
        famille: excelRow[13],
        referenceDossier: excelRow[14]
    };
    jsonBordereau.producteur = {
        entiteProductrice: excelRow[15],
        site: excelRow[16],
        uniteDependance: excelRow[17],
        UPDependance: excelRow[18],
        metierDependance: excelRow[19]
    };
    jsonBordereau.transporteur1 = {
        dateTransport: excelRow[20],
        modeTransport: excelRow[21],
        nom: excelRow[22],
        localisation: excelRow[23],
        recepisse: excelRow[24],
        immatriculationVehicule: excelRow[25],
        siret: excelRow[26],
        adr: excelRow[27],
        quantiteTransportee: excelRow[28],
        estimeeBool: excelRow[29]
    };
    jsonBordereau.traitementIntermediaire = {
        nom: excelRow[30],
        localisation: excelRow[31],
        siret: excelRow[32],
        datePriseEnCharge: excelRow[33],
        dateTraitement: excelRow[34],
        codeFiliereDR: excelRow[35],
        codeFiliereEDF: excelRow[36]
    };
    jsonBordereau.transporteur2 = {
        nom: excelRow[37],
        modeTransport: excelRow[38],
        localisation: excelRow[39],
        siret: excelRow[40],
        recepisse: excelRow[41],
    };
    jsonBordereau.traitementFinal = {
        nom: excelRow[42],
        localisation: excelRow[43],
        siret: excelRow[44],
        datePriseEnCharge: excelRow[45],
        quantite: excelRow[46],
        dateTraitement: excelRow[47],
        codeFiliereDR: excelRow[48],
        codeFiliereEDF: excelRow[49],
        qualificationTraitement: excelRow[50]
    };
    return (new dataSchemas.Bordereau(jsonBordereau));
};
*/

var readXlsx = function (filepath) {
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
                        jsonExcel.push(row.values);
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
}
var writeIntoBdd = function(excelName) {
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
}

//Export du service

/*var service = {}
service.readXlsx = readXlsx;
service.writeBordereauIntoBDD = writeBordereauIntoBdd;
service.convertRowIntoSequelize = convertRowIntoSequelize;
module.exports = service;*/


//Phase d'essai

writeIntoBdd("dataedfmars.xlsx");
