'use strict';

var app = angular.module('uprmcmsApp');

app.controller('RecruiterRegistrationCtrl', function($scope, $state, Registration) {

  $scope.companyName = Registration.sessionStorage.companyName;
  $scope.companyLocation = Registration.sessionStorage.companyLocation;
  var messageModal = $('#messageModal');

  $scope.registerRecruiter = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      $scope.recruiter.companyName = $scope.companyName;
      $scope.recruiter.companyLocationId = $scope.companyLocation.id;
      var userInfo = {
        recruiterInfo: $scope.recruiter
      };
      Registration.registerRecruiter(userInfo).then(function() {
        $scope.title = 'Congratulations';
        $scope.message = 'Registration was successful. You will receive an email once we have reviewed your information.';
        messageModal.modal('show');
        messageModal.on('hidden.bs.modal', function () {
          $state.go('landingPage');
          Registration.sessionStorage.companyName = null;
          Registration.sessionStorage.companyLocation = null;
        });
      }, function() {
        $scope.title = 'Warning';
        $scope.message = 'Email address already in use.';
        messageModal.modal('show');
      });
    }
  };


});
