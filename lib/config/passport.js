'use strict';

var passport = require('passport'),
  authType = require('../authType'),
  Administrator = require('../models').administrators,
  AdministratorAccess = require('../models').administratorAccess,
  Recruiter = require('../models').recruiters,
  LocalStrategy = require('passport-local').Strategy;
var Promise = require('bluebird');
var request = require('request');

/**
 * Passport configuration
 */
passport.serializeUser(function (user, done) {
  var serializedUser = {
    email: user.email,
    authType: user.authType
  };

  done(null, serializedUser);
});

passport.deserializeUser(function (serializedUser, done) {
  if (authType.isAdmin(serializedUser)) {
    Administrator.find({where: {email: serializedUser.email}}).then(function (admin) {
      var adminJson = admin.getJSON();
      authType.assignAdmin(adminJson);
      done(null, adminJson);
    }, done);
  } else if (authType.isRecruiter(serializedUser)) {
    Recruiter.find({where: {email: serializedUser.email}}).then(function (recruiter) {
      var recruiterJson = recruiter.getJSON();
      authType.assignRecruiter(recruiterJson);
      done(null, recruiterJson);
    }, done);
  } else {
    var studentJson;
    request({
      uri: 'http://54.191.110.48:9000/api/companies/IBM/recruiters',
      method: 'POST',
      timeout: 300000,
      form: {
        email: 'sergio@ibm.com'
      }
    }, function(err, response, body) {
      if (err) {
        return done(null, false, 'An error has occurred');
      }
      if (response.statusCode === 200) {
        studentJson = JSON.parse(body);
        authType.assignStudent(studentJson);
        done(null, studentJson);
      } else if (response.statusCode === 401) {
        done(null, false, 'Not authorized');
      }
    }, done);
  }

});

/**
 * Create a strategy to authenticate an administrator or a recruiter.
 * NOTE: If the administrator has access (active), then it can login.
 * NOTE: If the recruiter is active, then it can login.
 */
passport.use('local-user', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  },
  function (email, password, done) {

    Promise.all([
      AdministratorAccess.find({
        where: {
          email: email,
          adminAccountStatus: 'active'
        }
      }),
      Recruiter.find({
        where: {
          email: email,
          accountStatus: 'active'
        }
      })
    ]).then(function (results) {
      var adminAccess = results[0];
      var recruiter = results[1];

      if (recruiter) {

        recruiter.verifyPassword(password).then(function (isEqual) {
          if (isEqual) {
            var recruiterJson = recruiter.getJSON();
            authType.assignRecruiter(recruiterJson);
            done(null, recruiterJson);
          } else {
            done(null, false, 'Incorrect password');
          }

        }).catch(done);

      } else if (adminAccess) {

        Administrator.find({where: {email: email}}).then(function(admin) {
          admin.verifyPassword(password).then(function (isEqual) {
            if (isEqual) {
              var adminJson = admin.getJSON();
              authType.assignAdmin(adminJson);
              done(null, adminJson);
            } else {
              done(null, false, 'Incorrect password');
            }

          }).catch(done);
        });

      } else {
        done(null, false, 'Email is not registered');
      }
    }, done);

  }
));

passport.use('local-student', new LocalStrategy({
    usernameField: 'user',
    passwordField: 'keypass' // this is the virtual field on the model
  },
  function (user, keypass, done) {

    if (user === 'student' && user === keypass) {
      var studentJson;
      request({
        uri: 'http://54.191.110.48:9000/api/companies/IBM/recruiters',
        method: 'POST',
        timeout: 300000,
        form: {
          email: 'sergio@ibm.com'
        }
      }, function(err, response, body) {
        if (err) {
          return done(null, false, 'An error has occurred');
        }
        if (response.statusCode === 200) {
          studentJson = JSON.parse(body);
          authType.assignStudent(studentJson);
          done(null, studentJson);
        } else if (response.statusCode === 401) {
          done(null, false, 'Not authorized');
        }
      }, done);
    } else {
      done(null, false, 'Not authorized');
    }
  }
));

module.exports = passport;
