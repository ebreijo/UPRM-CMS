'use strict';

var app = angular.module('uprmcmsApp');

app.factory('Companies', function(Restangular) {
  var obj = {
    companies: [],
    pendingCompanies: []
  };

  obj.temporaryContact = [];

  obj.getAllCompanies = function(status) {
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

  obj.getCompany = function(companyName) {
    var activeOrInactiveCompany = obj.companies.filter(function(company) {
      return company.name === companyName;
    })[0];

    var pendingCompany = obj.pendingCompanies.filter(function(company) {
      return company.name === companyName;
    })[0];

    return activeOrInactiveCompany || pendingCompany;
  };

  obj.createNewCompany = function(company) {
    var self = this;
    Restangular.all('/api/admins/companies').post(company).then(function() {
      self.companies.push(company);
    });
  };

  obj.updateCompanyStatus = function(company) {
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

  // TODO: Make a request to create or update the company temporary contact
  obj.createOrUpdateCompanyTemporaryContact = function(temporaryContact) {
    var self = this;
    Restangular.one('/api/admins/companies/', temporaryContact.companyName).post('tempContact', temporaryContact).then(function() {
      self.temporaryContact.push(temporaryContact);
    });
  };

  return obj;
});
