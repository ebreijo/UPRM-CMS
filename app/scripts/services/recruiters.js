'use strict';

var app = angular.module('uprmcmsApp');

app.factory('Recruiters', function(Restangular) {
  var obj = {
    pendingRecruiters: []
  };

  obj.getAllPendingRecruiters = function() {
    Restangular.all('/api/admins/pendingRecruiters').getList().then(function(pendingRecruiters) {
      angular.copy(pendingRecruiters.plain(), obj.pendingRecruiters);
    });
  };

  obj.updateRecruiterStatus = function(recruiter) {
    return Restangular.all('/api/admins/recruiters').customPUT(recruiter);
  };

  return obj;
});
