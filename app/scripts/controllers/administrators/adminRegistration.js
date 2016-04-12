'use strict';

var app = angular.module('uprmcmsApp');

app.controller('AdminRegistrationCtrl', function($scope, Registration, $state) {


  $scope.user = {};
  var messageModal = $('#messageModal');

  $scope.submitAdminRegistration = function(isFormValid) {
    if(isFormValid) {
      Registration.registerAdmin($scope.user).then(function() {
        $scope.title = 'Congratulations';
        $scope.message = 'Your registration was successful. Please login';
        messageModal.modal('show');
        // once modal is hidden, then redirect to the login page
        messageModal.on('hidden.bs.modal', function () {
          $state.go('login');
        });
      }, function() {
        $scope.title = 'Warning';
        $scope.message = 'Your registration was not successful. You are either not authorized to register or your account is already activated';
        messageModal.modal('show');
      });
    }
  };

});
