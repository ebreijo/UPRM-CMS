'use strict';

var app = angular.module('uprmcmsApp');

app.factory('Recruiters', function(Restangular) {
  var obj = {
    pendingRecruiters: [],
    companyRecruiters: []
  };

  obj.getAllPendingRecruitersForAdmins = function() {
    Restangular.all('/api/admins/pendingRecruiters').getList().then(function(pendingRecruiters) {
      angular.copy(pendingRecruiters.plain(), obj.pendingRecruiters);
    });
  };

  obj.updateRecruiterStatusFromAdmins = function(recruiter) {
    return Restangular.all('/api/admins/recruiters').customPUT(recruiter);
  };

  obj.getRecruitersPerCompany = function(companyName) {
    return Restangular.one('/api/companies', companyName).getList('recruiters').then(function(compRecruiters){
      angular.copy(compRecruiters.plain(), obj.companyRecruiters);
    });
  };

  return obj;
});
