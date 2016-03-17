'use strict';

var students = require('../controllers/students');

module.exports = function(router) {

  // Job Offers

  // Get all active job offers
  router.get('/api/students/jobOffers', students.getAllActiveJobOffers);
  router.param('studentJobOfferId', students.getJobId);
  // Get a single job offer information
  router.get('/api/students/jobOffers/:studentJobOfferId', students.getJobOffer);


  // Get additional information from companies that will attend the job fair.
  router.get('/api/students/jobFair', students.getJobFairInformation);


  // Get all active companies for students to see
  router.get('/api/students/companies', students.getAllActiveCompanies);
  router.param('studCompanyId', students.getCompanyId);
  // Get specific company for students to see
  router.get('/api/students/companies/:studCompanyId', students.getCompany);

  // Jpb Offers per company

  // Get All Job Offers from a given company for students to see
  router.get('/api/students/companies/:studCompanyId/jobOffers', students.getActiveCompanyJobOffers);
  // Get JobOfferID Parameter.
  router.param('companyJobOfferId', students.getJobOfferId);
  // Get Job Offer by Job Offer ID for students to see
  router.get('/api/students/companies/:studCompanyId/jobOffers/:companyJobOfferId', students.getCompanyJobOffer);

  // Promotional Material Routes.

  // Get All Promotional Material from a Company.
  router.get('/api/students/companies/:studCompanyId/promotionalMaterial', students.getActiveCompanyPromotionalMaterials);
  // Get PromID Parameter.
  router.param('studPromotionalId', students.getPromId);
  // Get Promotional Material given Promotional ID
  router.get('/api/students/companies/:studCompanyId/promotionalMaterial/:studPromotionalId', students.getCompanyPromotionalMaterial);


  // Company Interested Majors
  router.get('/api/students/companies/:studCompanyId/interestedMajors', students.getCompanyInterestedMajors);

};
