'use strict';

var app = angular.module('uprmcmsApp');

app.controller('AdminProfileCtrl', function($scope, Companies, AdminAccess, Patterns, _) {

  $scope.companies = Companies.companies;

  $scope.compStatusSelection = 'active';

  $scope.patternEmail = Patterns.user.email;

  // Admins Tab
  $scope.adminAccessList = AdminAccess.adminAccessList;
  $scope.newAdminAccess = {};
  $scope.tempAdminAccess = {};

  $scope.giveAdminAccess = function(form) {
    if (form.$valid) {
      var element = _.find($scope.adminAccessList, { email: $scope.newAdminAccess.email});

      if (element) {
        $('#messageModal').modal('toggle');
        $scope.message = 'Admin already exists';
      } else {
        $scope.newAdminAccess.isRoot = false;
        $scope.newAdminAccess.adminAccountStatus = 'pending';
        $scope.adminAccessList.push($scope.newAdminAccess);
      }
    }
  };

  $scope.editAdminAccess = function(adminAccess) {
    $scope.tempAdminAccess.email = adminAccess.email;
    $scope.tempAdminAccess.currentEmail = adminAccess.email;
    $scope.tempAdminAccess.adminAccountStatus = adminAccess.adminAccountStatus;
  };

  $scope.$watch('tempAdminAccess.email', function handleEmailChange(newEmail) {
    $scope.tempAdminAccess.email = newEmail;
  });

  $scope.submitAdminAccessEdit = function(form) {
    if (form.$valid) {
      $scope.tempAdminAccess.isRoot = false;
      var element = _.find($scope.adminAccessList, { email: $scope.tempAdminAccess.currentEmail});
      _.merge(element, $scope.tempAdminAccess);
      $('#editAdminAccessModal').modal('hide');
    }
  };

});
