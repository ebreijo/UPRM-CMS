'use strict';

var app = angular.module('uprmcmsApp');

app.controller('CompanySearchCtrl', function($scope, $state, Registration) {

  $scope.companies = Registration.companyNames;
  $scope.disableContinueBtn = true;
  var companyName = null;

  $scope.selectCompany = function(item) {
    if (item) {
      Registration.setCompanyName(item.name);
      companyName = item.name;
      $scope.disableContinueBtn = false;
    }
  };

  $scope.continueToLocationSearch = function() {
    if (companyName) {
      $state.go('locationSearch');
    }
  };

});
