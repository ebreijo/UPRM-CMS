'use strict';

var app = angular.module('uprmcmsApp');

app.factory('Companies', function(Restangular) {
  var obj = {
    companies: [],
    pendingCompanies: [],
    temporaryContact: [],
    studentCompanies: [],
    companyGeneralInfo: []
  };

  obj.getAllCompaniesForAdmins = function(status) {
    if (status === 'active' || status === 'inactive') {
      return Restangular.all('/api/admins/companies').getList({status: status}).then(function(data) {
        angular.copy(data.plain(), obj.companies);
      });
    } else if (status === 'pending') {
      return Restangular.all('/api/admins/companies').getList({status: status}).then(function(data) {
        angular.copy(data.plain(), obj.pendingCompanies);
      });
    }
  };

  obj.getAllCompaniesForStudents = function() {
    return Restangular.all('/api/students/companies').getList().then(function(data) {
      angular.copy(data.plain(), obj.studentCompanies);
    });
  };

  obj.getCompany = function(companyName) {
    return Restangular.one('/api/admins/companies', companyName).get().then(function(company) {
      return company.plain();
    });
  };

  obj.getStudentCompany = function(companyName) {
    return Restangular.one('/api/students/companies', companyName).get().then(function(company) {
      return company.plain();
    });
  };

  obj.createNewCompany = function(company) {
    return Restangular.all('/api/admins/companies').post(company);
  };

  obj.updateCompanyFromAdmins = function(companyName, company) {
    return Restangular.one('/api/admins/companies', companyName).customPUT(company);
  };

  obj.getCompanyTemporaryContact = function(companyName) {
    return Restangular.one('/api/admins/companies', companyName).getList('tempContact').then(function(tempContact) {
      return tempContact.plain();
    });
  };

  obj.createOrUpdateCompanyTemporaryContact = function(temporaryContact) {
    var self = this;
    Restangular.one('/api/admins/companies', temporaryContact.companyName).post('tempContact', temporaryContact).then(function() {
      self.temporaryContact.push(temporaryContact);
    });
  };

  obj.getCompanyGeneralInformation = function(companyName) {
    return Restangular.one('/api/companies', companyName).get().then(function(compGeneralInfo) {
      angular.copy(compGeneralInfo.plain(), obj.companyGeneralInfo);
    });
  };

  obj.updateCompanyGeneralInformation = function(changes, companyName) {
    return Restangular.one('/api/companies', companyName).customPUT(changes);
  };

  obj.submitOnCampusServices = function (serviceInfo) {
    return Restangular.all('/api/onCampusServices').post(serviceInfo);
  };

  obj.logoCleanup = function(logoPath) {
    return Restangular.all('/api/logoCleanup').post(logoPath);
  };

  return obj;
});
