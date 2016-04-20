'use strict';

var app = angular.module('uprmcmsApp');

app.controller('AdminChangeCarousel', function($scope, Pictures) {

  $scope.lol = 'lol';
  $scope.pictures = Pictures.pictures;

});
