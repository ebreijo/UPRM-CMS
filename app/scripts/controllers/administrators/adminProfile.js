'use strict';

var app = angular.module('uprmcmsApp');


app.controller('AdminProfileCtrl', function($scope, Companies) {

  $scope.companies = Companies.companies;

});
