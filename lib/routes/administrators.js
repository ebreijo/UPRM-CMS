'use strict';

var admins = require('../controllers/administrators');

module.exports = function(router) {

  //router.post('/api/admins/login', admins.login);
  router.post('/api/admins/register', admins.register);
  //router.post('/api/admins/forgot', admins.forgot);
  //router.post('/api/admins/reset', admins.reset);
  router.param('adminId', admins.getAdminId);
  router.get('/api/admins/:adminId', admins.getAdmin);
  router.put('/api/admins/:adminId', admins.updateAdmin);


  router.post('/api/adminsAccess', admins.giveAdminAccess);
  router.get('/api/adminsAccess', admins.getAllAdminsAccess);
  router.param('adminAccessId', admins.getAdminAccessId);
  router.get('/api/adminsAccess/:adminAccessId', admins.getAdminAccess);
  router.put('/api/adminsAccess/:adminAccessId', admins.updateAdminAccess);
};
