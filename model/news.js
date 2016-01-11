var mongoose = require('mongoose');
var slug = require('mongoose-slug-generator');
var mongoosePaginate = require('mongoose-paginate');

// Slug plugin
mongoose.plugin(slug);

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
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    //required: true
  },
  updatedAt: {
    type: Date,
    //required: true
  },
  images: {
    type: Array
  }
});

// Pagination plugin
NewsSchema.plugin(mongoosePaginate);

// Generate the slug on save
NewsSchema.pre('save', function (next) {
  if (this.isNew) {
    this.createdAt = Date.now();
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('news', NewsSchema);
