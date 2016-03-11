'use strict';

var request = require('supertest'),
  expect = require('chai').expect,
  help = require('../help.js'),
  app = require('../../../server');


describe('Administrators Controller: ', function() {

  describe('Get an admin from the access list', function() {
    it('should find an admin with an email placement@uprm.edu', function(done) {
      request(app)
        .post('/api/adminsAccessGet')
        .send({"email": "placement@uprm.edu"})
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
        .post('/api/adminsAccessGet')
        .send({"email": "zzzz@upr.edu"})
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
        adminAccess.send(newAdminAccess)
          .expect('Content-Type', /json/)
          .expect(201)
          .end(help.isBodyEqual({
            "email": "eduardo@upr.edu"
          }, done));
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

    describe('with a valid admin object sent', function() {
      it('should update the email and admin access status and return a 200 status code', function (done) {
        var admin = request(app).put('/api/adminsAccess');
        var updatedAdmin = {
          "email": "maria.picapiedras@upr.edu",
          "currentEmail": "maria.hernandez@upr.edu",
          "adminAccountStatus": "pending"
        };

        admin.send(updatedAdmin)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(help.isBodyEqual({"message": "Admin Successfully Updated"}, done));
      });

      it('should not update admin account status to active if the admin is still pending to register', function (done) {
        var admin = request(app).put('/api/adminsAccess');
        var updatedAdmin = {
          "currentEmail": "pedro.rivera@upr.edu",
          "adminAccountStatus": "active"
        };

        admin.send(updatedAdmin)
          .expect('Content-Type', /json/)
          .expect(401)
          .end(function (err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Cannot activate the Administrator, it is still pending to register/);
              done();
            }
          });
      });
    });
  });

  describe('Get an admin', function() {
    it('should find an admin with an email placement@uprm.edu', function(done) {
      request(app)
        .post('/api/admins')
        .send({"email": "placement@uprm.edu"})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "email": "placement@uprm.edu",
          "firstName": "Placement",
          "lastName": 'Office'
        }, done));
    });

    it('should return 404 for an admin not found', function(done) {
      request(app)
        .post('/api/admins')
        .send({"email": "zzzz@upr.edu"})
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

        admin.send(newAdmin)
          .expect('Content-Type', /json/)
          .expect(201)
          .end(help.isBodyEqual({
            "email": "pedro.rivera@upr.edu",
            "firstName": "Pedro",
            "lastName": 'Rivera'
          }, done));
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

  describe('Update admin information', function() {
    var admin = null;
    beforeEach(function() {
      admin = request(app).put('/api/admins');
    });

    describe('with a valid admin object sent', function() {
      it('should update the firstName, lastName and password but not the email, and return a 200 status code', function (done) {
        var updatedAdmin = {
          "email": "juan.rodriguez@upr.edu",
          "password": "mipassword1",
          "firstName": "John",
          "lastName": "Rod"
        };

        admin.send(updatedAdmin)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(help.isBodyEqual({"message": "Update was successful"}, done));
      });
    });

    describe('with invalid attributes sent', function() {
      it('should not make the update and return a 400 status code', function (done) {
        var updatedAdmin = {
          "email": "zzzz@upr.edu",
          "password": "mipassword1",
          "firstName": "ZZZZ",
          "lastName": ""
        };

        admin.send(updatedAdmin)
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

      describe('with invalid email', function() {
        it('should not make the update and return a 404 status code', function (done) {
          var updatedAdmin = {
            "email": "zzzz@upr.edu",
            "password": "mipassword1",
            "firstName": "ZZZZ",
            "lastName": "sadfasf"
          };

          admin.send(updatedAdmin)
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
              if (err) {
                done(err);
              } else {
                expect(res.body.message).to.match(/Admin not found/);
                done();
              }
            });
        });
      });
    });
  });

  describe('Get latest job fair dates', function() {
    it('should find an admin with an email placement@uprm.edu', function(done) {
      request(app)
        .get('/api/jobFairDates')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "id": 1,
          "headerEnglish": "8th Spring Job Fair",
          "locationEnglish": "Mayaguez Resort & Casino",
          "dateEnglish": "Friday, February 19, 2016",
          "time": "8:30am - 2:30pm",
          "headerSpanish": "8va Feria de Empleo de Primavera",
          "locationSpanish": "Hotel Mayaguez Resort & Casino",
          "dateSpanish": "viernes, 19 de febrero de 2016",
          "resumeDeadlineDate": "2016-02-19T00:00:00.000Z"
        }, done));
    });
  });

  describe('Update job fair date', function() {
    var jobFairDates = null;
    beforeEach(function() {
      jobFairDates = request(app).put('/api/jobFairDates');
    });

    describe('with a valid job fair date object sent', function() {
      it('should change job fair dates correctly and return a 200 status code', function (done) {
        var newJobFairDates = {
          "headerEnglish": "30th Fall Job Fair",
          "locationEnglish": "Coliseum Rafael Mangual",
          "dateEnglish": "Friday, October 1, 2016",
          "time": "8:30am - 2:30pm",
          "headerSpanish": "30ma Feria de Empleo de Otono",
          "locationSpanish": "Coliseo Rafael Mangual",
          "dateSpanish": "viernes, 1 de octubre de 2016",
          "resumeDeadlineDate": "2016-09-29"
        };
        jobFairDates.send(newJobFairDates)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Job Fair Date information was successfully updated/);
              done();
            }
          });
      });
    });

    describe('with an invalid attributes in the job fair date object sent', function() {
      it('should get a validation error and return a 401 status code', function (done) {
        var newJobFairDates = {
          "headerEnglish": "30th Fall Job Fair",
          "locationEnglish": "",
          "dateEnglish": "Friday, October 1, 2016",
          "time": "8:30am - 2:30pm",
          "headerSpanish": "30ma Feria de Empleo de Otono",
          "locationSpanish": "Coliseo Rafael Mangual",
          "dateSpanish": "viernes, 1 de octubre de 2016",
          "resumeDeadlineDate": "2016-09-29"
        };
        jobFairDates.send(newJobFairDates)
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
});
