var _ = require('underscore');
var User = require('../models/user');

module.exports = function(app) {
  // app.all('/user/*', requireAuthentication, loadUser);

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
    user.save(function(err){
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
      } else {
        req.flash('info', "Thank you for registering!");
        res.redirect('/');
      }
    });

  });
}