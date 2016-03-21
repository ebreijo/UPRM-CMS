'use strict';

var app = angular.module('uprmcmsApp');

app.controller('RecruiterRegistrationCtrl', function($scope, $state, localStorageService) {

  $scope.companyName = localStorageService.get('companyToRegister');


});
