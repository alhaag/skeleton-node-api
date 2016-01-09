/**
 * Route /user
 *
 * Tratamento de requisições HTTP de usuários.
 *
 * @author André Luiz Haag <andreluizhaag@gmail.com>
 * @license LICENSE.md
 * @see middlewares/images
 * @see http://apidocjs.com/
 */
var express = require('express');
var router = express.Router();
var UserModel = require('../model/user');

/**
 * @api {GET} /user Listar
 * @apiGroup Users
 * @apiPermission admin
 * @apiDescription Obter a lista de usuários.
 * @apiExample {curl} Example usage:
 *   curl -X GET http://localhost/user -H "x-access-token: <your_access_token>"
 */
router.get('/', function(req, res, next) {
  UserModel.find({}, function (err, docs) {
    res.json(docs);
  });
});

/**
 * @api {POST} /user Incluir
 * @apiGroup Users
 * @apiDescription Incluir novo usuário.
 * @apiPermission admin
 * @apiHeader {String} x-access-token Token de acesso obtido no login.
 * @apiExample {curl} Example usage:
 *   curl -X POST http://localhost/user -H "x-access-token: <your_access_token>" -d '<json_param>'
 * @apiParam {String} name Nome do usuário.
 * @apiParam {String} email E-mail que será utilizado para autenticação no sistema.
 * @apiParam {String} password Senha que será utilizada para autenticação.
 * @apiParam {String} [descrition] Descição ou observações opcionais sobre o usuário.
 * @apiParamExample {json} Request-Example:
 *   {
 *     "name":        "alhaag",
 *     "email":       "andreluizhaag@gmail.com",
 *     "password":    "1a2a3a",
 *     "description": "Descição ou observações sobre o usuário"
 *   }
 */
router.post('/', function(req, res, next) {
  var data = new UserModel({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  // persiste o usuário no BD
  data.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.json({ message: 'Novo Usuário', data: data });
    }
  });
});

/**
 * @api {PUT} /user Atualizar
 * @apiGroup Users
 */
router.put('/', function(req, res, next) {
next(new Error("Pendente de implementação"));
});

/**
 * @api {DELETE} /user Deletar
 * @apiGroup Users
 */
router.delete('/:id', function(req, res, next) {
 next(new Error("Pendente de implementação"));
});

module.exports = router;
