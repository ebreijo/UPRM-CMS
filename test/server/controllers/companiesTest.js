'use strict';

var request = require('supertest'),
  expect = require('chai').expect,
  help = require('../help.js'),
  app = require('../../../server');

var Session = require('supertest-session')({
  app: app
});

describe('Companies Controller: ', function() {

  describe('Get all company names', function() {
    it('should find all companies and return a 200 status code', function(done) {
      request(app)
        .get('/api/companies')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([
          {
            "name": "Apple"
          },
          {
            "name": "EVERTEC"
          },
          {
            "name": "Google"
          },
          {
            "name": "IBM"
          },
          {
            "name": "Pepe Company"
          }
        ], done));
    });
  });

  describe('Get a company given its ID', function() {

    // Run before all tests
    before(function (done) {
      this.session = new Session();
      this.session.post('/api/login')
        .send({
          email: 'sergio@ibm.com',
          password: '1q@W#e'
        }).expect(200)
        .end(help.isBodyEqual({
          "email": "sergio@ibm.com",
          "companyName": "IBM",
          "companyLocationId": 1,
          "firstName": "Sergio",
          "lastName": "Rivera",
          "phoneNumber": "787-555-5555",
          "authType": "recruiter"
        }, done));
    });

    // Run after all tests
    after(function () {
      this.session.destroy();
    });

    it('should find a company with a company name IBM', function(done) {
      this.session
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

    it('should return 403 when looking for another company different from recruiter\'s company', function(done) {
      this.session
        .get('/api/companies/zzzz')
        .expect('Content-Type', /json/)
        .expect(403, done);
    });
  });

  describe('Register as a recruiter', function() {
    var recruiter = null;
    beforeEach(function() {
      recruiter = request(app).post('/api/companies/register');
    });

    describe('with a new company and company location', function () {

      it('should not register if some required fields are empty and return a 400 status code along with a Validation Error message', function(done) {
        var newRegistration = {
          "companyInfo": {
            "name": "COMPANY",
            "websiteUrl": "",
            "companyDescription": "this is a company"
          },
          "companyLocation": {
            "streetAddress": "company address",
            "city": "company city",
            "state": "NY",
            "country": "",
            "zipCode": "27709",
            "phoneNumber": "787-344-4444"
          },
          "recruiterInfo": {
            "email": "pepito@company.com",
            "password": "1q@W#e",
            "firstName": "Pepe",
            "lastName": "Perez",
            "phoneNumber": "787-555-5555"
          }
        };
        recruiter.send(newRegistration)
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function (err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Validation Error: Please make sure all the recruiter info fields are correct/);
              done();
            }
          });
      });

      it('should not register if password is invalid and return a 400 status code along with a Validation Error message', function(done) {
        var newRegistration = {
          "companyInfo": {
            "name": "COMPANY",
            "websiteUrl": "",
            "companyDescription": "this is a company"
          },
          "companyLocation": {
            "streetAddress": "company address",
            "city": "company city",
            "state": "NY",
            "country": "",
            "zipCode": "27709",
            "phoneNumber": "787-344-4444"
          },
          "recruiterInfo": {
            "email": "pepito@company.com",
            "password": "hola1",
            "firstName": "Pepe",
            "lastName": "Perez",
            "phoneNumber": "787-555-5555"
          }
        };
        recruiter.send(newRegistration)
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function (err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Invalid password/);
              done();
            }
          });
      });


      it('should register with valid information and return a 201 status code along with a registration message', function(done) {
        var newRegistration = {
          "companyInfo": {
            "name": "COMPANY",
            "websiteUrl": "company.com",
            "companyDescription": "this is a company"
          },
          "companyLocation": {
            "streetAddress": "company address",
            "city": "company city",
            "state": "NY",
            "country": "United States",
            "zipCode": "27709",
            "phoneNumber": "787-344-4444"
          },
          "recruiterInfo": {
            "email": "pepito@company.com",
            "password": "1q@W#e",
            "firstName": "Pepe",
            "lastName": "Perez",
            "phoneNumber": "787-555-5555"
          }
        };
        recruiter.send(newRegistration)
          .expect('Content-Type', /json/)
          .expect(201)
          .end(function (err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Registration Completed. We will review your information before you can LogIn/);
              done();
            }
          });
      });

      it('should not register if company already exists and return a 400 status code', function(done) {
        var newRegistration = {
          "companyInfo": {
            "name": "COMPANY",
            "websiteUrl": "company.com",
            "companyDescription": "this is a company"
          },
          "companyLocation": {
            "streetAddress": "company address",
            "city": "company city",
            "state": "NY",
            "country": "United States",
            "zipCode": "27709",
            "phoneNumber": "787-344-4444"
          },
          "recruiterInfo": {
            "email": "pepito@company.com",
            "password": "1q@W#e",
            "firstName": "Pepe",
            "lastName": "Perez",
            "phoneNumber": "787-555-5555"
          }
        };
        recruiter.send(newRegistration)
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function (err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Company already exists/);
              done();
            }
          });
      });

      it('should not register if email already exists and return a 400 status code', function(done) {
        var newRegistration = {
          "companyInfo": {
            "name": "La Nasa",
            "websiteUrl": "nasa.com",
            "companyDescription": "nasa is a company"
          },
          "companyLocation": {
            "streetAddress": "nasa address",
            "city": "nasa city",
            "state": "CA",
            "country": "United States",
            "zipCode": "27709",
            "phoneNumber": "787-344-4444"
          },
          "recruiterInfo": {
            "email": "sergio@ibm.com",
            "password": "1q@W#e",
            "firstName": "Sergio",
            "lastName": "Perez",
            "phoneNumber": "787-555-5555"
          }
        };
        recruiter.send(newRegistration)
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function (err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Email already exists/);
              done();
            }
          });
      });
    });

    describe('with a new company location, company has been registered previously', function () {
      it('should register an inactive recruiter with valid information and return a 201 status code along with a registration message', function(done) {
        var newRegistration = {
          "companyLocation": {
            "companyName": "EVERTEC",
            "streetAddress": "evertec company address",
            "city": "evertec company city",
            "state": "NY",
            "country": "Puerto Rico",
            "zipCode": "27709",
            "phoneNumber": "787-344-4444"
          },
          "recruiterInfo": {
            "email": "pancho@evertec.com",
            "password": "1q@W#e",
            "firstName": "Pancho",
            "lastName": "Del Toro",
            "phoneNumber": "787-555-5555"
          }
        };
        recruiter.send(newRegistration)
          .expect('Content-Type', /json/)
          .expect(201)
          .end(function (err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Registration Completed. We will review your information before you can LogIn/);
              done();
            }
          });
      });

      it('should not register if email already exists and return a 400 status code', function(done) {
        var newRegistration = {
          "companyLocation": {
            "companyName": "IBM",
            "streetAddress": "IBM address",
            "city": "IBM city",
            "state": "NY",
            "country": "United States",
            "zipCode": "27709",
            "phoneNumber": "787-344-4444"
          },
          "recruiterInfo": {
            "email": "sergio@ibm.com",
            "password": "1q@W#e",
            "firstName": "Sergio",
            "lastName": "Perez",
            "phoneNumber": "787-555-5555"
          }
        };
        recruiter.send(newRegistration)
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function (err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Email already exists/);
              done();
            }
          });
      });
    });

    describe('with a new recruiter info, company and company location have been registered previously', function () {
      it('should register with valid information and return a 201 status code along with a registration message', function(done) {
        var newRegistration = {
          "recruiterInfo": {
            "companyName": "IBM",
            "companyLocationId": 1,
            "email": "ed@ibm.com",
            "password": "1q@W#e",
            "firstName": "Ed",
            "lastName": "Ramos",
            "phoneNumber": "787-555-5555"
          }
        };
        recruiter.send(newRegistration)
          .expect('Content-Type', /json/)
          .expect(201)
          .end(function (err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Registration Completed. We will review your information before you can LogIn/);
              done();
            }
          });
      });

      it('should not register if email already exists and return a 400 status code', function(done) {
        var newRegistration = {
          "recruiterInfo": {
            "companyName": "IBM",
            "companyLocationId": 1,
            "email": "sergio@ibm.com",
            "password": "1q@W#e",
            "firstName": "Sergio",
            "lastName": "Perez",
            "phoneNumber": "787-555-5555"
          }
        };
        recruiter.send(newRegistration)
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function (err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Email already exists/);
              done();
            }
          });
      });
    });
  });


  describe('Update company information', function() {

    describe('with a valid company object sent', function() {

      before(function (done) {
        this.session = new Session();
        this.session.post('/api/login')
          .send({
            "email": "diana@gmail.com",
            "password": "1q@W#e"
          }).expect(200)
          .end(help.isBodyEqual({
            "email": "diana@gmail.com",
            "companyName": "Google",
            "companyLocationId": 4,
            "firstName": "Diana",
            "lastName": "Diaz",
            "phoneNumber": "787-555-5555",
            "authType": "recruiter"
          }, done));
      });

      after(function () {
        this.session.destroy();
      });

      it('should update the company name, description, but not the company status and registration date', function (done) {
        var company = this.session.put('/api/companies/Google');
        var updatedCompany = {
          "name": "Google INC",
          "websiteUrl": "https://www.google.com/",
          "logoPath": null,
          "companyDescription": "This is Google Updated",
          "companyStatus": "active"
        };
        company.send(updatedCompany)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Company Successfully Updated/);
              done();
            }
          });
      });
    });

    describe('with an invalid company object sent', function() {

      before(function (done) {
        this.session = new Session();
        this.session.post('/api/login')
          .send({
            "email": "celia@evertec.com",
            "password": "1q@W#e"
          }).expect(200)
          .end(help.isBodyEqual({
            "email": "celia@evertec.com",
            "companyName": "EVERTEC",
            "companyLocationId": 5,
            "firstName": "Celia",
            "lastName": "Santiago",
            "phoneNumber": "787-555-5555",
            "authType": "recruiter"
          }, done));
      });

      after(function () {
        this.session.destroy();
      });


      it('should not update the company information and return a 500 status code', function (done) {
        var company = this.session.put('/api/companies/EVERTEC');
        company.send({})
          .expect('Content-Type', /json/)
          .expect(500, done);
      });

      it('should not update the company information because of validation error and return a 400 status code', function (done) {
        var company = this.session.put('/api/companies/EVERTEC');
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
        var company = this.session.put('/api/companies/EVERTEC');
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

    before(function (done) {
      this.session = new Session();
      this.session.post('/api/login')
        .send({
          "email": "sergio@ibm.com",
          "password": "1q@W#e"
        }).expect(200)
        .end(help.isBodyEqual({
          "email": "sergio@ibm.com",
          "companyName": "IBM",
          "companyLocationId": 1,
          "firstName": "Sergio",
          "lastName": "Rivera",
          "phoneNumber": "787-555-5555",
          "authType": "recruiter"
        }, done));
    });

    after(function () {
      this.session.destroy();
    });



    it('should find all recruiters from IBM and return a 200 status code', function(done) {
      this.session
        .get('/api/companies/IBM/recruiters')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([
          {
            "email": "leonardo@ibm.com",
            "firstName": "Leonardo",
            "lastName": "Dicaprio",
            "phoneNumber": "787-555-5555",
            "companyLocation": {
              "id": 2,
              "streetAddress": "1 New Orchard Road",
              "city": "Armonk",
              "state": "NY",
              "country": "United States",
              "zipCode": "10504",
              "phoneNumber": null
            }
          },
          {
            "email": "sergio@ibm.com",
            "firstName": "Sergio",
            "lastName": "Rivera",
            "phoneNumber": "787-555-5555",
            "companyLocation": {
              "id": 1,
              "streetAddress": "3039 E Cornwallis Road",
              "city": "Durham",
              "state": "NC",
              "country": "United States",
              "zipCode": "27709",
              "phoneNumber": null
            }
          }
        ], done));
    });
  });

  describe('Get an active recruiter from a company', function() {

    before(function (done) {
      this.session = new Session();
      this.session.post('/api/login')
        .send({
          "email": "sergio@ibm.com",
          "password": "1q@W#e"
        }).expect(200)
        .end(help.isBodyEqual({
          "email": "sergio@ibm.com",
          "companyName": "IBM",
          "companyLocationId": 1,
          "firstName": "Sergio",
          "lastName": "Rivera",
          "phoneNumber": "787-555-5555",
          "authType": "recruiter"
        }, done));
    });

    after(function () {
      this.session.destroy();
    });

    describe('with a valid ID', function() {
      it('should find an recruiter from IBM and return a 200 status code', function(done) {
        this.session
          .post('/api/companies/IBM/recruiters')
          .send({"email": "sergio@ibm.com"})
          .expect('Content-Type', /json/)
          .expect(200)
          .end(help.isBodyEqual({
            "email": "sergio@ibm.com",
            "firstName": "Sergio",
            "lastName": "Rivera",
            "phoneNumber": "787-555-5555",
            "companyLocation": {
              "id": 1,
              "streetAddress": "3039 E Cornwallis Road",
              "city": "Durham",
              "state": "NC",
              "country": "United States",
              "zipCode": "27709",
              "phoneNumber": null
            }
          }, done));
      });
    });

    describe('with an invalid ID', function() {
      it('should find an recruiter from IBM and return a 404 status code', function(done) {
        this.session
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

  describe('Login as a recruiter', function() {
    describe('with a valid email and password object sent', function() {

      before(function (done) {
        this.session = new Session();
        this.session.post('/api/login')
          .send({
            "email": "leonardo@ibm.com",
            "password": "1q@W#e"
          }).expect(200)
          .end(help.isBodyEqual({
            "email": "leonardo@ibm.com",
            "companyName": "IBM",
            "companyLocationId": 2,
            "firstName": "Leonardo",
            "lastName": "Dicaprio",
            "phoneNumber": "787-555-5555",
            "authType": "recruiter"
          }, done));
      });

      after(function () {
        this.session.destroy();
      });

      it('should be able to change their personal information', function(done) {
        var recruiterChange = {
          "email": "leonardo@upr.edu",
          "lastName": "Da Vinci"
        };
        this.session.post('/api/recruiters/me')
          .send(recruiterChange)
          .expect('Content-Type', /json/)
          .expect(200, done);
      });

      it('should verify the changes of personal information', function(done) {
        this.session.get('/api/recruiters/me')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(help.isBodyEqual({
            "email": "leonardo@ibm.com",
            "companyName": "IBM",
            "companyLocationId": 2,
            "firstName": "Leonardo",
            "lastName": "Da Vinci",
            "phoneNumber": "787-555-5555",
            "authType": "recruiter"
          }, done));
      });

      it('should get a 401 if recruiter change account status to pending', function(done) {
        var recruiterChange = {
          "email": "leonardo@upr.edu",
          "accountStatus": "pending"
        };
        this.session.post('/api/recruiters/me')
          .send(recruiterChange)
          .expect('Content-Type', /json/)
          .expect(401, done);
      });
    });
  });

  describe('Remove a recruiter from a given company, in this case IBM', function() {

    before(function (done) {
      this.session = new Session();
      this.session.post('/api/login')
        .send({
          "email": "sergio@ibm.com",
          "password": "1q@W#e"
        }).expect(200)
        .end(help.isBodyEqual({
          "email": "sergio@ibm.com",
          "companyName": "IBM",
          "companyLocationId": 1,
          "firstName": "Sergio",
          "lastName": "Rivera",
          "phoneNumber": "787-555-5555",
          "authType": "recruiter"
        }, done));
    });

    after(function () {
      this.session.destroy();
    });


    var recruiter = null;
    beforeEach(function() {
      recruiter = this.session.put('/api/companies/IBM/recruiters');
    });

    describe('with a valid recruiter object sent', function() {
      it('should remove the recruiter from IBM and return a 200 status code', function (done) {
        var removedRecruiter = {
          "email": "leonardo@ibm.com",
          "accountStatus": "inactive"
        };
        recruiter.send(removedRecruiter)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Recruiter was successfully removed/);
              done();
            }
          });
      });
    });

    describe('with an invalid recruiter object sent', function() {
      it('with an empty object, should not remove the recruiter and return a 404 status code', function (done) {
        recruiter.send({})
          .expect('Content-Type', /json/)
          .expect(404, done);
      });

      it('with invalid attributes should not remove the recruiter because of validation error and return a 400 status code', function (done) {
        var removedRecruiter = {
          "email": "sergio@ibm.com",
          "companyName": "EVERTEC",
          "firstName": "576",
          "lastName": "asf",
          "phoneNumber": "787-888-5555",
          "accountStatus": "pending"
        };
        recruiter.send(removedRecruiter)
          .expect('Content-Type', /json/)
          .expect(401)
          .end(function(err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Unauthorized/);
              done();
            }
          });
      });

      it('with invalid email should not remove the recruiter because of 404 status code', function (done) {
        var removedRecruiter = {
          "email": "zzzz@us.ibm.com",
          "accountStatus": "inactive"
        };
        recruiter.send(removedRecruiter)
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

  describe('Get all company locations for a given company', function() {

    before(function (done) {
      this.session = new Session();
      this.session.post('/api/login')
        .send({
          "email": "sergio@ibm.com",
          "password": "1q@W#e"
        }).expect(200)
        .end(help.isBodyEqual({
          "email": "sergio@ibm.com",
          "companyName": "IBM",
          "companyLocationId": 1,
          "firstName": "Sergio",
          "lastName": "Rivera",
          "phoneNumber": "787-555-5555",
          "authType": "recruiter"
        }, done));
    });

    after(function () {
      this.session.destroy();
    });

    it('should find all company locations for IBM and return a 200 status code', function(done) {
      this.session
        .get('/api/companies/IBM/companyLocations')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([
          {
            "id": 1,
            "companyName": "IBM",
            "streetAddress": "3039 E Cornwallis Road",
            "city": "Durham",
            "state": "NC",
            "country": "United States",
            "zipCode": "27709",
            "phoneNumber": null
          },
          {
            "id": 2,
            "companyName": "IBM",
            "streetAddress": "1 New Orchard Road",
            "city": "Armonk",
            "state": "NY",
            "country": "United States",
            "zipCode": "10504",
            "phoneNumber": null
          }
        ], done));
    });
  });

  describe('Get a company location given its company and location ID', function() {

    before(function (done) {
      this.session = new Session();
      this.session.post('/api/login')
        .send({
          "email": "sergio@ibm.com",
          "password": "1q@W#e"
        }).expect(200)
        .end(help.isBodyEqual({
          "email": "sergio@ibm.com",
          "companyName": "IBM",
          "companyLocationId": 1,
          "firstName": "Sergio",
          "lastName": "Rivera",
          "phoneNumber": "787-555-5555",
          "authType": "recruiter"
        }, done));
    });

    after(function () {
      this.session.destroy();
    });

    it('should find an IBM company location with ID 1', function(done) {
      this.session
        .get('/api/companies/IBM/companyLocations/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "id": 1,
          "companyName": "IBM",
          "streetAddress": "3039 E Cornwallis Road",
          "city": "Durham",
          "state": "NC",
          "country": "United States",
          "zipCode": "27709",
          "phoneNumber": null
        }, done));
    });

    it('should return 404 for a company location not found for IBM', function(done) {
      this.session
        .get('/api/companies/IBM/companyLocations/6')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
  });

  describe('Update company location for a given company', function() {

    before(function (done) {
      this.session = new Session();
      this.session.post('/api/login')
        .send({
          "email": "sergio@ibm.com",
          "password": "1q@W#e"
        }).expect(200)
        .end(help.isBodyEqual({
          "email": "sergio@ibm.com",
          "companyName": "IBM",
          "companyLocationId": 1,
          "firstName": "Sergio",
          "lastName": "Rivera",
          "phoneNumber": "787-555-5555",
          "authType": "recruiter"
        }, done));
    });

    after(function () {
      this.session.destroy();
    });

    var companyLocation = null;
    beforeEach(function() {
      companyLocation = this.session.put('/api/companies/IBM/companyLocations/1');
    });

    describe('with a valid company location object sent', function() {
      it('should update the company street address, city, states, among other things but not the company name', function (done) {
        var updatedCompanyLocation = {
          "companyName": "RECsfd",
          "streetAddress": "La Calle",
          "city": "San Juan",
          "state": "PR",
          "country": "Puerto Rico",
          "zipCode": "27709",
          "phoneNumber": "787-555-5555"
        };
        companyLocation.send(updatedCompanyLocation)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Company Location Successfully Updated/);
              done();
            }
          });
      });
    });

    describe('with an invalid company location object sent', function() {
      it('should not update the company location and return a 500 status code', function (done) {
        companyLocation.send({})
          .expect('Content-Type', /json/)
          .expect(500, done);
      });

      it('should not update the company location because of validation error and return a 400 status code', function (done) {
        var updatedCompanyLocation = {
          "companyName": "RECsfd",
          "streetAddress": "4545",
          "city": "San Juan",
          "state": "PR",
          "country": "454545",
          "zipCode": "27709",
          "phoneNumber": "787-555-5555"
        };
        companyLocation.send(updatedCompanyLocation)
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
    });
  });

  /**
   * Company Promotional Material Tests
   */

  describe('Get all pending promotional material', function() {

    before(function (done) {
      this.session = new Session();
      this.session.post('/api/login')
        .send({
          "email": "sergio@ibm.com",
          "password": "1q@W#e"
        }).expect(200)
        .end(help.isBodyEqual({
          "email": "sergio@ibm.com",
          "companyName": "IBM",
          "companyLocationId": 1,
          "firstName": "Sergio",
          "lastName": "Rivera",
          "phoneNumber": "787-555-5555",
          "authType": "recruiter"
        }, done));
    });

    after(function () {
      this.session.destroy();
    });

    it('should find all pending company promotional material and return a 200 status code', function(done) {
      this.session
        .get('/api/companies/IBM/promotionalMaterial?status=pending')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) {
            done(err);
          } else {
            expect(res.body[0].id).to.match(/2/);
            expect(res.body[0].companyName).to.match(/IBM/);
            expect(res.body[0].title).to.match(/Promotion2/);
            expect(res.body[0].status).to.match(/pending/);
            done();
          }
        });
    });
  });

  describe('Get all approved promotional material', function() {
    before(function (done) {
      this.session = new Session();
      this.session.post('/api/login')
        .send({
          "email": "sergio@ibm.com",
          "password": "1q@W#e"
        }).expect(200)
        .end(help.isBodyEqual({
          "email": "sergio@ibm.com",
          "companyName": "IBM",
          "companyLocationId": 1,
          "firstName": "Sergio",
          "lastName": "Rivera",
          "phoneNumber": "787-555-5555",
          "authType": "recruiter"
        }, done));
    });

    after(function () {
      this.session.destroy();
    });

    it('should find all approved company promotional material  and return a 200 status code', function(done) {
      this.session
        .get('/api/companies/IBM/promotionalMaterial?status=approved')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) {
            done(err);
          } else {
            expect(res.body[0].id).to.match(/1/);
            expect(res.body[0].companyName).to.match(/IBM/);
            expect(res.body[0].title).to.match(/Promotion1/);
            expect(res.body[0].status).to.match(/approved/);
            done();
          }
        });
    });
  });

  describe('Get all approved promotional material (again)', function() {
    before(function (done) {
      this.session = new Session();
      this.session.post('/api/login')
        .send({
          "email": "sergio@ibm.com",
          "password": "1q@W#e"
        }).expect(200)
        .end(help.isBodyEqual({
          "email": "sergio@ibm.com",
          "companyName": "IBM",
          "companyLocationId": 1,
          "firstName": "Sergio",
          "lastName": "Rivera",
          "phoneNumber": "787-555-5555",
          "authType": "recruiter"
        }, done));
    });

    after(function () {
      this.session.destroy();
    });

    it('should convert "rejected" to "approved" in the URL', function(done) {
      this.session
        .get('/api/companies/IBM/promotionalMaterial?status=rejected')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) {
            done(err);
          } else {
            expect(res.body[0].id).to.match(/1/);
            expect(res.body[0].companyName).to.match(/IBM/);
            expect(res.body[0].title).to.match(/Promotion1/);
            expect(res.body[0].status).to.match(/approved/);
            done();
          }
        });
    });
  });

  describe('Add a Company Promotional Material', function() {

    before(function (done) {
      this.session = new Session();
      this.session.post('/api/login')
        .send({
          "email": "sergio@ibm.com",
          "password": "1q@W#e"
        }).expect(200)
        .end(help.isBodyEqual({
          "email": "sergio@ibm.com",
          "companyName": "IBM",
          "companyLocationId": 1,
          "firstName": "Sergio",
          "lastName": "Rivera",
          "phoneNumber": "787-555-5555",
          "authType": "recruiter"
        }, done));
    });

    after(function () {
      this.session.destroy();
    });

    it('should add a promotional material for IBM and return a 201 status code', function(done) {
      this.session
        .post('/api/companies/IBM/promotionalMaterial')
        .send(
          {
            "companyName": "IBM",
            "title" : "doc1",
            "expirationDate": "2100-04-04",
            "filePath" : "testPath"
          }
        )
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function (err, res) {
          if(err) {
            done(err);
          } else {
            expect(res.body.id).to.match(/6/);
            expect(res.body.title).to.match(/doc1/);
            expect(res.body.companyName).to.match(/IBM/);
            expect(res.body.status).to.match(/pending/);
            done();
          }
        });
    });
  });

  describe('Modify a Company Promotional Material', function() {

    before(function (done) {
      this.session = new Session();
      this.session.post('/api/login')
        .send({
          "email": "sergio@ibm.com",
          "password": "1q@W#e"
        }).expect(200)
        .end(help.isBodyEqual({
          "email": "sergio@ibm.com",
          "companyName": "IBM",
          "companyLocationId": 1,
          "firstName": "Sergio",
          "lastName": "Rivera",
          "phoneNumber": "787-555-5555",
          "authType": "recruiter"
        }, done));
    });

    after(function () {
      this.session.destroy();
    });

    it('should modify an existing promotional material ' +
      'for IBM (given its ID) and return a 200 status code', function(done) {
      this.session
        .put('/api/companies/IBM/promotionalMaterial/3')
        .send(
          {
            "id": 3,
            "companyName": "IBM",
            "title": "new title",
            "filePath": "/lib/promotionalMaterial",
            "expirationDate": "2016-07-22T16:12:12.000Z",
            "status": "rejected"
          }
        )
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual(
          {
            "message": "Promotional Material Updated."
          } ,done));
    });
  });

  describe('Delete a Company Promotional Material', function() {

    before(function (done) {
      this.session = new Session();
      this.session.post('/api/login')
        .send({
          "email": "sergio@ibm.com",
          "password": "1q@W#e"
        }).expect(200)
        .end(help.isBodyEqual({
          "email": "sergio@ibm.com",
          "companyName": "IBM",
          "companyLocationId": 1,
          "firstName": "Sergio",
          "lastName": "Rivera",
          "phoneNumber": "787-555-5555",
          "authType": "recruiter"
        }, done));
    });

    after(function () {
      this.session.destroy();
    });

    it('should delete an existing promotional material ' +
      'for IBM (given its ID) and return a 200 status code', function(done) {
      this.session
        .del('/api/companies/IBM/promotionalMaterial/3')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual( {
          id: 3,
          companyName: 'IBM',
          title: 'new title',
          expirationDate: '2016-07-22T16:12:12.000Z',
          status: 'rejected',
          filePath: '/lib/promotionalMaterial'
        } ,done));
    });
  });

  describe('Add a lot of Company Promotional Material until reach a maximum of 5', function() {

    before(function (done) {
      this.session = new Session();
      this.session.post('/api/login')
        .send({
          "email": "sergio@ibm.com",
          "password": "1q@W#e"
        }).expect(200)
        .end(help.isBodyEqual({
          "email": "sergio@ibm.com",
          "companyName": "IBM",
          "companyLocationId": 1,
          "firstName": "Sergio",
          "lastName": "Rivera",
          "phoneNumber": "787-555-5555",
          "authType": "recruiter"
        }, done));
    });

    after(function () {
      this.session.destroy();
    });

    it('should add one promotional material and return a 201 status code', function(done) {
      this.session
        .post('/api/companies/IBM/promotionalMaterial')
        .send({
          "companyName": "IBM",
          "title": "doc1",
          "expirationDate": "2100-04-04",
          "filePath": "testPath"
        })
        .expect('Content-Type', /json/)
        .expect(201, done);
    });

    it('should add another promotional material and return a 201 status code', function(done) {
      this.session
        .post('/api/companies/IBM/promotionalMaterial')
        .send({
          "companyName": "IBM",
          "title" : "doc1",
          "expirationDate": "2100-04-04",
          "filePath" : "testPath"
        })
        .expect('Content-Type', /json/)
        .expect(201, done);
    });

    it('should get a message saying that the maximum amount of promotional material have reached return a 401 status code', function(done) {
      this.session
        .post('/api/companies/IBM/promotionalMaterial')
        .send({
          "companyName": "IBM",
          "title" : "doc1",
          "expirationDate": "2100-04-04",
          "filePath" : "testPath"
        })
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.body.message).to.match(/You have reached the maximum capacity to upload promotional material/);
            done();
          }
        });
    });
  });

  /**
   * Company Job Offers Tests
   */

  describe('Get all Approved Job Offers', function() {

    before(function (done) {
      this.session = new Session();
      this.session.post('/api/login')
        .send({
          "email": "sergio@ibm.com",
          "password": "1q@W#e"
        }).expect(200)
        .end(help.isBodyEqual({
          "email": "sergio@ibm.com",
          "companyName": "IBM",
          "companyLocationId": 1,
          "firstName": "Sergio",
          "lastName": "Rivera",
          "phoneNumber": "787-555-5555",
          "authType": "recruiter"
        }, done));
    });

    after(function () {
      this.session.destroy();
    });

    it('should find all approved job offers and return a 200 status code', function(done) {
      this.session
        .get('/api/companies/IBM/jobOffers?status=approved')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) {
            done(err);
          } else {
            expect(res.body[0].id).to.match(/1/);
            expect(res.body[0].companyName).to.match(/IBM/);
            expect(res.body[0].email).to.match(/sergio@ibm.com/);
            expect(res.body[0].title).to.match(/New Job Offer/);
            expect(res.body[0].jobOfferStatus).to.match(/approved/);
            done();
          }
        });
    });
  });

  describe('Get all Pending Job Offers', function() {

    before(function (done) {
      this.session = new Session();
      this.session.post('/api/login')
        .send({
          "email": "sergio@ibm.com",
          "password": "1q@W#e"
        }).expect(200)
        .end(help.isBodyEqual({
          "email": "sergio@ibm.com",
          "companyName": "IBM",
          "companyLocationId": 1,
          "firstName": "Sergio",
          "lastName": "Rivera",
          "phoneNumber": "787-555-5555",
          "authType": "recruiter"
        }, done));
    });

    after(function () {
      this.session.destroy();
    });

    it('should find all pending job offers and return a 200 status code', function(done) {
      this.session
        .get('/api/companies/IBM/jobOffers?status=pending')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) {
            done(err);
          } else {
            expect(res.body[0].id).to.match(/2/);
            expect(res.body[0].companyName).to.match(/IBM/);
            expect(res.body[0].email).to.match(/sergio@ibm.com/);
            expect(res.body[0].title).to.match(/Different Job Offer/);
            expect(res.body[0].jobOfferStatus).to.match(/pending/);
            done();
          }
        });
    });
  });

  describe('Get a specific Job Offer', function() {
    before(function (done) {
      this.session = new Session();
      this.session.post('/api/login')
        .send({
          "email": "sergio@ibm.com",
          "password": "1q@W#e"
        }).expect(200)
        .end(help.isBodyEqual({
          "email": "sergio@ibm.com",
          "companyName": "IBM",
          "companyLocationId": 1,
          "firstName": "Sergio",
          "lastName": "Rivera",
          "phoneNumber": "787-555-5555",
          "authType": "recruiter"
        }, done));
    });

    after(function () {
      this.session.destroy();
    });

    it('should find a job offers with its ID and return a 200 status code', function(done) {
      this.session
        .get('/api/companies/IBM/jobOffers/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) {
            done(err);
          } else {
            expect(res.body.id).to.match(/1/);
            expect(res.body.companyName).to.match(/IBM/);
            expect(res.body.email).to.match(/sergio@ibm.com/);
            expect(res.body.title).to.match(/New Job Offer/);
            expect(res.body.jobOfferStatus).to.match(/approved/);
            done();
          }
        });
    });

    it('should get a not found message and return a 404 status code', function(done) {
      this.session
        .get('/api/companies/IBM/jobOffers/1234')
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function(err, res) {
          if(err) {
            done(err);
          } else {
            expect(res.body.message).to.match(/Job Offer not found/);
            done();
          }
        });
    });
  });

  describe('Create a new job offer for IBM', function() {

    before(function (done) {
      this.session = new Session();
      this.session.post('/api/login')
        .send({
          "email": "sergio@ibm.com",
          "password": "1q@W#e"
        }).expect(200)
        .end(help.isBodyEqual({
          "email": "sergio@ibm.com",
          "companyName": "IBM",
          "companyLocationId": 1,
          "firstName": "Sergio",
          "lastName": "Rivera",
          "phoneNumber": "787-555-5555",
          "authType": "recruiter"
        }, done));
    });

    after(function () {
      this.session.destroy();
    });

    var jobOffer = null;
    beforeEach(function () {
      jobOffer = this.session.post('/api/companies/IBM/jobOffers');
    });

    describe('with a valid job offer object sent', function () {

      it('should create the job offer and return a 201 status code', function (done) {
        var newJobOffer = {
          "id": 1,
          "companyName": "IBM",
          "email": "sergio@ibm.com",
          "title": "Another Job Offer",
          "description": "This is a job offer",
          "jobPosition": "Part-Time",
          "educationLevel": "Bachelors",
          "recentGraduate": false,
          "creationDate": "2016-02-22 16:12:12",
          "expirationDate": "2030-07-22 16:12:12",
          "announcementNumber": null,
          "flyerPath": null,
          "jobOfferStatus": "approved",
          "location": "Durham, NC"
        };
        jobOffer.send(newJobOffer)
          .expect('Content-Type', /json/)
          .expect(201)
          .end(help.isBodyEqual({
            "jobOfferStatus": "pending",
            "id": 6,
            "companyName": "IBM",
            "email": "sergio@ibm.com",
            "title": "Another Job Offer",
            "description": "This is a job offer",
            "jobPosition": "Part-Time",
            "educationLevel": "Bachelors",
            "recentGraduate": false,
            "expirationDate": "2030-07-22T20:12:12.000Z",
            "announcementNumber": null,
            "flyerPath": null,
            "location": "Durham, NC"
          }, done));
      });
    });

    describe('with an invalid job offer object sent', function () {

      it('should not create the job offer and return a 404 status code if recruiter email is not found', function (done) {
        var newJoboffer = {
          "id": 1,
          "companyName": "IBM",
          "email": "seo@ibm.com",
          "title": "Another Job Offer",
          "description": "This is a job offer",
          "jobPosition": "Part-Time",
          "educationLevel": "Bachelors",
          "recentGraduate": false,
          "creationDate": "2016-02-22 16:12:12",
          "expirationDate": "2016-07-22 16:12:12",
          "announcementNumber": null,
          "flyerPath": null,
          "jobOfferStatus": "approved",
          "location": "Durham, NC"
        };
        jobOffer.send(newJoboffer)
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

  describe('Disable a job offer for IBM', function() {

    before(function (done) {
      this.session = new Session();
      this.session.post('/api/login')
        .send({
          "email": "sergio@ibm.com",
          "password": "1q@W#e"
        }).expect(200)
        .end(help.isBodyEqual({
          "email": "sergio@ibm.com",
          "companyName": "IBM",
          "companyLocationId": 1,
          "firstName": "Sergio",
          "lastName": "Rivera",
          "phoneNumber": "787-555-5555",
          "authType": "recruiter"
        }, done));
    });

    after(function () {
      this.session.destroy();
    });

    var jobOffer = null;
    beforeEach(function () {
      jobOffer = this.session.put('/api/companies/IBM/jobOffers/6');
    });

    describe('with a valid job offer object sent', function () {

      it('should disable the job offer and return a 200 status code', function (done) {
        var disableJobOffer = {
          "jobOfferStatus": "rejected"
        };
        jobOffer.send(disableJobOffer)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Job Offer was successfully removed/);
              done();
            }
          });
      });

      it('should not disable a job offer that has been disabled and return a 404 status code', function (done) {
        var disableJobOffer = {
          "jobOfferStatus": "rejected"
        };
        jobOffer.send(disableJobOffer)
          .expect('Content-Type', /json/)
          .expect(404)
          .end(function(err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Job Offer not found/);
              done();
            }
          });
      });
    });

  });

  describe('Get all interested majors from a specific company', function() {

    before(function (done) {
      this.session = new Session();
      this.session.post('/api/login')
        .send({
          "email": "sergio@ibm.com",
          "password": "1q@W#e"
        }).expect(200)
        .end(help.isBodyEqual({
          "email": "sergio@ibm.com",
          "companyName": "IBM",
          "companyLocationId": 1,
          "firstName": "Sergio",
          "lastName": "Rivera",
          "phoneNumber": "787-555-5555",
          "authType": "recruiter"
        }, done));
    });

    after(function () {
      this.session.destroy();
    });

    it('should find all interested majors given IBM as company and return a 200 status code', function(done) {
      this.session
        .get('/api/companies/IBM/companyInterestedMajors')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([
          {
            "id": 1,
            "companyName": "IBM",
            "majorCode": "ICOM"
          },
          {
            "id": 2,
            "companyName": "IBM",
            "majorCode": "CCOM"
          },
          {
            "id": 3,
            "companyName": "IBM",
            "majorCode": "INSO"
          }
        ], done));
    });
  });

  describe('Add a new interested major', function() {

    before(function (done) {
      this.session = new Session();
      this.session.post('/api/login')
        .send({
          "email": "sergio@ibm.com",
          "password": "1q@W#e"
        }).expect(200)
        .end(help.isBodyEqual({
          "email": "sergio@ibm.com",
          "companyName": "IBM",
          "companyLocationId": 1,
          "firstName": "Sergio",
          "lastName": "Rivera",
          "phoneNumber": "787-555-5555",
          "authType": "recruiter"
        }, done));
    });

    after(function () {
      this.session.destroy();
    });

    var interestedMajor = null;
    beforeEach(function () {
      interestedMajor = this.session.post('/api/companies/IBM/companyInterestedMajors');
    });

    describe('with a valid object sent', function () {

      it('should add the interested major to the company and return a 201 status code', function (done) {
        var newInterestedMajor = {
          "interestedMajors": [
            {
              "id": 1,
              "companyName": "IBM",
              "majorCode": "ESPA"
            }
          ]
        };
        interestedMajor.send(newInterestedMajor)
          .expect('Content-Type', /json/)
          .expect(201)
          .end(help.isBodyEqual([{
            "id": 6,
            "companyName": "IBM",
            "majorCode": "ESPA"
          }], done));
      });
    });

    describe('with an invalid object sent', function () {

      it('should not add the interested major and return a 404 status code if the major is not found', function (done) {
        var newInterestedMajor = {
          "interestedMajors": [
            {
              "id": 1,
              "companyName": "IBM",
              "majorCode": "ZZZZ"
            }
          ]
        };
        interestedMajor.send(newInterestedMajor)
          .expect('Content-Type', /json/)
          .expect(404)
          .end(function(err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Major not found/);
              done();
            }
          });
      });
    });
  });

  describe('Remove a company interested major', function() {
    before(function (done) {
      this.session = new Session();
      this.session.post('/api/login')
        .send({
          "email": "sergio@ibm.com",
          "password": "1q@W#e"
        }).expect(200)
        .end(help.isBodyEqual({
          "email": "sergio@ibm.com",
          "companyName": "IBM",
          "companyLocationId": 1,
          "firstName": "Sergio",
          "lastName": "Rivera",
          "phoneNumber": "787-555-5555",
          "authType": "recruiter"
        }, done));
    });

    after(function () {
      this.session.destroy();
    });

    it('should remove an existing company interested major for IBM (given its ID) and return a 200 status code', function(done) {
      var removeInterestedMajor = {
        "interestedMajors": [
          {
            "id": 1,
            "companyName": "IBM",
            "majorCode": "ESPA"
          }
        ]
      };
      this.session
        .put('/api/companies/IBM/companyInterestedMajors')
        .send(removeInterestedMajor)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([{
          "id": 6,
          "companyName": "IBM",
          "majorCode": "ESPA"
        }] ,done));
    });
  });


  describe('Get all positions a company is looking for', function() {

    before(function (done) {
      this.session = new Session();
      this.session.post('/api/login')
        .send({
          "email": "pepe@apple.com",
          "password": "1q@W#e"
        }).expect(200)
        .end(help.isBodyEqual({
          "email": "pepe@apple.com",
          "companyName": "Apple",
          "companyLocationId": 3,
          "firstName": "Pepe",
          "lastName": "Tembleque",
          "phoneNumber": "787-555-5555",
          "authType": "recruiter"
        }, done));
    });

    after(function () {
      this.session.destroy();
    });

    it('should find all positions Apple is looking for and return a 200 status code', function(done) {
      this.session
        .get('/api/companies/Apple/companyLookingFor')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([
          {
            "companyName": "Apple",
            "jobPosition": "Internship",
            "status": true
          },
          {
            "companyName": "Apple",
            "jobPosition": "Full-Time",
            "status": true
          }
        ], done));
    });
  });

  describe('Add a position to look for', function() {

    before(function (done) {
      this.session = new Session();
      this.session.post('/api/login')
        .send({
          "email": "pepe@apple.com",
          "password": "1q@W#e"
        }).expect(200)
        .end(help.isBodyEqual({
          "email": "pepe@apple.com",
          "companyName": "Apple",
          "companyLocationId": 3,
          "firstName": "Pepe",
          "lastName": "Tembleque",
          "phoneNumber": "787-555-5555",
          "authType": "recruiter"
        }, done));
    });

    after(function () {
      this.session.destroy();
    });

    var positionLookingFor = null;
    beforeEach(function () {
      positionLookingFor = this.session.post('/api/companies/Apple/companyLookingFor');
    });

    describe('with a valid object sent', function () {

      it('should add the new positions or update positions already exists in the company and return a 200 status code', function (done) {
        var newPositionLookingFor = {
          "companyPositions": [
            {
              "companyName": "Apple",
              "jobPosition": "Internship",
              "status": false
            },
            {
              "companyName": "Apple",
              "jobPosition": "Full-Time",
              "status": false
            },
            {
              "companyName": "Apple",
              "jobPosition": "CO-OP",
              "status": true
            },
            {
              "companyName": "Apple",
              "jobPosition": "Part-Time",
              "status": false
            }
          ]
        };
        positionLookingFor.send(newPositionLookingFor)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Change successful/);
              done();
            }
          });
      });
    });

    describe('with an invalid object sent', function () {

      it('should not add the new position to look for and return a 400 status code because of validation error', function (done) {
        var newPositionLookingFor = {
          "companyPositions": [
            {
              "companyName": "Apple",
              "jobPosition": "",
              "status": false
            },
            {
              "companyName": "Apple",
              "jobPosition": "Full-Time",
              "status": false
            },
            {
              "companyName": "Apple",
              "jobPosition": "CO-OP",
              "status": true
            },
            {
              "companyName": "Apple",
              "jobPosition": "Part-Time",
              "status": false
            }
          ]
        };
        positionLookingFor.send(newPositionLookingFor)
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
    });
  });

});
