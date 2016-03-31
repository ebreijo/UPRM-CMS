'use strict';

var app = angular.module('uprmcmsApp');

app.controller('LoginCtrl', function($scope, $state, Auth, USER_ROLES) {

  $scope.user = {};
  $scope.errors = {};

  $scope.login = function(form) {
    if (form.$valid) {
      $scope.errors = {};
      Auth.login({
        email: $scope.user.email,
        password: $scope.user.password
      }).then(function(user) {
        if (user.authType === USER_ROLES.administrator) {
          $state.go('adminProfile');
        } else if (user.authType === USER_ROLES.recruiter) {
          $state.go('company');
        }
      }).catch(function(error) {
        $scope.show = true;
        $scope.errors.message = error.data.message;
      });
    }
  };

});
