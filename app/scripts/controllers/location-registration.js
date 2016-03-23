'use strict';

var app = angular.module('uprmcmsApp');

app.controller('RecruiterRegistrationCtrl', function($scope, $state, localStorageService) {

  $scope.companyName = localStorageService.get('companyToRegister');

  $scope.registerRecruiter = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      $state.go('company');
    }
  };


});
