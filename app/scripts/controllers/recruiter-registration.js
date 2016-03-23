'use strict';

var app = angular.module('uprmcmsApp');

app.controller('LocationRegistrationCtrl', function($scope, $state, localStorageService) {

  $scope.companyName = localStorageService.get('companyToRegister');
  $scope.companyLocation = localStorageService.get('companyLocationToRegister');


  $scope.registerRecruiter = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      $state.go('company');
    }
  };


});
