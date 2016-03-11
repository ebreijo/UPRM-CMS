'use strict';

var admins = require('../controllers/administrators');

module.exports = function(router) {

  // Admin routes
  //router.post('/api/admins/login', admins.login);
  router.post('/api/admins/register', admins.register);
  //router.post('/api/admins/forgot', admins.forgot);
  //router.post('/api/admins/reset', admins.reset);
  router.post('/api/admins', admins.getAdmin); // Get an admin by using POST, no need to pass email as parameter to the endpoint
  router.put('/api/admins', admins.updateAdmin); // Update an admin by passing email through the json, no need to pass email as parameter to the endpoint

  // Admin Access routes
  router.post('/api/adminsAccess', admins.giveAdminAccess);
  router.get('/api/adminsAccess', admins.getAllAdminsAccess);
  router.post('/api/adminsAccessGet', admins.getAdminAccess); // Get an access for an admin using POST, no need to pass email as parameter to the endpoint
  router.put('/api/adminsAccess', admins.updateAdminAccess);

  // Job Fair dates routes
  router.get('/api/jobFairDates', admins.getJobFairDates);
  router.put('/api/jobFairDates', admins.changeJobFairDates);
};
