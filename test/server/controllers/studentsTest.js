'use strict';

var request = require('supertest'),
  expect = require('chai').expect,
  help = require('../help.js'),
  app = require('../../../server');

var Session = require('supertest-session')({
  app: app
});

describe('Students Controller: ', function() {

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

  describe('Get all job offers for students', function () {
    it('should find all active job offers and return a 200 status code', function (done) {
      this.session
        .get('/api/students/jobOffers')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) {
            done(err);
          } else {
            expect(res.body[0].id).to.match(/1/);
            expect(res.body[0].companyName).to.match(/IBM/);
            expect(res.body[0].title).to.match(/New Job Offer/);
            expect(res.body[0].jobPosition).to.match(/Full-Time/);
            expect(res.body[1].id).to.match(/4/);
            expect(res.body[1].companyName).to.match(/Apple/);
            expect(res.body[1].title).to.match(/Apple Job Offer/);
            expect(res.body[1].jobPosition).to.match(/Full-Time/);
            expect(res.body[2].id).to.match(/5/);
            expect(res.body[2].companyName).to.match(/Apple/);
            expect(res.body[2].title).to.match(/Apple Different Job Offer/);
            expect(res.body[2].jobPosition).to.match(/Part-Time/);
            done();
          }
        });
    });
  });

  describe('Get a job offer given its ID', function () {
    it('should find a job offer with a job offer Id of 1', function (done) {
      this.session
        .get('/api/students/jobOffers/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) {
            done(err);
          } else {
            expect(res.body.id).to.match(/1/);
            expect(res.body.companyName).to.match(/IBM/);
            expect(res.body.title).to.match(/New Job Offer/);
            expect(res.body.jobPosition).to.match(/Full-Time/);
            done();
          }
        });
    });

    it('should return 404 for a job offer not found', function (done) {
      this.session
        .get('/api/students/jobOffers/1234')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
  });

  describe('Get job fair information for students', function () {
    it('should find the companies attending job fair and additional information, and return a 200 status code', function (done) {
      this.session
        .get('/api/students/jobFair')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([
          {
            "companyName": "Apple",
            "minGpa": '3.40',
            "extraInformation": "This is Apple attending the Job Fair",
            "collectingResumesBeforeJobFair": true,
            "mustFillOnline": false,
            "interviewsDuringWeekend": true,
            "websiteApplication": "http://www.apple.com/jobs/us/",
            "lookingFor": [
              {
                "companyName": "Apple",
                "jobPosition": "CO-OP"
              }
            ],
            "interestedMajors": [
              {
                "companyName": "Apple",
                "majorCode": "ICOM"
              },
              {
                "companyName": "Apple",
                "majorCode": "CCOM"
              }
            ]
          },
          {
            "companyName": "IBM",
            "minGpa": '3.70',
            "extraInformation": "This is IBM attending the Job Fair",
            "collectingResumesBeforeJobFair": true,
            "mustFillOnline": false,
            "interviewsDuringWeekend": false,
            "websiteApplication": "IBM.COM",
            "lookingFor": [
              {
                "companyName": "IBM",
                "jobPosition": "Internship"
              },
              {
                "companyName": "IBM",
                "jobPosition": "Full-Time"
              }
            ],
            "interestedMajors": [
              {
                "companyName": "IBM",
                "majorCode": "ICOM"
              },
              {
                "companyName": "IBM",
                "majorCode": "CCOM"
              },
              {
                "companyName": "IBM",
                "majorCode": "INSO"
              }
            ]
          }
        ], done));
    });
  });

  describe('Get all active companies for students', function () {
    it('should find all active companies and return a 200 status code', function (done) {
      this.session
        .get('/api/students/companies')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([
          {
            "name": "Apple",
            "websiteUrl": "http://www.apple.com/",
            "logoPath": null,
            "companyDescription": "This is Apple a good company",
            "companyStatus": "active"
          },
          {
            "name": "IBM",
            "websiteUrl": "http://www.ibm.com/us-en/",
            "logoPath": null,
            "companyDescription": "This is IBM",
            "companyStatus": "active"
          }
        ], done));
    });
  });

  describe('Get a company given its name', function () {
    it('should find a company with a company name of Apple', function (done) {
      this.session
        .get('/api/students/companies/Apple')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "name": "Apple",
          "websiteUrl": "http://www.apple.com/",
          "logoPath": null,
          "companyDescription": "This is Apple a good company",
          "companyStatus": "active"
        }, done));
    });

    it('should return 404 for a company not found', function (done) {
      this.session
        .get('/api/students/companies/Zzzzz')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
  });

  describe('Get all job offers from a specific company for students', function () {
    it('should find all active job offers from a company and return a 200 status code', function (done) {
      this.session
        .get('/api/students/companies/Apple/jobOffers')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) {
            done(err);
          } else {
            expect(res.body[0].id).to.match(/4/);
            expect(res.body[0].companyName).to.match(/Apple/);
            expect(res.body[0].title).to.match(/Apple Job Offer/);
            expect(res.body[0].jobPosition).to.match(/Full-Time/);
            expect(res.body[1].id).to.match(/5/);
            expect(res.body[1].companyName).to.match(/Apple/);
            expect(res.body[1].title).to.match(/Apple Different Job Offer/);
            expect(res.body[1].jobPosition).to.match(/Part-Time/);
            done();
          }
        });
    });
  });

  describe('Get a job offer from a company given its job offer ID', function () {
    it('should find a job offer from a company with a job offer Id of 4', function (done) {
      this.session
        .get('/api/students/companies/Apple/jobOffers/4')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) {
            done(err);
          } else {
            expect(res.body.id).to.match(/4/);
            expect(res.body.companyName).to.match(/Apple/);
            expect(res.body.title).to.match(/Apple Job Offer/);
            expect(res.body.jobPosition).to.match(/Full-Time/);
            done();
          }
        });
    });

    it('should return 404 for a job offer not found', function (done) {
      this.session
        .get('/api/students/companies/Apple/jobOffers/1234')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
  });

  describe('Get all promo materials from a company for students', function () {
    it('should find all active promo materials from a company and return a 200 status code', function (done) {
      this.session
        .get('/api/students/companies/IBM/promotionalMaterial')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) {
            done(err);
          } else {
            expect(res.body[0].id).to.match(/1/);
            expect(res.body[0].companyName).to.match(/IBM/);
            expect(res.body[0].title).to.match(/Promotion1/);
            done();
          }
        });
    });
  });

  describe('Get a specific promo material given its ID', function () {
    it('should find a specific promo material with a promo Id of 1', function (done) {
      this.session
        .get('/api/students/companies/IBM/promotionalMaterial/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) {
            done(err);
          } else {
            expect(res.body.id).to.match(/1/);
            expect(res.body.companyName).to.match(/IBM/);
            expect(res.body.title).to.match(/Promotion1/);
            done();
          }
        });
    });

    it('should return 404 for a job offer not found', function (done) {
      this.session
        .get('/api/students/companies/IBM/promotionalMaterial/1234')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
  });

  describe('Get all company interested majors for students to see', function () {
    it('should find all company interested majors and return a 200 status code', function (done) {
      this.session
        .get('/api/students/companies/IBM/interestedMajors')
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

});
