'use strict';

var app = angular.module('uprmcmsApp');

app.controller('CompanySearchCtrl', function($scope, Registration) {

  $scope.companies = Registration.companyNames;
  $scope.disableContinueBtn = true;

  $scope.selectCompany = function(item) {
    if (item) {
      Registration.setCompanyName(item.name);
      $scope.disableContinueBtn = false;
    }
  };

});
