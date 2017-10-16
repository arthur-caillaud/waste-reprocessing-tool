var supertest = require("supertest");
var chai = require("chai");
var assert = chai.assert;

var server = supertest.agent("http://localhost:4000");

// TODO change URL when the API will use the new adresses

describe("Prestataires Routes", () => {



    describe("GET /prestataires", () => {

        it("should return a 200 status code", (done) => {
            server.get("/prestataires/")
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

    describe("GET /prestataires?attributes=id,nom", () => {

        it("should return a 200 status code", (done) => {
            server.get("/prestataires/?attributes=id,nom")
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

    describe("GET /prestataires?order=-id", () => {

        it("should return a 200 status code", (done) => {
            server.get("/prestataires/?order=-id")
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

    describe("GET /prestataires?id=1", () => {

        it("should return a 200 status code", (done) => {
            server.get("/prestataires/?id=1")
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

    describe("GET /prestataires?siret=33135716000075", () => {

        it("should return a 200 status code", (done) => {
            server.get("/prestataires/?siret=33135716000075")
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
            server.get("/prestataires/1")
                .then((response) => {
                    assert.equal(response.status, 200);
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });

        it("should return a 404 status code for non-existing value", (done) => {
            server.get("/prestataires/0")
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
