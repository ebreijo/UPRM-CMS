'use strict';

var admins = require('../controllers/administrators');
var authenticateAdmin = require('../middleware').authAdmin;

module.exports = function(router) {

  // Register as an admin route
  router.post('/api/admins/register', admins.register);

  /**
   * Manange access of other admins
   */
  // Give access to other admin
  router.post('/api/adminsAccess', authenticateAdmin, admins.giveAdminAccess);
  // Get all the admins with access, pending to register and inactive
  router.get('/api/adminsAccess', authenticateAdmin, admins.getAllAdminsAccess);
  // Get an access for an admin using POST, no need to pass email as parameter to the endpoint
  router.post('/api/adminsAccessGet', authenticateAdmin, admins.getAdminAccess);
  // Update the access of an admin
  router.put('/api/adminsAccess', authenticateAdmin, admins.updateAdminAccess);

  // Job Fair dates routes
  router.get('/api/admins/jobFairDates', authenticateAdmin, admins.getJobFairDates);
  router.put('/api/admins/jobFairDates', authenticateAdmin, admins.changeJobFairDates);

  /**
   * Manage additional job fair information from companies
   */
  // Get job fair information for each company
  router.get('/api/admins/jobFairInformation', authenticateAdmin, admins.getJobFairInfo);
  // Get job for information for a given company
  router.get('/api/admins/jobFairInformation/:companyId', authenticateAdmin, admins.getJobFairInfoPerCompany);
  // Add or update job fair information for a given company
  router.post('/api/admins/jobFairInformation/:companyId', authenticateAdmin, admins.addOrUpdateJobFairInfoPerCompany);
  // Get all the companies for the job fair information
  router.get('/api/admins/companiesJobFair', authenticateAdmin, admins.getAllCompaniesJobFair);


  /**
   * Manage companies by admins
   */
  // Get all the companies, that is, active, inactive, or pending
  router.get('/api/admins/companies', authenticateAdmin, admins.getAllCompanies);
  // Get company ID, in this case, the name
  router.param('companyId', admins.getCompanyId);
  router.get('/api/admins/companies/:companyId', authenticateAdmin, admins.getCompany);
  // Update company basic information
  router.put('/api/admins/companies/:companyId', authenticateAdmin, admins.updateCompany);
  // Create a new company with basic information
  router.post('/api/admins/companies', authenticateAdmin, admins.createCompany);

  /**
   * Company Promotional Material Routes for admins.
   */
  router.get('/api/admins/companies/:companyId/promotionalMaterial', authenticateAdmin, admins.getCompanyPromotionalMaterialForAdmins);
  // Get PromID Parameter.
  router.param('adminPromId', admins.getAdminPromId);
  // Edit a Promotional Material of a Specific Company.
  router.put('/api/admins/companies/:companyId/promotionalMaterial/:adminPromId', authenticateAdmin, admins.editCompanyPromotionalMaterialForAdmins);
  // Delete a Promotional Material of a Specific Company.
  router.delete('/api/admins/companies/:companyId/promotionalMaterial/:adminPromId', authenticateAdmin, admins.deleteCompanyPromotionalMaterialForAdmins);

  /**
   * Company Job Offer Routes for admins.
   */
    // Get All Job Offers from a given company
  router.get('/api/admins/companies/:companyId/jobOffers', authenticateAdmin, admins.getAllCompanyJobOffersForAdmins);
  // Get JobID Parameter.
  router.param('adminJobId', admins.getAdminJobOfferId);
  // Get Job Offer by Job Offer ID.
  router.get('/api/admins/companies/:companyId/jobOffers/:adminJobId', authenticateAdmin, admins.getCompanyJobOfferForAdmins);
  // Remove/disable a job offer for a given job offer id
  router.put('/api/admins/companies/:companyId/jobOffers/:adminJobId', authenticateAdmin, admins.editCompanyJobOfferForAdmins);


  /**
   * Manage temporary contact for companies
   */
  // Get a temporary contact per company
  router.get('/api/admins/companies/:companyId/tempContact', authenticateAdmin, admins.getCompTemporaryContact);
  // Create or update a temporary contact per company
  router.post('/api/admins/companies/:companyId/tempContact', authenticateAdmin, admins.addOrUpdateCompTemporaryContact);


  /**
   * Manage recruiters by admins
   */
  // Get all pending recruiters that has registered but have not been approved or rejected
  router.get('/api/admins/pendingRecruiters', authenticateAdmin, admins.getAllPendingRecruiters);
  // Get a recruiter using POST, don't need to pass email as parameter to the endpoint
  router.post('/api/admins/pendingRecruiters', authenticateAdmin, admins.getPendingRecruiter);

  // Accept (activate) or reject (inactivate) a recruiter, don't need to pass email as parameter to the endpoint
  router.put('/api/admins/recruiters', authenticateAdmin, admins.activateOrInactivateRecruiter);

  /**
   * Manage recruiters per companies by admins
   */
  // Get all active and inactive recruiters for a given company
  router.get('/api/admins/companies/:companyId/recruiters', authenticateAdmin, admins.getAllActiveInactiveRecruiters);
  // Get a recruiter using POST, don't need to pass email as parameter to the endpoint
  router.post('/api/admins/companies/:companyId/recruiters', authenticateAdmin, admins.getActiveInactiveRecruiter);
  // Update recruiter status given the company name
  router.put('/api/admins/companies/:companyId/recruiters', authenticateAdmin, admins.updateRecruiterStatus);


  /**
   * Administrator Job Offers Routes.
   */
    // Get All Job Offers
  router.get('/api/admins/jobOffers', authenticateAdmin, admins.getJobOffers);
  // Edit a specific Job Offer.
  router.param('jobOfferId', admins.getJobOfferId);
  // Edit a specific Job Offer
  router.put('/api/admins/jobOffers/:jobOfferId', authenticateAdmin, admins.editAdminJobOffer);

  /**
   * Administrator Promotional Material Routes.
   */
  // Get All Pending Promotional Material from a Company.
  router.get('/api/admins/promotionalMaterial', authenticateAdmin, admins.getAdminPromotionalMaterial);
  // Get PromID Parameter.
  router.param('promotionalId', admins.getPromId);
  // Edit a specific Promotional Material.
  router.put('/api/admins/promotionalMaterial/:promotionalId', authenticateAdmin, admins.editAdminPromotionalMaterial);
  // Delete a specific Promotional Material.
  router.delete('/api/admins/promotionalMaterial/:promotionalId', authenticateAdmin, admins.deleteAdminPromotionalMaterial);

  /**
   * Authenticated administrator information
   */
  // Get my own admin information
  router.param('adminMe', admins.getMeParamAdmin);
  router.get('/api/administrators/:adminMe', admins.getMeAdmin);
  router.post('/api/administrators/:adminMe', admins.changeMeAdmin);

};
