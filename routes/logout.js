var express = require('express');
var router = express.Router();
var UserModel = require('../model/user');

/* POST /logout */
router.post('/', function(req, res, next) {
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
      user.update({loggedIn: false}, function(err, user) {
        // se ocorrer erro no update
        if (err) {
          return res.sendStatus(500);
        }
        // retorno de sucesso 204 No Content
        return res.sendStatus(204);
      });
    });
  });
});

module.exports = router;
