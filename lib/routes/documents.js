'use strict';

var documents = require('../controllers/documents');

module.exports = function(router) {

  router.get('/api/documents', documents.get);
  router.post('/api/documents', documents.post);

  router.param('docId', documents.getParam);
  router.get('/api/documents/:docId', documents.getDocument);

  /*
  router.param('docId', documents.getParam);
  router.delete('/api/documents/:docId', documents.deleteDocument);
  */
};
