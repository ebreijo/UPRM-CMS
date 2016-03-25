'use strict';

var index = require('./controllers/index');
var errors = require('errors');
var middleware = require('./middleware');

module.exports = function(app) {
  // All other routes to use Angular routing in app/scripts/app.js
  app.all('/api/*', function(req, res) {
    res.status(404).json(new errors.Http404Error());
  });

  app.get('/partials/*', index.partials);
  app.get('/*', middleware.setUserCookie, index.index);
};
