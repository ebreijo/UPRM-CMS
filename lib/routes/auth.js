'use strict';

var auth = require('../controllers/auth.js');

module.exports = function (router) {
  router.post('/api/login/admin', auth.loginAdmin);
  router.post('/api/login', auth.loginRecruiter);
  router.post('/api/logout', auth.logout);

  // Forgot and reset password routes
  router.post('/api/forgot', auth.forgot);
  router.post('/api/reset/:token', auth.reset);
};
