/* jshint ignore:start */
'use strict';

var app = angular.module('uprmcmsApp');

app.controller('CompanyRegistrationCtrl', function($scope, $state, Registration, Companies) {

  //$scope.fileUploadConfig = FileUpload.fileUploadConfig('/api/companies/logos', 'image', 10);
  $scope.fileUploadConfig = {
    'options': { // passed into the Dropzone constructor
      'url': '/api/companies/logos',
      'paramName': 'image',     // The name that will be used to transfer the file
      'maxFilesize': 2, // in MBs
      'maxFiles': 2,
      'acceptedFiles': 'image/jpeg,image/png'
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
        Companies.logoCleanup({logoPath: $scope.logoPath});
      },
      'error': function(file, response) {
        this.removeAllFiles();
        alert('ERROR: File Too Large!');
      }
    }
  };


  var messageModal = $('#messageModal');

  $scope.registerCompany = function(isValid) {
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

