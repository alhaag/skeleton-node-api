var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var moment = require('moment');
var UserModel = require('../model/user');

/* POST /login */
router.post('/', function(req, res, next) {
  var secret = req.app.get('secret');
  var username = req.body.username || '';
  var password = req.body.password || '';
  if (username === '' || password === '') {
    return res.send(401);
  }
  // tenta recuperar o usuário
  UserModel.findOne({username: username}, function (err, user) {
    // se retorna erro ou não existir o usuário no BD
    if (err || (! user)) {
      return res.sendStatus(401);
    }
    // confere a senha com o hash gravado no BD
    user.passwordChecks(password, function(isMatch) {
      if (!isMatch) {
        return res.sendStatus(401);
      }
      // seta o usuário como login ativo
      user.update({loggedIn: true}, function(err, user) {
        // se ocorrer erro no update
        if (err) {
          return res.sendStatus(500);
        }
        // validade do token
        var expires = moment().add(1,'days').valueOf();
        // jera o token JWT
        var token = jwt.encode({
          iss: user.id,
          exp: expires
        }, secret);
        // retorna o token JWT e a validade
        return res.status(200).json({
          token : token,
          expires: expires
        });
      });
    });
  });
});

module.exports = router;
