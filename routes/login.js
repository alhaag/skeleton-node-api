/**
 * Route /login
 *
 * Tratamento de requisições HTTP de autenticação e recuperação de senha.
 *
 * @author André Luiz Haag <andreluizhaag@gmail.com>
 * @license LICENSE.md
 * @see middlewares/images
 * @see http://apidocjs.com/
 */
var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var moment = require('moment');
var UserModel = require('../model/user');

/**
 * @api {POST} /login Autenticação
 *
 * @apiGroup Login
 * @apiDescription Efetua o login para obter o toke de acesso a API. Este token
 * deve ser enviado no header de cada requisição HTTP que precise de autenticação.
 * @apiPermission none
 *
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
 *
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
  var secret = req.app.get('secret');
  var email = req.body.email || '';
  var password = req.body.password || '';
  if (email === '' || password === '') {
     // 400 - Bad Request
    return res.send(400).json({
      "error": "Parâmetro faltando ou inválido"
    });
  }
  // tenta recuperar o usuário
  UserModel.findOne({email: email}, function (err, user) {
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
        if (err) return res.sendStatus(500);
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

/**
 * @api {POST} /login/recovery Recuperar senha
 * @apiGroup Login
 * @apiDescription Receber um e-mail da API para recuperação da senha de acesso.
 * Este é o primeiro passo para a recuperação. O e-mail irá conter um link para a URL
 * de retorno informada acrescido do parâmetro token que deve ser enviado na
 * criação da nova senha para o recurso "change-password". O toke expira em 60 minutos.
 * @apiPermission none
 * @apiExample {curl} Example usage:
 *   curl -X POST http://localhost/login/recovery -d '<json_param>'
 * @apiParam {String} email E-mail utilizado para autenticação no sistema.
 * @apiParamExample {json} Request-Example:
 *   {
 *     "email":     "andreluizhaag@gmail.com",
 *     "returnUrl": "http://front-end.com.br/recovery"
 *   }
 */
router.post('/recovery', function(req, res, next) {
  next(new Error("Pendente de implementação"));
  /*UserModel.findOne({email: email}, function (err, user) {
    res.json(docs);
  });*/
});

/**
 * @api {POST} /login/change-password Alterar senha perdida
 * @apiGroup Login
 * @apiDescription Cria uma nova senha
 * @apiPermission none
 * @apiExample {curl} Example usage:
 *   curl -X POST http://localhost/login/change-password -d '<json_param>'
 * @apiParam {String} token Token enviado para o e-mail de recuperação.
 * @apiParam {String} email E-mail utilizado para autenticação no sistema.
 * @apiParam {String} newPasswrd Nova senha que irá subistituir a antiga.
 * @apiParamExample {json} Request-Example:
 *   {
 *     "toke":        "$2a$05$ooqAbytsQU2lAgBG.Ob8x.4T5F/AO/8s6fSYZXdvIXNDtnNt5h1uq"
 *     "email":       "andreluizhaag@gmail.com",
 *     "newPassword": "1a2b3c"
 *   }
 */
router.post('/change-password', function(req, res, next) {
  next(new Error("Pendente de implementação"));
  /*UserModel.find({}, function (err, docs) {
    res.json(docs);
  });*/
});

module.exports = router;
