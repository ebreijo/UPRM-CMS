'use strict';

var students = require('../controllers/students');
var authenticateStudentOrAdmin = require('../middleware').authStudentOrAdmin;
var authenticateRecruiterOrStudentOrAdmin = require('../middleware').authRecruiterOrStudentOrAdmin;

module.exports = function(router) {

  /**
   * Job Offers
   */
  // Get all active job offers
  router.get('/api/students/jobOffers', authenticateStudentOrAdmin, students.getAllActiveJobOffers);
  router.param('studentJobOfferId', students.getJobId);
  // Get a single job offer information
  router.get('/api/students/jobOffers/:studentJobOfferId', authenticateStudentOrAdmin, students.getJobOffer);

  /**
   * Job Fair information
   */
  // Get additional information from companies that will attend the job fair.
  router.get('/api/students/jobFair', authenticateRecruiterOrStudentOrAdmin, students.getJobFairInformation);

  /**
   * Companies
   */
  // Get all active companies for students to see
  router.get('/api/students/companies', authenticateStudentOrAdmin, students.getAllActiveCompanies);
  router.param('studCompanyId', students.getCompanyId);
  // Get specific company for students to see
  router.get('/api/students/companies/:studCompanyId', authenticateStudentOrAdmin, students.getCompany);

  /**
   * Job Offers per company
   */
  // Get All Job Offers from a given company for students to see
  router.get('/api/students/companies/:studCompanyId/jobOffers', authenticateStudentOrAdmin, students.getActiveCompanyJobOffers);
  // Get JobOfferID Parameter.
  router.param('companyJobOfferId', students.getJobOfferId);
  // Get Job Offer by Job Offer ID for students to see
  router.get('/api/students/companies/:studCompanyId/jobOffers/:companyJobOfferId', authenticateStudentOrAdmin, students.getCompanyJobOffer);

  /**
   * Promotional Material per company for students to see.
   */
  // Get All Promotional Material from a Company.
  router.get('/api/students/companies/:studCompanyId/promotionalMaterial', authenticateStudentOrAdmin, students.getActiveCompanyPromotionalMaterial);
  // Get PromID Parameter.
  router.param('studPromotionalId', students.getPromId);
  // Get Promotional Material given Promotional ID
  router.get('/api/students/companies/:studCompanyId/promotionalMaterial/:studPromotionalId', authenticateStudentOrAdmin, students.getCompanyPromotionalMaterial);


  // Company Interested Majors
  router.get('/api/students/companies/:studCompanyId/interestedMajors', authenticateStudentOrAdmin, students.getCompanyInterestedMajors);

  // Get my own student information
  router.param('studentMe', students.getMeParamStudent);
  router.get('/api/students/:studentMe', students.getMeStudent);

};
