'use strict';

var app = angular.module('uprmcmsApp');

app.controller('AdminChangeCarousel', function($scope, Pictures, cfpLoadingBar) {

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

  $scope.uploadPictureConfig = {
    'options': { // passed into the Dropzone constructor
      'url': '/api/pictures',
      'paramName': 'image',     // The name that will be used to transfer the file
      'maxFilesize': 5, // in MBs
      'maxFiles': 1,
      'acceptedFiles': 'image/jpeg,image/png',
      'createImageThumbnails': false
    },
    'eventHandlers': {
      'sending': function () {
        console.log('Sending!!!!');
        cfpLoadingBar.start();
      },
      'success': function (file, response) {
        console.log('Success!!!!');
        cfpLoadingBar.complete();
        this.removeAllFiles();
        Pictures.updateLandingPagePicture({'filePath': response.filePath, 'fileLabel':response.fileLabel}, $scope.selectedPicture+1);
        $scope.pictures[$scope.selectedPicture].filePath = response.filePath;
      },
      'error': function() {
        this.removeAllFiles();
        /* jshint ignore:start */
        alert('ERROR: File Too Large!');
        /* jshint ignore:end */
      }
    }
  };

});
