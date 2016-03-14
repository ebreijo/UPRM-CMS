'use strict';

var majors = require('../controllers/majors');

module.exports = function(router) {

  router.get('/api/majors', majors.getAll);
  router.post('/api/majors', majors.create);
  router.param('majorId', majors.getParam);
  router.get('/api/majors/:majorId', majors.getMajor);
  router.put('/api/majors/:majorId', majors.updateMajor);
  router.delete('/api/majors/:majorId', majors.deleteMajor);

};
