'use strict';

var passport = require('passport'),
  authType = require('../authType'),
  Administrator = require('../models').administrators,
  Recruiter = require('../models').recruiters,
  LocalStrategy = require('passport-local').Strategy;

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
    Administrator.find({where: {email: serializedUser.email}}).then(function (user) {
      authType.assignAdmin(user);
      done(null, user);
    }, done);
  } else {
    Recruiter.find({where: {email: serializedUser.email}}).then(function (user) {
      authType.assignRecruiter(user);
      done(null, user);
    }, done);
  }

});

passport.use('local-admin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  },
  function (email, password, done) {

    Administrator.find({where: {email: email}}).then(function (admin) {
      if (admin) {

        admin.verifyPassword(password).then(function (isEqual) {
          if (isEqual) {
            var adminJson = admin.getJSON();
            authType.assignAdmin(adminJson);
            done(null, adminJson);
          } else {
            done(null, false, 'Incorrect password');
          }

        }).error(done);

      } else {
        done(null, false, 'Email is not registered');
      }

    }, done);
  }
));

passport.use('local-recruiter', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  },
  function (email, password, done) {

    Recruiter.find({where: {email: email}}).then(function (recruiter) {
      if (recruiter) {

        recruiter.verifyPassword(password).then(function (isEqual) {
          if (isEqual) {
            var recruiterJson = recruiter.getJSON();
            authType.assignRecruiter(recruiterJson);
            done(null, recruiterJson);
          } else {
            done(null, false, 'Incorrect password');
          }

        }).error(done);

      } else {
        done(null, false, 'Email is not registered');
      }

    }, done);
  }
));

module.exports = passport;
