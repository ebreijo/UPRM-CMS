'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express'),
  path = require('path'),
  fs = require('fs');

var https = require('https');

/**
 * Main application file
 */

// Application Config
var config = require('./lib/config/config');

// Load custom errors
require('./lib/config/errors');

// Passport Configuration
var passport = require('./lib/config/passport');

// Express app
var app = express();

// Bootstrap models
var db = require('./lib/models');

// Express settings
require('./lib/config/express')(app, passport);

// Bootstrap routes
var router = express.Router();
var routesPath = path.join(__dirname, 'lib/routes');
fs.readdirSync(routesPath).forEach(function (file) {
  if (/(.*)\.(js$)/.test(file)) {
    require(routesPath + '/' + file)(router);
  }
});



// html5mode on in angular. Needs to be after bootstrapping the routes.
require('./lib/angular')(router);

app.use(router);

// Error handler
app.use(function(err, req, res, next) {
  res.status(err.status).json(err);
});

var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('key-cert.pem')
};

db.sequelize.authenticate().then(function() {

  // Start server
  https.createServer(options, app).listen(config.port, function () {
    console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
  });
}, function(err) {
  console.log('Error authenticating the database', err);
  throw(err);
});

// Expose app
exports = module.exports = app;
