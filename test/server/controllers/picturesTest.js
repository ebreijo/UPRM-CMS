'use strict';

var request = require('supertest');
var help = require('../help.js');
var app = require('../../../server');

describe('Pictures Controller: ', function() {

  describe('Get all Pictures.', function() {
    it('should fetch all three pictures that are stored in the database.', function(done) {
      request(app)
        .get('/api/pictures')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([{
          id: 1,
          fileLabel : 'photo1',
          filePath : '/lib/pictures'
        }, {
          id: 2,
          fileLabel : 'photo2',
          filePath : '/lib/pictures'
        }, {
          id: 3,
          fileLabel : 'photo3',
          filePath : '/lib/pictures'
        }], done));
    });
  });

  describe('Get a Picture.', function() {
    it('should fetch a specific picture, given its ID.', function(done) {
      request(app)
        .get('/api/pictures/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          id: 1,
          fileLabel : 'photo1',
          filePath : '/lib/pictures'
        }, done));
    });

    it('should throw a 404 error if picture does not exist.', function(done) {
      request(app)
        .get('/api/pictures/6')
        .expect('Content-Type', /json/)
        .expect(404)
        .end(help.isBodyEqual({
          "code": "404",
          "status": "404",
          "name": "Http404Error",
          "message": "Picture not found"
        }, done));
    });
  });


  describe('Update a Picture.', function() {

    it('should update a picture, given its id.', function(done) {
      request(app)
        .put('/api/pictures/1')
        .send({"fileLabel" : "updated picture"})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "message": "Picture Successfully Updated."
        }, done));
    });

    it('should send a 404 error if the picture does not exist.', function(done) {
      request(app)
        .del('/api/pictures/6')
        .expect('Content-Type', /json/)
        .send({"fileLabel" : "updated picture"})
        .expect(404, done)
    });
  });

});
