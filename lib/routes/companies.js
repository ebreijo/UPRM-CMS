'use strict';

var companies = require('../controllers/companies');

module.exports = function(router) {

  // Companies routes
  router.post('/api/companies/register', companies.register);
  router.get('/api/companies', companies.getAllCompanies);
  router.param('compId', companies.getCompanyId);
  router.get('/api/companies/:compId', companies.getCompany);
  router.put('/api/companies/:compId', companies.updateCompany);

  // Recruiters within Companies routes
  router.get('/api/companies/:compId/recruiters', companies.getAllActiveRecruitersFromCompany);
  // Get a recruiter from a company using POST, don't need to pass email as parameter to the endpoint
  router.post('/api/companies/:compId/recruiters', companies.getActiveRecruiterFromCompany);
  // Update a recruiter from a company, don't need to pass email as parameter to the endpoint
  router.put('/api/companies/:compId/recruiters', companies.updateRecruiter);

  // Company locations routes
  router.get('/api/companies/:compId/companyLocations', companies.getAllCompanyLocations); // Get company locations for a given company
  router.param('locationId', companies.getLocationId);
  router.get('/api/companies/:compId/companyLocations/:locationId', companies.getCompanyLocation);
  router.put('/api/companies/:compId/companyLocations/:locationId', companies.updateCompanyLocation);

  // Get All Job Offers
  router.get('/api/jobOffers', companies.getAllJobOffers);
  //Add a Job Offer
  router.post('/api/jobOffers', companies.addJobOffer);
  // Get JobID Parameter.
  router.param('jobId', companies.getJobOfferId);
  // Get Job Offer by Job Offer ID.
  router.get('/api/jobOffers/:jobId', companies.getJobOffer);
  // Modify Job Offer Status
  router.put('/api/jobOffers/:jobId', companies.editJobOffer);
  // Get All Job Offers from a Specific Company
  router.get('/api/companies/:compId/jobOffers', companies.getAllJobOffersByCompany);
};
