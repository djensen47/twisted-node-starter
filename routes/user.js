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
}