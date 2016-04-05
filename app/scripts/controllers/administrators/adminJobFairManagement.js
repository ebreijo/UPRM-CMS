'use strict';

var app = angular.module('uprmcmsApp');

app.controller('adminJobFairManagementCtrl', function($scope, _) {

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

  var majors = [
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



  var jobFairCompanies = [
    {
      companyName: 'Apple',
      minGpa: 3.4,
      extraInformation: 'This is Apple attending the Job Fair',
      collectingResumesBeforeJobFair: true,
      mustFillOnline: false,
      interviewsDuringWeekend: true,
      websiteApplication: 'http://www.apple.com/jobs/us/',
      attending: true,
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
      attending: false,
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
      attending: true,
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

  $scope.jobFairCompaniesList = [];
  $scope.jobFairCompanyItem = {};

  $scope.jobPositionInternship = null;
  $scope.jobPositionFullTime = null;
  $scope.jobPositionPartTime = null;
  $scope.jobPositionCOOP = null;

  $scope.majorList = [];


  for (var i = 0; i < jobFairCompanies.length; i++) {
    $scope.jobFairCompaniesList.push(jobFairCompanies[i]);
  }

  $scope.getJobFairCompanyItem = function(companySelected){
    if (companySelected==='Add New Company'){
      //$scope.jobFairCompanyItem = null;
      $scope.jobFairCompanyItem= { lookingFor: [], interestedMajors: [] };
      $scope.jobPositionInternship = null;
      $scope.jobPositionFullTime = null;
      $scope.jobPositionPartTime = null;
      $scope.jobPositionCOOP = null;
      $scope.majorList = [];
      for (i = 0; i < majors.length; i++) {
        $scope.majorList.push({majorCode: majors[i].majorCode, value: false});
      }
    }
    else {
      for (i = 0; i < $scope.jobFairCompaniesList.length; i++) {
        if ($scope.jobFairCompaniesList[i].companyName===companySelected && companySelected!=='Add New Company'){
          $scope.jobFairCompanyItem = angular.copy($scope.jobFairCompaniesList[i]);
          for (i = 0; i < $scope.jobFairCompanyItem.lookingFor.length; i++) {
            if ($scope.jobFairCompanyItem.lookingFor[i].jobPosition==='Internship'){
              $scope.jobPositionInternship = true;
            }
            else if ($scope.jobFairCompanyItem.lookingFor[i].jobPosition==='Full-Time'){
              $scope.jobPositionFullTime = true;
            }
            else if ($scope.jobFairCompanyItem.lookingFor[i].jobPosition==='COOP'){
              $scope.jobPositionCOOP = true;
            }
            else if ($scope.jobFairCompanyItem.lookingFor[i].jobPosition==='Part-Time'){
              $scope.jobPositionPartTime = true;
            }
          }
          $scope.majorList = [];
          for (i = 0; i < majors.length; i++) {
            if((!contains(majors[i].majorCode,$scope.jobFairCompanyItem.interestedMajors))){
              $scope.majorList.push({majorCode: majors[i].majorCode, value: false});
            }
          }
          for (i = 0; i < $scope.jobFairCompanyItem.interestedMajors.length; i++) {
            $scope.jobFairCompanyItem.interestedMajors.arr.splice(0, 0, {majorCode: $scope.jobFairCompanyItem.interestedMajors.pop().majorCode, value: false});
          }
        }
      }
    }
  };

  $scope.addMajors = function() {
    var tempList = [];
    angular.forEach($scope.majorList, function (item) {
      tempList.push(item);
    });
    angular.forEach(tempList, function (item) {
      if (item.value === true && (contains(item.majorCode, $scope.jobFairCompanyItem.interestedMajors) === false)){
        $scope.jobFairCompanyItem.interestedMajors.push({majorCode: item.majorCode, value: false});
        _.remove($scope.majorList, item);
      }
    });
  };

  $scope.removeMajors = function() {
    var tempList = [];
    angular.forEach($scope.jobFairCompanyItem.interestedMajors, function (item) {
      tempList.push(item);
    });
    angular.forEach(tempList, function (item) {
      if (item.value === true && (contains(item.majorCode, $scope.majorList) === false)){
        $scope.majorList.push({majorCode: item.majorCode, value: false});
        _.remove($scope.jobFairCompanyItem.interestedMajors, item);
      }
    });
  };

  var contains = function(element, list){
    for (var i = 0; i < list.length; i++) {
      if (list[i].majorCode === element){
        return true;
      }
    }
    return false;
  };

});
