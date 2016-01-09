var mongoose = require('mongoose');

/**
 * Definição do modelo
 {
    "title": "Título da notícia",
    "description": "Descrição da notícia"
    "slug": "titulo-da-noticia"
    "images": [
      {
        "index": 1,
        "url": "/news/56772f52a7f4de1bc965acf3/img.jpg",
        "type": ""
      }
    ]
 }
 */
var NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: {
    type: Array
  }
});

module.exports = mongoose.model('news', NewsSchema);
