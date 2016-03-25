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

  /*
  var contains = function(element, list){
    alert('Test');
    for (var i = 0; i < list.length; i++) {
      if (list[i].name === element){
        alert('true');
        return true;
      }
    }
    alert('false');
    return false;
  }
  */

  var contains = function(){
    //alert('test');
  };

  $scope.addMajors = function() {
    // check to make sure the form is completely valid
    angular.forEach($scope.majorList, function (item) {
      if (item.value === true){
        contains();
        $scope.majorsSelected.push(item);
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
