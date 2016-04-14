'use strict';

var _ = require('lodash');

exports.ADMIN = 'admin';
exports.RECRUITER = 'recruiter';
exports.STUDENT = 'student';


exports.isAdmin = function(user) {
  return _.isEqual(user.authType, exports.ADMIN);
};

exports.isRecruiter = function(user) {
  return _.isEqual(user.authType, exports.RECRUITER);
};

exports.isStudent = function(user) {
  return _.isEqual(user.authType, exports.STUDENT);
};

exports.assignAdmin = function(user) {
  user.authType = exports.ADMIN;
};

exports.assignRecruiter = function(user) {
  user.authType = exports.RECRUITER;
};

exports.assignStudent = function(user) {
  user.authType = exports.STUDENT;
};

