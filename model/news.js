var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// Definição do modelo
var NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('news', NewsSchema);
