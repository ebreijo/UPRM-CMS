'use strict';

var app = angular.module('uprmcmsApp');

app.factory('Recruiters', function(Restangular) {
  var obj = {
    pendingRecruiters: [],
    companyRecruiters: [],
    companyRecruitersForAdmins: [],
    recruiter: {}
  };

  obj.getAllPendingRecruitersForAdmins = function() {
    Restangular.all('/api/admins/pendingRecruiters').getList().then(function(pendingRecruiters) {
      angular.copy(pendingRecruiters.plain(), obj.pendingRecruiters);
    });
  };

  obj.updateRecruiterStatusFromAdmins = function(recruiter) {
    return Restangular.all('/api/admins/recruiters').customPUT(recruiter);
  };

  obj.getRecruitersPerCompanyForAdmins = function(companyName, status) {
    return Restangular.one('/api/admins/companies', companyName).getList('recruiters', {status: status}).then(function(recruiters) {
      angular.copy(recruiters.plain(), obj.companyRecruitersForAdmins);
    });
  };

  obj.getRecruitersPerCompany = function(companyName) {
    return Restangular.one('/api/companies', companyName).getList('recruiters').then(function(compRecruiters){
      angular.copy(compRecruiters.plain(), obj.companyRecruiters);
    });
  };

  obj.removeRecruitersPerCompany = function(companyName, recruiter) {
    return Restangular.one('/api/companies', companyName).customPUT(recruiter, 'recruiters');
  };

  obj.updateRecruiterStatusPerCompanyForAdmins = function(companyName, recruiter) {
    return Restangular.one('/api/admins/companies', companyName).customPUT(recruiter, 'recruiters');
  };

  obj.getMyInformation = function() {
    return Restangular.one('/api/recruiters', 'me').get().then(function(recruiter) {
      angular.copy(recruiter.plain(), obj.recruiter);
    });
  };

  obj.updatePersonalInfo = function(changes) {
    return Restangular.one('/api/recruiters', 'me').customPOST(changes);
  };

  obj.changePassword = function(password) {
    return Restangular.one('/api/recruiters', 'me').customPOST({password: password});
  };

  return obj;
});
