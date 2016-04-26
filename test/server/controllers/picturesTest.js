'use strict';

var request = require('supertest');
var help = require('../help.js');
var app = require('../../../server');

var Session = require('supertest-session')({
  app: app
});

describe('Pictures Controller: ', function () {

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

  describe('Get all Pictures.', function () {
    it('should fetch all three pictures that are stored in the database.', function (done) {
      this.session
        .get('/api/pictures')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([{
          id: 1,
          fileLabel: 'photo1',
          filePath: 'media/landing/628ff789a945c81bc53273e5fafdfb65.jpeg'
          },
          {
            id: 2,
            fileLabel: 'photo2',
            filePath: 'media/landing/99842a6ebf72dacd7585cf010c0e2149.jpeg'
          },
          {
            id: 3,
            fileLabel: 'photo3',
            filePath: 'media/landing/9547ade0666c15d4e1f5b6f9fac6f5cf.jpeg'
          },
          {
            id: 4,
            fileLabel: 'photo4',
            filePath: 'media/landing/36aedd4cf64b499de8412354af1635ef.jpeg'
          },
          {
            id: 5,
            fileLabel: 'photo5',
            filePath: 'media/landing/c052d690e3698b00a2e6b887a607b684.jpeg'
          }], done));
    });
  });

  describe('Get a Picture.', function () {
    it('should fetch a specific picture, given its ID.', function (done) {
      this.session
        .get('/api/pictures/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          id: 1,
          fileLabel: 'photo1',
          filePath: 'media/landing/628ff789a945c81bc53273e5fafdfb65.jpeg'
        }, done));
    });

    it('should throw a 404 error if picture does not exist.', function (done) {
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


  describe('Update a Picture.', function () {

    it('should update a picture, given its id.', function (done) {
      this.session
        .put('/api/pictures/1')
        .send({"fileLabel": "updated picture", "filePath": "updated path"})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "message": "Picture Successfully Updated."
        }, done));
    });

    it('should send a 404 error if the picture does not exist.', function (done) {
      this.session
        .del('/api/pictures/6')
        .expect('Content-Type', /json/)
        .send({"fileLabel": "updated picture"})
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
