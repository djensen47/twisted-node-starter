
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
  app.set('port', process.env.PORT || 3003);
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

// mongoose configuration
mongo = {
  "hostname": "localhost",
  "port": 27017,
  "username": "",
  "password": "",
  "name": "",
  "db": "dbname"
}
//get configuration for AppFog (or other Cloud Foundry)
if (process.env.VCAP_SERVICES) {
    env = JSON.parse(process.env.VCAP_SERVICES);
    mongo = env['mongodb-1.8'][0]['credentials'];
}

var generateMognoUrl = function(obj) {
  obj.hostname = (obj.hostname || 'localhost')
  obj.port = (obj.port || 27017)
  obj.db = (obj.db || 'test')
  if (obj.username && obj.password) {
    return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
  } else {
    return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;  
  }
};

var mongourl = generateMognoUrl(mongo);
console.log("Connecting to mongodb at #{mongo.hostname}:#{mongo.port}");
mongoose.connect(mongourl);

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
