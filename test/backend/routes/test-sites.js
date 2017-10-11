var supertest = require("supertest");
var chai = require("chai");
var assert = chai.assert;

var server = supertest.agent("http://localhost:4000");

describe("Sites Routes", () => {



    describe("GET /sites", () => {

        it("should return a 200 status code", (done) => {
            server.get("/sites")
                .then((response) => {
                    assert.equal(response.status, 200);
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });

        it("should return the correct data", () => {
            // TODO as the data must be studied to be tested
        })
    })


    describe("GET sites/:id", () => {

        it("should return a 200 status code", (done) => {
            server.get("/sites/1")
                .then((response) => {
                    assert.equal(response.status, 200);
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });

        it("should return a 404 status code for non-existing value", (done) => {
            server.get("/sites/0")
                .then((response) => {
                    assert.equal(response.status, 404);
                    done();
                })
                .catch((err) => {
                    done(err);
                })
        })

        it("should return the correct data", () => {
            // TODO as the data must be studied to be tested
        })

    });

});
