var _ = require('underscore');
var passport = require('passport');
var forms = require('forms'),
    fields = forms.fields,
    validators = forms.validaotors;
var User = require('../models/user');

module.exports = function(app) {

  var registration_form = forms.create({
    password: fields.string({required: true}),
    username: fields.string({required: true}),
    email:    fields.email({required: true})
  });

  app.all(/^\/user\/(list).*$/, function(req, res, next) {
    if (!req.isAuthenticated()) {
      req.flash('info', "Login required to proceed.");
      req.session.redirectAfterLogin = req.path;
      res.redirect('/login');
    }
    next();
  });

  app.get('/user/list', function(req, res){
    User.find({}).limit(10).exec(function(err, users){
      if (err)
        res.send(500, { error: 'Database Error' });
      res.render('user/list', { userList: users });
    });
  });

  app.get('/register', function(req, res){
    // TODO: check if the user is already logged in, redirect ro homepage
    res.render('user/register', {form: {username:"", email:"", password:""}});
  });

  app.post('/register', function(req, res) {
    var user = new User(req.body);
    //manually check password (this is a pain)
    if (_.isEmpty(req.body.password)) {
      if (!err) {
        err = {
          message: "Validation failed",
          name: "ValidationError",
          errors: {}
        }
      }
      err.errors.password = {message: "Password must not be blank."};
    }
    if (err) {
      console.log(err);
      if (err.name != "ValidationError" && err.name != "MongooseError")  {
        res.send(500, {error: err.message});
      }
      console.log("/register validation error");
      req.flash('error', err.message);
      res.render('user/register', {
        form: req.body,
        errors: err.errors, 
        flash: req.flash()
      });
    } else user.save(function(err){
      req.flash('info', "Thank you for registering!");
      req.login(user);
      res.redirect('/');
    });
  });

  app.get('/login', function(req, res){
    res.render('user/login', { flash: req.flash() });
  });

  app.post(
    '/login',
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    function(req, res){
      req.flash("Welcome @" + req.user.username + ".");
      res.redirect( req.session.redirectAfterLogin || '/');
    });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });  

}
