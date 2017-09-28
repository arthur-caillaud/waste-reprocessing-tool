var excel = require('exceljs');
var database = require('../database');
var dataSchemas = require('./data/dataSchemas.js');
var mongoose = require('mongoose');

var service = {}

//Excel Consts
const MAIN_SHEET = 1

//Mongoose Consts
const MONGOBASE_URL = "mongodb://0.0.0.0:27017"

readXlsx = function (filename,callback) {
    var workBook = new excel.Workbook();
    var jsonExcel = [];
    workBook.xlsx.readFile("data/" + filename).
        then(() => {
            // use workbook
            workBook.getWorksheet(MAIN_SHEET).eachRow(function(row,rowNumber) {
                jsonExcel.push(JSON.stringify(row.values))
            });
            callback(jsonExcel);
        });
};

writeXlsxIntoBdd = function(bddUrl, excelName) {
    //The input is an excelname located in the data/ directory
    //The function enables pushing raw data in the database by converting it to the borderau schema
    database.mongooseConnect(bddUrl, function() {
        readXlsx(excelName, function(jsonExcel, err, result) {
            if (err) {
                console.log('Error', error);
            }
            else {
                var Bordereau = mongoose.model('Bordereau', dataSchemas.bordereauSchema);
                jsonExcel.forEach(function(row){
                    jsonBordereau = convertRawBordereauIntoMongoJson(row);
                    jsonBordereau.save(function(err){
                        if (err){
                            console.error(handleError(err));
                        }
                        else {
                            console.log(jsonBordereau.numeroBordereau)
                            console.log("Bordereau successfully saved in MongoDB");
                        }
                    })
                })
            }

        });
    });
}

convertRawBordereauIntoMongoJson = function(bordereauRow) {
    //The input is a stringified JSON read from an xlsx file using readXlsx function
    //The output is a ready to be pushed in the MongoDB bordereau
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
    return (new Bordereau(jsonBordereau));
}

service.readXlsx = readXlsx;
service.writeXlsxIntoBDD = writeXlsxIntoBdd;
service.convertRawBordereauIntoMongoJson = convertRawBordereauIntoMongoJson;
module.exports = service;
