'use strict';

var app = angular.module('uprmcmsApp');

app.controller('CompanyJobFairCtrl', function($scope, JobFairGeneralInfo, JobFairCompaniesInfo) {

  $scope.generalInformation = JobFairGeneralInfo.jobFairGeneralInfo;
  $scope.jobFairCompanies = JobFairCompaniesInfo.studentJobFairCompaniesInfo;
  
});
