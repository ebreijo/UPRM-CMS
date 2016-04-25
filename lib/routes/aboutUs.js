'use strict';

var aboutUs = require('../controllers/aboutUs');
var authenticateAdmin = require('../middleware').authAdmin;

module.exports = function(router) {
  // GET that returns all Data.
  router.get('/api/aboutUs', aboutUs.getAllData);

  // PUT to Update aboutUs Table.
  router.put('/api/aboutUs', authenticateAdmin, aboutUs.updateAboutUs);

  // PUT, POST, and DELETE Routes for Requirements.
  router.put('/api/aboutUs/requirements', authenticateAdmin, aboutUs.updateRequirements);
  router.post('/api/aboutUs/requirements', authenticateAdmin, aboutUs.addRequirement);
  router.param('requirementId', aboutUs.getRequirementId);
  router.delete('/api/aboutUs/requirements/:requirementId', authenticateAdmin, aboutUs.deleteRequirement);

  // PUT, POST, and DELETE Routes for Company Services.
  router.put('/api/aboutUs/companyServices', authenticateAdmin, aboutUs.updateCompanyServices);
  router.post('/api/aboutUs/companyServices', authenticateAdmin, aboutUs.addCompanyService);
  router.param('companyServiceId', aboutUs.getCompanyServiceId);
  router.delete('/api/aboutUs/companyServices/:companyServiceId', authenticateAdmin, aboutUs.deleteCompanyService);

  // PUT, POST, and DELETE Routes for Policies.
  router.put('/api/aboutUs/policies', authenticateAdmin, aboutUs.updatePolicies);
  router.post('/api/aboutUs/policies', authenticateAdmin, aboutUs.addPolicy);
  router.param('policyId', aboutUs.getPolicyId);
  router.delete('/api/aboutUs/policies/:policyId', authenticateAdmin, aboutUs.deletePolicy);

  // PUT, POST, and DELETE Routes for Our Staff.
  router.put('/api/aboutUs/ourStaff', authenticateAdmin, aboutUs.updateOurStaff);
  router.post('/api/aboutUs/ourStaff', authenticateAdmin, aboutUs.addStaff);
  router.param('ourStaffId', aboutUs.getStaffId);
  router.delete('/api/aboutUs/ourStaff/:ourStaffId', authenticateAdmin, aboutUs.deleteStaff);

  // PUT, POST, and DELETE Routes for Student Services.
  router.put('/api/aboutUs/studentServices', authenticateAdmin, aboutUs.updateStudentServices);
  router.post('/api/aboutUs/studentServices', authenticateAdmin, aboutUs.addStudentService);
  router.param('studentServiceId', aboutUs.getStudentServiceId);
  router.delete('/api/aboutUs/studentServices/:studentServiceId', authenticateAdmin, aboutUs.deleteStudentService);
};

