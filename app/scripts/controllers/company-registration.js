'use strict';

var app = angular.module('uprmcmsApp');

app.controller('CompanyRegistrationCtrl', function($scope, $state) {

  $scope.majorList = [];
  $scope.majorsSelected = [];

  $scope.dropzoneConfig = {
    'options': { // passed into the Dropzone constructor
      'url': '/api/pictures',
      'paramName' : 'image', // The name that will be used to transfer the file
      'maxFilesize': 10 // MB
    },
    'eventHandlers': {
      'sending': function (file, xhr, formData) {
        console.log('Sending!!!!');
        console.log(file + xhr + formData);
      },
      'success': function (file, response) {
        console.log('Success!!!!');
        console.log(file + response);
      }
    }
  };


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
    angular.forEach($scope.majorList, function (item) {
      if (item.value === true && (contains(item.name, $scope.majorsSelected) === false)){
        $scope.majorsSelected.push({name: item.name, value: false});
      }
    });
    updateLists($scope.majorList, $scope.majorsSelected);
  };

  $scope.removeMajors = function() {
    angular.forEach($scope.majorsSelected, function (item) {
      if (item.value === true && (contains(item.name, $scope.majorList) === false)){
        $scope.majorList.push({name: item.name, value: false});
      }
    });
    updateLists($scope.majorsSelected, $scope.majorList);
  };

  var updateLists = function(list1, list2) {
    var tempList = [];
    angular.forEach(list1, function(item) {
      if(!contains(item.name, list2)){
        tempList.push(item);
      }
    });
    clearList(list1);
    angular.forEach(tempList, function(item) {
      list1.push(item);
    });
  };

  var clearList = function(list) {
    while(list.length > 0){
      list.pop();
    }
  };

  $scope.registerCompany = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      $state.go('company');
      //Jasmine Test
      return true;
    }
    //Jasmine Test
    return false;
  };

});
