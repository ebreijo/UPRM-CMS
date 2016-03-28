'use strict';

var app = angular.module('uprmcmsApp');

app.controller('AdminProfileCtrl', function($scope, Companies, AdminAccess, Majors, Patterns, $filter, _) {

  $scope.patternEmail = Patterns.user.email;

  /**
   * Companies Tab
   */
  $scope.companies = Companies.companies;
  $scope.compStatusSelection = 'active';

  $scope.tempCompany = {};

  $scope.editCompanyStatus = function(company) {
    $scope.tempCompany = angular.copy(company);
  };

  $scope.submitCompanyStatusEdit = function(form) {
    if (form.$valid) {
      Companies.updateCompanyStatus($scope.tempCompany);
      $('#editCompanyStatusModal').modal('hide');
    }
  };


  /**
   * Admins Tab
   */
  $scope.adminAccessList = AdminAccess.adminAccessList;
  $scope.newAdminAccess = {};
  $scope.tempAdminAccess = {};

  $scope.giveAdminAccess = function(form) {
    if (form.$valid) {
      var element = _.find($scope.adminAccessList, { email: $scope.newAdminAccess.email});

      if (element) { // If admin already exists, show a Warning
        $scope.title = 'Warning';
        $scope.message = 'Admin already exists';
        $('#messageModal').modal('toggle');
      } else {
        $scope.newAdminAccess.isRoot = false;
        $scope.newAdminAccess.adminAccountStatus = 'pending';
        AdminAccess.giveAdminAccess($scope.newAdminAccess);
        $scope.newAdminAccess = null;
      }
    }
  };

  $scope.editAdminAccess = function(adminAccess) {
    $scope.tempAdminAccess = angular.copy(adminAccess);
    $scope.tempAdminAccess.currentEmail = adminAccess.email;
    $scope.tempAdminAccess.adminTempAccountStatus = adminAccess.adminAccountStatus;
  };

  $scope.submitAdminAccessEdit = function(form) {
    if ($scope.tempAdminAccess.adminTempAccountStatus === 'pending' && $scope.tempAdminAccess.adminAccountStatus === 'active') {
      $scope.title = 'Warning';
      $scope.message = 'Cannot activate the Administrator, it is still pending to register';
      $('#messageModal').modal('toggle');
    } else if (form.$valid) {
      $scope.tempAdminAccess.isRoot = false;
      AdminAccess.updateAdminAccess($scope.tempAdminAccess);
      $('#editAdminAccessModal').modal('hide');
    }
  };

  /**
   * Majors Tab
   */
  $scope.majors = Majors.majors;

  $scope.major = {};
  $scope.tempMajor = {};

  $scope.submitAddMajor = function(form) {
    if(form.$valid) {
      $scope.major.majorCode = $scope.major.majorCode.toUpperCase();
      Majors.createNewMajor($scope.major);
      $scope.major = null;
    }
  };

  $scope.editMajor = function(major) {
    $scope.tempMajor = angular.copy(major);
    $scope.tempMajor.currentMajorCode = major.majorCode;
  };

  $scope.submitMajorEdit = function(form) {
    if(form.$valid) {
      $scope.tempMajor.majorCode = $scope.tempMajor.majorCode.toUpperCase();
      Majors.editMajor($scope.tempMajor);
      $('#editMajorModal').modal('hide');
    }
  };

  $scope.deleteMajor = function(major) {
    $scope.tempMajor = angular.copy(major);
  };

  $scope.submitMajorDelete = function(form) {
    if(form.$valid) {
      console.log('hola');
      Majors.deleteMajor($scope.tempMajor);
      $('#deleteMajorModal').modal('hide');
    }
  };

});
