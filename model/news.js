/**
 * Model news
 *
 * Modelo que representa o documento news.
 * Agrega validações e comportamentos de persistencia no BD.
 *
 * @author André Luiz Haag <andreluizhaag@gmail.com>
 * @license LICENSE.md
 * @see middlewares/images
 */

 /**
  * dependencies
  */
var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var slug = require('mongoose-slug-generator');
var mongoosePaginate = require('mongoose-paginate');
var ImageModel = require('./image');

/**
 * setup plugins
 */
mongoose.plugin(slug);
mongoose.plugin(mongoosePaginate);

/**
 * Definição do modelo
 */
var NewsSchema = new mongoose.Schema({
  slug: {
    type: String,
    slug: ["title"],
    unique: true
  },
  title: {
    type: String,
    required: true,
    validade: [
      validate({
        validator: 'isLength',
        arguments: [1, 255],
        message: 'Título deve possuir de {ARGS[0]} a {ARGS[1]} characteres'
      })
    ]
  },
  shortDescription: {
    type: String,
    required: true,
    validade: [
      validate({
        validator: 'isLength',
        arguments: [1, 255],
        message: 'Breve descrição deve possuir de {ARGS[0]} a {ARGS[1]} characteres'
      })
    ]
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    "default": Date.now
  },
  updatedAt: {
    type: Date,
    //required: true
  },
  keyWords: {
    type: String,
    required: false,
    validade: [
      validate({
        validator: 'isLength',
        arguments: [0, 255],
        message: 'Palavras chave deve possuir de {ARGS[0]} a {ARGS[1]} characteres'
      })
    ]
  },
  images: {
    type: [ImageModel],
    required: false
  }
});

// Generate the slug on save
NewsSchema.pre('save', function (next) {
  /*if (this.isNew) {
    this.createdAt = Date.now();
  }*/
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('news', NewsSchema);
