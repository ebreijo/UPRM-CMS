'use strict';

var app = angular.module('uprmcmsApp');

app.controller('ApplicationCtrl', function ($scope, USER_ROLES) {

  // variables for use in child scopes.
  $scope.currentUser = null;
  $scope.userRoles = USER_ROLES;

});
