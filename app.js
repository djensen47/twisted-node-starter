
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , mongoose = require('mongoose');

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
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  //app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(require('node-sass').middleware({src: __dirname + '/public', dest: __dirname + '/public', debug: true}));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./config/mongoose_config')
require('./config/passport_config')

// load the controllers
var routeDir = 'routes',
    files     = fs.readdirSync(routeDir);

files.forEach(function(file) {
  var filePath = path.resolve('./', routeDir, file);
  console.log(filePath);
  require(filePath)(app); 
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
