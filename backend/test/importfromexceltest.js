var path = require('path');
var test = require('tape');
var Excel = require(path.join(__dirname, '../datamanagement', 'importfromexcel'));


test("Import des données depuis Excel", function (t) {
    Excel.readXlsx("importfromexceltestdata.xlsx", function(err, jsonExcel) {
        t.equal(err, null);
        t.equal(jsonExcel, //insert object here)
    };
});
