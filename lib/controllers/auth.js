'use strict';

var passport = require('passport');
var errors = require('errors');

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
exports.loginAdmin = login('local-admin');

exports.loginRecruiter = login('local-recruiter');

/**
 * Logout
 */
exports.logout = function (req, res) {
  req.logout();
  res.send(200);
};
