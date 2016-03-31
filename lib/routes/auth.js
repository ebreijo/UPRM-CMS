'use strict';

var auth = require('../controllers/auth.js');

module.exports = function (router) {
  // Login and logout routes
  router.post('/api/login', auth.login);
  router.post('/api/logout', auth.logout);

  // Forgot and reset password routes
  router.post('/api/forgot', auth.forgot);
  router.post('/api/reset/:token', auth.reset);
};
