var assert = require('assert');
var router = require('../backend/routes/prestataires.controller');
var service = require('../backend/services/prestataire.service');
var Excel = require('../backend/datamanagement/db_importfromexcel');


describe("Should correctly find clients in database", function(t) {

    /* This test assumes that previous tests from importfromexceltest
    passed, as it uses functions that are being tested by that file */

        //Path getting the Excel file
        var filepath = "./data/prestatairedatatest.xlsx";
        // Dummy function to ignore events
        const noop = () => {};

        const handleError = (error) => {
          if (error) {
            throw error;
          }
        }

        it("should be an Observable", (done) => {
            try {
                assert.isFunction(service.getAllClients().subscribe);
                done();
            }
            catch(err) {
                return done(err);
            }
        });

        it("should finish without error", (done) => {
            try {
                service.getAllClients().subscribe(
                    (result) => {
                        assert.isNotNull(result);
                        done();
                    },
                    handleError
                );
            }
            catch (err) {
                done(err);
            }
        });

        it("should correctly get all the prestataires from database", (done) => {

            //To be changed
            // var expectedResult = [
            //     ["test","nord",12345,1]
            // ];
            service.getAllClients().subscribe((result) => {
                try {
                    assert.equal(JSON.stringify(expectedResult), JSON.stringify(result));
                    done();
                }
                catch (err) {
                    done(err);
                }
            });
        });


});
