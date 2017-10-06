var supertest = require("supertest");
var chai = require("chai");
var assert = chai.assert;

var server = supertest.agent("http://localhost:4000");

describe("Déchets Routes", () => {



  describe("GET /dechets", () => {

    it("should return a 200 status code", () => {
      try {
        server
          .get("/dechets")
          .expect("Content-type",/JSON/)
          .expect(200)
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      }
      catch (err) {
        done(err);
      }
    });
    it("should return the correct data", () => {
      try {
        server
          .get("/dechets")
          .expect("Content-type", /JSON/)
          .expect(200)
          .end((err, res) => {
            var message = res.body.message;
            var expectedMessage = "OK";
            assert.equal(message, expectedMessage);
            done();
          })
      }
      catch (err) {
        done(err);
      }
    })
  })


  describe("GET dechets/:id", () => {
    it("should return a 200 status code", () => {
      try {
        server
          .get("/dechets/42")
          .expect("Content-type",/JSON/)
          .expect(200)
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      }
      catch (err) {
        done(err);
      }
    });
    it("should return the correct data", () => {
      try {
        server
          .get("/dechets/42")
          .expect("Content-type", /JSON/)
          .expect(200)
          .end((err, res) => {
            var message = res.body.message;
            var receivedId = res.body.id;
            var expectedMessage = "OK";
            var expectedId = "42";
            assert.equal(message, expectedMessage);
            assert.equal(receivedId, expectedId);
            done();
          })
      }
      catch (err) {
        done(err);
      }
    });

  });

});
