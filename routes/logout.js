var express = require('express');
var router = express.Router();
var UserModel = require('../model/user');

/**
 * @api {POST} /logout Desautorização
 * @apiGroup Logout
 * @apiDescription Desautoriza o token de acesso. Este token
 * deve ser enviado no header de cada requisição HTTP que precise de autenticação.
 * @apiPermission none
 * @apiExample {curl} Example usage:
 *   curl -X POST http://<api_domain>:<port>/login -d '<json_param>'
 * @apiParam {String} email E-mail do usuário.
 * @apiParam {String} password Senha de acesso do usuário.
 * @apiParamExample {json} Request-Example:
 *   {
 *     "email":    "andreluizhaag@gmail.com",
 *     "password": "1a2b3c"
 *   }
 * @apiSuccess {String} token Token JWT(Jason Web Token) que serve para
 *   identificar o usuário nas próximas requisições. Deve ser incluido no header
 *   "x-access-token".
 * @apiSuccess {number} expires Time stamp em que a autenticação irá expirar.
 * @apiSuccessExample {json} Success-Reponse:
 *   HTTP/1.1 200 OK
 *   {
 *     token : "$2a$05$ooqAbytsQU2lAgBG.Ob8x.4T5F/AO/8s6fSYZXdvIXNDtnNt5h1uq",
 *     expires: "13965"
 *   }
 * @apiErrorExample {json} Error-400:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Parâmetro faltando ou inválido"
 *     }
 * @apiErrorExample {json} Error-401 :
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Não autorizado"
 *     }
 */
router.post('/', function(req, res, next) {
  var username = req.body.username || '';
  var password = req.body.password || '';
  if (username === '' || password === '') {
    return res.send(400);
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
