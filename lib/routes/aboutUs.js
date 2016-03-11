'use strict';

var aboutUs = require('../controllers/aboutUs');

module.exports = function(router) {
  // GET that returns all Data.
  router.get('/api/aboutUs', aboutUs.getAllData);

  // PUT to Update aboutUs Table.
  router.put('/api/aboutUs', aboutUs.updateAboutUs);

  // PUT, POST, and DELETE Routes for Requirements.
  router.put('/api/aboutUs/requirements', aboutUs.updateRequirements);
  router.post('/api/aboutUs/requirements', aboutUs.addRequirement);
  router.delete('/api/aboutUs/requirements', aboutUs.deleteRequirement);

  // PUT, POST, and DELETE Routes for Company Services.
  router.put('/api/aboutUs/companyServices', aboutUs.updateCompanyServices);
  router.post('/api/aboutUs/companyServices', aboutUs.addCompanyService);
  router.delete('/api/aboutUs/companyServices', aboutUs.deleteCompanyService);

  // PUT, POST, and DELETE Routes for Policies.
  router.put('/api/aboutUs/policies', aboutUs.updatePolicies);
  router.post('/api/aboutUs/policies', aboutUs.addPolicy);
  router.delete('/api/aboutUs/policies', aboutUs.deletePolicy);

  // PUT, POST, and DELETE Routes for Our Staff.
  router.put('/api/aboutUs/ourStaff', aboutUs.updateOurStaff);
  router.post('/api/aboutUs/ourStaff', aboutUs.addStaff);
  router.delete('/api/aboutUs/ourStaff', aboutUs.deleteStaff);

  // PUT, POST, and DELETE Routes for Student Services.
  router.put('/api/aboutUs/studentServices', aboutUs.updateStudentServices);
  router.post('/api/aboutUs/studentServices', aboutUs.addStudentService);
  router.delete('/api/aboutUs/studentServices', aboutUs.deleteStudentService);
};

