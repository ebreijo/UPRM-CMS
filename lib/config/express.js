'use strict';

var express = require('express'),
    path = require('path'),
    config = require('./config');
var compression = require('compression');
var errorhandler = require('errorhandler');
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var favicon = require('serve-favicon');
var db = require('../models').sequelize;

// initalize sequelize with session store
var SequelizeStore = require('connect-session-sequelize')(session.Store);

/**
 * Express configuration
 */
module.exports = function(app, passport) {

  var devConfig = function() {
    app.use(require('connect-livereload')());

    // Disable caching of scripts for easier testing
    app.use(function noCache(req, res, next) {
      if (req.url.indexOf('/scripts/') === 0) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('uprm-cms', 'no-cache');
        res.header('Expires', 0);
      }
      next();
    });

    app.use(compression({
      level: 9
    }));
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'app')));
    app.use(errorhandler());
    app.set('views', config.root + '/app/views');
  };

  if (app.get('env') === 'development') {
    devConfig();
  }
  if (app.get('env') === 'test') {
    devConfig();
  }

  if (app.get('env') === 'production') {
    app.use(compression({
      level: 9
    }));
    app.use(favicon(path.join(config.root, 'app', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'app')));
    app.set('views', config.root + '/app/views');
  }


  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(methodOverride());
  app.use(cookieParser());

  // save sessions in database
  app.use(session({
    secret: 'UPRM CMS secret',
    store: new SequelizeStore({db: db}),
    resave: false,
    saveUninitialized: true
  }));

  //use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  /* jshint unused: false */
  app.use(function(err, req, res, next) {
    res.status(err.status).json(err);
  });
};
