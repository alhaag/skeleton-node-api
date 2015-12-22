var model = require('../model/user');
var jwt = require('jwt-simple');

/**
 * Autoriza ou não o acesso a recursos da api.
 * Verifica a existencia e validade do token JWT recebido pelo header da
 * requisição denominado "x-access-token" obtido no login.
 * Verifica também se a flag "loggedIn" ainda é true, caso contrário deve ser
 * realizado o login novamente. Isso forne uma forma de invalidar o token que
 * neta API é realizado pela rota /logout.
 *
*/
module.exports = function(req, res, next) {
  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
  // se tiver o token
  if (token) {
    try {
      var secret = req.app.get('secret');
      var decoded = jwt.decode(token, secret);
      console.log('decodando ' + decoded);
     // verifica a validade
      if (decoded.exp <= Date.now()) {
        res.json(400, {error: 'Acesso Expirado, faça login novamente'});
      }
      // verifica o usuário
      model.findOne({ _id: decoded.iss }, function(err, user) {
        if (err) {
          res.status(500).json({message: "erro ao procurar usuario do token."});
        }
        // inclui o usuário no objeto req
        req.user = user;
        // prosegue para o próximo middleware
        return next();
      });
    // se der erro
    } catch (err) {
      return res.status(401).json({message: 'Erro: Seu token é inválido'});
    }
  } else {
    res.status(401).json({message: 'Token não encontrado ou informado'});
  }
};
