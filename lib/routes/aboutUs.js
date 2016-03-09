'use strict';

var aboutUs = require('../controllers/aboutUs');

module.exports = function(router) {

  router.get('/api/aboutUs', aboutUs.getAllData);
//  router.put('/api/aboutUs', aboutUs.update);
};
