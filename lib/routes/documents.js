'use strict';

var documents = require('../controllers/documents');

module.exports = function(router) {

  router.param('docId', documents.getParam);

  router.get('/api/documents', documents.getAll);
  router.post('/api/documents', documents.create);
  router.get('/api/documents/:docId', documents.getDocument);
  router.delete('/api/documents/:docId', documents.deleteDocument);

};
