'use strict';

var app = angular.module('uprmcmsApp');

app.factory('Registration', function(Restangular, $sessionStorage) {

  var obj = {};

  obj.companyNames = [];

  obj.sessionStorage = $sessionStorage;

  obj.companyLocations = [];

  obj.registerAdmin = function(user) {
    return Restangular.all('api/admins/register').post(user);
  };

  obj.registerRecruiter = function(user) {
    console.log(user);
    return Restangular.all('api/companies/register').customPOST({'recruiterInfo': user});
  };

  obj.getAllCompanyNamesForRecruiters = function() {
    return Restangular.all('api/companies').getList().then(function(compNames) {
      angular.copy(compNames.plain(), obj.companyNames);
    });
  };

  obj.setCompanyName = function(companyName) {
    this.sessionStorage.companyName = companyName;
  };

  obj.setCompanyLocation = function(companyLocation) {
    this.sessionStorage.companyLocation = companyLocation;
  };

  obj.getAllCompanyLocations = function(companyName) {
    return Restangular.one('api/companies', companyName).getList('companyLocations').then(function(compLocations) {
      angular.copy(compLocations.plain(), obj.companyLocations);
    });
  };

  return obj;

});
