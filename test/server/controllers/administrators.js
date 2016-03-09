'use strict';

var request = require('supertest'),
  expect = require('chai').expect,
  help = require('../help.js'),
  app = require('../../../server');


describe('Administrators Controller: ', function() {

  describe('Get an admin from the access list', function() {
    it('should find an admin with an email placement@uprm.edu', function(done) {
      request(app)
        .get('/api/adminsAccess/placement@uprm.edu')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "email": "placement@uprm.edu",
          "isRoot": true,
          "adminAccountStatus": "active"
        }, done));
    });

    it('should return 404 for an admin not found in the access list', function(done) {
      request(app)
        .get('/api/adminsAccess/zzzz@upr.edu')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
  });

  describe('Grant access to an admin', function() {
    var adminAccess = null;
    beforeEach(function() {
      adminAccess = request(app).post('/api/adminsAccess');
    });

    describe('with a valid admin object sent', function() {

      it('should grant access to admin and return a 201 status code', function(done) {
        var newAdminAccess = {
          "email": "eduardo@upr.edu"
        };
        var expectedAdminAccess = 'eduardo@upr.edu';
        adminAccess.send(newAdminAccess)
          .expect('Content-Type', /json/)
          .expect(201)
          .end(function(err) {
            if(err) {
              done(err);
            } else {
              request(app).get('/api/adminsAccess/' + expectedAdminAccess)
                .expect(200, done);
            }
          });
      });

      it('should not give access to an admin that exists already', function(done) {
        var newAdminAccess = {
          "email": "maria.hernandez@upr.edu"
        };
        adminAccess.send(newAdminAccess)
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function(err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/exists/);
              done();
            }
          });
      });
    });

    describe('with an invalid admin object sent', function() {

      it('with an empty body should send 400', function(done) {
        adminAccess.send({})
          .expect('Content-Type', /json/)
          .expect(400, done);
      });

      it('with invalid attributes should respond with 400 and a Validation Error message', function(done) {
        var newAdminAccess = {
          "email": "ZZZZ",
          "isRoot": "fal"
        };
        adminAccess.send(newAdminAccess)
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function (err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Validation error/);
              done();
            }
          });
      });
    });
  });

  describe('Update access to an admin', function() {
    var admin = null;
    beforeEach(function() {
      admin = request(app).put('/api/adminsAccess/maria.hernandez@upr.edu');
    });

    describe('with a valid admin object sent', function() {
      it('should update the email and admin access status and return a 200 status code', function (done) {
        var updatedAdmin = {
          "email": "maria.picapiedras@upr.edu",
          "adminAccountStatus": "pending"
        };
        var expectedAdmin = {
          "email": "maria.picapiedras@upr.edu",
          "isRoot": false,
          "adminAccountStatus": "pending"
        };
        admin.send(updatedAdmin)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err) {
            if (err) {
              done(err);
            } else {
              request(app).get('/api/adminsAccess/' + expectedAdmin.email)
                .expect(200)
                .end(help.isBodyEqual(expectedAdmin, done));
            }
          });
      });
    });
  });

  describe('Get an admin', function() {
    it('should find an admin with an email placement@uprm.edu', function(done) {
      request(app)
        .get('/api/admins/placement@uprm.edu')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "email": "placement@uprm.edu",
          "password": "pass",
          "firstName": "Placement",
          "lastName": 'Office'
        }, done));
    });

    it('should return 404 for an admin not found', function(done) {
      request(app)
        .get('/api/admins/zzzz@upr.edu')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
  });

  describe('Register as a new admin', function() {
    var admin = null;
    beforeEach(function() {
      admin = request(app).post('/api/admins/register');
    });

    describe('with a valid admin object sent', function() {

      it('should register and return a 201 status code', function(done) {
        var newAdmin = {
          "email": "pedro.rivera@upr.edu",
          "password": "pedro123",
          "firstName": "Pedro",
          "lastName": "Rivera"
        };
        var expectedAdmin = 'pedro.rivera@upr.edu';
        admin.send(newAdmin)
          .expect('Content-Type', /json/)
          .expect(201)
          .end(function(err) {
            if(err) {
              done(err);
            } else {
              request(app).get('/api/admins/' + expectedAdmin)
                .expect(200, done);
            }
          });
      });

      it('should not let admin to register if account is active or inactive', function(done) {
        var newAdmin = {
          "email": "pedro.rivera@upr.edu",
          "password": "pedro123",
          "firstName": "Pedro",
          "lastName": "Rivera"
        };
        admin.send(newAdmin)
          .expect('Content-Type', /json/)
          .expect(401)
          .end(function(err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Not authorized to register or account is already activated/);
              done();
            }
          });
      });
    });

    describe('with an invalid admin object sent', function() {

      it('with an empty body should send 401, which is unauthorized', function(done) {
        admin.send({})
          .expect('Content-Type', /json/)
          .expect(401, done);
      });

      it('with invalid attributes should respond with 401 which is not authorized', function(done) {
        var newAdmin = {
          "email": "ZZZZ",
          "password": "fal"
        };
        admin.send(newAdmin)
          .expect('Content-Type', /json/)
          .expect(401)
          .end(function (err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Not authorized to register or account is already activated/);
              done();
            }
          });
      });
    });
  });
});
