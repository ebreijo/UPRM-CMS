'use strict';

var app = angular.module('uprmcmsApp');

app.controller('jobOffersCtrl', function($scope, JobOffers) {

  $scope.jobOffers = JobOffers.getAllApprovedJobOffers();

  $scope.companyFilter = function(majorList, lookingForList){
    return $scope.majorFilter(majorList) && $scope.lookingForFilter(lookingForList);
  };

  /*
  $scope.majorFilter = function(majorList) {
    if ($scope.majorSelected === 'All'){
      return true;
    }
    for (var i = 0; i < majorList.length; i++){
      if ($scope.majorSelected === majorList[i].majorCode){
        return true;
      }
    }
    return false;
  };

  $scope.lookingForFilter = function(lookingForList) {
    if(noItemsAreChecked()){
      return true;
    } else {
      var checkBoxCounter = getCheckboxCounter();
      var count = 0;
      if($scope.checkBox.internship === true && contains(lookingForList, 'Internship')) {
        count++;
      }
      if($scope.checkBox.coop === true && contains(lookingForList, 'COOP')){
        count++;
      }
      if($scope.checkBox.partTime === true && contains(lookingForList, 'Part-Time')){
        count++;
      }
      if($scope.checkBox.fullTime === true && contains(lookingForList, 'Full-Time')){
        count++;
      }
      return count === checkBoxCounter;
    }
  };

  function getCheckboxCounter(){
    var count = 0;
    if($scope.checkBox.internship === true) {
      count++;
    }
    if($scope.checkBox.coop === true){
      count++;
    }
    if($scope.checkBox.partTime === true){
      count++;
    }
    if($scope.checkBox.fullTime === true){
      count++;
    }
    return count;
  }

  function contains(list, position){
    for(var i = 0; i < list.length; i++){
      if(list[i].jobPosition === position){
        return true;
      }
    }
    return false;
  }

  function noItemsAreChecked() {
    return $scope.checkBox.internship === false &&
      $scope.checkBox.coop === false &&
      $scope.checkBox.partTime === false &&
      $scope.checkBox.fullTime === false;
  }
  */

});
