var excel = require('exceljs');
var database = require('../database')
var mongoose = require('mongoose');

var service = {}

//Excel Consts
const MAIN_SHEET = 1

//Mongoose Consts
const MONGOBASE_URL = "mongodb://0.0.0.0:27017"

readXlsx = function (filename,callback){
    var workBook = new excel.Workbook();
    var jsonExcel = [];
    workBook.xlsx.readFile("data/" + filename).
        then(() => {
            // use workbook
            workBook.getWorksheet(MAIN_SHEET).eachRow(function(row,rowNumber){
                jsonExcel.push(JSON.stringify(row.values))
            });
            callback(jsonExcel);
        });
};


writeXlsxIntoBDD = function(MONGOBASE_URL) {
    database.mongooseConnect(MONGOBASE_URL,function(){
        readXlsx("importfromexceltestdata.xlsx",function(jsonExcel) {
            var Bordereau = mongoose.model('Bordereau', dataSchemas.bordereauSchema);
        })
    })
}


service.readXlsx = readXlsx;
module.exports = service;
