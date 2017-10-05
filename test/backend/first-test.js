var supertest = require("supertest");
var assert = require("assert");
// This agent refers to PORT where the program is running.
var server = supertest.agent("http://localhost:4000");

// UNIT test begin

describe("SAMPLE unit test",function(){

  // #1 should return home page
  it("should return home page",function(done){
    // calling home page
    try {
      server
      .get("/")
      .expect("Content-type",/text/)
      .expect(200) // THis is HTTP response
      .end(function(err,res){
        // HTTP status should be 200
        assert.equal(res.status, 200);
        done();
      });
    }
    catch (err) {
      done(err);
    }
  });

});