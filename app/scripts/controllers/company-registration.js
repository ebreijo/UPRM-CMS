'use strict';

var app = angular.module('uprmcmsApp');

app.controller('CompanyRegistrationCtrl', function($scope, $state, Registration, FileUpload) {

  $scope.fileUploadConfig = FileUpload.fileUploadConfig('/api/pictures', 'image', 10);

  var messageModal = $('#messageModal');

  $scope.registerCompany = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      var userInfo = {
        companyInfo: $scope.company,
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
        $scope.message = 'Company or Email address already exist.';
        messageModal.modal('show');
      });
      //Jasmine Test
      return true;
    }
    //Jasmine Test
    return false;
  };

});
