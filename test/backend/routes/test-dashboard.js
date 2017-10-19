var supertest = require("supertest");
var chai = require("chai");
var assert = chai.assert;

var server = supertest.agent("http://localhost:4000/api");

describe("Dashboard Routes", () => {

    describe("GET /dashboard", () => {

        it("should return a 200 code", (done) => {
            server.get('/dashboard')
                .then((response) => {
                    assert.equal(response.status, 200);
                    done();
                })
                .catch((error) => {
                    done(error);
                })
        });

        it("should return the right amount of entries", (done) => {
            server.get('/dashboard')
                .then((response) => {
                    assert.equal(response.body.length, 909);
                    done();
                })
                .catch((error) => {
                    done(error);
                })
        });

        it("should have the right quantity", (done) => {
            server.get('/dashboard')
                .then((response) => {
                    var sum = 0;
                    response.body.forEach((element) => {
                        sum += parseFloat(element.volume_total);
                    })
                    assert.equal(sum, 60358.3682);
                    done();
                })
                .catch((error) => {
                    done(error);
                })
        })
    })


})
