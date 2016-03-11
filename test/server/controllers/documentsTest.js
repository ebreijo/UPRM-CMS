'use strict';

var request = require('supertest');
var help = require('../help.js');
var app = require('../../../server');

describe('Documents Controller: ', function() {

  describe('Get all Documents.', function() {
    it('should fetch all three documents that are stored in the database.', function(done) {
      request(app)
        .get('/api/documents')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([{
          id: 1,
          fileLabel : 'document1',
          filePath : '/lib/documents'
        }, {
          id: 2,
          fileLabel : 'document2',
          filePath : '/lib/documents'
        }, {
          id: 3,
          fileLabel : 'document3',
          filePath : '/lib/documents'
        }], done));
    });
  });

  describe('Create a Document.', function() {
    it('should create a new document, given the document name.', function(done) {
      request(app)
        .post('/api/documents')
        .send({
          fileLabel : "new document name"
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .end(help.isBodyEqual({
          "id": 4,
          "fileLabel": "new document name",
          "filePath": "/documents/file1"
        }, done));
    });
  });

  describe('Get a Document.', function() {
    it('should fetch a specific document, given its ID.', function(done) {
      request(app)
        .get('/api/documents/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          id: 1,
          fileLabel : 'document1',
          filePath : '/lib/documents'
        }, done));
    });

    it('should throw a 404 error if document does not exist.', function(done) {
      request(app)
        .get('/api/documents/6')
        .expect('Content-Type', /json/)
        .expect(404)
        .end(help.isBodyEqual({
          "code": "404",
          "status": "404",
          "name": "Http404Error",
          "message": "Document not found"
        }, done));
    });
  });

  describe('Delete a Document.', function() {
    it('should delete a document, given its id.', function(done) {
      request(app)
        .del('/api/documents/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "message": "Document Successfully Deleted."
        }, done));
    });

    it('should send a 404 error if the document does not exist.', function(done) {
      request(app)
        .del('/api/documents/6')
        .expect('Content-Type', /json/)
        .expect(404)
        .end(help.isBodyEqual({
          "code": "404",
          "status": "404",
          "name": "Http404Error",
          "message": "Document not found"
        }, done));
    });
  });

});
