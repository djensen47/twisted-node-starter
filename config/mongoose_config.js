var mongoose = require('mongoose');

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

var mongourl = generateMognoUrl(mongo);
console.log("Connecting to mongodb at #{mongo.hostname}:#{mongo.port}");
mongoose.connect(mongourl);