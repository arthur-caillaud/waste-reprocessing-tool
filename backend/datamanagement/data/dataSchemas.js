var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var bordereauSchema = new Schema({
    numeroBordereau: String,
    cas: Number,
    nomEmetteur: String,
    etatBordereau: String,
    modeSuivi: String,
    codeFiliereDRPrevu: String,
    codeFiliereEDFPrevu: String,
    dechet: {
        codeInterneDechet: String,
        libelleDechet: String,
        codeEuropeenDechet: String,
        categorieDechet: String,
        indicateurNationalValorisation: String,
        famille: String,
        referenceDossier: String
    },
    producteur: {
        entiteProductrice: String,
        site: String,
        uniteDependance: String,
        UPDependance: String,
        metierDependance: String
    },
    transporteur1: {
        dateTransport: Date,
        modeTransport: String,
        nom: String,
        localisation: String,
        recepisse: String,
        immatriculationVehicule: String,
        siret: Number,
        adr: String,
        quantiteTransportee: Number,
        estimeeBool: Boolean
    },
    traitementIntermediaire: {
        nom: String,
        localisation: String,
        siret: Number,
        datePriseEnCharge: Date,
        dateTraitement: Date,
        codeFiliereDR: String,
        codeFiliereEDF: String
    },
    transporteur2: {
        nom: String,
        modeTransport: String,
        localisation: String,
        siret: Number,
        recepisse: String,
    },
    traitementFinal: {
        nom: String,
        localisation: String,
        siret: Number,
        datePriseEnCharge: Date,
        quantite: Number,
        dateTraitement: Date,
        codeFiliereDR: String,
        codeFiliereEDF: String,
        qualificationTraitement: String
    }
});

dataModel = {}
dataModel.bordereau = bordereauSchema

module.exports.dataModel = dataModel
