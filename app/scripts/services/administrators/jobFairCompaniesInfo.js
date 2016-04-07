'use strict';

var app = angular.module('uprmcmsApp');

app.factory('JobFairCompaniesInfo', function(_) {
  var obj = {
    jobFairCompaniesInfo: [
      {
        companyName: 'Apple',
        minGpa: 3.4,
        extraInformation: 'This is Apple attending the Job Fair',
        collectingResumesBeforeJobFair: true,
        mustFillOnline: false,
        interviewsDuringWeekend: false,
        attending: true,
        websiteApplication: 'http://www.apple.com/jobs/us/'
      },
      {
        companyName: 'IBM',
        minGpa: 3.3,
        extraInformation: 'This is a company attending the Job Fair',
        collectingResumesBeforeJobFair: true,
        mustFillOnline: false,
        interviewsDuringWeekend: true,
        attending: true,
        websiteApplication: 'http://www-03.ibm.com/employment/us/'
      }
    ]
  };

  // TODO: Make a request to get the job fair additional information for all companies
  obj.getJobFairCompaniesInfo = function() {
    return this.jobFairCompaniesInfo;
  };

  // TODO: Make a request to get the job fair additional information per company
  obj.getJobFairInfoPerCompany = function(companyName) {
    return _.find(this.jobFairCompaniesInfo, { companyName: companyName});
  };

  // TODO: Make a request to update the job fair additional information per company
  obj.updateJobFairInfoPerCompany = function(jobFairInfo) {
    var element = _.find(this.jobFairCompaniesInfo, { companyName: jobFairInfo.companyName});
    if (element) {
      _.merge(element, jobFairInfo);
    } else {
      this.jobFairCompaniesInfo.push(jobFairInfo);
    }
  };

  return obj;
});
