'use strict';

var app = angular.module('uprmcmsApp');

//app.controller('AboutUsCtrl', function($scope, aboutUs) {
//$scope.aboutUs = aboutUs.aboutUsInfo;
app.controller('CompanyCtrl', function($scope) {

  var majors = [
    {
      'majorCode': 'CCOM'
    },
    {
      'majorCode': 'ICOM'
    },
    {
      'majorCode': 'INSO'
    },
    {
      'majorCode': 'INME'
    },
    {
      'majorCode': 'INEL'
    }
  ];

  var companyInfo = {
    name: 'IBM',
    websiteUrl: 'http://www.ibm.com/us-en/',
    logoPath: null,
    companyDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat quis elit a vestibulum. Mauris leo sem, lacinia eu dapibus a, tempor eget metus. In vehicula maximus magna. Vestibulum pulvinar purus in tristique pellentesque. Sed porta imperdiet ultricies. Cras ac ipsum aliquam, condimentum risus non, euismod quam. Morbi posuere lobortis auctor. Aliquam massa eros, ultrices a viverra a, lacinia sed sem.',
    companyStatus: 'Active'
  };

  $scope.companyProfile = {
    'generalInfo':[

    ],
    'interestedMajors':[

    ],
    'promotionalMaterial':[
      {

      }
    ],
    'recruiterList':[
      {

      }
    ],
    'requestsInfo':[
      {

      }
    ]
  };

  //For Edit Company Description Modal------------------------------------------------------------

  $scope.tempCompanyInfo = [];

  $scope.companyProfile.generalInfo.push({name: companyInfo.name, websiteUrl: companyInfo.websiteUrl, logoPath: companyInfo.logoPath, companyDescription: companyInfo.companyDescription, companyStatus: companyInfo.companyStatus });

  $scope.tempCompanyInfo.push({name: companyInfo.name, websiteUrl: companyInfo.websiteUrl, logoPath: companyInfo.logoPath, companyDescription: companyInfo.companyDescription, companyStatus: companyInfo.companyStatus });

  $scope.updateCompanyDescription = function(isValid){
    if (isValid){
      $scope.companyProfile.generalInfo[0].websiteUrl = $scope.tempCompanyInfo[0].websiteUrl;
      $scope.companyProfile.generalInfo[0].companyDescription = $scope.tempCompanyInfo[0].companyDescription;
    }
  };

  $scope.closeCompanyDescriptionModal = function(){
    $scope.tempCompanyInfo[0].websiteUrl = $scope.companyProfile.generalInfo[0].websiteUrl;
    $scope.tempCompanyInfo[0].companyDescription = $scope.companyProfile.generalInfo[0].companyDescription;
  };

  //For Edit Interested Majors Modal------------------------------------------------------------

  $scope.majorList = [];

  for (var i = 0; i < majors.length; i++) {
    $scope.majorList.push({name: majors[i].majorCode, value: false});
  }

  $scope.addMajors = function() {
    angular.forEach($scope.majorList, function (item) {
      if (item.value === true && (contains(item.name, $scope.companyProfile.interestedMajors) === false)){
        $scope.companyProfile.interestedMajors.push({name: item.name, value: false});
      }
    });
    updateLists($scope.majorList, $scope.companyProfile.interestedMajors);
  };

  $scope.removeMajors = function() {
    angular.forEach($scope.companyProfile.interestedMajors, function (item) {
      if (item.value === true && (contains(item.name, $scope.majorList) === false)){
        $scope.majorList.push({name: item.name, value: false});
      }
    });
    updateLists($scope.companyProfile.interestedMajors, $scope.majorList);
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

  var contains = function(element, list){
    for (var i = 0; i < list.length; i++) {
      if (list[i].name === element){
        return true;
      }
    }
    return false;
  };

  var clearList = function(list) {
    while(list.length > 0){
      list.pop();
    }
  };

});
