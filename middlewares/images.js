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

/**
 * Dependencies
 */
var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var mkdirp = require("mkdirp");
var _object = require('lodash/object');

/**
 * Default options.
 */
var defaultOptions = {
  "limit": 10,
  "dir": "./public/images/",
  "maxWidth": 800,
  "maxHeight": 600
};

/**
 * Merge specific options to the default.
 * @param {object} options Especific options from call.
 */
var processOptions = function(options) {
  return _object.merge(defaultOptions, options);
};

/**
 * Remove file and directories recursive.
 * @param {string} path Directory to be removed.
 */
var deleteFolderRecursiveSync = function(path) {
  if(fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file,index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursiveSync(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

/**
 * Salva imagens recebidas por POST.
 *
 * @param {object} req Request object.
 * @param {object} res Response object.
 * @param {object} next Function to call next matching route.
 * @param {object} doc Document containing the images field.
 * @param {object} options Especific options.
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
        // persist in the model
        doc.save(function (err, result) {
          if(err) next(err);
          return res.status(200).json(result.images);
        });
      });
    }
  ]);
};

/**
 * Salva imagens recebidas por PUT.
 *
 * @param {object} req Request object.
 * @param {object} res Response object.
 * @param {object} next Function to call next matching route.
 * @param {object} doc Document containing the images field.
 * @param {object} options Especific options.
 */
module.exports.put = function(req, res, next, doc, options) {
  // TODO: validade options, req.body
  var opt = processOptions(options);
  // fill sub doc images
  async.forEach(req.body, function (item, cbInterator) {
    var image = doc.images.id(item._id);
    if (image !== null) {
      image.set({
        "index": item.index || images.index,
        "description": item.description || images.description
      });
    } else {
      // TODO: se não existir alguma não persistir nada e retornar 404 com o corpo informando IDs inexistentes
    }
    cbInterator(); // tell async that the iterator has completed
  },
  function(err) {
    if (err) return cb(err);
    // persist in the model
    doc.save(function (err, result) {
      if(err) next(err);
      return res.status(200).json(result.images);
    });
  });
};

/**
 * Remove imagens recebidas por DELETE.
 *
 * @param {object} req Request object.
 * @param {object} res Response object.
 * @param {object} next Function to call next matching route.
 * @param {object} doc Document containing the images field.
 * @param {string} idImage Id of image field to remove.
 * @param {object} options Especific options.
 */
module.exports.delete = function(req, res, next, doc, idImage, options) {
  // TODO: validade options, req.body
  var opt = processOptions(options);
  // find subdocument
  var image = doc.images.id(idImage);
  if (image === null) return res.status(404).json({
    message: "Imagem não existe"
  });
  // remove subdocument
  image.remove();
  fs.unlink('./public' + image.url, function(err) {
    if (err) return next(err);
    // persist parent
    doc.save(function (err, result) {
      if(err) next(err);
      return res.status(200).json({
        message: 'Imagem removida com sucesso'
      });
    });
  });
};

/**
 * Remove todas as imagens de um documento.
 *
 * @param {object} req Request object.
 * @param {object} res Response object.
 * @param {object} next Function to call next matching route.
 * @param {string} docId Document id to remove images.
 * @param {object} options Especific options.
 */
module.exports.deleteAll = function(req, res, next, docId, options) {
  // TODO: validade options, req.body
  var opt = processOptions(options);
  // find subdocument
  var path = opt.dir + docId;
  deleteFolderRecursiveSync(path);
};
