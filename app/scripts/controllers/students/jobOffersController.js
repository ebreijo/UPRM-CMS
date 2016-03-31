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

  $scope.printCheckbox = function() {
    console.log('internship: ' + $scope.checkBox.internship);
    console.log('coop: ' + $scope.checkBox.coop);
    console.log('partTime: ' + $scope.checkBox.partTime);
    console.log('fullTime: ' + $scope.checkBox.fullTime);
    console.log('');
  };

  // TODO: FIX FILTER
  $scope.lookingForFilter = function(lookingForList) {
    if(noItemsAreChecked()){
      return true;
    } else {
      var educationalLevel = lookingForList[0].educationalLevel;
      console.log(educationalLevel);
      if($scope.checkBox.internship === true) {
        return true;
      }
      if($scope.checkBox.coop === true){
        return true;
      }
      if($scope.checkBox.partTime === true){
        return true;
      }
      if($scope.checkBox.fullTime === true){
        return true;
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
