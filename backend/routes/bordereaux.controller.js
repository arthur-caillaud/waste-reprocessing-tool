'use strict';
var express = require('express');
var router = express.Router();
var Rx = require('rx');


/*
This is a controller entirely dedicated to error handling when it comes
to database communication. The functions dealing directly with Sequalize
are written in the services being called in this controller
*/

/*
Only two functions are needed: you don't need to create, modify or delete
anything concerning the bordereaux
*/


function getAllBordereaux(req, res) {
    // currently only returns a 200 code with dummy data
    var dummyResponse = {"message": "OK"};
    res.json(dummyResponse);
}

function getBordereau(req, res) {
  // currently only returns a 200 code with dummy data
  // the data will contain the id that was requested
  var id = req.params.id;
  var dummyResponse = {"message": "OK", "id": id};
  res.json(dummyResponse);
}


// routes to the functions
router.get('/', getAllBordereaux);
router.get('/:id', getBordereau);

module.exports = router;
