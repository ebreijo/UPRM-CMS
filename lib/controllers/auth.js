'use strict';

var passport = require('passport');
var errors = require('errors');
var db = require('../models');
var crypto = require('crypto');
var Sequelize = require('sequelize');
var Promise = require('bluebird');
var mailer = require('../mailer');
var _ = require('lodash');

var login = function(strategy) {
  return function (req, res, next) {
    passport.authenticate(strategy, function(err, user, info) {
      if(err) {
        next(new errors.Http500Error(err.message));
      } else if(info){
        next(new errors.Http401Error(info));
      } else {
        req.logIn(user, function(err) {
          if (err) {
            next(new errors.Http500Error(err.message));
          } else {
            res.json(req.user);
          }
        });
      }

    })(req, res, next);
  };
};

/**
 * Login
 */
exports.login = login('local-user');

exports.studentLogin = login('local-student');

exports.validateStudent = function(req, res) {

  console.log(req);
  res.json('Got it');

};

/**
 * Logout
 */
exports.logout = function (req, res) {
  req.logout();
  res.sendStatus(200);
};

/**
 * Forgot password for recruiters and administrators.
 * NOTE: Need to provide a valid and registered email address, then an email will be sent with further instructions.
 * NOTE: The email will contain a link to the reset password form.
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.forgot = function (req, res, next) {
  var token = null;

  return Promise.all([
    db.recruiters.findOne({
      where: {
        email: req.body.email,
        accountStatus: 'active'
      }
    }),
    db.administratorAccess.findOne({
      where: {
        email: req.body.email,
        adminAccountStatus: 'active'
      }
    })
  ]).then(function (results) {
    var recruiter = results[0];
    var administrator = results[1];

    if (recruiter) {
      token = crypto.randomBytes(20).toString('hex');
      db.passwordRecovery.findById(recruiter.email).then(function(data) {
        if (data) {
          return db.passwordRecovery.update({passwordRecoveryCode: token}, {
            where: {
              email: recruiter.email
            }
          });
        } else {
          return db.passwordRecovery.create({email: recruiter.email, passwordRecoveryCode: token, typeOfUser: 'recruiter'});
        }
      });
      mailer.sendResetPasswordEmail(req, recruiter, token);
      res.json({message: 'An e-mail has been sent to ' + recruiter.email + ' with further instructions'});
    } else if (administrator) {
      token = crypto.randomBytes(20).toString('hex');
      console.log(token);
      db.passwordRecovery.findById(administrator.email).then(function(data) {
        if (data) {
          return db.passwordRecovery.update({passwordRecoveryCode: token}, {
            where: {
              email: administrator.email
            }
          });
        } else {
          return db.passwordRecovery.create({email: administrator.email, passwordRecoveryCode: token, typeOfUser: 'admin'});
        }
      });
      mailer.sendResetPasswordEmail(req, administrator, token);
      res.json({message: 'An e-mail has been sent to ' + administrator.email + ' with further instructions'});
    } else {
      return Promise.reject(new errors.Http404Error('No account found with that email address'));
    }
  }).catch(Sequelize.ValidationError, function () {
    next(new errors.ValidationError('Validation Error: Please make sure all the fields are correct'));
  }).catch(Sequelize.DatabaseError, function (err) {
    next(new errors.DatabaseError(err.message));
  }).catch(Error, function (err) {
    next(err);
  });
};

/**
 * Reset the password with a new one provided by the user.
 * NOTE: Must be a valid password.
 * NOTE: The token/code passed as parameter of the request must match what is stored in
 *      the password recovery table.
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.reset = function (req, res, next) {
  var token = req.params.token;
  var typeUser = null;
  var email = req.body.email;
  var password = req.body.password;
  var passwordRegex = new RegExp(/^(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;'<>,.?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{6,40}$/);

  if (!passwordRegex.test(password)) {
    return next(new errors.Http400Error('Invalid password'));
  }

  db.passwordRecovery.findOne({
    where: {
      email: email
    }
  }).then(function (data) {
    if (data) {
      typeUser = data.typeOfUser;
      if(_.isEqual(data.passwordRecoveryCode, token)) {
        if (typeUser === 'recruiter') {
          return db.recruiters.hashPassword(password);
        } else {
          return db.administrators.hashPassword(password);
        }
      } else {
        return Promise.reject(new errors.Http404Error('Password reset token is invalid'));
      }
    } else {
      return Promise.reject(new errors.Http404Error('No account found with that email address'));
    }
  }).then(function (hashedPassword) {
    if (typeUser === 'recruiter') {
      return db.recruiters.update({password: hashedPassword}, {
        where: {
          email: email
        }
      });
    } else {
      return db.administrators.update({password: hashedPassword}, {
        where: {
          email: email
        }
      });
    }
  }).then(function(data) {
    if (data[0]) {
      res.json('Password has been successfully reset');
    } else {
      res.status(500).json('Password has been successfully reset');
    }
  }).catch(Sequelize.ValidationError, function () {
    next(new errors.ValidationError('Validation Error: Please make sure all the fields are correct'));
  }).catch(Sequelize.DatabaseError, function (err) {
    next(new errors.DatabaseError(err.message));
  }).catch(Error, function (err) {
    next(err);
  });
};
