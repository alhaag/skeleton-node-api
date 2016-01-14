var express = require('express');
var router = express.Router();

/**
 * @api {GET} / Teste de conectividade
 *
 * @apiDescription URL de teste para verificação de conectividade com a API.
 * @apiGroup Teste
 * @apiPermission none
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "success" : "API acessada com sucesso."
 *   }
 */
router.get('/', function(req, res, next) {
  return res.status(200).json({
    success : "API acessada com sucesso."
  });
});

module.exports = router;
