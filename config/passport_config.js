var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

// Use the LocalStrategy within Passport.

passport.use(new LocalStrategy({
    usernameField: 'username'
  },
  function (username, password, done) {
    // Find the user by username.  If there is no user with the given
    // username, or the password is not correct, set the user to `false` to
    // indicate failure.  Otherwise, return the authenticated `user`.
    User.authenticate(username, password, function(err, user) {
      return done(err, user);
    });
  }
));

// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});