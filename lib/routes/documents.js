'use strict';

var documents = require('../controllers/documents');
var authenticateAdmin = require('../middleware').authAdmin;

module.exports = function(router) {

  router.param('docId', documents.getParam);

  router.get('/api/documents', documents.getAll);
  router.post('/api/documents', authenticateAdmin, documents.create);
  router.get('/api/documents/:docId', documents.getDocument);
  router.delete('/api/documents/:docId', authenticateAdmin, documents.deleteDocument);

  router.post('/api/documents/upload', authenticateAdmin, documents.uploadDocument);

};
