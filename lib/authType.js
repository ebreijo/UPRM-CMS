'use strict';

var _ = require('lodash');

exports.ADMIN = 'admin';
exports.RECRUITER = 'recruiter';


exports.isAdmin = function(user) {
  return _.isEqual(user.authType, exports.ADMIN);
};

exports.isRecruiter = function(user) {
  return _.isEqual(user.authType, exports.RECRUITER);
};

exports.assignAdmin = function(user) {
  user.authType = exports.ADMIN;
};

exports.assignRecruiter = function(user) {
  user.authType = exports.RECRUITER;
};

