'use strict';

var app = angular.module('uprmcmsApp');

app.controller('LocationSearchCtrl', function($scope, $state, Registration) {

  $scope.companyName = Registration.sessionStorage.companyName;

  $scope.companyLocations = Registration.companyLocations;

  $scope.companyLocation = null;

  $scope.selectLocation = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      for (var i = 0; i < $scope.companyLocations.length; i++) {
        if ($scope.companyLocations[i].id === $scope.companyLocation.id) {
          // To add to local storage
          Registration.setCompanyLocation($scope.companyLocation);
          $state.go('recruiterRegistration');
          //Jasmine Test
          return true;
        }
      }
    }
    //Jasmine Test
    return false;
  };

});
