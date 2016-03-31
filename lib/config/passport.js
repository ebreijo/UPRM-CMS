'use strict';

var passport = require('passport'),
  authType = require('../authType'),
  Administrator = require('../models').administrators,
  AdministratorAccess = require('../models').administratorAccess,
  Recruiter = require('../models').recruiters,
  LocalStrategy = require('passport-local').Strategy;
var Promise = require('bluebird');

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
  } else {
    Recruiter.find({where: {email: serializedUser.email}}).then(function (recruiter) {
      var recruiterJson = recruiter.getJSON();
      authType.assignRecruiter(recruiterJson);
      done(null, recruiterJson);
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

module.exports = passport;
