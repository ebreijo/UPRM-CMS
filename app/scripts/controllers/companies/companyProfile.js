'use strict';

var app = angular.module('uprmcmsApp');

//app.controller('AboutUsCtrl', function($scope, aboutUs) {
//$scope.aboutUs = aboutUs.aboutUsInfo;
app.controller('CompanyCtrl', function($scope) {

  $scope.tempCompanyInfo = [];


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

  var companyInfo = {
    name: "IBM",
    websiteUrl: "http://www.ibm.com/us-en/",
    logoPath: null,
    companyDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat quis elit a vestibulum. Mauris leo sem, lacinia eu dapibus a, tempor eget metus. In vehicula maximus magna. Vestibulum pulvinar purus in tristique pellentesque. Sed porta imperdiet ultricies. Cras ac ipsum aliquam, condimentum risus non, euismod quam. Morbi posuere lobortis auctor. Aliquam massa eros, ultrices a viverra a, lacinia sed sem.",
    companyStatus: "Active"
  };

  $scope.companyProfile = {
    'generalInfo':[

    ],
    'interestedMajors':[
      {

      }
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

  $scope.companyProfile.generalInfo.push({name: companyInfo.name, websiteUrl: companyInfo.websiteUrl, logoPath: companyInfo.logoPath, companyDescription: companyInfo.companyDescription, companyStatus: companyInfo.companyStatus });

  $scope.tempCompanyInfo.push({name: companyInfo.name, websiteUrl: companyInfo.websiteUrl, logoPath: companyInfo.logoPath, companyDescription: companyInfo.companyDescription, companyStatus: companyInfo.companyStatus });

  $scope.updateCompanyDescription = function(isValid){
    if (isValid){
      $scope.companyProfile.generalInfo[0].websiteUrl = $scope.tempCompanyInfo[0].websiteUrl;
      $scope.companyProfile.generalInfo[0].companyDescription = $scope.tempCompanyInfo[0].companyDescription;
    }
  };

});
