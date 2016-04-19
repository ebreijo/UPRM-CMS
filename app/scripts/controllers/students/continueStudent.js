'use strict';

var app = angular.module('uprmcmsApp');

app.controller('ContinueStudentCtrl', function($scope, Auth, $state, $stateParams) {

  $scope.continueStudent = function() {
    Auth.studentLogin({param: $stateParams.ticket}).then(function() {
      $state.go('jobFair');
    }).catch(function() {
      $state.go('landingPage');
    });
  };

});

