var excel = require('exceljs');
var mongoose = require('mongoose');
var dataSchemas = require('./data/dataSchemas.js');

var service = {}

//Excel Consts
const DATA_DIR = "data/"
const MAIN_SHEET = 1

//Mongoose Consts
const MONGOBASE_URL = "mongodb://0.0.0.0:27017"

readXlsx = function (filename,callback){
    var workBook = new excel.Workbook();
    var jsonExcel = [];
    workBook.xlsx.readFile(DATA_DIR + filename).
        then(() => {
            // use workbook
            workBook.getWorksheet(MAIN_SHEET).eachRow(function(row,rowNumber){
                jsonExcel.push(JSON.stringify(row.values))
            });
            callback(jsonExcel);
        });
};

mongooseConnect = function(mongoBaseUrl,callback) {
    mongoose.connect(mongoBaseUrl,{
        useMongoClient: true
    });
    var database = mongoose.connection;
    database.on('error', console.error.bind(console, 'connection error:'));
    database.once('open', function(){
        console.log("Connection to database successfully achieved");
        callback();
    })
}

mongooseConnect(MONGOBASE_URL,function(){
    readXlsx("importfromexceltestdata.xlsx",function(jsonExcel) {
        var Bordereau = mongoose.model('Bordereau', dataSchemas.bordereauSchema);
    })
})

service.readXlsx = readXlsx;
service.mongooseConnect = mongooseConnect;
module.exports = service;
