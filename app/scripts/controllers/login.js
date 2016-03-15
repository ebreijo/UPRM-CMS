'use strict';

var app = angular.module('uprmcmsApp');

//app.controller('AboutUsCtrl', function($scope, aboutUs) {
//$scope.aboutUs = aboutUs.aboutUsInfo;
app.controller('LoginCtrl', function($scope, $state) {

  //emails
     //user1@ibm.com
     //user34@foundation.org
  //Passwords
     //jwjefW@34
     //9Tbfdh#ld


  $scope.submitForm = function(isValid) {

    // check to make sure the form is completely valid
    if (isValid) {
      for (var i = 0; i < $scope.users.length; i++) {
        if (($scope.user.email === $scope.users[i].email) && ($scope.user.password === $scope.users[i].password)){
          $scope.show = false;
          $state.go('company');
        }
        else {
          $scope.show = true;
        }
      }
    }

  };

  $scope.users = [
    {
      'email': 'user1@ibm.com',
      'password': 'jwjefW@34',
      //'isRoot': false,
      //'adminAccountStatus': 'active'
    },
    {
      'email': 'user34@foundation.org',
      'password': '9Tbfdh#ld',
      //'email': 'placement@uprm.edu',
      //'isRoot': true,
      //'adminAccountStatus': 'active'
    }
  ];

});
