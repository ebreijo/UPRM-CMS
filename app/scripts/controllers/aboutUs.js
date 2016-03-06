'use strict';

var app = angular.module('uprmcmsApp');

app.controller('AboutUsCtrl', function($scope, aboutUs) {
  $scope.aboutUs = aboutUs.aboutUsInfo;
});
