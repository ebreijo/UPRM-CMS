'use strict';

var admin = require('../controllers/administrator');

module.exports = function(router) {

  //router.post('/api/admins/login', admin.login);
  router.post('/api/admins/register', admin.register);
  //router.post('/api/admins/forgot', admin.forgot);
  //router.post('/api/admins/reset', admin.reset);
  router.post('/api/adminsAccess', admin.giveAccess);
  router.get('/api/adminsAccess', admin.getAllAdmins);
  router.param('adminId', admin.getParam);
  router.get('/api/adminsAccess/:adminId', admin.getAdmin);
  router.put('/api/adminsAccess/:adminId', admin.updateAdmin);
};
