var chai = require('chai');
var assert = chai.assert;
var Excel = require('../../backend/datamanagement/db_importfromexcel');

describe("Data importing from Excel", function(t) {

  // Path starting from the ./backend folder
  var filepath = "./importfromexceltestdata.xlsx";
  // Dummy function to ignore events
  const noop = () => {};

  const handleError = (error) => {
    if (error) {
      throw error;
    }
  }

  it("should be an Observable", (done) => {
    try {
      // tests if the subscribe method exists to check if observable
      assert.isFunction(Excel.readXlsx(filepath).subscribe);
      done();
    }
    catch(err) {
      return done(err);
    }
  });

  it("should finish whithout error", (done) => {
    try {
      // ignores all events except end of stream event
      Excel.readXlsx(filepath).subscribe(
        (result) => {
          assert.isNotNull(result);
          done()
        },
        handleError
      );
    }
    catch (err) {
      done(err);
    }
  })

  it("should correctly import data from Excel", (done) => {

    // The function ignores the headers
    var expectedResult = [
      [null,"Siamois",14,null,"Thon"],
      [null,"Persan",10,"Rempli","Thon"],
      [null,"Lion",1,null,"Viande"]];

    Excel.readXlsx(filepath).subscribe((result) => {
      try {
        // Using JSON.stringify to avoid comparison problems
        assert.equal(JSON.stringify(expectedResult), JSON.stringify(result));
        done();
      }
      catch (err) {
        done(err);
      }
    });
  });

});
