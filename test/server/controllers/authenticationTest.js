'use strict';

var request = require('supertest'),
  expect = require('chai').expect,
  help = require('../help.js'),
  app = require('../../../server');

var Session = require('supertest-session')({
  app: app
});

describe('Authentication Controller: ', function() {

  describe('Admin login', function () {

    var login = null;
    beforeEach(function () {
      login = request(app).post('/api/login');
    });

    it('should login an active admin email placement@uprm.edu', function (done) {
      login.send({
        "email": "placement@uprm.edu",
        "password": "1q@W#e"
      }).expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "email": "placement@uprm.edu",
          "firstName": "Placement",
          "lastName": "Office",
          "authType": "admin"
        }, done));
    });

    it('should respond with 401 when admin does not have access to login', function (done) {
      login.send({
        email: 'mark@gmail.com',
        password: 'pass'
      }).expect(401)
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.body.message).to.match(/Email is not registered/);
            done();
          }
        });
    });

    it('should respond with a when an incorrect password is sent 401', function (done) {
      login.send({
        "email": "juan.rodriguez@upr.edu",
        "password": "password"
      }).expect('Content-Type', /json/)
        .expect(401)
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.body.message).to.match(/Incorrect password/);
            done();
          }
        });
    });

    it('should respond with a 401 when an empty body is sent', function (done) {
      login.send().expect(401, done);
    });

    describe('needs to persist the session', function () {
      before(function (done) {
        this.session = new Session();
        this.session.post('/api/login')
          .send({
            email: 'placement@uprm.edu',
            password: '1q@W#e'
          }).expect(200, done);
      });

      after(function () {
        this.session.destroy();
      });

      it('should allow me to request myself after being logged in', function (done) {
        this.session.get('/api/administrators/me')
          .expect(200)
          .end(help.isBodyEqual({
            "email": "placement@uprm.edu",
            "firstName": "Placement",
            "lastName": "Office",
            "authType": "admin"
          }, done));
      });
    });
  });

  describe('logout', function () {
    describe('with an admin logged in', function () {
      beforeEach(function (done) {
        this.session = new Session();
        this.session.post('/api/login')
          .send({
            email: "placement@uprm.edu",
            password: "1q@W#e"
          }).expect(200, done);
      });

      afterEach(function () {
        this.session.destroy();
      });

      it('should destroy the session after log out', function (done) {
        var sess = this.session;
        this.session.post('/api/logout')
          .expect(200)
          .end(function (err) {
            if (err) {
              done(err);
            } else {
              sess.get('/api/administrators/me')
                .expect(401, done);
            }
          });
      });
    });
  });

  describe('Recruiter login', function () {

    var login = null;
    beforeEach(function () {
      login = request(app).post('/api/login');
    });

    it('should login an active recruiter with email sergio@ibm.com', function (done) {
      login.send({
        "email": "sergio@ibm.com",
        "password": "1q@W#e"
      }).expect('Content-Type', /json/)
        .expect(200)
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

    it('should respond with 401 when admin does not have access to login', function (done) {
      login.send({
        email: 'mark@gmail.com',
        password: 'pass'
      }).expect(401)
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.body.message).to.match(/Email is not registered/);
            done();
          }
        });
    });

    it('should respond with a when an incorrect password is sent 401', function (done) {
      login.send({
        "email": "sergio@ibm.com",
        "password": "password"
      }).expect('Content-Type', /json/)
        .expect(401)
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.body.message).to.match(/Incorrect password/);
            done();
          }
        });
    });

    it('should respond with a 401 when an empty body is sent', function (done) {
      login.send().expect(401, done);
    });

    describe('needs to persist the session', function () {
      before(function (done) {
        this.session = new Session();
        this.session.post('/api/login')
          .send({
            email: 'sergio@ibm.com',
            password: '1q@W#e'
          }).expect(200, done);
      });

      after(function () {
        this.session.destroy();
      });

      it('should allow me to request myself as recruiter after being logged in', function (done) {
        this.session.get('/api/recruiters/me')
          .expect(200)
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
    });
  });

  describe('Logout', function () {
    describe('with a recruiter logged in', function () {
      beforeEach(function (done) {
        this.session = new Session();
        this.session.post('/api/login')
          .send({
            email: "sergio@ibm.com",
            password: "1q@W#e"
          }).expect(200, done);
      });

      afterEach(function () {
        this.session.destroy();
      });

      it('should destroy the session after log out', function (done) {
        var sess = this.session;
        this.session.post('/api/logout')
          .expect(200)
          .end(function (err) {
            if (err) {
              done(err);
            } else {
              sess.get('/api/recruiters/me')
                .expect(401, done);
            }
          });
      });
    });
  });

  describe('Forgot password', function () {
    var forgot = null;
    beforeEach(function() {
      forgot = request(app).post('/api/forgot');
    });

    it('should allow a recruiter to enter the email address and receive a response back', function (done) {
      forgot.send({"email": "pepe@apple.com"})
        .expect(200)
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.body.message).to.match(/An e-mail has been sent to pepe@apple.com with further instructions/);
            done();
          }
        });
    });

    it('should not allow an invalid email address and a 404 status code back', function (done) {
      forgot.send({"email": "xzx@sdz.com"})
        .expect(404)
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.body.message).to.match(/No account found with that email address/);
            done();
          }
        });
    });
  });

});
