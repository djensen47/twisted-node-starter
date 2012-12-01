
/*
 * GET home page.
 */

module.exports = function(app) {


  app.get('/', function(req, res) {
    // req.flash('info', 'Flash this!');
    // req.flash('info', 'Flash this!');
    // req.flash('error', 'Flash this!');
    res.render('index', { title: 'Twisted Node Starter', flash: req.flash() });
  });

};