'use strict';

var pictures = require('../controllers/pictures');

module.exports = function(router) {

  router.param('picId', pictures.getParam);
  router.get('/api/pictures', pictures.getAll);
  router.get('/api/pictures/:picId', pictures.getPicture);
  router.post('/api/pictures', pictures.createPicture);
  router.put('/api/pictures/:picId', pictures.updatePicture);

};
