'use strict';

var app = angular.module('uprmcmsApp');

app.controller('CompanyRegistrationCtrl', function($scope, $state) {

  $scope.majorList = [];
  $scope.majorsSelected = [];

  var majors = [
    {
      'majorCode': 'CCOM',
      'nameEnglish': 'Computer Science',
      'nameSpanish': 'Ciencias de Computos'
    },
    {
      'majorCode': 'ICOM',
      'nameEnglish': 'Computer Engineering',
      'nameSpanish': 'Ingenieria en Computadoras'
    },
    {
      'majorCode': 'INSO',
      'nameEnglish': 'Software Engineering',
      'nameSpanish': 'Ingenieria de Software'
    },
    {
      'majorCode': 'INME',
      'nameEnglish': 'Mechanical Engineering',
      'nameSpanish': 'Ingenieria Mecanica'
    },
    {
      'majorCode': 'INEL',
      'nameEnglish': 'Electrical Engineering',
      'nameSpanish': 'Ingenieria Electrica'
    }
  ];


  for (var i = 0; i < majors.length; i++) {
    $scope.majorList.push({name: majors[i].majorCode, value: false});
  }

  var contains = function(element, list){
    for (var i = 0; i < list.length; i++) {
      if (list[i].name === element){
        return true;
      }
    }
    return false;
  };

  $scope.addMajors = function() {
    // check to make sure the form is completely valid
    angular.forEach($scope.majorList, function (item) {
      if (item.value === true && (contains(item.name, $scope.majorsSelected) === false)){
        $scope.majorsSelected.push({name: majors[i].majorCode, value: false});
      }
    });
  };

  $scope.registerLocation = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      $state.go('company');
    }
  };

});
