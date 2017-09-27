var excel = require('exceljs');
var mongoose = require('mongoose');

//Creating something to export in other files
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
        console.log("Json Excel", jsonExcel);
        var Schema = mongoose.Schema;
        var schemaArchitecture = jsonExcel[0];
        console.log(schemaArchitecture);
        var bordereauSchema = new Schema({
            numeroBordereau: String,
            cas: Number,
            nomEmetteur: String,
            etatBordereau: String,
            modeSuivi: String,
            codeFiliereDRPrevu: String,
            codeFiliereEDFPrevu: String,
            codeInterneDechet: String,
            libelleDechet: String,
            codeEuropeenDechet: String,
            categorieDechet: String,
            indicateurNationalValorisation: String,
            famille: String,

        }
        )
    })
});
})


//setting what we want to export
service.readXlsx = readXlsx;
service.mongooseConnect = mongooseConnect;
module.exports = service;
