var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var router = express.Router();

var config = require('./config/config');
var routes = require('./routes/index');
var user = require('./routes/user');
var news = require('./routes/news');
var login = require('./routes/login');
var logout = require('./routes/logout');
var accessValidation = require('./middlewares/access-validation');

var app = express();

app.set('secret', config.secret); // secret variable
app.use(logger('dev')); // use morgan to log requests to the console
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect(config.database);

// API ROUTES -------------------
app.use('/', routes);
app.use('/login', login);
app.use('/logout', accessValidation, logout);
app.use('/user', accessValidation, user);
app.use('/news', accessValidation, news);

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
