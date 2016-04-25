'use strict';

var pictures = require('../controllers/pictures');
var authenticateAdmin = require('../middleware').authAdmin;

module.exports = function(router) {

  router.param('picId', pictures.getParam);
  router.get('/api/pictures', pictures.getAll);
  router.get('/api/pictures/:picId', pictures.getPicture);
  router.post('/api/pictures', authenticateAdmin, pictures.createPicture);
  router.put('/api/pictures/:picId', authenticateAdmin, pictures.updatePicture);

};
