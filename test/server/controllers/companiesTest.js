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
            "email": "sergio@ibm.com",
            "companyName": "IBM",
            "firstName": "Sergio",
            "lastName": "Rivera",
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
          .send({"email": "sergio@ibm.com"})
          .expect('Content-Type', /json/)
          .expect(200)
          .end(help.isBodyEqual({
            "email": "sergio@ibm.com",
            "companyName": "IBM",
            "firstName": "Sergio",
            "lastName": "Rivera",
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
          "email": "sergio@ibm.com",
          "companyName": "EVERTEC",
          "firstName": "Mariano",
          "lastName": "Costa",
          "phoneNumber": "787-888-5555"
        };
        recruiter.send(updatedRecruiter)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Update was successful/);
              done();
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
          "email": "sergio@ibm.com",
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

  describe('Get all company locations for a given company', function() {
    it('should find all company locations for IBM and return a 200 status code', function(done) {
      request(app)
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
    it('should find an IBM company location with ID 1', function(done) {
      request(app)
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
      request(app)
        .get('/api/companies/IBM/companyLocations/6')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
  });

  describe('Update company location for a given company', function() {

    var companyLocation = null;
    beforeEach(function() {
      companyLocation = request(app).put('/api/companies/IBM/companyLocations/1');
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
    it('should find all pending company promotional' +
      'material  and return a 200 status code', function(done) {
      request(app)
        .get('/api/companies/IBM/promotionalMaterial?status=pending')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([
          {
            id: 2,
            companyName: "IBM",
            title: "Promotion2",
            filePath: "/lib/promotionalMaterial",
            expirationDate: "2016-07-22T16:12:12.000Z",
            status: "pending"
          }
        ], done));
    });
  });

  describe('Get all approved promotional material', function() {
    it('should find all approved company promotional' +
      'material  and return a 200 status code', function(done) {
      request(app)
        .get('/api/companies/IBM/promotionalMaterial?status=approved')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([
          {
            id: 1,
            companyName: "IBM",
            title: "Promotion1",
            filePath: "/lib/promotionalMaterial",
            expirationDate: "2016-07-22T16:12:12.000Z",
            status: "approved"
          }
        ], done));
    });
  });

  describe('Get all approved promotional material (again)', function() {
    it('should convert "rejected" to "approved" in the URL', function(done) {
      request(app)
        .get('/api/companies/IBM/promotionalMaterial?status=rejected')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([
          {
            id: 1,
            companyName: "IBM",
            title: "Promotion1",
            filePath: "/lib/promotionalMaterial",
            expirationDate: "2016-07-22T16:12:12.000Z",
            status: "approved"
          }
        ], done));
    });
  });

  describe('Add a Company Promotional Material', function() {
    it('should add a promotional material for IBM and return a 201 status code', function(done) {
      request(app)
        .post('/api/companies/IBM/promotionalMaterial')
        .send(
          {
            "companyName": "IBM",
            "title" : "doc1",
            "filePath" : "testPath"
          }
        )
        .expect('Content-Type', /json/)
        .expect(201)
        .end(help.isBodyEqual({
          status: 'pending',
          id: 5,
          companyName: 'IBM',
          title: 'doc1',
          filePath: 'testPath'
        }, done));
    });
  });

  describe('Modify a Company Promotional Material', function() {
    it('should modify an existing promotional material ' +
      'for IBM (given its ID) and return a 200 status code', function(done) {
      request(app)
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
    it('should delete an existing promotional material ' +
      'for IBM (given its ID) and return a 200 status code', function(done) {
      request(app)
        .del('/api/companies/IBM/promotionalMaterial/3')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual( {
          id: 3,
          companyName: 'IBM',
          title: 'new title',
          filePath: '/lib/promotionalMaterial',
          expirationDate: '2016-07-22T16:12:12.000Z',
          status: 'rejected'
        } ,done));
    });
  });

  /**
   * Company Job Offers Tests
   */

  describe('Get all Approved Job Offers', function() {
    it('should find all approved job offers and return a 200 status code', function(done) {
      request(app)
        .get('/api/companies/IBM/jobOffers?status=approved')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([
          {
            id: 1,
            companyName: 'IBM',
            email: 'sergio@ibm.com',
            title: 'New Job Offer',
            description: 'This is a job offer',
            jobPosition: 'Full-Time',
            educationLevel: 'Bachelors',
            recentGraduate: true,
            creationDate: '2016-02-22T16:12:12.000Z',
            expirationDate: '2016-07-22T16:12:12.000Z',
            announcementNumber: null,
            flyerPath: null,
            jobOfferStatus: 'approved',
            location: 'Durham, NC'
          } ], done));
    });
  });

  describe('Get all Pending Job Offers', function() {
    it('should find all pending job offers and return a 200 status code', function(done) {
      request(app)
        .get('/api/companies/IBM/jobOffers?status=pending')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([
          {
            id: 2,
            companyName: 'IBM',
            email: 'sergio@ibm.com',
            title: 'Different Job Offer',
            description: 'This is a job offer which is different',
            jobPosition: 'CO-OP',
            educationLevel: 'Bachelors',
            recentGraduate: false,
            creationDate: '2016-02-22T16:12:12.000Z',
            expirationDate: '2016-07-22T16:12:12.000Z',
            announcementNumber: null,
            flyerPath: null,
            jobOfferStatus: 'pending',
            location: 'Durham, NC'
          }], done));
    });
  });

  describe('Get a specific Job Offer', function() {
    it('should find a job offers with its ID and return a 200 status code', function(done) {
      request(app)
        .get('/api/companies/IBM/jobOffers/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          id: 1,
          companyName: 'IBM',
          email: 'sergio@ibm.com',
          title: 'New Job Offer',
          description: 'This is a job offer',
          jobPosition: 'Full-Time',
          educationLevel: 'Bachelors',
          recentGraduate: true,
          creationDate: '2016-02-22T16:12:12.000Z',
          expirationDate: '2016-07-22T16:12:12.000Z',
          announcementNumber: null,
          flyerPath: null,
          jobOfferStatus: 'approved',
          location: 'Durham, NC'
        }, done));
    });

    it('should get a not found message and return a 404 status code', function(done) {
      request(app)
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
    var adminAccess = null;
    beforeEach(function () {
      adminAccess = request(app).post('/api/companies/IBM/jobOffers');
    });

    describe('with a valid job offer object sent', function () {

      it('should create the job offer and return a 201 status code', function (done) {
        var newJoboffer = {
          "id": 1,
          "companyName": "IBM",
          "email": "sergio@ibm.com",
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
        adminAccess.send(newJoboffer)
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
            "expirationDate": "2016-07-22 16:12:12",
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
        adminAccess.send(newJoboffer)
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

});
