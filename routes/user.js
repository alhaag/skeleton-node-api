var express = require('express');
var router = express.Router();
var UserModel = require('../model/user');

/* GET user listing. */
router.get('/', function(req, res, next) {
  UserModel.find({}, function (err, docs) {
    res.json(docs);
  });
});

/* POST user listing. */
router.post('/', function(req, res, next) {
  var data = new UserModel({
    username: req.body.username,
    password: req.body.password
  });

  data.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.json({ message: 'Novo Usuário', data: data });
    }
  });
});

module.exports = router;
