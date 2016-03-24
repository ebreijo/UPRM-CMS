'use strict';

var app = angular.module('uprmcmsApp');

app.controller('CompanyRegistrationCtrl', function($scope, $state) {

  $scope.registerLocation = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      $state.go('company');
    }
  };


});
