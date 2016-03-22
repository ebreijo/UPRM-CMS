'use strict';

var app = angular.module('uprmcmsApp');

app.controller('LandingPageCtrl', function($scope) {

  $scope.dropzoneConfig = {
    'options': { // passed into the Dropzone constructor
      'url': '/api/pictures',
      'paramName' : 'image', // The name that will be used to transfer the file
      'maxFilesize': 1 // MB
    },
    'eventHandlers': {
      'sending': function (file, xhr, formData) {
        console.log('Sending!!!!');
        console.log(file + xhr + formData);
      },
      'success': function (file, response) {
        console.log('Success!!!!');
        console.log(file + response);
      }
    }
  };

  $scope.$on('$viewContentLoaded', function() {
    /* jshint ignore:start */
    FB.XFBML.parse(document.getElementById('promo-facebook-plugin'));
    /* jshint ignore:end */
  });

});
