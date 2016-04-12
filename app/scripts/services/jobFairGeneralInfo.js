'use strict';

var app = angular.module('uprmcmsApp');

app.factory('JobFairGeneralInfo', function(Restangular) {
  var obj = {
    jobFairGeneralInfo: {}
  };

  obj.getJobFairDate = function() {
    return Restangular.all('/api/admins/jobFairDates').customGET().then(function(generalInfo) {
      angular.copy(generalInfo.plain(), obj.jobFairGeneralInfo);
    });
  };

  obj.updateJobFairDateInfo = function(jobFairDate) {
    return Restangular.all('/api/admins/jobFairDates').customPUT(jobFairDate);
  };

  return obj;
});
