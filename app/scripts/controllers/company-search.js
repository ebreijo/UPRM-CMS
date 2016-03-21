/**
 * Created by artic_hunt on 3/20/16.
 */
'use strict';

var app = angular.module('uprmcmsApp');

app.controller('CompanySearchCtrl', function($scope, $state, companySearchService) {

  $scope.selectCompany = function(isValid) {

    // check to make sure the form is completely valid
    if (isValid) {
      for (var i = 0; i < $scope.companies.length; i++) {
        if ($scope.companies[i].name === $scope.companyName){
          companySearchService.set($scope.companyName);
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
