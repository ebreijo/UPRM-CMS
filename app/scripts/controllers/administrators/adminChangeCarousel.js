'use strict';

var app = angular.module('uprmcmsApp');

app.controller('AdminChangeCarousel', function($scope, Pictures) {

  $scope.pictures = Pictures.pictures;
  $scope.selectedPicture = 0;
  $scope.printValue = function(){
    console.log($scope.selectedPicture);
  };

  /*
  {
    "filePath":"lolllllo",
    "fileLabel":"laFoto"
  }
  */

  /* jshint ignore:start */
  $scope.uploadPictureConfig = {
    'options': { // passed into the Dropzone constructor
      'url': '/api/pictures',
      'paramName': 'image',     // The name that will be used to transfer the file
      'maxFilesize': 2, // in MBs
      'maxFiles': 1,
      'acceptedFiles': 'image/jpeg,image/png',
      'createImageThumbnails': false
    },
    'eventHandlers': {
      'sending': function (file, xhr, formData) {
        console.log('Sending!!!!');
      },
      'success': function (file, response) {
        console.log('Success!!!!');
        this.removeAllFiles();
        Pictures.updateLandingPagePicture({'filePath': response.filePath, 'fileLabel':response.fileLabel}, $scope.selectedPicture+1);
        $scope.pictures[$scope.selectedPicture].filePath = response.filePath;
      },
      'error': function(file, response) {
        this.removeAllFiles();
        alert('ERROR: File Too Large!');
      }
    }
  };
  /* jshint ignore:end */

});
