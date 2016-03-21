'use strict';

var app = angular.module('uprmcmsApp');

app.controller('LocationSearchCtrl', function($scope, $state, localStorageService) {

  //$scope.companyNames = companySearchService.get();
  $scope.companyName = localStorageService.get('companyToRegister');
  // To remove a local storage

  $scope.submitForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      for (var i = 0; i < $scope.users.length; i++) {
        if (($scope.user.email === $scope.users[i].email) && ($scope.user.password === $scope.users[i].password)){
          $scope.show = false;
          $state.go('company');
        }
        else {
          $scope.show = true;
        }
      }
    }
  };

  $scope.users = [
    {
      'email': 'user1@ibm.com',
      'password': 'jwjefW@34',
      //'isRoot': false,
      //'adminAccountStatus': 'active'
    },
    {
      'email': 'user34@foundation.org',
      'password': '9Tbfdh#ld',
      //'email': 'placement@uprm.edu',
      //'isRoot': true,
      //'adminAccountStatus': 'active'
    }
  ];

});