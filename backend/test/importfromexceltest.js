var assert = require('assert');
var Excel = require('../datamanagement/db_importfromexcel');

describe("Data Management", function(t) {

  it("should correctly import data from Excel", function(done) {

    // Path starting from the ./backend folder
    var filepath = "./test/data/importfromexceltestdata.xlsx";

    // The function ignores the headers
    var expectedResult = [
      [null,"Siamois",14,null,"Thon"],
      [null,"Persan",10,"Rempli","Thon"],
      [null,"Lion",1,null,"Viande"]];

    Excel.readXlsx(filepath, function(error, jsonExcel) {
      try {
        // Using JSON.stringify to avoid comparison problems
        assert.equal(JSON.stringify(expectedResult), JSON.stringify(jsonExcel));
        done();
      }
      catch (err) {
        done(err);
      }
    });
  });

});
