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
toSequelizeDate = function(excelDate){
    return Sequelize.Date(excelDate.slice(6,10),excelDate.slice(3,5),excelDate.slice(0,2));
}
toBordereauFinished = function(etatBordereau){
    if (etatBordereau == 'T'){
        return 1
    }
    if (etatBordereau == 'E'){
        return 0
    }
    return 0;
}
toQuantiteeEstimee = function(estimeeBool){
    if(estimeeBool == "E"){
        return 1
    }
    if(estimeeBool == "R"){
        return 0
    }
    return 1
}

convertRowIntoDechetSequelize = function(excelRow){
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
            obs.next(dechet);
        })
    });

    return dechetObservable;
};
convertRowIntoSiteSequelize = function(excelRow){
    var newSite = {
        site_production: bordereauRow[16],
        unite_dependance: bordereauRow[17],
        up_dependance: bordereauRow[18],
        metier_dependance: bordereauRow[19]
    };

    var siteObservable = Rx.Observable.create(obs => {
        site.findOrCreate({where: {nom: excelRow[15]}, defaults: newSite})
        .spread((site, created) => {
            if (created){
                console.log("Successfully created new site:");
                console.log(site);
            }
            obs.next(site)
        })
    });

    return siteObservable;
};
convertRowIntoPrestataireSequelize = function(excelRow){
    var newPrestataireInter = {
        nom: bordereauRow[30],
        localisation: bordereauRow[31]
    };

    var newPrestataireFinal = {
        nom: bordereauRow[42],
        localisation: bordereauRow[43]
    };

    var prestataireObservable = Rx.Observable.create((obs) => {
        prestataire.findOrCreate({where: {siret: bordereauRow[32],}, defaults: newPrestataireInter})
        .spread((prestataireInter, created) => {
            if (created){
                console.log("Successfully created new prestataire:");
                console.log(prestataireInter);
            }
            obs.next({
                prestataireInter: prestataireInter,
                prestataireFinal: null
            })
        })
        prestataire.findOrCreate({where: {siret: bordereauRow[44],}, defaults: newPrestataireFinal})
        .spread((prestataireFinal, created) => {
            if(created){
                console.log("Successfully created new prestataire");
                console.log(prestataireFinal);
            }
            obs.next({
                prestataireInter: null,
                prestataireFinal: prestataireFinal
            })
        })
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
        type_traitement.findOrCreate({where: {code_dr: excelRow[6]}, defaults: typeTraitementPrevu})
        .spread((typeTraitementPrevu, created) => {
            if (created){
                console.log("Successfully created new type_traitement:");
                console.log(typeTraitementPrevu);
            }
            obs.next({
                typeTraitementPrevu: typeTraitementPrevu,
                typeTraitementInter: null,
                typeTraitementFinal: null
            })
        })
        type_traitement.findOrCreate({where: {code_dr: excelRow[48]}, defaults: typeTraitementFinal})
        .spread((typeTraitementFinal, created) => {
            if (created){
                console.log("Successfully created new type_traitement:");
                console.log(typeTraitementFinal);
            }
            obs.next({
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
            obs.next({
                typeTraitementPrevu: null,
                typeTraitementInter: typeTraitementInter,
                typeTraitementFinal: null
            })
        })
    });

    return typeTraitementObservable;
}
convertRowIntoTransporteurSequelize = function(excelRow){
    var TransporteurObservable = Rx.Observable.create((obs) => {
        newTransporteur1 = {
            nom: bordereauRow[22],
            localisation: bordereauRow[23]
        };
        newTransporteur2 = {
            nom: bordereauRow[37],
            localisation: bordereauRow[39]
        }
        transporteur.findOrCreate({where: {siret: bordereauRow[26]}, defaults: newTransporteur1})
        .spread((transporteur1, created) => {
            if(created){
                console.log("Successfully created new transporteur:");
                console.log(transporteur1);
            }
            obs.next({
                transporteur1: transporteur1,
                transporteur2: null
            });
        });

        transporteur.findOrCreate({where: {siret: bordereauRow[40]}, defaults: newTransporteur2})
        .spread((transporteur2, created) => {
            if(created){
                console.log("Successfully created new transporteur:");
                console.log(transporteur2);
            }
            obs.next({
                transporteur1: null,
                transporteur2: transporteur2
            });
        });
    });
    return TransporteurObservable;
}
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
        var transporteurObservable = convertRowIntoTransporteurSequelize(excelRow);
        transporteurObservable.subscribe({
            next: function(value){
                if(value.transporteur1){
                    transport.findOrCreate({where: transport1, defaults: {id_transporteur: value.transporteur1.id}})
                    .spread((transport1, created) => {
                        if(created){
                            console.log("Successfully created new transport:");
                            console.log(transport1);
                        }
                        obs.next({
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
                        obs.next({
                            transport1: null,
                            transport2: transport2
                        })
                    })
                }
            }
        })
    });

    return transportObservable;
}
convertRowIntoTraitementSequelize = function(excelRow){
    var traitementInter = {
        date_priseencharge: toSequelizeDate(excelRow[33]),
        date_traitement: toSequelizeDate(excelRow[34])
    }
    var traitementFinal = {
        date_priseencharge: toSequelizeDate(excelRow[45]),
        date_traitement: toSequelizeDate(excelRow[47])
    }

    var traitementObservable = Rx.Observable.create(obs => {
        var typeTraitementObservable = convertRowIntoTypeTraitementSequelize(excelRow);
        var prestataireObservable = convertRowIntoPrestataireSequelize(excelRow);
        typeTraitementObservable.subscribe({
            next: function(value){
                if(value.typeTraitementInter){
                    traitementInter.id_type_traitement = value.typeTraitementInter.id;
                    if(traitementInter.id_prestataire){
                        traitement.findOrCreate({where: traitementInter})
                        .spread((traitementInter, created) => {
                            if(created){
                                console.log("Successfully created new traitement:");
                                console.log(traitementInter);
                            }
                            obs.next({
                                traitementInter: traitementInter,
                                traitementFinal: null
                            })
                        })
                    }
                }
                if(value.typeTraitementFinal){
                    traitementFinal.id_type_traitement = value.typeTraitementInter.id;
                    if(traitementFinal.id_prestataire){
                        traitement.findOrCreate({where: traitementFinal})
                        .spread((traitementFinal, created) => {
                            if(created){
                                console.log("Successfully created new traitement:");
                                console.log(traitementFinal);
                            }
                            obs.next({
                                traitementInter: null,
                                traitementFinal: traitementFinal
                            })
                        })
                    }
                }
            }
        });
        prestataireObservable.subscribe({
            next: function(value){
                if(value.prestataireInter){
                    traitementInter.id_prestataire = value.prestataireInter.id;
                    if (traitementInter.id_type_traitement){
                        traitement.findOrCreate({where: traitementInter})
                        .spread((traitementInter, created) => {
                            if(created){
                                console.log("Successfully created new traitement:");
                                console.log(traitementInter);
                            }
                            obs.next({
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
                            obs.next({
                                traitementInter: null,
                                traitementFinal: traitementFinal
                            })
                        })
                    }
                }
            }
        });
    })

    return traitementObservable;
}
convertRowIntoBordereauSequelize = function(excelRow){
    var bordereau = {
        num_bordereau: excelRow[1],
        cas: excelRow[2],
        nom_emetteur: excelRow[3],
        bordereau_finished: toBordereauFinished(excelRow[4]),
        mode_suivi: excelRow[5],
        ref_dossier: excelRow[14],
        quantitee_transportee: excelRow[28],
        quantitee_finale: excelRow[46],
        quantitee_estimee: toQuantiteeEstimee(xcelRow[29])
    }

    findOrCreateBordereau = function(){
        if(bordereau.id_dechet || bordereau.id_site || bordereau.id_transport_1 || bordereau.id_transport_2 || bordereau.id_traitement_final || bordereau.id_traitement_prevu || bordereau.id_traitement_inter){
            bordereau.findOrCreate({where: bordereau})
            .spread((bordereau, created) => {
                if (created){
                    console.log("Successfully created new bordereau");
                    console.log(bordereau);
                }
                obs.next(bordereau)
            })
        }
    }

    var bordereauObservable = Rx.Observable.create(obs => {
        var traitementObservable = convertRowIntoTraitementSequelize;
        var dechetObservable = convertRowIntoDechetSequelize;
        var transportObservable = convertRowIntoTransportSequelize;
        var siteObservable = convertRowIntoSiteSequelize;
        var typeTraitementObservable = convertRowIntoTypeTraitementSequelize;

        traitementObservable.subscribe({
            next: value => {
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
            next: value => {
                bordereau.id_dechet = value.id;
                findOrCreateBordereau();
            }
        });
        transportObservable.subscribe({
            next: value => {
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
            next: value => {
                bordereau.id_site = value.id;
                findOrCreateBordereau();
            }
        });
        typeTraitementObservable.subscribe({
            next: value => {
                if(value.typeTraitementPrevu){
                    bordereau.id_traitement_prevu = value.typeTraitementPrevu.id;
                    findOrCreateBordereau();
                }
            }
        });
    });

    return bordereauObservable;
}
/*
_old_convertRowIntoSequelize = function(bordereauRow) {
    //The input is a json read from an xlsx file using readXlsx function
    //The output is a ready to be pushed in the mySql db

    jsonBordereau = {};
    jsonBordereau.numeroBordereau = bordereauRow[1];
    jsonBordereau.cas = bordereauRow[2];
    jsonBordereau.nomEmetteur = bordereauRow[3];
    jsonBordereau.etatBordereau = bordereauRow[4];
    jsonBordereau.modeSuivi = bordereauRow[5];
    jsonBordereau.codeFiliereDRPrevu = bordereauRow[6];
    jsonBordereau.codeFiliereEDFPrevu = bordereauRow[7];
    jsonBordereau.dechet = {
        codeInterneDechet: bordereauRow[8],
        libelleDechet: bordereauRow[9],
        codeEuropeenDechet: bordereauRow[10],
        categorieDechet: bordereauRow[11],
        indicateurNationalValorisation: bordereauRow[12],
        famille: bordereauRow[13],
        referenceDossier: bordereauRow[14]
    };
    jsonBordereau.producteur = {
        entiteProductrice: bordereauRow[15],
        site: bordereauRow[16],
        uniteDependance: bordereauRow[17],
        UPDependance: bordereauRow[18],
        metierDependance: bordereauRow[19]
    };
    jsonBordereau.transporteur1 = {
        dateTransport: bordereauRow[20],
        modeTransport: bordereauRow[21],
        nom: bordereauRow[22],
        localisation: bordereauRow[23],
        recepisse: bordereauRow[24],
        immatriculationVehicule: bordereauRow[25],
        siret: bordereauRow[26],
        adr: bordereauRow[27],
        quantiteTransportee: bordereauRow[28],
        estimeeBool: bordereauRow[29]
    };
    jsonBordereau.traitementIntermediaire = {
        nom: bordereauRow[30],
        localisation: bordereauRow[31],
        siret: bordereauRow[32],
        datePriseEnCharge: bordereauRow[33],
        dateTraitement: bordereauRow[34],
        codeFiliereDR: bordereauRow[35],
        codeFiliereEDF: bordereauRow[36]
    };
    jsonBordereau.transporteur2 = {
        nom: bordereauRow[37],
        modeTransport: bordereauRow[38],
        localisation: bordereauRow[39],
        siret: bordereauRow[40],
        recepisse: bordereauRow[41],
    };
    jsonBordereau.traitementFinal = {
        nom: bordereauRow[42],
        localisation: bordereauRow[43],
        siret: bordereauRow[44],
        datePriseEnCharge: bordereauRow[45],
        quantite: bordereauRow[46],
        dateTraitement: bordereauRow[47],
        codeFiliereDR: bordereauRow[48],
        codeFiliereEDF: bordereauRow[49],
        qualificationTraitement: bordereauRow[50]
    };
    return (new dataSchemas.Bordereau(jsonBordereau));
};
*/
readXlsx = function (filepath) {
    //The input is an xlsx filepath et the function callbacks a json containing the whole excel data
    //Warning : function only supports .XLSX files

    var workBook = new excel.Workbook();
    var jsonExcel = [];

    var readObservable = Rx.Observable.create((obs) => {
        // Using directly the filepath, NOT APPENDING ANYTHING
        workBook.xlsx.readFile(filepath)
            .then(() => {
                // use workbook
                workBook.getWorksheet(config.excel.MAIN_SHEET).eachRow(function(row,rowNumber) {
                    if(rowNumber > config.excel.STARTING_ROW){
                        jsonExcel.push(row.values);
                    }
                });
                obs.next(jsonExcel);
                obs.onCompleted();
            })
            .catch(error => {
                obs.onError(error);
            })
    });

    return readObservable;
}
writeIntoBdd = function(excelName) {
    //The input is an excelname located in the data/ directory
    //The function enables pushing raw data in the database by converting it to the database model

    var sequelize = db.mySqlConnect();
    sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        var readXlsxObservable = readXlsx(config.excel.DATA_DIR + excelName);
        console.log("readXlsxObservable built");
        var writeIntoBddObservable = Rx.Observable.create(obs => {
            readXlsxObservable.subscribe({
                next: jsonExcel => {
                    console.log("Successfully read excel");
                    jsonExcel.forEach(row => {
                        var bordereauObservable = convertRowIntoBordereauSequelize(row);
                        console.log("Successfully built bordereauObservable");
                        bordereauObservable.subscribe({
                            next: bordereau => {
                                console.log("Successfully pushed excel whole row into database:");
                            }
                        })
                    })
                },
                onError: error => {
                    console.error("Error in writeIntoBdd")
                    obs.onError(error);
                },
                onCompleted: () => {
                    console.log("readXlsx completed");
                }
            })
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

writeIntoBdd("dataedfmars.xslx");
