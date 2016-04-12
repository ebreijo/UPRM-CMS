'use strict';

var app = angular.module('uprmcmsApp');

app.controller('LocationRegistrationCtrl', function($scope, $state, Registration) {

  $scope.companyName = Registration.sessionStorage.companyName;
  var messageModal = $('#messageModal');

  $scope.registerLocation = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      $scope.compLocation.companyName = $scope.companyName;
      var userInfo = {
        companyLocation: $scope.compLocation,
        recruiterInfo: $scope.recruiter
      };
      Registration.registerRecruiter(userInfo).then(function() {
        $scope.title = 'Congratulations';
        $scope.message = 'Registration was successful. You will receive an email once we have reviewed your information.';
        messageModal.modal('show');
        messageModal.on('hidden.bs.modal', function () {
          $state.go('landingPage');
        });
      }, function() {
        $scope.title = 'Warning';
        $scope.message = 'Email address already in use.';
        messageModal.modal('show');
      });
      //Jasmine Test
      return true;
    }
    //Jasmine Tests
    return false;
  };

});
