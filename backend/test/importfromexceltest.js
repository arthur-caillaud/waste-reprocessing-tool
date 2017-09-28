var assert = require('assert');
var Excel = require('../datamanagement/importfromexcel');

describe("Import des données depuis Excel", function(t) {
  it("should correctly import data from Excel", function(done) {
    var filepath = "./test/data/importfromexceltestdata.xlsx";
    var expectedResult = [
      JSON.stringify([null,"Chat","Nombre","Colonne parfois vide","Repas"]),
      JSON.stringify([null,"Siamois",14,null,"Thon"]),
      JSON.stringify([null,"Persan",10,"Rempli","Thon"]),
      JSON.stringify([null,"Lion",1,null,"Viande"])];
    Excel.readXlsx(filepath, function(jsonExcel) {
      try {
        assert.equal(JSON.stringify(expectedResult), JSON.stringify(jsonExcel));
        done();
      }
      catch (err) {
        done(err);
      }
    });
  });
});
