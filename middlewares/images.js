/**
 * Middleware images
 *
 * Manipula imagens dos recursos de acordo com os parâmetros informados pelas
 * rotas.
 *
 * @author André Luiz Haag <andreluizhaag@gmail.com>
 * @license LICENSE.md
 * @see https://lodash.com/docs
 */

// dependencies
var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var mkdirp = require("mkdirp");
var _object = require('lodash/object');

/**
 * Opções default para a persistencia das imagens em disco
 */
var defaultOptions = {
  "limit": 10,
  "dir": "./public/images/",
  "maxWidth": 800,
  "maxHeight": 600
};

var processOptions = function(options) {
  return _object.merge(defaultOptions, options);
};

var validadePost = function() {

};

var validadePut = function() {

};

/**
 * Salva imagens recebidas por post.
 */
module.exports.post = function(req, res, next, doc, options) {
  // TODO: validade options, req.body
  var opt = processOptions(options);
  opt.dir = opt.dir + doc._id + '/'; // inclui id no path
  // waterfall functions
  async.waterfall([
    function(callback) {
      // create if not exists
      if (!fs.existsSync(opt.dir)) {
        mkdirp(opt.dir, function (err) {
          console.log('Diretório criado: ', opt.dir);
          callback(err || null);
        });
      } else {
        // continue if dir exists
        callback(null);
      }
    },
    function(callback) {
      // save images in disc
      async.forEach(req.body, function (item, cbInterator) {
        var buff = new Buffer(item.data.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');
        // TODO: se arquivo ja existe renomeia incrementando até não existir igual
        // TODO: remover caracteres especiais e espacos do nome do arquivo
        fs.writeFile(opt.dir + item.fileName, buff, function (err) {
          doc.images.push({
              "index": item.index || 1,
              "url": opt.dir.replace('./public', '') + item.fileName,
              "description": item.description || ''
          });
          cbInterator(); // tell async that the iterator has completed
        });
      },
      function(err) {
        if (err) return cb(err);
        // return field images to persist in the model
        //return cb(null, imgs);
        doc.save(function (err, result) {
          if(err) next(err);
          return res.status(200).json(result.images);
        });
      });
    }
  ]);
};

/**
 * Salva imagens recebidas por post.
 */
module.exports.put = function(req, res, next, doc, options) {
  // TODO: validade options, req.body
  var opt = processOptions(options);
  // fill sub doc images
  async.forEach(req.body, function (item, cbInterator) {
    doc.images.findOne({_id: item._id}, function (err, doc) {
      console.log(doc);
    });
    cbInterator(); // tell async that the iterator has completed
  },
  function(err) {
    return res.status(200).json({"result": "ok"});

    if (err) return cb(err);
    // return field images to persist in the model
    //return cb(null, imgs);
    doc.save(function (err, result) {
      if(err) next(err);
      return res.status(200).json(result.images);
    });
  });
};
