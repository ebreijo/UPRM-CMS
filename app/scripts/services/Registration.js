'use strict';

var app = angular.module('uprmcmsApp');

app.factory('Registration', function(Restangular) {

  var obj = {};

  obj.registerAdmin = function(user) {
    return Restangular.all('api/admins/register').post(user);
  };

  return obj;

});
