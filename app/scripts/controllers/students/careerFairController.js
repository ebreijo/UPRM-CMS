'use strict';

var app = angular.module('uprmcmsApp');

app.controller('CareerFairCtrl', function($scope) {

  $scope.jobFairCompanies = [
    {
      companyName: "Apple",
      minGpa: 3.4,
      extraInformation: "This is Apple attending the Job Fair",
      collectingResumesBeforeJobFair: true,
      mustFillOnline: false,
      interviewsDuringWeekend: true,
      websiteApplication: "http://www.apple.com/jobs/us/",
      lookingFor: [
        {
          companyName: "Apple",
          jobPosition: "Internship"
        },
        {
          companyName: "Apple",
          jobPosition: "Full-Time"
        }
      ],
      interestedMajors: [
        {
          companyName: "Apple",
          majorCode: "ICOM"
        },
        {
          companyName: "Apple",
          majorCode: "CCOM"
        }
      ]
    },
    {
      companyName: "IBM",
      minGpa: 3.3,
      extraInformation: "This is a company attending the Job Fair",
      collectingResumesBeforeJobFair: true,
      mustFillOnline: false,
      interviewsDuringWeekend: true,
      websiteApplication: "http://www-03.ibm.com/employment/us/",
      lookingFor: [
        {
          companyName: "IBM",
          jobPosition: "Internship"
        },
        {
          companyName: "IBM",
          jobPosition: "Full-Time"
        }
      ],
      interestedMajors: [
        {
          companyName: "IBM",
          majorCode: "ICOM"
        },
        {
          companyName: "IBM",
          majorCode: "CCOM"
        },
        {
          companyName: "IBM",
          majorCode: "INSO"
        }
      ]
    },
    {
      companyName: "Drug Enforcement Administration",
      minGpa: 3.0,
      extraInformation: "This is a company attending the Job Fair",
      collectingResumesBeforeJobFair: true,
      mustFillOnline: true,
      interviewsDuringWeekend: true,
      websiteApplication: "www.doj.gov",
      lookingFor: [
        {
          companyName: "Drug Enforcement Administration",
          jobPosition: "Internship"
        },
        {
          companyName: "Drug Enforcement Administration",
          jobPosition: "Full-Time"
        }
      ],
      interestedMajors: [
        {
          companyName: "Drug Enforcement Administration",
          majorCode: "ICOM"
        },
        {
          companyName: "Drug Enforcement Administration",
          majorCode: "CCOM"
        },
        {
          companyName: "Drug Enforcement Administration",
          majorCode: "INSO"
        }
      ]
    }
  ];

  $scope.getLookingForString = function(lookingFor) {
    var lookingForString = '';

    for(var i = 0; i < lookingFor.length; i++) {
      lookingForString += lookingFor[i].jobPosition;

      if(i != lookingFor.length - 1) {
        lookingForString += ', ';
      }
    }
    return lookingForString;
  };

  $scope.getInterestedMajorsString = function(interestedMajors) {
    var interestedMajorsString = '';

    for(var i = 0; i < interestedMajors.length; i++) {
      interestedMajorsString += interestedMajors[i].majorCode;

      if(i != interestedMajors.length - 1) {
        interestedMajorsString += ', ';
      }
    }
    return interestedMajorsString;
  };

});
