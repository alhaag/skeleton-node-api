var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// Definição do modelo
var UserSchema = new mongoose.Schema({
  active: {
    type: Boolean,
    default: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  loggedIn: {
    type: Boolean,
    default: false
  }
});

// Tratamento antes do save
UserSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

//3
UserSchema.methods.passwordChecks = function(password, next) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return next(err);
    next(isMatch);
  });
};

module.exports = mongoose.model('users', UserSchema);
