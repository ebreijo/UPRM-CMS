'use strict';

var students = require('../controllers/students');

module.exports = function(router) {

  // Get all active job offers
  router.get('/api/students/jobOffers', students.getAllActiveJobOffers);
  router.param('jobOfferId', students.getJobId);
  // Get a single job offer information
  router.get('/api/students/jobOffers/:jobOfferId', students.getJobOffer);

  // Get additional information from companies that will attend the job fair.
  router.get('/api/students/jobFair', students.getJobFairInformation);

  // Get all active companies for students to see
  router.get('/api/students/companies', students.getAllActiveCompanies);
  router.param('companyId', students.getCompanyId);
  // Get specific company for students to see
  router.get('/api/students/companies/:companyId', students.getCompany);

  // TODO: Define and implement routes for job offers per company and promotional material per company

};
