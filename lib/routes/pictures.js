'use strict';

var pictures = require('../controllers/pictures');

module.exports = function(router) {

  router.param('picId', pictures.getParam);

  router.get('/api/pictures', pictures.get);
  router.get('/api/pictures/:picId', pictures.getPicture);
  router.put('/api/pictures/:picId', pictures.updatePicture);

};
