var supertest = require("supertest");
var chai = require("chai");
var assert = chai.assert;

var server = supertest.agent("http://localhost:4000");

// TODO change URL when the API will use the new adresses

describe("Bordereaux Routes", () => {



    describe("GET /bordereaux", () => {

        it("should return a 200 status code", (done) => {
            server.get("/bordereaux")
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


    describe("GET prestataires/:id", () => {

        it("should return a 200 status code", (done) => {
            server.get("/bordereaux/1")
                .then((response) => {
                    assert.equal(response.status, 200);
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });

        // TODO: add the function when the service is created
        // it("should return a 404 status code for non-existing value", (done) => {
        //     server.get("/prestataires/new/0")
        //         .then((response) => {
        //             assert.equal(response.status, 404);
        //             done();
        //         })
        //         .catch((err) => {
        //             done(err);
        //         })
        // })

        it("should return the correct data", () => {
            // TODO as the data must be studied to be tested
        })

    });

});
