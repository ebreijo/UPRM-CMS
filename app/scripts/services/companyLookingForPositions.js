'use strict';

var app = angular.module('uprmcmsApp');

app.factory('CompanyLookingForPositions', function(_) {
  var obj = {
    companyLookingForPositions: [
      {
        companyName: 'IBM',
        jobPosition: 'Internship',
        status: true
      },
      {
        companyName: 'IBM',
        jobPosition: 'Full-Time',
        status: true
      },
      {
        companyName: 'Apple',
        jobPosition: 'Internship',
        status: true
      },
      {
        companyName: 'Apple',
        jobPosition: 'Full-Time',
        status: true
      }
    ]
  };

  // TODO: Make a request to get the job fair company looking for position per company
  obj.getCompanyLookingForPositions = function(companyName) {
    return _.filter(this.companyLookingForPositions, { companyName: companyName});
  };

  // TODO: Make a request to update the jjob fair company looking for position per company
  obj.updateCompanyLookingForPositions = function(companyLookingForPositions) {
    var self = this;
    _.each(companyLookingForPositions,  function(companyPosition) {
      var element = _.find(self.companyLookingForPositions, { companyName: companyPosition.companyName, jobPosition: companyPosition.jobPosition});
      if (element) {
        _.merge(element, companyPosition);
      } else {
        self.companyLookingForPositions.push(companyPosition);
      }
    });
  };

  return obj;
});
