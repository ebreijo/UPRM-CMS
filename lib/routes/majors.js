'use strict';

var majors = require('../controllers/majors');
var authenticateRecruiterOrStudentOrAdmin = require('../middleware').authRecruiterOrStudentOrAdmin;
var authenticateAdmin = require('../middleware').authAdmin;

module.exports = function(router) {

  router.get('/api/majors', authenticateRecruiterOrStudentOrAdmin, majors.getAll);
  router.post('/api/majors', authenticateAdmin, majors.create);
  router.param('majorId', majors.getParam);
  router.get('/api/majors/:majorId', authenticateRecruiterOrStudentOrAdmin, majors.getMajor);
  router.put('/api/majors/:majorId', authenticateAdmin, majors.updateMajor);
  router.delete('/api/majors/:majorId', authenticateAdmin, majors.deleteMajor);

};
