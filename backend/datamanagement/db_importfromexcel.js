const excel = require('exceljs');
const Rx = require ('rx');
const config = require('../config/config.json');
const Sequelize = require('sequelize');
const db = require('./db');
const async = require('async');
const Iconv = require('iconv').Iconv;

//Import data models
const models = require('../models/');
const bordereau = models.bordereau;
const dechet = models.dechet;
const prestataire = models.prestataire;
const site = models.site;
const traitement = models.traitement;
const transport = models.transport;
const transporteur = models.transporteur;
const type_traitement = models.type_traitement;
const referentiel_dechet = models.referentiel_dechet;

//Functions used converting raw excel data in fully pushable sequelize data
const toQualification = function(code_dr){
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
const toSequelizeDate = function(excelDate){
    /*if (excelDate){
        date = excelDate.toString().slice(11,15) + '-' + excelDate.toString().slice(5,7) + '-' + excelDate.toString().slice(8,10);
    }
    console.log("Date", date);*/
    return excelDate;
}
const toBordereauFinished = function(etatBordereau){
    if (etatBordereau == 'T'){
        return 1
    }
    if (etatBordereau == 'E'){
        return 0
    }
    return null;
}
const toQuantiteeEstimee = function(estimeeBool){
    if(estimeeBool == "E"){
        return 1
    }
    if(estimeeBool == "R"){
        return 0
    }
    return null
}
const toDangereux = function(code_europeen){
    if (typeof code_europeen === "string" && code_europeen.slice(8,9) == '*'){
        return 1
    }
    return 0
};
const toListeVerte = function(liste_verte){
    if(liste_verte == 'v'){
        return 1;
    }
    return 0;
};
const toIndicateurNationalValorisation = function(indicateurNationalValorisation) {
    if (indicateurNationalValorisation == "Oui"){
        return 1
    }
    if (indicateurNationalValorisation == "Non"){
        return 0
    }
    return null;
}
const toQuantitee = function(quantiteeNumber){
    console.log("quantiteeNumber", quantiteeNumber);
    if(quantiteeNumber){
        if(typeof quantiteeNumber == "number" && quantiteeNumber !== 0){
            return parseFloat((quantiteeNumber).toFixed(5))
        }
        return 0;
    }
    return 0;
}

//Observables function used to convert a whole excelRow into a sequelize object and push it into database
const convertRowIntoDechetSequelize = function(excelRow){
    var newDechet = {
        is_dangereux: toDangereux(excelRow[10]),
        libelle: excelRow[9],
        code_europeen: excelRow[10],
        categorie: excelRow[11],
        indicateur_national_valorisation: toIndicateurNationalValorisation(excelRow[12]),
        famille: excelRow[13]
    };
    console.log("Code interne", newDechet.codeinterne);
    var dechetObservable = Rx.Observable.create(obs => {
        try{
            if (excelRow[8]){
                dechet.findOrCreate({where: {codeinterne: excelRow[8]}, default: newDechet})
                .spread((dechet, created) => {
                    console.log("Dechet found or created");
                    obs.onNext({
                        dechet: dechet
                    });
                })
                .catch(error => {
                    obs.onError(error)
                })
            }
            else {
                obs.onNext({
                    dechet_isNull: true
                });
                console.log("Dechet is null");
            }
        }
        catch(Exception){
            obs.onError(Exception);
        }
    });
    return dechetObservable;
};

const convertRowIntoSiteSequelize = function(excelRow){
    var newSite = {
        site_production: (typeof excelRow[16] == "string" ? excelRow[16].toUpperCase() : excelRow[16]),
        unite_dependance: (typeof excelRow[17] == "string" ? excelRow[17].toUpperCase() : excelRow[17]),
        up_dependance: (typeof excelRow[18] == "string" ? excelRow[18].toUpperCase() : excelRow[18]),
        metier_dependance: (typeof excelRow[19] == "string" ? excelRow[19].toUpperCase() : excelRow[19])
    };

    var siteObservable = Rx.Observable.create(obs => {
        try {
            if(excelRow[15]){
                newSite.nom = (typeof excelRow[15] == "string" ? excelRow[15].toUpperCase() : excelRow[15]);
                site.findOrCreate({where: newSite})
                .spread((site, created) => {
                    console.log("Site found or created");
                    obs.onNext(site);
                })
                .catch(error => {
                    obs.onError(error);
                })
            }
            else{
                console.log("Site is null");
                obs.onNext(null);
            }
        }
        catch(Exception){
            obs.onError(Exception);
        }
    });
    return siteObservable;
};

const convertRowIntoPrestataireSequelize = function(excelRow){
    var newPrestataireInter = {
        nom: (typeof excelRow[30] == "string" ? excelRow[30].toUpperCase() : excelRow[30]),
        localisation: (typeof excelRow[31] == "string" ? excelRow[31].toUpperCase() : excelRow[31])
    };
    var newPrestataireFinal = {
        nom: (typeof excelRow[42] == "string" ? excelRow[42].toUpperCase() : excelRow[42]),
        localisation: (typeof excelRow[43] == "string" ? excelRow[43].toUpperCase() : excelRow[43])
    };

    var prestataireObservable = Rx.Observable.create((obs) => {
        try{
            if(excelRow[32]){
                prestataire.findOrCreate({where: {siret: excelRow[32]}, default: newPrestataireInter})
                .spread((prestataireInter, created) => {
                    console.log("prestataireInter found or created");
                    obs.onNext({
                        prestataireInter: prestataireInter,
                        prestataireFinal: null
                    });
                    if(excelRow[44]){
                        prestataire.findOrCreate({where: {siret: excelRow[44]}, default: newPrestataireFinal})
                        .spread((prestataireFinal, created) => {
                            console.log("prestataireFinal found or created");
                            obs.onNext({
                                prestataireInter: null,
                                prestataireFinal: prestataireFinal
                            });
                        });
                    }
                    else {
                        console.log("prestataireFinal is null");
                        obs.onNext({
                            prestataireFinal_isNull: true
                        });
                    }
                })
                .catch(error => {
                    obs.onError(error);
                })
            }
            else {
                console.log("prestataireInter is null");
                obs.onNext({
                    prestataireInter_isNull: true
                });
                if(excelRow[44]){
                    prestataire.findOrCreate({where: {siret: excelRow[44]}, default: newPrestataireFinal})
                    .spread((prestataireFinal, created) => {
                        console.log("prestataireFinal found or created");
                        obs.onNext({
                            prestataireInter: null,
                            prestataireFinal: prestataireFinal
                        });
                    })
                    .catch(error => {
                        obs.onError(error);
                    })
                }
                else {
                    console.log("prestataireFinal is null");
                    obs.onNext({
                        prestataireFinal_isNull: true
                    });
                }
            }
        }
        catch(Exception){
            obs.onError(Exception);
        }
    });
    return prestataireObservable;
};

const convertRowIntoTypeTraitementSequelize = function(excelRow){
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
                type_traitement.findOrCreate({where: {code_dr: excelRow[6]}, default: typeTraitementPrevu})
                .spread((typeTraitementPrevu, created) => {
                    console.log("typeTraitement found or created");
                    obs.onNext({
                        typeTraitementPrevu: typeTraitementPrevu,
                        typeTraitementInter: null,
                        typeTraitementFinal: null
                    });
                    if(excelRow[48]){
                        type_traitement.findOrCreate({where: {code_dr: excelRow[48]}, default: typeTraitementFinal})
                        .spread((typeTraitementFinal, created) => {
                            console.log("typeTraitement found or created");
                            obs.onNext({
                                typeTraitementPrevu: null,
                                typeTraitementInter: null,
                                typeTraitementFinal: typeTraitementFinal
                            });
                            if(excelRow[36]){
                                type_traitement.findOrCreate({where: {code_dr: excelRow[36]}, default: typeTraitementInter})
                                .spread((typeTraitementInter, created) => {
                                    console.log("typeTraitement found or created");
                                    obs.onNext({
                                        typeTraitementPrevu: null,
                                        typeTraitementInter: typeTraitementInter,
                                        typeTraitementFinal: null
                                    })
                                })
                            }
                            else{
                                console.log("typeTraitement is null");
                                obs.onNext({
                                    typeTraitementInter_isNull: true
                                });
                            }
                        })
                    }
                    else {
                        console.log("typeTraitement is null");
                        obs.onNext({
                            typeTraitementFinal_isNull: true
                        });
                        if(excelRow[36]){
                            type_traitement.findOrCreate({where: {code_dr: excelRow[36]}, default: typeTraitementInter})
                            .spread((typeTraitementInter, created) => {
                                console.log("typeTraitement found or created");
                                obs.onNext({
                                    typeTraitementPrevu: null,
                                    typeTraitementInter: typeTraitementInter,
                                    typeTraitementFinal: null
                                })
                            })
                        }
                        else{
                            console.log("typeTraitement is null");
                            obs.onNext({
                                typeTraitementInter_isNull: true
                            });
                        }
                    }
                })
                .catch(error => {
                    obs.onError(error);
                })
            }
            else{
                console.log("typeTraitement is null");
                obs.onNext({
                    typeTraitementPrevu_isNull: true
                });
                if(excelRow[48]){
                    type_traitement.findOrCreate({where: {code_dr: excelRow[48]}, default: typeTraitementFinal})
                    .spread((typeTraitementFinal, created) => {
                        console.log("typeTraitement found or created");
                        obs.onNext({
                            typeTraitementPrevu: null,
                            typeTraitementInter: null,
                            typeTraitementFinal: typeTraitementFinal
                        });
                        if(excelRow[36]){
                            type_traitement.findOrCreate({where: {code_dr: excelRow[36]}, default: typeTraitementInter})
                            .spread((typeTraitementInter, created) => {
                                console.log("typeTraitement found or created");
                                obs.onNext({
                                    typeTraitementPrevu: null,
                                    typeTraitementInter: typeTraitementInter,
                                    typeTraitementFinal: null
                                })
                            })
                        }
                        else{
                            console.log("typeTraitement is null");
                            obs.onNext({
                                typeTraitementInter_isNull: true
                            });
                        }
                    })
                    .catch(error => {
                        obs.onError(error);
                    })
                }
                else {
                    console.log("typeTraitement is null");
                    obs.onNext({
                        typeTraitementFinal_isNull: true
                    });
                    if(excelRow[36]){
                        type_traitement.findOrCreate({where: {code_dr: excelRow[36]}, default: typeTraitementInter})
                        .spread((typeTraitementInter, created) => {
                            console.log("typeTraitement found or created");
                            obs.onNext({
                                typeTraitementPrevu: null,
                                typeTraitementInter: typeTraitementInter,
                                typeTraitementFinal: null
                            })
                        })
                        .catch(error => {
                            obs.onError(error);
                        })
                    }
                    else{
                        console.log("typeTraitement is null");
                        obs.onNext({
                            typeTraitementInter_isNull: true
                        });
                    }
                }
            }
        }
        catch(Exception){
            obs.onError(Exception);
        }
    });

    return typeTraitementObservable;
}

const convertRowIntoTransporteurSequelize = function(excelRow){
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
                transporteur.findOrCreate({where: {siret: excelRow[26]}, default: newTransporteur1})
                .spread((transporteur1, created) => {
                    console.log("transporteur1 found or created");
                    obs.onNext({
                        transporteur1: transporteur1,
                        transporteur2: null
                    });
                    if(excelRow[40]){
                        transporteur.findOrCreate({where: {siret: excelRow[40]}, default: newTransporteur2})
                        .spread((transporteur2, created) => {
                            console.log("transporteur1 found or created");
                            obs.onNext({
                                transporteur1: null,
                                transporteur2: transporteur2
                            });
                        });
                    }
                    else{
                        console.log("transporteur2 is null");
                        obs.onNext({
                            transporteur2_isNull: true
                        });
                    }
                })
                .catch(error => {
                    obs.onError(error);
                })
            }
            else{
                console.log("transporteur1 is null");
                obs.onNext({
                    transporteur1_isNull: true
                });
                if(excelRow[40]){
                    transporteur.findOrCreate({where: {siret: excelRow[40]}, default: newTransporteur2})
                    .spread((transporteur2, created) => {
                        console.log("transporteur2 found or created");
                        obs.onNext({
                            transporteur1: null,
                            transporteur2: transporteur2
                        });
                    })
                    .catch(error => {
                        obs.onError(error)
                    })
                }
                else{
                    console.log("transporteur2 is null");
                    obs.onNext({
                        transporteur2_isNull: true
                    });
                }
            }
        }
        catch(Exception){
            obs.onError(Exception);
        };
    });
    return transporteurObservable;
};

const convertRowIntoTransportSequelize = function(excelRow){
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
                        transport1.id_transporteur = value.transporteur1.dataValues.id;
                        transport.findOrCreate({where: transport1})
                        .spread((transport1, created) => {
                            console.log("transport found or created");
                            obs.onNext({
                                transport1: transport1,
                                transport2: null
                            })
                        })
                        .catch(error => {
                            obs.onError(error);
                        })
                    }
                    if(value.transporteur1_isNull){
                        console.log("transport is null");
                        obs.onNext({
                            transport1_isNull: true
                        })
                    }
                    if(value.transporteur2){
                        transport2.id_transporteur = value.transporteur2.dataValues.id;
                        transport.findOrCreate({where: transport2})
                        .spread((transport2, created) => {
                            console.log("transport found or created");
                            obs.onNext({
                                transport1: null,
                                transport2: transport2
                            })
                        })
                        .catch(error => {
                            obs.onError(error);
                        })
                    }
                    if(value.transporteur2_isNull){
                        console.log("transport is null");
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

const convertRowIntoTraitementSequelize = function(excelRow){
    var traitementInter = {
        date_priseencharge: toSequelizeDate(excelRow[33]),
        date_traitement: toSequelizeDate(excelRow[34])
    };
    var traitementFinal = {
        date_priseencharge: toSequelizeDate(excelRow[45]),
        date_traitement: toSequelizeDate(excelRow[47])
    };

    const findOrCreateTraitementInter = obs => {
        traitement.findOrCreate({where: traitementInter})
        .spread((traitementInter, created) => {
            console.log("traitement found or created");
            obs.onNext({
                traitementInter: traitementInter,
                traitementFinal: null
            })
        })
        .catch(error => {
            obs.onError(error);
        });
    }

    const findOrCreateTraitementFinal = obs => {
        traitement.findOrCreate({where: traitementFinal})
        .spread((traitementFinal, created) => {
            console.log("traitement found or created");
            obs.onNext({
                traitementInter: null,
                traitementFinal: traitementFinal
            })
        })
        .catch(error => {
            obs.onError(error);
        });
    }

    try{
        var traitementObservable = Rx.Observable.create(obs => {
            var typeTraitementObservable = convertRowIntoTypeTraitementSequelize(excelRow);
            var prestataireObservable = convertRowIntoPrestataireSequelize(excelRow);
            typeTraitementObservable.subscribe({
                onNext: value => {
                    if(value.typeTraitementInter){
                        traitementInter.id_type_traitement = value.typeTraitementInter.dataValues.id;
                        if(traitementInter.id_prestataire){
                            findOrCreateTraitementInter(obs);
                        }
                        if(traitementInter.id_prestataire === null){
                            findOrCreateTraitementInter(obs);
                        }
                    }
                    if(value.typeTraitementInter_isNull){
                        traitementInter.id_type_traitement = null;
                        if(traitementInter.id_prestataire){
                            findOrCreateTraitementInter(obs);
                        }
                        if(traitementInter.id_prestataire === null){
                            console.log("traitement is null");
                            obs.onNext({
                                traitementInter_isNull: true
                            })
                        }
                    }
                    if(value.typeTraitementFinal){
                        traitementFinal.id_type_traitement = value.typeTraitementFinal.dataValues.id;
                        if(traitementFinal.id_prestataire){
                            findOrCreateTraitementFinal(obs);
                        }
                        if(traitementFinal.id_prestataire === null){
                            findOrCreateTraitementFinal(obs);
                        }
                    }
                    if(value.typeTraitementFinal_isNull){
                        traitementFinal.id_type_traitement = null;
                        if(traitementFinal.id_prestataire){
                            findOrCreateTraitementFinal(obs);
                        }
                        if(traitementFinal.id_prestataire === null){
                            console.log("traitement is null");
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
                onNext: value => {
                    if(value.prestataireInter){
                        traitementInter.id_prestataire = value.prestataireInter.dataValues.id;
                        if(traitementInter.id_type_traitement){
                            findOrCreateTraitementInter(obs);
                        }
                        if (traitementInter.id_type_traitement === null){
                            findOrCreateTraitementInter(obs);
                        }
                    }
                    if(value.prestataireInter_isNull){
                        traitementInter.id_prestataire = null;
                        if (traitementInter.id_type_traitement){
                            findOrCreateTraitementInter(obs);
                        }
                        if(traitementInter.id_type_traitement === null){
                            console.log("traitement is null");
                            obs.next({
                                traitementInter_isNull: true
                            });
                        }
                    }
                    if(value.prestataireFinal){
                        traitementFinal.id_prestataire = value.prestataireFinal.dataValues.id;
                        if(traitementFinal.id_type_traitement){
                            findOrCreateTraitementFinal(obs);
                        }
                        if(traitementFinal.id_type_traitement === null){
                            findOrCreateTraitementFinal(obs);
                        }
                    }
                    if(value.prestataireFinal_isNull){
                        traitementFinal.id_prestataire = null;
                        if (traitementFinal.id_type_traitement){
                            findOrCreateTraitementFinal(obs);
                        }
                        if(traitementFinal.id_type_traitement === null){
                            console.log("traitement is null");
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

const convertRowIntoBordereauSequelize = function(excelRow){
    let newBordereau = {
        num_bordereau: excelRow[1],
        cas: excelRow[2],
        nom_emetteur: excelRow[3],
        bordereau_finished: toBordereauFinished(excelRow[4]),
        mode_suivi: excelRow[5],
        ref_dossier: excelRow[14],
        quantitee_transportee: toQuantitee(excelRow[28]),
        quantitee_finale: toQuantitee(excelRow[46]),
        quantitee_estimee: toQuantiteeEstimee(excelRow[29])
    }
    console.log(newBordereau);
    const findOrCreateBordereau = function(obs){
        console.log(newBordereau);
        if(typeof newBordereau.id_dechet !== "undefined" && typeof newBordereau.id_site !== "undefined" && typeof newBordereau.id_transport_1 !== "undefined" && typeof newBordereau.id_transport_2 !== "undefined" && typeof newBordereau.id_traitement_final !== "undefined" && typeof newBordereau.id_traitement_prevu !== "undefined" && typeof newBordereau.id_traitement_inter !== "undefined" ){
            bordereau.findOrCreate({where: newBordereau})
            .spread((bordereau, created) => {
                console.log("bordereau found or created");
                obs.onNext(bordereau);
                obs.onCompleted();
            })
            .catch(error => {
                console.error(error);
                obs.onError(error);
            });
        }
    }

    let bordereauObservable = Rx.Observable.create(obs => {
        console.log("traitementObservable");
        let traitementObservable = convertRowIntoTraitementSequelize(excelRow);
        console.log("dechetObservable");
        let dechetObservable = convertRowIntoDechetSequelize(excelRow);
        console.log("transportObservable");
        let transportObservable = convertRowIntoTransportSequelize(excelRow);
        console.log("siteObservable");
        let siteObservable = convertRowIntoSiteSequelize(excelRow);
        console.log("typeTraitementObservable");
        let typeTraitementObservable = convertRowIntoTypeTraitementSequelize(excelRow);

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
                    if(value.dechet){
                        newBordereau.id_dechet = value.dechet.dataValues.id;
                        findOrCreateBordereau(obs);
                    }
                    if(value.dechet_isNull){
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

const convertRowIntoReferentielDechetSequelize = function(excelRow){
    let jsonRow = {
        codeinterne: excelRow[1]+(excelRow[2]? excelRow[2] : ""),
        is_listeverte: toListeVerte(excelRow[5]),
        is_dangereux: toDangereux(excelRow[8]),
    };
    const codeDictionnaire = {
        'R1': 9,
        'R2': 10,
        'R3': 11,
        'R4': 12,
        'R5': 13,
        'R6': 14,
        'R7': 15,
        'R8': 16,
        'R9': 17,
        'R10': 18,
        'R11': 19,
        'R12': 20,
        'R13': 21,
        'D5': 22,
        'D8': 23,
        'D9': 24,
        'D10': 25,
        'D13': 26,
        'D14': 27,
        'D15': 28,
    };

    let referentielDechetObservable = Rx.Observable.create(obs => {
        try{
            if (jsonRow.codeinterne){
                dechet.findOne({where: {codeinterne: jsonRow.codeinterne}})
                .then(dechet => {
                    if(dechet){
                        dechet.updateAttributes({
                            is_dangereux: jsonRow.is_dangereux,
                            is_listeverte: jsonRow.is_listeverte
                        }).then(dechet => {
                            Object.keys(codeDictionnaire).forEach(code_dr => {
                                type_traitement.findOne({where: {code_dr : code_dr}})
                                .then(type_traitement => {
                                    if(type_traitement){
                                        var newReferentielDechet = {
                                            id_dechet: dechet.dataValues.id,
                                            id_type_traitement: type_traitement.dataValues.id,
                                            gestion: excelRow[codeDictionnaire[code_dr]]
                                        };
                                        if(newReferentielDechet.gestion){
                                            referentiel_dechet.findOrCreate({where : newReferentielDechet})
                                            .spread((referentiel_dechet, created) => {
                                                obs.onNext(referentiel_dechet);
                                                obs.onCompleted();
                                            });
                                        }
                                        else {
                                            obs.onCompleted();
                                        }
                                    }
                                    else {
                                        obs.onCompleted();
                                    }
                                })
                                .catch(err => {
                                    obs.onError(err)
                                });
                            });
                        })
                        .catch(err => {
                            obs.onError(err)
                        })
                    }
                    else {
                        obs.onCompleted();
                    }
                })
            }
        }
        catch(Exception){
            obs.onError(Exception);
        }
    });
    return referentielDechetObservable;
}

//Function used to read the data extracted from the Ogive EDF database
const readXlsx = function (filepath, sheetNumber, startingRow) {
    //The input is an xlsx filepath et the function callbacks a json containing the whole excel data
    //WARNING: function only supports .XLSX files

    let workBook = new excel.Workbook();
    let jsonExcel = [];

    let readObservable = Rx.Observable.create(obs => {
        // Using directly the filepath, NOT APPENDING ANYTHING
        workBook.xlsx.readFile(filepath)
            .then(() => {
                // use workbook
                console.log("Start reading excel file...");
                workBook.getWorksheet(sheetNumber).eachRow(function(row,rowNumber) {
                    if(rowNumber >= startingRow){
                        let newRow = [null];
                        row.values.forEach(cell => {
                            let newCell = cell;
                            if (typeof cell == "string"){
                                newCell = cell.trim();
                                newCell = newCell.toUpperCase();
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

//Function used to read the Referentiel Dechet excel sheet which provides the liste verte and reglementation
const readReferentielDechetXlsx = function (filepath, sheetNumber, startingRow) {
    //The input is an xlsx filepath et the function callbacks a json containing the whole excel data
    //WARNING: function only supports .XLSX files

    let workBook = new excel.Workbook();
    let jsonExcel = [];

    let readObservable = Rx.Observable.create(obs => {
        // Using directly the filepath, NOT APPENDING ANYTHING
        workBook.xlsx.readFile(filepath)
            .then(() => {
                // use workbook
                console.log("Start reading excel file...");
                workBook.getWorksheet(sheetNumber).eachRow(function(row,rowNumber) {
                    if(rowNumber >= startingRow){
                        newRow = [null];
                        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                            newRow.push(cell.value);
                        });
                        jsonExcel.push(newRow);
                    }
                });
                obs.onNext(jsonExcel);
            })
            .catch(error => {
                obs.onError(error);
            })
    });
    return readObservable;
};

const writeReferentielDechetIntoBdd = function (filepath) {
    const sequelize = db.mySqlConnect();
    sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        let readXlsxObservable = readReferentielDechetXlsx(config.excel.DATA_DIR + "liste_dechets.xlsx", config.excel.REFERENTIELDECHET_SHEET, config.excel.REFERENTIELDECHET_STARTING_ROW);
        console.log("readXlsxObservable built");
        readXlsxObservable.subscribe({
            onNext: (jsonExcel) => {
                console.log("Successfully loaded excel data in RAM");
                let tasksArray = [];
                jsonExcel.forEach(row => {
                    let task = function(callback){
                        let referentielDechetObservable = convertRowIntoReferentielDechetSequelize(row);
                        referentielDechetObservable.subscribe({
                            onNext: referentiel_dechet => {
                            },
                            onError: err => {
                                console.error("Error thrown by referentielDechetObservable");
                                console.error(err);
                                process.nextTick(() => {
                                    callback(null, true);
                                });
                            },
                            onCompleted: () => {
                                process.nextTick(() => {
                                    callback(null, true);
                                });
                            }
                        });
                    };
                    tasksArray.push(task);
                });
                async.series(tasksArray, (err,res) => {
                    console.log("Async tasks done");
                    db.mysqlDisconnect(sequelize);
                });
            },
            onError: error => {
                console.error("Error in writeReferentielDechetIntoBdd")
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

const writeIntoBdd = function(excelName) {
    //The input is an excelname located in the data/ directory
    //The function enables pushing raw data in the database by converting it to the database model

    const sequelize = db.mySqlConnect();
    sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        let readXlsxObservable = readXlsx(config.excel.DATA_DIR + excelName, config.excel.MAIN_SHEET, config.excel.STARTING_ROW);
        console.log("readXlsxObservable built");
        readXlsxObservable.subscribe({
            onNext: (jsonExcel) => {
                console.log("Successfully loaded excel data in RAM");
                let tasksArray = [];
                jsonExcel.forEach(bordereau => {
                    let task = function(callback){
                        console.log("Building observable...");
                        let bordereauObservable = convertRowIntoBordereauSequelize(bordereau);
                        bordereauObservable.subscribe({
                            onNext: bordereau => {
                                console.log("Successfully pushed excel whole row into database");
                            },
                            onError: error => {
                                console.error("Error thrown by bordereauObservable", error);
                                process.nextTick(() => {
                                    console.log("NO NEXT TICK");
                                    callback(error, null);
                                });
                            },
                            onCompleted: () => {
                                process.nextTick(() => {
                                    console.log("Next tick");
                                    callback(null, true);
                                });
                            }
                        });
                    };
                    tasksArray.push(task);
                });
                console.log("Starting importing data...");
                async.series(tasksArray, (err,res) => {
                    console.log("Async tasks done");
                    db.mysqlDisconnect(sequelize);
                });
            },
            onError: error => {
                console.error("Error in writeIntoBdd")
                console.error(error);
            },
            onCompleted: () => {
                console.log("Successfully read whole excel");
            }
        });
    })
    .catch(err => {
        console.error('Database connection lost or unable to start');
    });
};

//TEST PHASE
//writeReferentielDechetIntoBdd("./data/liste_dechets.xlsx");
writeIntoBdd("dataedfmars.xlsx");
