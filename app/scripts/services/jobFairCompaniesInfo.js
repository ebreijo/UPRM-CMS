'use strict';

var app = angular.module('uprmcmsApp');

app.factory('JobFairCompaniesInfo', function(Restangular, _) {
  var obj = {
    companiesJobFair: [],
    jobFairCompaniesInfo: [],
    studentJobFairCompaniesInfo: []
  };

  obj.getAllCompaniesForJobFairManagement = function() {
    Restangular.all('/api/admins/companiesJobFair').getList().then(function(companies) {
      angular.copy(companies.plain(), obj.companiesJobFair);
    });
  };

  obj.getAllCompaniesForStudentJobFair = function() {
    Restangular.all('/api/students/jobFair').getList().then(function(companies) {
      angular.copy(companies.plain(), obj.studentJobFairCompaniesInfo);
    });
  };

  obj.getCompanyForJobFair = function(companyName) {
    return _.find(obj.companiesJobFair, {'name': companyName});
  };

  obj.getJobFairCompaniesInfo = function() {
    return Restangular.all('/api/admins/jobFairInformation').getList().then(function(companiesInfo) {
      angular.copy(companiesInfo.plain(), obj.jobFairCompaniesInfo);
    });
  };

  obj.getJobFairInfoPerCompany = function(companyName) {
    return _.find(this.jobFairCompaniesInfo, { companyName: companyName});
  };

  obj.updateJobFairInfoPerCompany = function(jobFairInfo) {
    Restangular.one('/api/admins/jobFairInformation', jobFairInfo.companyName).customPOST(jobFairInfo).then(function() {
      var element = _.find(obj.jobFairCompaniesInfo, { companyName: jobFairInfo.companyName});
      if (element) {
        _.merge(element, jobFairInfo);
      } else {
        obj.jobFairCompaniesInfo.push(jobFairInfo);
      }
    });
  };

  return obj;
});
