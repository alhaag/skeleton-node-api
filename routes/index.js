var express = require('express');
var router = express.Router();

/**
 * @api {GET} / Teste de conectividade
 * @apiGroup Teste
 * @apiPermission none
 * @apiDescription URL de teste para verificação de conectividade com a API.
 * @apiExample {curl} Example usage:
 *   curl -X GET http://<api_domain>:<port>/
 * @apiSuccess {String} success Mensagem de sucesso.
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
