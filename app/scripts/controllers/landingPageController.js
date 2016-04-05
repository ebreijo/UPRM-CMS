'use strict';

var app = angular.module('uprmcmsApp');
//var CryptoJS = require('crypto-js');

app.controller('LandingPageCtrl', function($scope, Pictures) {
  $scope.pictures = Pictures.pictures;

  /*
  $scope.decrypted = function() {
    var decrypted = CryptoJS.AES.decrypt('U2FsdGVkX1/VDopBc9rLEzuBzotckwZsHfBM6oJZRPY=', 'SPumKMp6VDSaOv1F3wKVcF9W+5XBNypn52IcHVNpLbs=').toString();
    return CryptoJS.enc.Utf8.stringify(decrypted);
  };
  */

  $scope.dropzoneConfig = {
    'options': { // passed into the Dropzone constructor
      'url': '/api/pictures',
      'paramName' : 'image', // The name that will be used to transfer the file
      'maxFilesize': 10 // MB
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

  // Once the view is loaded, parse the Facebook plugin and load the slider
  $scope.$on('$viewContentLoaded', function() {
    /* jshint ignore:start */
    FB.XFBML.parse(document.getElementById('promo-facebook-plugin'));
    /* jshint ignore:end */

    // Slider
    $(document).ready(function() {
      $('.flexslider').flexslider({
        animation: 'slide'
      });
    });
  });

});
