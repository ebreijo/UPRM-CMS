'use strict';

var app = angular.module('uprmcmsApp');

app.controller('LoginCtrl', function($scope, $state, Auth, USER_ROLES) {

  $scope.user = {};
  $scope.errors = {};

  $scope.login = function(form) {
    if (form.$valid) {
      Auth.login({
        email: $scope.user.email,
        password: $scope.user.password
      }).then(function(user) {
        if (user.authType === USER_ROLES.administrator) {
          $state.go('adminProfile');
        } else if (user.authType === USER_ROLES.recruiter) {
          $state.go('company');
        }
      }).catch(function() {
        $scope.show = true;
      });
    }
  };

  $scope.forgot = function(form) {
    if (form.$valid) {
      Auth.forgot({email: $scope.forgotEmail}).then(function(res) {
        $('#forgotPasswordModal').modal('hide');
        console.log(res);
        //$state.go('');
      }).catch(function() {
        $scope.modalShowMessage = true;
      });
    }
  };

});
