'use strict';

var app = angular.module('uprmcmsApp');

app.factory('CompanyLookingForPositions', function(Restangular) {
  var obj = {
    companyLookingForPositions: []
  };

  obj.getCompanyLookingForPositions = function(companyName) {
    return Restangular.one('/api/companies', companyName).getList('companyLookingFor');
  };

  obj.updateCompanyLookingForPositions = function(companyName, companyLookingForPositions) {
    Restangular.one('/api/companies/', companyName).customPOST({companyPositions: companyLookingForPositions}, 'companyLookingFor');
  };

  return obj;
});
