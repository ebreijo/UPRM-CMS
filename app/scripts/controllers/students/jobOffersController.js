'use strict';

var app = angular.module('uprmcmsApp');

app.controller('jobOffersCtrl', function($scope, JobOffers) {

  $scope.jobOffers = JobOffers.getAllApprovedJobOffers();

  $scope.checkBox = {
    internship: false,
    coop: false,
    partTime: false,
    fullTime: false
  };

  $scope.lookingForFilter = function(jobPosition) {
    if(noItemsAreChecked()){
      return true;
    } else {
      if(jobPosition === 'Internship') {
        return $scope.checkBox.internship;
      }
      if(jobPosition === 'CO-OP'){
        return $scope.checkBox.coop;
      }
      if(jobPosition === 'Part-Time'){
        return $scope.checkBox.partTime;
      }
      if(jobPosition === 'Full-Time'){
        return $scope.checkBox.fullTime;
      }
      return false;
    }
  };

  function noItemsAreChecked() {
    return $scope.checkBox.internship === false &&
      $scope.checkBox.coop === false &&
      $scope.checkBox.partTime === false &&
      $scope.checkBox.fullTime === false;
  }

});
