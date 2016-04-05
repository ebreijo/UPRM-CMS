'use strict';

var request = require('supertest'),
    expect = require('chai').expect,
    help = require('../help.js'),
    app = require('../../../server');


describe('Majors Controller: ', function() {

  describe('Get a major', function() {
    it('should find a major with a majorCode ICOM', function(done) {
      request(app)
        .get('/api/majors/ICOM')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "majorCode": "ICOM",
          "nameEnglish": "Computer Engineering",
          "nameSpanish": "Ingenieria en Computadoras"
        }, done));
    });

    it('should return 404 for a Major not found', function(done) {
      request(app)
        .get('/api/majors/ZZZZ')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
  });

  describe('Create a major', function() {
    var major = null;
    beforeEach(function() {
      major = request(app).post('/api/majors');
    });

    describe('with a valid major object sent', function() {

      it('should create a new major and return a 201 status code', function(done) {
        var newMajor = {
          "majorCode": "CISO",
          "nameEnglish": "Social Science",
          "nameSpanish": "Ciencias Sociales"
        };
        var expectedMajorCode = 'CISO';
        major.send(newMajor)
          .expect('Content-Type', /json/)
          .expect(201)
          .end(function(err) {
            if(err) {
              done(err);
            } else {
              request(app).get('/api/majors/' + expectedMajorCode)
                .expect(200, done);
            }
          });
      });

      it('should not create a Major with an existing MajorCode', function(done) {
        var newMajor = {
          "majorCode": "CCOM",
          "nameEnglish": "New Computer Science",
          "nameSpanish": "Nuevas Ciencias de Computos"
        };
        major.send(newMajor)
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

    describe('with an invalid major object sent', function() {

      it('with an empty body should send 400', function(done) {
        major.send({})
          .expect('Content-Type', /json/)
          .expect(400, done);
      });

      it('with invalid attributes should respond with 400 and a Validation Error message', function(done) {
        var newMajor = {
          "majorCode": "ZZZZ",
          "nameEnglish": "",
          "nameSpanish": "Zoo"
        };
        major.send(newMajor)
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

  describe('Update a major', function() {
    var major = null;
    describe('with a valid major object sent', function() {
      it('should update the majorCode and return a 200 status code', function (done) {
        major = request(app).put('/api/majors/CISO');
        var updatedMajor = {
          "majorCode": "COEN",
          "nameEnglish": "New CISO",
          "nameSpanish": "Nuevo CISO"
        };
        major.send(updatedMajor)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Major Successfully Updated./);
              done();
            }
          });
      });

      it('should not update the majorCode if that new major code already exists', function (done) {
        major = request(app).put('/api/majors/COEN');
        var updatedMajor = {
          "majorCode": "ININ",
          "nameEnglish": "New CISO",
          "nameSpanish": "Nuevo CISO"
        };
        major.send(updatedMajor)
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function (err, res) {
            if(err) {
              done(err);
            } else {
              expect(res.body.message).to.match(/Major already exists/);
              done();
            }
          });
      });
    });
  });

  describe('Delete a major', function() {

    describe('with a valid majorCode sent', function() {
      it('should delete the major and return a 200 status code', function (done) {
        var majorDelete = 'COEN';
        request(app).del('/api/majors/' + majorDelete)
          .expect(200)
          .end(function (err) {
            if (err) {
              done(err);
            } else {
              request(app).get('/api/majors/' + majorDelete)
                .expect(404, done);
            }
          });
      });
    });
  });
});
