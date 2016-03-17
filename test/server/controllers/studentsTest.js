'use strict';

var request = require('supertest'),
  expect = require('chai').expect,
  help = require('../help.js'),
  app = require('../../../server');


describe('Students Controller: ', function() {

  describe('Get all job offers for students', function () {
    it('should find all active job offers and return a 200 status code', function (done) {
      request(app)
        .get('/api/students/jobOffers')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([
          {
            "id": 1,
            "companyName": "IBM",
            "title": "New Job Offer",
            "description": "This is a job offer",
            "jobPosition": "Full-Time",
            "educationLevel": "Bachelors",
            "recentGraduate": true,
            "expirationDate": "2016-07-22T16:12:12.000Z",
            "announcementNumber": null,
            "flyerPath": null,
            "location": "Durham, NC"
          },
          {
            "id": 4,
            "companyName": "Apple",
            "title": "Apple Job Offer",
            "description": "This is a job offer",
            "jobPosition": "Full-Time",
            "educationLevel": "Bachelors",
            "recentGraduate": true,
            "expirationDate": "2016-07-22T16:12:12.000Z",
            "announcementNumber": null,
            "flyerPath": null,
            "location": "Cupertino, CA"
          },
          {
            "id": 5,
            "companyName": "Apple",
            "title": "Apple Different Job Offer",
            "description": "This is a job offer",
            "jobPosition": "Part-Time",
            "educationLevel": "Bachelors",
            "recentGraduate": true,
            "expirationDate": "2016-07-22T16:12:12.000Z",
            "announcementNumber": null,
            "flyerPath": null,
            "location": "Cupertino, CA"
          }
        ], done));
    });
  });

  describe('Get a job offer given its ID', function () {
    it('should find a job offer with a job offer Id of 1', function (done) {
      request(app)
        .get('/api/students/jobOffers/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "id": 1,
          "companyName": "IBM",
          "title": "New Job Offer",
          "description": "This is a job offer",
          "jobPosition": "Full-Time",
          "educationLevel": "Bachelors",
          "recentGraduate": true,
          "expirationDate": "2016-07-22T16:12:12.000Z",
          "announcementNumber": null,
          "flyerPath": null,
          "location": "Durham, NC"
        }, done));
    });

    it('should return 404 for a job offer not found', function (done) {
      request(app)
        .get('/api/students/jobOffers/1234')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
  });

  describe('Get job fair information for students', function () {
    it('should find the companies attending job fair and additional information, and return a 200 status code', function (done) {
      request(app)
        .get('/api/students/jobFair')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([
          {
            "companyName": "Apple",
            "minGpa": 3.4,
            "extraInformation": "This is Apple attending the Job Fair",
            "collectingResumesBeforeJobFair": true,
            "mustFillOnline": false,
            "interviewsDuringWeekend": true,
            "websiteApplication": "http://www.apple.com/jobs/us/",
            "lookingFor": [
              {
                "companyName": "Apple",
                "jobPosition": "Internship"
              },
              {
                "companyName": "Apple",
                "jobPosition": "Full-Time"
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
            "minGpa": 3.3,
            "extraInformation": "This is a company attending the Job Fair",
            "collectingResumesBeforeJobFair": true,
            "mustFillOnline": false,
            "interviewsDuringWeekend": true,
            "websiteApplication": "http://www-03.ibm.com/employment/us/",
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
      request(app)
        .get('/api/students/companies')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([
          {
            "name": "Apple",
            "websiteUrl": "http://www.apple.com/",
            "logoPath": null,
            "companyDescription": "This is Apple",
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
      request(app)
        .get('/api/students/companies/Apple')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "name": "Apple",
          "websiteUrl": "http://www.apple.com/",
          "logoPath": null,
          "companyDescription": "This is Apple",
          "companyStatus": "active"
        }, done));
    });

    it('should return 404 for a company not found', function (done) {
      request(app)
        .get('/api/students/companies/Zzzzz')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
  });

  describe('Get all job offers from a specific company for students', function () {
    it('should find all active job offers from a company and return a 200 status code', function (done) {
      request(app)
        .get('/api/students/companies/Apple/jobOffers')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([
          {
            "id": 4,
            "companyName": "Apple",
            "title": "Apple Job Offer",
            "description": "This is a job offer",
            "jobPosition": "Full-Time",
            "educationLevel": "Bachelors",
            "recentGraduate": true,
            "expirationDate": "2016-07-22T16:12:12.000Z",
            "announcementNumber": null,
            "flyerPath": null,
            "location": "Cupertino, CA"
          },
          {
            "id": 5,
            "companyName": "Apple",
            "title": "Apple Different Job Offer",
            "description": "This is a job offer",
            "jobPosition": "Part-Time",
            "educationLevel": "Bachelors",
            "recentGraduate": true,
            "expirationDate": "2016-07-22T16:12:12.000Z",
            "announcementNumber": null,
            "flyerPath": null,
            "location": "Cupertino, CA"
          }
        ], done));
    });
  });

  describe('Get a job offer from a company given its job offer ID', function () {
    it('should find a job offer from a company with a job offer Id of 4', function (done) {
      request(app)
        .get('/api/students/companies/Apple/jobOffers/4')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "id": 4,
          "companyName": "Apple",
          "title": "Apple Job Offer",
          "description": "This is a job offer",
          "jobPosition": "Full-Time",
          "educationLevel": "Bachelors",
          "recentGraduate": true,
          "expirationDate": "2016-07-22T16:12:12.000Z",
          "announcementNumber": null,
          "flyerPath": null,
          "location": "Cupertino, CA"
        }, done));
    });

    it('should return 404 for a job offer not found', function (done) {
      request(app)
        .get('/api/students/companies/Apple/jobOffers/1234')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
  });

  describe('Get all promo materials from a company for students', function () {
    it('should find all active promo materials from a company and return a 200 status code', function (done) {
      request(app)
        .get('/api/students/companies/IBM/promotionalMaterial')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual([
          {
            "id": 1,
            "companyName": "IBM",
            "title": "Promotion1",
            "filePath": "/lib/promotionalMaterial",
            "expirationDate": "2016-07-22T16:12:12.000Z"
          }
        ], done));
    });
  });

  describe('Get a specific promo material given its ID', function () {
    it('should find a specific promo material with a promo Id of 1', function (done) {
      request(app)
        .get('/api/students/companies/IBM/promotionalMaterial/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "id": 1,
          "companyName": "IBM",
          "title": "Promotion1",
          "filePath": "/lib/promotionalMaterial",
          "expirationDate": "2016-07-22T16:12:12.000Z"
        }, done));
    });

    it('should return 404 for a job offer not found', function (done) {
      request(app)
        .get('/api/students/companies/IBM/promotionalMaterial/1234')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
  });

  describe('Get all company interested majors for students to see', function () {
    it('should find all company interested majors and return a 200 status code', function (done) {
      request(app)
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
