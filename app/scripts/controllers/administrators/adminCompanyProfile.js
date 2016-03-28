'use strict';

var app = angular.module('uprmcmsApp');


app.controller('AdminCompanyProfileCtrl', function($scope, adminCompanyPromise, $stateParams) {

  $scope.company = adminCompanyPromise;

  console.log($stateParams);

});
