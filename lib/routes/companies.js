'use strict';

var companies = require('../controllers/companies');

module.exports = function(router) {

  // Register route for companies/recruiters
  router.post('/api/companies/register', companies.register);

  /**
   * Companies routes
   */
  router.get('/api/companies', companies.getAllCompanies);
  router.param('compId', companies.getCompanyId);
  router.get('/api/companies/:compId', companies.getCompany);
  router.put('/api/companies/:compId', companies.updateCompany);

  /**
   * Recruiters per company routes
   */
  // Get all the active recruiters for a given company
  router.get('/api/companies/:compId/recruiters', companies.getAllActiveRecruitersFromCompany);
  // Get a recruiter from a company using POST, don't need to pass email as parameter to the endpoint
  router.post('/api/companies/:compId/recruiters', companies.getActiveRecruiterFromCompany);
  // Update a recruiter from a company, don't need to pass email as parameter to the endpoint
  router.put('/api/companies/:compId/recruiters', companies.removeOtherRecruiter);

  /**
   * Company locations for a given company routes
   */
  // Get all the locations for a given company
  router.get('/api/companies/:compId/companyLocations', companies.getAllCompanyLocations); // Get company locations for a given company
  router.param('locationId', companies.getLocationId);
  // Get a single location for a given company
  router.get('/api/companies/:compId/companyLocations/:locationId', companies.getCompanyLocation);
  // Update the company location
  router.put('/api/companies/:compId/companyLocations/:locationId', companies.updateCompanyLocation);

  /**
   * Company Job Offer Routes.
   */
  // Get All Job Offers from a given company
  router.get('/api/companies/:compId/jobOffers', companies.getCompanyJobOffers);
  // Add a Job Offer for a company
  router.post('/api/companies/:compId/jobOffers', companies.addJobOffer);
  // Get JobID Parameter.
  router.param('jobId', companies.getJobOfferId);
  // Get Job Offer by Job Offer ID.
  router.get('/api/companies/:compId/jobOffers/:jobId', companies.getCompanyJobOffer);
  // Remove/disable a job offer for a given job offer id
  router.put('/api/companies/:compId/jobOffers/:jobId', companies.disableCompanyJobOffer);

  /**
   * Company Promotional Material Routes.
   */
  // Get All Promotional Material from a Company.
  router.get('/api/companies/:compId/promotionalMaterial', companies.getCompanyPromotionalMaterial);
  // Add a Promotional Material to a Specific Company.
  router.post('/api/companies/:compId/promotionalMaterial', companies.addCompanyPromotionalMaterial);
  // Get PromID Parameter.
  router.param('promId', companies.getPromId);
  // Edit a Promotional Material of a Specific Company.
  router.put('/api/companies/:compId/promotionalMaterial/:promId', companies.editCompanyPromotionalMaterial);
  // Delete a Promotional Material of a Specific Company.
  router.delete('/api/companies/:compId/promotionalMaterial/:promId', companies.deleteCompanyPromotionalMaterial);

  /**
   * Company Interested Majors
   */
  // Get all the interested majors for a company
  router.get('/api/companies/:compId/companyInterestedMajors', companies.getAllCompanyInterestedMajors);
  // Add a new interested major to a company
  router.post('/api/companies/:compId/companyInterestedMajors', companies.addNewCompanyInterestedMajor);
  // Remove an interested major from a company
  router.put('/api/companies/:compId/companyInterestedMajors', companies.removeCompanyInterestedMajor);

  /**
   * Company looking for positions
   */
  // Get all looking for positions per company
  router.get('/api/companies/:compId/companyLookingFor', companies.companyLookingFor);
  // Add or remove a looking for position from a company
  router.post('/api/companies/:compId/companyLookingFor', companies.addRemoveCompanyLookingFor);


  /**
   * On-Campus Services
   */
  router.post('/api/onCampusServices', companies.requestOnCampusServices);


  /**
   * Authenticated recruiter information
   */
    // Get my own recruiter information
  router.param('recruiterMe', companies.getMeParamRecruiter);
  router.get('/api/recruiters/:recruiterMe', companies.getMeRecruiter);
  router.post('/api/recruiters/:recruiterMe', companies.changeMeRecruiter);

  /**
   * Company Logos Uploads
   */
  router.post('/api/companies/logos', companies.uploadLogo);
  // TODO:
  // put

  /**
   * Job Offers Uploads
   */
  router.post('/api/companies/jobOffers', companies.uploadJobOffer);
  // TODO:
  // put

  /**
   * Promotional Material Uploads
   */
  router.post('/api/companies/promotionalMaterial/upload', companies.uploadPromotionalMaterial);

};
