'use strict';

var app = angular.module('uprmcmsApp');

app.controller('AboutUsCtrl', function($scope, AboutUs) {

  $scope.aboutUs = AboutUs.aboutUsInfo;

});
