'use strict';

var app = angular.module('uprmcmsApp');

app.controller('LocationSearchCtrl', function($scope, $state, localStorageService) {

  //$scope.companyNames = companySearchService.get();
  $scope.companyName = localStorageService.get('companyToRegister');

  $scope.selectLocation = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      for (var i = 0; i < $scope.apple.length; i++) {
        if ($scope.apple[i].city + ', ' + $scope.apple[i].country === $scope.companyLocation){
          // To add to local storage
          localStorageService.set('companyLocationToRegister',$scope.companyLocation);
          $state.go('recruiterRegistration');
          //Jasmine Test
          return true;
        }
      }
    }
    //Jasmine Test
    return false;
  };

  $scope.apple = [
    {
      id: 2,
      companyName: 'Apple',
      streetAddress: 'Street 2nd',
      city: 'Durham',
      state: 'NY',
      country: 'United States',
      zipCode: '10504',
      phoneNumber: null
    },
    {
      id: 2,
      companyName: 'Apple',
      streetAddress: 'Street 1rst',
      city: 'Armonk',
      state: 'NY',
      country: 'United States',
      zipCode: '10504',
      phoneNumber: null
    }
  ];

});
