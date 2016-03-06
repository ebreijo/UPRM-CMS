'use strict';

var aboutUs = require('../controllers/aboutUs');

module.exports = function(router) {
  //router.put('/aboutUs', aboutUs.update);
  router.get('/api/aboutUs', aboutUs.get);
};
