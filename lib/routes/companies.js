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

};
