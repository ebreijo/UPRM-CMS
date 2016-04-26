'use strict';

var request = require('supertest');
var help = require('../help.js');
var app = require('../../../server');

var Session = require('supertest-session')({
  app: app
});

describe('Pictures Controller: ', function() {

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

  describe('Get all Pictures.', function() {
    it('should fetch all three pictures that are stored in the database.', function(done) {
      this.session
        .get('/api/pictures')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([{
          id: 1,
          fileLabel : 'photo1',
          filePath : 'media/landing/222402f605892859df986fe7f0925a7a.jpeg'
        }, {
          id: 2,
          fileLabel : 'photo2',
          filePath : 'media/landing/08256d2e4d626c571dcbeb7eea0ce9d5.jpeg'
        }, {
          id: 3,
          fileLabel : 'photo3',
          filePath : 'media/landing/1e0c41dbfd2cedd61f3da7d34498356d.jpeg'
        }, {
          id: 4,
          fileLabel : 'photo4',
          filePath : 'media/landing/c6ee9c7978a335b2bafcaaf630785fe5.jpeg'
        }, {
          id: 5,
          fileLabel : 'photo5',
          filePath : 'media/landing/1836f55e9dc707d5102552f97d1650f2.jpeg'
        }], done));
    });
  });

  describe('Get a Picture.', function() {
    it('should fetch a specific picture, given its ID.', function(done) {
      this.session
        .get('/api/pictures/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          id: 1,
          fileLabel : 'photo1',
          filePath : 'media/landing/222402f605892859df986fe7f0925a7a.jpeg'
        }, done));
    });

    it('should throw a 404 error if picture does not exist.', function(done) {
      this.session
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
      this.session
        .put('/api/pictures/1')
        .send({"fileLabel" : "updated picture", "filePath": "updated path"})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "message": "Picture Successfully Updated."
        }, done));
    });

    it('should send a 404 error if the picture does not exist.', function(done) {
      this.session
        .del('/api/pictures/6')
        .expect('Content-Type', /json/)
        .send({"fileLabel" : "updated picture"})
        .expect(404, done)
    });
  });

  /*
  describe('Create a Picture.', function() {
    it('should create a new picture, given the picture name.', function(done) {
      this.session
        .post('/api/pictures')
        .send({
          fileLabel : "new picture name"
        })
        .expect('Content-Type', /json/)
        .expect(201, done);
    });
  });
  */

});
