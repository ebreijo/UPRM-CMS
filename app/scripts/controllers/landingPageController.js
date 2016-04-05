'use strict';

var app = angular.module('uprmcmsApp');

app.controller('LandingPageCtrl', function($scope, $crypto, Pictures) {

  $scope.encrypted = $crypto.encrypt('loll');
  //$scope.encrypted = CryptoJS.AES("Message", 'FD477B24F877040A6E9865CC5E9646B7BF76C0006A53ADC1');
  //$scope.decrypted = $crypto.decrypt('AwFp1kRpiXdJLY3jn9YoNrYhLlDipiatYmJ/JZXXlvONJQUbqqcOYYdW9hGIFQFzaU6+7H8JDcKcBab+wSf0z4/cpEFH72H9DP2HlyMmLzUmQuqXsXDZRPLxZVoPTMyuTTc=');

  $scope.pictures = Pictures.pictures;

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
