'use strict';

var documents = require('../controllers/documents');

module.exports = function(router) {

  router.param('docId', documents.getParam);

  router.get('/api/documents', documents.get);
  router.post('/api/documents', documents.post);
  router.get('/api/documents/:docId', documents.getDocument);
  router.delete('/api/documents/:docId', documents.deleteDocument);

};
