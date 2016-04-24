/* jshint ignore:start */
'use strict';

var app = angular.module('uprmcmsApp');

app.controller('CompanyRegistrationCtrl', function($scope, $state, Registration, Companies) {

  // Cleanup after leaving
  $scope.$on('$destroy', function() {
    if($scope.logoPath !== undefined){
      Companies.logoCleanup({logoPath: $scope.logoPath});
    }
  });

  //$scope.fileUploadConfig = FileUpload.fileUploadConfig('/api/companies/logos', 'image', 10);
  $scope.fileUploadConfig = {
    'options': { // passed into the Dropzone constructor
      'url': '/api/companies/logos',
      'paramName': 'image',     // The name that will be used to transfer the file
      'maxFilesize': 2, // in MBs
      'maxFiles': 2,
      'acceptedFiles': 'image/jpeg,image/png',
      'autoProcessQueue': false
    },
    'eventHandlers': {
      'sending': function (file, xhr, formData) {
        console.log('Sending!!!!');
      },
      'success': function (file, response) {
        console.log('Success!!!!');
        if(this.files.length === 2){
          this.removeFile(this.files[0]);
        }
        $scope.logoPath = response.filePath;
      },
      'error': function(file, response) {
        this.removeAllFiles();
        alert('Error:' + response.error.message);
      }
    }
  };


  var messageModal = $('#messageModal');

  $scope.registerCompany = function(isValid) {
    // If Logo was selected, upload logo here.
    if($scope.logoPath !== undefined){
      $('#fileUpload').get(0).dropzone.getAcceptedFiles().then(function(){
        submitData(isValid)
      });
    } else {
      submitData(isValid)
    }
  };

  function submitData(isValid){
    // check to make sure the form is completely valid
    if (isValid) {
      if($scope.logoPath){
        $scope.company.logoPath = $scope.logoPath;
      }
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
/* jshint ignore:end */

