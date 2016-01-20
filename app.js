/**
 * Rest full API - Skeleton
 *
 * API esqueleto para a criação de novas API's.
 *
 * @author André Luiz Haag <andreluizhaag@gmail.com>
 * @license LICENSE.md
 */

// dependencies
var express = require('express');
var expressValidator = require('express-validator');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var router = express.Router();
// globals
global.__base = __dirname + '/';
// local midlewares
var config = require('./config/config');
var headers = require('./middlewares/app-headers');
var routes = require('./middlewares/app-routes');

var app = express();

app.set('secret', config.secret); // secret variable
app.use(logger('dev')); // use morgan to log requests to the console
app.use(bodyParser.json({limit: '50mb'})); // set request body limit
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(expressValidator()); // include validator
app.use(express.static(path.join(__dirname, 'public'))); // provides statically files /public
app.use('/doc', express.static(__dirname + '/doc')); // provides statically documentation /doc
app.use(cookieParser());
mongoose.connect(config.database); // mongodb set by the configuration file
app.use(headers); // set app headers
routes.mount(app); // set app resource routes

module.exports = app;
