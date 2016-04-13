'use strict';

var app = angular.module('uprmcmsApp');

app.controller('AdminJobFairManagementCtrl', function($scope, JobFairGeneralInfo, JobFairCompaniesInfo, CompanyLookingForPositions, Majors, Patterns, _) {

  $scope.jobFairGeneralInformation = JobFairGeneralInfo.jobFairGeneralInfo;
  $scope.jobFairCompaniesList = JobFairCompaniesInfo.companiesJobFair;
  $scope.company = {};
  $scope.jobFairCompanyAdditionalInfo = {};
  $scope.patterns = Patterns.jobFairManagement;

  var majorList = Majors.majors;
  var jobPositions = ['Internship', 'Full-Time', 'Part-Time', 'CO-OP'];

  $scope.companySelection = 'Select Company';
  $scope.isDisable = true;

  $scope.companyJobPositions = [];

  $scope.$watch('companySelection', function (newValue) {
    $scope.companySelection = newValue;
    if ($scope.companySelection === 'Select Company') {
      $scope.isDisable = true;
    } else {
      $scope.isDisable = false;
      CompanyLookingForPositions.getCompanyLookingForPositions($scope.companySelection).then(function(companyLookingForPositions) {
        $scope.companyJobPositions = angular.copy(companyLookingForPositions.plain());
        var positions = [];
        _.forEach($scope.companyJobPositions,  function(element) {
          positions.push(element.jobPosition);
        });
        _.forEach(jobPositions,  function(position) {
          if(positions.indexOf(position) < 0){
            var dummyObject = {
              companyName: $scope.companySelection,
              jobPosition: position,
              status: false
            };
            $scope.companyJobPositions.push(dummyObject);
          }
        });
      });
    }

    $scope.jobFairCompanyAdditionalInfo = angular.copy(JobFairCompaniesInfo.getJobFairInfoPerCompany($scope.companySelection));
    $scope.company = JobFairCompaniesInfo.getCompanyForJobFair($scope.companySelection);
    if ($scope.jobFairCompanyAdditionalInfo) {
      if ($scope.jobFairCompanyAdditionalInfo.minGpa) {
        $scope.jobFairCompanyAdditionalInfo.minGpa = Number($scope.jobFairCompanyAdditionalInfo.minGpa).toFixed(2);
      }
    }
    $scope.companyJobPositions = [];
    $scope.majors = Majors.getInterestedMajorsPerCompany($scope.companySelection);

    var positions = [];
    _.forEach($scope.companyJobPositions,  function(element) {
      positions.push(element.jobPosition);
    });

    _.forEach(jobPositions,  function(position) {
      if(positions.indexOf(position) < 0){
        var dummyObject = {
          companyName: $scope.companySelection,
          jobPosition: position,
          status: false
        };
        $scope.companyJobPositions.push(dummyObject);
      }
    });

    var majorCodes = [];
    _.forEach($scope.majors,  function(major) {
      major.isSet = true;
      majorCodes.push(major.majorCode);
    });

    _.forEach(majorList,  function(major) {
      if(majorCodes.indexOf(major.majorCode) < 0) {
        var dummyObject = {
          companyName: $scope.companySelection,
          majorCode: major.majorCode,
          isSet: false
        };
        $scope.majors.push(dummyObject);
      }
    });

  });

  $scope.showJobFairResumeDeadlineDateError = false;
  var today = (new Date()).toISOString();

  $('#resumeDeadlineDatePicker').datepicker({
    format: 'yyyy-mm-dd'
  });

  $scope.checkResumeDeadlineDate = function(form) {
    if (form.$valid) {
      if($scope.jobFairGeneralInformation.showResumeDeadlineDate) {
        if (new Date($scope.jobFairGeneralInformation.resumeDeadlineDate).toISOString() <= today) {
          $scope.showJobFairResumeDeadlineDateError = true;
          return;
        }
      }
      $scope.showJobFairResumeDeadlineDateError=false;
      $('#confirmJobFairGeneralInformationModal').modal('show');
    }
  };

  $scope.submitJobFairGeneralInfo = function(form) {
    if (form.$valid) {
      $scope.jobFairGeneralInformation.resumeDeadlineDate = new Date($scope.jobFairGeneralInformation.resumeDeadlineDate).toISOString();
      JobFairGeneralInfo.updateJobFairDateInfo($scope.jobFairGeneralInformation).then(function() {
        $('#confirmJobFairGeneralInformationModal').modal('hide');
      }, function() {
        $scope.title = 'Warning';
        $scope.message = 'There was an error with Job Fair General Information';
        $('#messageModal').modal('toggle');
      });
    }
  };

  $scope.setJobFairAdditionalInfoToConfirm = function(form) {
    if (form.$valid) {
      $('#confirmJobFairManagementModal').modal('show');
    }
  };

  $scope.submitJobFairManagementChanges = function(form){
    if (form.$valid) {
      $scope.jobFairCompanyAdditionalInfo.companyName = $scope.companySelection;
      if ($scope.jobFairCompanyAdditionalInfo.minGpa) {
        $scope.jobFairCompanyAdditionalInfo.minGpa = (Number($scope.jobFairCompanyAdditionalInfo.minGpa)).toFixed(2);
      }
      JobFairCompaniesInfo.updateJobFairInfoPerCompany($scope.jobFairCompanyAdditionalInfo);
      CompanyLookingForPositions.updateCompanyLookingForPositions($scope.companySelection, $scope.companyJobPositions);
      Majors.setInterestedMajorsPerCompany($scope.majors);
      $('#confirmJobFairManagementModal').modal('hide');
    }
  };


});
