var assert = require('assert');
var router = require('../backend/routes/prestataires.controller');
var service = require('../backend/services/prestataires.service');
var Excel = require('../backend/datamanagement/db_importfromexcel');


describe("Should correctly find clients in database", function(t) {

    it("should correctly find the test clients in the clients table", function(done) {

        /* This test assumes that previous tests from importfromexceltest
        passed, as it uses functions that are being tested by that file */

        //Path getting the Excel file
        var filepath = "./data/prestatairedatatest.xlsx";
        

    });
});
