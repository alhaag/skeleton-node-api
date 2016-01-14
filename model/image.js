/**
 * Model image
 *
 * Modelo que representa o subdocumento image.
 *
 * @author André Luiz Haag <andreluizhaag@gmail.com>
 * @license LICENSE.md
 * @see middlewares/images
 */

/**
 * dependencies
 */
var mongoose = require('mongoose');

/**
 * Definição do modelo
 */
module.exports = new mongoose.Schema({
  index: {
    type: Number,
    "default": 1
  },
  url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  }
});
