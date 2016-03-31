'use strict';

var app = angular.module('uprmcmsApp');

app.controller('companyListCtrl', function($scope, Companies) {
  $scope.companies = Companies.getAllCompanies('active');

  //TODO: Company Filter By Name
  
});
