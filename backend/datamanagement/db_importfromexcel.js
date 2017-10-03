var excel = require('exceljs');
var Rx = require ('rx');
var config = require('../config.json');

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


readXlsx = function (filepath, callback) {
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
};

convertRowIntoDechetSequelize = function(excelRow){
    newDechet = {
        libelle: excelRow[9],
        code_europeen: excelRow[10],
        categorie: excelRow[11],
        indicateur_national_valorisation: excelRow[12],
        famille: excelRow[13]
    };
    dechet.findOrCreate({where: {codeinterne: excelRow[8]}, defaults: newDechet})
    .spread((dechet, created) => {
        return dechet;
    });
};

convertRowIntoTransporteurSequelize = function(excelRow) {
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
            obs.next(transporteur1);
        });

        transporteur.findOrCreate({where: {siret: bordereauRow[40]}, defaults: newTransporteur2})
        .sprend((transporteur2, created) => {
            obs.next(transporteur2);
        });
    };
    return TransporteurObservable;
}

convertRowIntoSequelize = function(bordereauRow) {
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
}

writeIntoBdd = function(bddUrl, excelName) {
    //The input is an excelname located in the data/ directory
    //The function enables pushing raw data in the database by converting it to the borderau schema

}


//Export du service

var service = {}
service.readXlsx = readXlsx;
service.writeBordereauIntoBDD = writeBordereauIntoBdd;
service.convertRowIntoSequelize = convertRowIntoSequelize;
module.exports = service;


//Phase d'essai

var readXlsxObserver = {
    next: function(value){
        console.log(value);
    },
    error: function(error){
        console.error(error);
    },
    complete: function(){
        console.log("readXlsx completed");
    }
}
readXlsx("dataedfmars.xlsx").subscribe(readXlsxObserver);
