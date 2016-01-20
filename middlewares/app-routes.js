var accessValidation = require(__base + 'middlewares/access-validation');
var test = require(__base + 'routes/index');
var user = require(__base + 'routes/user');
var news = require(__base + 'routes/news');
var login = require(__base + 'routes/login');
var logout = require(__base + 'routes/logout');

module.exports.mount = function(app) {

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
};