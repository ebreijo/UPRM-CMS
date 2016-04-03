'use strict';

var app = angular.module('uprmcmsApp');

app.controller('ApplicationCtrl', function ($scope, $state, USER_ROLES, Auth, AUTH_EVENTS) {

  // variables for use in child scopes.
  $scope.currentUser = null;
  $scope.userRoles = USER_ROLES;

  // Logout function to use in child scopes
  $scope.logout = Auth.logout;

  $scope.$on(AUTH_EVENTS.loginSuccess, function(event, user) {
    $scope.currentUser = user;
  });

  $scope.$on(AUTH_EVENTS.logoutSuccess, function() {
    $scope.currentUser = null;
  });

});
