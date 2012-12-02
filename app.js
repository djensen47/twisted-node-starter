
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , mongoose = require('mongoose')
  , passport = require('passport')
  , flash    = require('connect-flash')
  , sys      = require('sys');

var app = express();

// express configuration
app.configure(function(){
  app.set('port', process.env.PORT || process.env.VMC_APP_PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('12873649yruiwofyruyrqweruyqior2341'));
  app.use(express.session());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());


  app.use(function(req, res, next){
    //initialize values that are expected by the layouts but may or may not have been passed through.
    // -- stupid undefined varaibles
    res.locals.errors = null;
    res.locals.flash = null;
    next();
  });
  
  // underscore middleware
  app.use(function(req, res, next){
      res.locals._ = require('underscore');
      next();
  });

  app.use(app.router);

  app.use(require('stylus').middleware(__dirname + '/public'));
  //app.use(require('node-sass').middleware({src: __dirname + '/public', dest: __dirname + '/public', debug: true}));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, 'vendor')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./config/mongoose_config')
require('./config/passport_config')

// load the controllers
var routeDir = 'routes',
    files     = fs.readdirSync(routeDir);

console.log("Loading routes:");
files.forEach(function(file) {
  var filePath = path.resolve('./', routeDir, file);
  console.log("  "+filePath);
  require(filePath)(app); 
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
