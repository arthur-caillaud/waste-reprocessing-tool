var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var bordereaux = require('./routes/bordereaux.controller');
var prestataires = require('./routes/prestataires.controller');
var prestatairesNew = require('./routes/prestataires-new.controller');
var dechets = require('./routes/dechets.controller');
var sites = require('./routes/sites.controller');
var dashboard = require('./routes/dashboard.controller');
var graphs = require('./routes/graphs.controller');

var router = express.Router();

// for now, we ignore the file as it will probably be launched externally
// var preCompute = require('./datamanagement/pre_computing');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

//CAN WE PLEASE CHANGE TO EJS ??????

app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// allow access-controll headers
app.use(function(req, res, next) {
  // allow for cross-referencing
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // allow different requests
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});

app.use('/api', router);

router.use('/', index);
router.use('/users', users);

router.use('/bordereaux', bordereaux);
router.use('/dechets', dechets);
router.use('/prestataires', prestatairesNew);
router.use('/old/prestataires', prestataires);
router.use('/sites', sites);
router.use('/dashboard', dashboard);
router.use('/graphs', graphs);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
