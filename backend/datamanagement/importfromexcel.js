var excel = require('exceljs');
var mongoose = require('mongoose');

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

mongoose.connect(MONGOBASE_URL,{
    useMongoClient: true
});
var database = mongoose.connection;
database.on('error', console.error.bind(console, 'connection error:'));
database.once('open', function() {
    //Connection successfully achieved
    console.log("Connection to database successfully achieved");
    readXlsx("importfromexceltestdata.xlsx",function(jsonExcel) {
        console.log("Json Excel", jsonExcel);
        var Schema = mongoose.Schema;
        var schemaArchitecture = jsonExcel[0];
        var bordereauSchema = new Schema(
        )
    })
});
