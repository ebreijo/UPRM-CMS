'use strict';

var app = angular.module('uprmcmsApp');

//app.controller('AboutUsCtrl', function($scope, aboutUs) {
//$scope.aboutUs = aboutUs.aboutUsInfo;
app.controller('CompanyCtrl', function($scope) {

  //emails
  //user1@ibm.com
  //user34@foundation.org
  //Passwords
  //jwjefW@34
  //9Tbfdh#ld


  $scope.submitForm = function() {
    // check to make sure the form is completely valid
    if (isValid) {

      for (i = 0; i < $scope.users.length; i++) {
        if (($scope.user.email == $scope.users[i].email) && ($scope.user.password == $scope.users[i].password)){
          return true;
        }
        else {
          return false;
        }
      }
    }

  };

  $scope.users = [
    {
      "email": "user1@ibm.com",
      "password": "jwjefW@34",
      //"isRoot": false,
      //"adminAccountStatus": "active"
    },
    {
      "email": "user34@foundation.org",
      "password": "9Tbfdh#ld",
      //"email": "placement@uprm.edu",
      //"isRoot": true,
      //"adminAccountStatus": "active"
    }
  ]

});
