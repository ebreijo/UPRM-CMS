/**
 * Created by artic_hunt on 3/20/16.
 */
'use strict';

var app = angular.module('uprmcmsApp');

app.controller('CompanySearchCtrl', function($scope, $state, localStorageService) {

  $scope.selectCompany = function(isValid) {

    // check to make sure the form is completely valid
    if (isValid) {
      for (var i = 0; i < $scope.companies.length; i++) {
        if ($scope.companies[i].name === $scope.companyName){
          // To add to local storage
          localStorageService.set('companyToRegister',$scope.companyName);
          //companySearchService.add($scope.companyName);
          $state.go('locationSearch');
        }
      }
    }

  };

  $scope.companies = [
    {
      name: 'Apple'
    },
    {
      name: 'Verizon'
    },
    {
      name: 'Accenture'
    },
    {
      name: 'EVERTEC'
    },
    {
      name: 'Google'
    },
    {
      name: 'Microsoft'
    },
    {
      name: 'IBM'
    }
  ];

});