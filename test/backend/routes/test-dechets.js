var supertest = require("supertest");
var chai = require("chai");
var assert = chai.assert;

var server = supertest.agent("http://localhost:4000/api");

describe("Déchets Routes", () => {



    describe("GET /dechets", () => {

        it("should return a 200 status code", (done) => {
            server.get("/dechets")
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
    });

    describe("GET /dechets/?attributes=id,libelle", () => {

        it("should return a 200 status code", (done) => {
            server.get("/dechets?attributes=id,libelle")
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
    });

    describe("GET /dechets/order=-id", () => {

        it("should return a 200 status code", (done) => {
            server.get("/dechets/?order=-id")
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
    });

    describe("GET /dechets?id=1", () => {

        it("should return a 200 status code", (done) => {
            server.get("/dechets?id=1")
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
    });


    describe("GET /dechets?is_dangereux=1", () => {

        it("should return a 200 status code", (done) => {
            server.get("/dechets?id_dangereux=1")
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


    describe("GET dechets/:id", () => {

        it("should return a 200 status code", (done) => {
            server.get("/dechets/1")
                .then((response) => {
                    assert.equal(response.status, 200);
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });

        it("should return a 404 status code for non-existing value", (done) => {
            server.get("/dechets/0")
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
