/**
 * Rest full API - Skeleton
 *
 * API esqueleto para a criação de novas API's.
 *
 * @author André Luiz Haag <andreluizhaag@gmail.com>
 * @license LICENSE.md
 */

var express = require('express');
var expressValidator = require('express-validator');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var router = express.Router();

var config = require('./config/config');
var test = require('./routes/index');
var user = require('./routes/user');
var news = require('./routes/news');
var login = require('./routes/login');
var logout = require('./routes/logout');
var accessValidation = require('./middlewares/access-validation');

var app = express();

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  return next();
});
app.set('secret', config.secret); // secret variable
app.use(logger('dev')); // use morgan to log requests to the console
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/doc', express.static(__dirname + '/doc')); // prove a doc estaticamente
app.use(cookieParser());
mongoose.connect(config.database);

// API ROUTES -------------------
app.use('/', test);
app.use('/login', login);
app.use('/logout', accessValidation, logout);
app.use('/user', /*accessValidation,*/ user);
app.use('/news', /*accessValidation,*/ news);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    var status = err.status || 500;
    res.status(status).json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  var status = err.status || 500;
  res.status(status).json({
    message: err.message,
    error: {}
  });
});

module.exports = app;
