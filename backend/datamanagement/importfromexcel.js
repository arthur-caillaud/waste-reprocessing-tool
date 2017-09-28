var excel = require('exceljs');
var database = require('../database');
var dataSchemas = require ('.data/dataSchemas.js') 
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


writeXlsxIntoBDD = function(BDD_URL, callback) {
    database.mongooseConnect(BDD_URL, function() {
        readXlsx("importfromexceltestdata.xlsx", function(jsonExcel, err, result) {
            if (err) {
                console.log('Error', error);
            }
            else {
                var Bordereau = mongoose.model('Bordereau', dataSchemas.bordereauSchema);

            }

        });
    });
}

convertRawBordereauIntoMongoJson = function(bordereauRow,callback) {

}

service.readXlsx = readXlsx;
service.writeXlsxIntoBDD = writeXlsxIntoBDD;
module.exports = service;
