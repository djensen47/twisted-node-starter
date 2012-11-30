// User model

var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = new Schema({ 
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  hash:  { type: String, required: true },
  salt:  { type: String, required: true }
});

UserSchema.virtual('password').get(function() {
  this._password;
}).set(function(password) {
  this._password = password;
  salt = this.salt = bcrypt.genSaltSync(10);
  this.hash = bcrypt.hashSync(password, salt);
});
 
UserSchema.methods.check_password = function(password, callback) {
  bcrypt.compare(password, this.hash, callback);
};

UserSchema.statics.authenticate = function(username, password, callback) {
  this.findOne( {username: username}, function(err, user) {
    if (err)
      return callback(err);
    if (!user)
      return callback(null, false);

    user.checkPassword(password, function(err, passwordCorrect) {
      if (err)
        return callback(err);

      if (!passwordCorrect)
        return callback(null, false);

      return callback(null, user);
    });
  });
};

module.exports = mongoose.model('User', UserSchema);