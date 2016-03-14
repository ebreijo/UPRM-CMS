'use strict';

var authType = require('./authType');

var auth = function(predicate) {

  return function(req, res, next) {
    if (req.isAuthenticated() && predicate(req.user)) {
      return next();
    }

    res.send(401);
  };

};

/**
*  Protect routes on your api from unauthenticated access
*/
exports.auth = auth(function() { return true; });

exports.authAdmin = auth(authType.isAdmin);

exports.authRecruiter = auth(authType.isRecruiter);

/**
* Set a cookie for angular so it knows we have an http session
*/
exports.setUserCookie = function(req, res, next) {
  if(req.user) {
    res.cookie('user', JSON.stringify(req.user.userInfo));
  }
  next();
};
