'use strict';

var app = angular.module('uprmcmsApp');

app.factory('Companies', function(Restangular, _) {
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
    var activeOrInactiveCompany = _.find(obj.companies, { 'name': companyName});
    var pendingCompany = _.find(obj.pendingCompanies, { 'name': companyName});

    return activeOrInactiveCompany || pendingCompany;
  };

  obj.createNewCompany = function(company) {
    var self = this;
    Restangular.all('/api/admins/companies').post(company).then(function() {
      self.companies.push(company);
    });
  };

  obj.updateCompanyStatusFromAdmins = function(company) {
    return Restangular.one('/api/admins/companies/', company.name).customPUT(company);
  };

  obj.acceptOrRejectCompany = function(company) {
    return Restangular.one('/api/admins/companies/', company.name).customPUT(company);
  };

  obj.getCompanyTemporaryContact = function(companyName) {
    return Restangular.one('/api/admins/companies', companyName).getList('tempContact').then(function(tempContact) {
      return tempContact;
    });
  };

  obj.createOrUpdateCompanyTemporaryContact = function(temporaryContact) {
    var self = this;
    Restangular.one('/api/admins/companies/', temporaryContact.companyName).post('tempContact', temporaryContact).then(function() {
      self.temporaryContact.push(temporaryContact);
    });
  };

  obj.getCompanyGeneralInformation = function(companyName) {
    return Restangular.one('/api/companies', companyName).get().then(function(compGeneralInfo) {
      angular.copy(compGeneralInfo.plain(), obj.companyGeneralInfo);
    });
  };

  /*
  obj.getInterestedMajorsPerCompany = function(companyName) {
    return Restangular.one('/api/companies', companyName).getList('companyInterestedMajors');
  };
  */

  return obj;
});
