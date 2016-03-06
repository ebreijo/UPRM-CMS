'use strict';

var app = angular.module('uprmcmsApp');

app.constant('USER_ROLES', {
  guest: 'guest',
  student: 'student',
  recruiter: 'recruiter',
  administrator: 'administrator'
});
