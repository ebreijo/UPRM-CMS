'use strict';

var app = angular.module('uprmcmsApp');

app.controller('LandingPageCtrl', function($scope, Pictures) {
  $scope.pictures = Pictures.pictures;

  // Once the view is loaded, parse the Facebook plugin and load the slider
  $scope.$on('$viewContentLoaded', function() {
    /* jshint ignore:start */
    setTimeout(function() {
      FB.XFBML.parse(document.getElementById('promo-facebook-plugin'));
    }, 100);
    /* jshint ignore:end */

    // Slider
    $(document).ready(function() {
      setTimeout(function() {
        $('.flexslider').flexslider({
          animation: 'slide',
          touch: true
        }).show();
      }, 100);
    });
  });

});
