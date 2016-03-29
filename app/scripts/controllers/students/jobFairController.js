'use strict';

var app = angular.module('uprmcmsApp');

app.controller('jobFairCtrl', function($scope) {

  $scope.generalInformation = {
    id: 1,
    headerEnglish: '8th Spring Job Fair',
    locationEnglish: 'Mayaguez Resort & Casino',
    dateEnglish: 'Friday, February 19, 2016',
    time: '8:30am - 2:30pm',
    headerSpanish: '8va Feria de Empleo de Primavera',
    locationSpanish: 'Hotel Mayaguez Resort & Casino',
    dateSpanish: 'viernes, 19 de febrero de 2016',
    resumeDeadlineDate: '2016-02-19T00:00:00.000Z'
  };

  $scope.checkBox = {
    internship: false,
    coop: false,
    partTime: false,
    fullTime: false
  };

  $scope.majors = [
    {
      majorCode: 'CCOM',
      nameEnglish: 'Computer Science',
      nameSpanish: 'Ciencias de Computos'
    },
    {
      majorCode: 'ICOM',
      nameEnglish: 'Computer Engineering',
      nameSpanish: 'Ingenieria en Computadoras'
    },
    {
      majorCode: 'ININ',
      nameEnglish: 'Industrial Engineering',
      nameSpanish: 'Ingenieria Industrial'
    },
    {
      majorCode: 'INME',
      nameEnglish: 'Mechanical Engineering',
      nameSpanish: 'Ingenieria Mecanica'
    },
    {
      majorCode: 'INSO',
      nameEnglish: 'Software Engineering',
      nameSpanish: 'Ingenieria de Software'
    }
  ];



  $scope.jobFairCompanies = [
    {
      companyName: 'Apple',
      minGpa: 3.4,
      extraInformation: 'This is Apple attending the Job Fair',
      collectingResumesBeforeJobFair: true,
      mustFillOnline: false,
      interviewsDuringWeekend: true,
      websiteApplication: 'http://www.apple.com/jobs/us/',
      lookingFor: [
        {
          companyName: 'Apple',
          jobPosition: 'Internship'
        },
        {
          companyName: 'Apple',
          jobPosition: 'Full-Time'
        }
      ],
      interestedMajors: [
        {
          companyName: 'Apple',
          majorCode: 'ICOM'
        },
        {
          companyName: 'Apple',
          majorCode: 'CCOM'
        }
      ]
    },
    {
      companyName: 'IBM',
      minGpa: 3.3,
      extraInformation: 'This is a company attending the Job Fair',
      collectingResumesBeforeJobFair: true,
      mustFillOnline: false,
      interviewsDuringWeekend: true,
      websiteApplication: 'http://www-03.ibm.com/employment/us/',
      lookingFor: [
        {
          companyName: 'IBM',
          jobPosition: 'Internship'
        },
        {
          companyName: 'IBM',
          jobPosition: 'Full-Time'
        }
      ],
      interestedMajors: [
        {
          companyName: 'IBM',
          majorCode: 'ICOM'
        },
        {
          companyName: 'IBM',
          majorCode: 'CCOM'
        },
        {
          companyName: 'IBM',
          majorCode: 'INSO'
        }
      ]
    },
    {
      companyName: 'Drug Enforcement Administration',
      minGpa: 3.0,
      extraInformation: 'This is a company attending the Job Fair',
      collectingResumesBeforeJobFair: true,
      mustFillOnline: true,
      interviewsDuringWeekend: true,
      websiteApplication: 'http://www.dea.gov/careers/occupations.shtml',
      lookingFor: [
        {
          companyName: 'Drug Enforcement Administration',
          jobPosition: 'Internship'
        },
        {
          companyName: 'Drug Enforcement Administration',
          jobPosition: 'Full-Time'
        },
        {
          companyName: 'Drug Enforcement Administration',
          jobPosition: 'COOP'
        }
      ],
      interestedMajors: [
        {
          companyName: 'Drug Enforcement Administration',
          majorCode: 'ICOM'
        },
        {
          companyName: 'Drug Enforcement Administration',
          majorCode: 'CCOM'
        },
        {
          companyName: 'Drug Enforcement Administration',
          majorCode: 'INSO'
        }
      ]
    }
  ];

  $scope.printCheckbox = function() {
    console.log('internship: ' + $scope.checkBox.internship);
    console.log('coop: ' + $scope.checkBox.coop);
    console.log('partTime: ' + $scope.checkBox.partTime);
    console.log('fullTime: ' + $scope.checkBox.fullTime);
    console.log('');
  };

  $scope.getLookingForString = function(lookingFor) {
    var lookingForString = '';

    for(var i = 0; i < lookingFor.length; i++) {
      lookingForString += lookingFor[i].jobPosition;

      if(i !== lookingFor.length - 1) {
        lookingForString += ', ';
      }
    }
    return lookingForString;
  };

  $scope.getInterestedMajorsString = function(interestedMajors) {
    var interestedMajorsString = '';

    for(var i = 0; i < interestedMajors.length; i++) {
      interestedMajorsString += interestedMajors[i].majorCode;

      if(i !== interestedMajors.length - 1) {
        interestedMajorsString += ', ';
      }
    }
    return interestedMajorsString;
  };


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

  // ng-show="majorFilter(company.interestedMajors)"
  // ng-show="lookingForFilter(company.lookingFor)"
  /*
   $scope.checkBox = {
     internship: false,
     coop: false,
     partTime: false,
     fullTime: false
   };
   */

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

});
