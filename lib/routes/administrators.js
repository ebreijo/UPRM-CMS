'use strict';

var admins = require('../controllers/administrators');

module.exports = function(router) {

  // Admin routes
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
  router.get('/api/admins/jobFairDates', admins.getJobFairDates);
  router.put('/api/admins/jobFairDates', admins.changeJobFairDates);

  /**
   * Administrator Job Offers Routes.
   */
  // Get All Job Offers
  router.get('/api/admins/jobOffers', admins.getJobOffers);
  // Edit a specific Job Offer.
  router.param('jobOfferId', admins.getJobOfferId);
  // Edit a specific Promotional Material.
  router.put('/api/admins/jobOffers/:jobOfferId', admins.editAdminJobOffer);

  /**
   * Administrator Promotional Material Routes.
   */
  // Get All Pending Promotional Material from a Company.
  router.get('/api/admins/promotionalMaterial', admins.getAdminPromotionalMaterial);
  // Get PromID Parameter.
  router.param('promId', admins.getPromId);
  // Edit a specific Promotional Material.
  router.put('/api/admins/promotionalMaterial/:promId', admins.editAdminPromotionalMaterial);
  // Delete a specific Promotional Material.
  router.delete('/api/admins/promotionalMaterial/:promId', admins.deleteAdminPromotionalMaterial);

  // Get my own admin information
  router.param('adminMe', admins.getMeParam);
  router.get('/api/admins/:adminMe', admins.getMe);
};
