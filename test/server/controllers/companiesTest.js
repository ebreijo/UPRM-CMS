'use strict';

var request = require('supertest'),
  expect = require('chai').expect,
  help = require('../help.js'),
  app = require('../../../server');


describe('Companies Controller: ', function() {

  describe('Get all company names', function() {
    it('should find all companies and return a 200 status code', function(done) {
      request(app)
        .get('/api/companies')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([
          {
            "name": "EVERTEC"
          },
          {
            "name": "Google"
          },
          {
            "name": "IBM"
          }
        ], done));
    });
  });

  describe('Get a company given its ID', function() {
    it('should find a company with a company name IBM', function(done) {
      request(app)
        .get('/api/companies/IBM')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({"name": "IBM",
          "websiteUrl": "http://www.ibm.com/us-en/",
          "logoPath": null,
          "companyDescription": "This is IBM",
          "companyStatus": "active"
        }, done));
    });

    it('should return 404 for a company not found', function(done) {
      request(app)
        .get('/api/companies/zzzz')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
  });

  describe('Update company information', function() {

    describe('with a valid company object sent', function() {
      it('should update the company name, description, but not the company status and registration date', function (done) {
        var company = request(app).put('/api/companies/Google');
        var updatedCompany = {
          "name": "Google INC",
          "websiteUrl": "https://www.google.com/",
          "logoPath": null,
          "companyDescription": "This is Google Updated",
          "companyStatus": "active"
        };
        var expectedCompany = {
          "name": "Google INC",
          "websiteUrl": "https://www.google.com/",
          "logoPath": null,
          "companyDescription": "This is Google Updated",
          "companyStatus": "pending"
        };
        company.send(updatedCompany)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err) {
            if (err) {
              done(err);
            } else {
              request(app).get('/api/companies/' + expectedCompany.name)
                .expect(200)
                .end(help.isBodyEqual(expectedCompany, done));
            }
          });
      });
    });

    describe('with an invalid company object sent', function() {
      it('should not update the company information and return a 500 status code', function (done) {
        var company = request(app).put('/api/companies/EVERTEC');
        company.send({})
          .expect('Content-Type', /json/)
          .expect(500, done);
      });

      it('should not update the company information because of validation error and return a 400 status code', function (done) {
        var company = request(app).put('/api/companies/EVERTEC');
        var updatedCompany = {
          "name": "EVERTEC",
          "websiteUrl": "",
          "logoPath": null,
          "companyDescription": "This is Google Updated"
        };
        company.send(updatedCompany)
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function(err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Validation error/);
              done();
            }
          });
      });

      it('should not update the company name for an existing registered company', function (done) {
        var company = request(app).put('/api/companies/EVERTEC');
        var updatedCompany = {
          "name": "IBM",
          "websiteUrl": "evertec.com",
          "logoPath": null,
          "companyDescription": "This is Google Updated"
        };
        company.send(updatedCompany)
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function(err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Company already exists/);
              done();
            }
          });
      });
    });
  });

  describe('Get all active recruiter from a company', function() {
    it('should find all recruiters from IBM and return a 200 status code', function(done) {
      request(app)
        .get('/api/companies/IBM/recruiters')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([
          {
            "email": "sscosta@us.ibm.com",
            "companyName": "IBM",
            "firstName": "Sergio",
            "lastName": "Costa",
            "phoneNumber": "787-555-5555"
          }
        ], done));
    });
  });

  describe('Get an active recruiter from a company', function() {

    describe('with a valid ID', function() {
      it('should find an recruiter from IBM and return a 200 status code', function(done) {
        request(app)
          .post('/api/companies/IBM/recruiters')
          .send({"email": "sscosta@us.ibm.com"})
          .expect('Content-Type', /json/)
          .expect(200)
          .end(help.isBodyEqual({
            "email": "sscosta@us.ibm.com",
            "companyName": "IBM",
            "firstName": "Sergio",
            "lastName": "Costa",
            "phoneNumber": "787-555-5555"
          }, done));
      });
    });

    describe('with an invalid ID', function() {
      it('should find an recruiter from IBM and return a 404 status code', function(done) {
        request(app)
          .post('/api/companies/IBM/recruiters')
          .send({"email": "pedro@us.ibm.com"})
          .expect('Content-Type', /json/)
          .expect(404)
          .end(function(err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Recruiter not found/);
              done();
            }
          });
      });
    });
  });

  describe('Update recruiter information from a given company, in this case IBM', function() {

    var recruiter = null;
    beforeEach(function() {
      recruiter = request(app).put('/api/companies/IBM/recruiters');
    });

    describe('with a valid recruiter object sent', function() {
      it('should update the recruiter information from IBM but not the recruiter email, company, account status and registration date', function (done) {
        var updatedRecruiter = {
          "email": "sscosta@us.ibm.com",
          "companyName": "EVERTEC",
          "firstName": "Mariano",
          "lastName": "Costa",
          "phoneNumber": "787-888-5555"
        };
        var expectedRecruiter = {
          "email": "sscosta@us.ibm.com",
          "companyName": "IBM",
          "firstName": "Mariano",
          "lastName": "Costa",
          "phoneNumber": "787-888-5555"
        };
        recruiter.send(updatedRecruiter)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err) {
            if (err) {
              done(err);
            } else {
              request(app).post('/api/companies/IBM/recruiters')
                .send({"email": expectedRecruiter.email})
                .expect(200)
                .end(help.isBodyEqual(expectedRecruiter, done));
            }
          });
      });
    });

    describe('with an invalid recruiter object sent', function() {
      it('with an empty object, should not update the recruiter information and return a 500 status code', function (done) {
        recruiter.send({})
          .expect('Content-Type', /json/)
          .expect(500, done);
      });

      it('with invalid attributes should not update the recruiter information because of validation error and return a 400 status code', function (done) {
        var updatedRecruiter = {
          "email": "sscosta@us.ibm.com",
          "companyName": "EVERTEC",
          "firstName": "576",
          "lastName": "asf",
          "phoneNumber": "787-888-5555"
        };
        recruiter.send(updatedRecruiter)
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function(err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Validation error/);
              done();
            }
          });
      });

      it('with invalid email should not update the recruiter information because of 404 status code', function (done) {
        var updatedRecruiter = {
          "email": "zzzz@us.ibm.com",
          "companyName": "IBM",
          "firstName": "Mariano",
          "lastName": "Rodriguez",
          "phoneNumber": "787-888-5555"
        };
        recruiter.send(updatedRecruiter)
          .expect('Content-Type', /json/)
          .expect(404)
          .end(function(err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Recruiter not found for this company/);
              done();
            }
          });
      });
    });
  });

});
