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

  $scope.submitForm = function(isValid, type) {

    // check to make sure the form is completely valid
    if (isValid && type==='page') {
      for (var i = 0; i < $scope.users.length; i++) {
        if (($scope.user.email === $scope.users[i].email) && ($scope.user.password === $scope.users[i].password)){
          $scope.show = false;
          $state.go('company');
        }
      }
      $scope.show = true;
      return $scope.show;
    }
    else if(isValid && type==='modal'){
      for (var j = 0; j < $scope.users.length; j++) {
        if (($scope.modalEmail === $scope.users[j].email)){
          $scope.modalShow = false;
          return $scope.modalShow;
        }
      }
      $scope.modalShow = true;
      return $scope.modalShow;
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
