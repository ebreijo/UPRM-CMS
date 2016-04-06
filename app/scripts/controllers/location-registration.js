'use strict';

var app = angular.module('uprmcmsApp');

app.controller('LocationRegistrationCtrl', function($scope, $state, localStorageService) {

  $scope.companyName = localStorageService.get('companyToRegister');

  $scope.registerLocation = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      $state.go('company');
      //Jasmine Test
      return true;
    }
    //Jasmine Tests
    return false;
  };

});
