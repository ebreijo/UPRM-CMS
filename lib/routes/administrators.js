'use strict';

var admins = require('../controllers/administrators');

module.exports = function(router) {

  // Admin routes
  router.post('/api/admins/register', admins.register);
  //router.post('/api/admins/forgot', admins.forgot);
  //router.post('/api/admins/reset', admins.reset);

  // Admin Access routes
  router.post('/api/adminsAccess', admins.giveAdminAccess);
  router.get('/api/adminsAccess', admins.getAllAdminsAccess);
  router.post('/api/adminsAccessGet', admins.getAdminAccess); // Get an access for an admin using POST, no need to pass email as parameter to the endpoint
  router.put('/api/adminsAccess', admins.updateAdminAccess);

  // Job Fair dates routes
  router.get('/api/admins/jobFairDates', admins.getJobFairDates);
  router.put('/api/admins/jobFairDates', admins.changeJobFairDates);

  /**
   * Manage additional job fair information from companies
   */
  // Get job fair information for each company
  router.get('/api/admins/jobFairInformation', admins.getJobFairInfo);
  // Get job for information for a given company
  router.get('/api/admins/jobFairInformation/:companyId', admins.getJobFairInfoPerCompany);
  // Add or update job fair information for a given company
  router.post('/api/admins/jobFairInformation/:companyId', admins.addOrUpdateJobFairInfoPerCompany);


  /**
   * Manage companies by admins
   */
  // TODO: Create tests for this routes
  // Get all the companies, that is, active, inactive, or pending
  router.get('/api/admins/companies', admins.getAllCompanies);
  // Get company ID, in this case, the name
  router.param('companyId', admins.getCompanyId);
  router.get('/api/admins/companies/:companyId', admins.getCompany);
  // Update company basic information
  router.put('/api/admins/companies/:companyId', admins.updateCompany);
  // Create a new company with basic information
  router.post('/api/admins/companies', admins.createCompany);

  /**
   * Manage temporary contact for companies
   */
  // TODO: Create tests for this routes
  // Get a temporary contact per company
  router.get('/api/admins/companies/:companyId/tempContact', admins.getCompTemporaryContact);
  // Create or update a temporary contact per company
  router.post('/api/admins/companies/:companyId/tempContact', admins.addOrUpdateCompTemporaryContact);


  /**
   * Manage recruiters by admins
   */
  // TODO: Create tests for this routes
  router.get('/api/admins/pendingRecruiters', admins.getAllPendingRecruiters);
  // Get a recruiter using POST, don't need to pass email as parameter to the endpoint
  router.post('/api/admins/pendingRecruiters', admins.getPendingRecruiter);
  // Accept (activate) or reject (deactivate) a recruiter registration, don't need to pass email as parameter to the endpoint
  router.put('/api/admins/pendingRecruiters', admins.acceptOrRejectRecruiter);


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
  router.param('promotionalId', admins.getPromId);
  // Edit a specific Promotional Material.
  router.put('/api/admins/promotionalMaterial/:promotionalId', admins.editAdminPromotionalMaterial);
  // Delete a specific Promotional Material.
  router.delete('/api/admins/promotionalMaterial/:promotionalId', admins.deleteAdminPromotionalMaterial);

  /**
   * Authenticated administrator information
   */
  // Get my own admin information
  router.param('adminMe', admins.getMeParamAdmin);
  router.get('/api/administrators/:adminMe', admins.getMeAdmin);
  router.post('/api/administrators/:adminMe', admins.changeMeAdmin);

};
