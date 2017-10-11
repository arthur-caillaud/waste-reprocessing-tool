'use strict';
var Rx = require('rx');
var service = {};
var sequelize = require('sequelize');

var models = require('../models/');
var bordereau = models.bordereau;

const tolerance = 10;
