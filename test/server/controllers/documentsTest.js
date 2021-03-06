'use strict';

var request = require('supertest');
var help = require('../help.js');
var app = require('../../../server');

var Session = require('supertest-session')({
  app: app
});

describe('Documents Controller: ', function() {

  // Run before all tests
  before(function (done) {
    this.session = new Session();
    this.session.post('/api/login')
      .send({
        email: 'placement@uprm.edu',
        password: '1q@W#e'
      }).expect(200)
      .end(help.isBodyEqual({
        "email": "placement@uprm.edu",
        "firstName": "Placement",
        "lastName": "Office",
        "authType": "admin"
      }, done));
  });

  // Run after all tests
  after(function () {
    this.session.destroy();
  });

  describe('Get all Documents.', function() {
    it('should fetch all three documents that are stored in the database.', function(done) {
      this.session
        .get('/api/documents')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([
          { id: 1,
            fileLabel: 'Job Fair Dress Code',
            filePath: 'media/promotionalMaterial/ERV7.pdf'
          },
          {
            id: 2,
            fileLabel: 'Resume Template',
            filePath: 'media/promotionalMaterial/ERV7.pdf'
          },
          {
            id: 3, fileLabel: '8th Job Fair',
            filePath: 'media/promotionalMaterial/ERV7.pdf'
          },
          {
            id: 4,
            fileLabel: 'Interview Tips',
            filePath: 'media/promotionalMaterial/ERV7.pdf'
          }], done));
    });
  });

  describe('Create a Document.', function() {
    it('should create a new document, given the document name.', function(done) {
      this.session
        .post('/api/documents')
        .send({
          fileLabel: "new document name",
          filePath: "media/promotionalMaterial/ERV7.pdf"
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .end(help.isBodyEqual({
          id: 5,
          fileLabel: 'new document name',
          filePath: 'media/promotionalMaterial/ERV7.pdf'
        }, done));
    });
  });

  describe('Get a Document.', function() {
    it('should fetch a specific document, given its ID.', function(done) {
      this.session
        .get('/api/documents/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          id: 1,
          fileLabel: 'Job Fair Dress Code',
          filePath: 'media/promotionalMaterial/ERV7.pdf' }
          , done));
    });

    it('should throw a 404 error if document does not exist.', function(done) {
      this.session
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
      this.session
        .del('/api/documents/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "message": "Document Successfully Deleted."
        }, done));
    });

    it('should send a 404 error if the document does not exist.', function(done) {
      this.session
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
