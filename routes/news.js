var express = require('express');
var router = express.Router();
var NewsModel = require('../model/news');

/* GET /news
 * Lista todas as notícias
*/
router.get('/', function(req, res, next) {
  NewsModel.find({}, function (err, docs) {
    res.json(docs);
  });
});

/* GET /news/:id */

/* POST /news
 * Cria uma notícia
*/
router.post('/', function(req, res, next) {
  // preenche o modelo
  var data = new NewsModel({
    title: req.body.title,
    description: req.body.description
  });
  // salva no BD
  data.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.json({ message: 'Nova notícia criada com sucesso', data: data });
    }
  });
});

/* PUT /news/:id */

/* DELETE /news/:id */

/* DELETE /news */

module.exports = router;
