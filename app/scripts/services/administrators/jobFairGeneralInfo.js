'use strict';

var app = angular.module('uprmcmsApp');

app.factory('JobFairGeneralInfo', function(_) {
  var obj = {
    jobFairGeneralInfo: {
      id: 1,
      headerEnglish: '8th Spring Job Fair',
      locationEnglish: 'Mayaguez Resort & Casino',
      dateEnglish: 'Friday, February 19, 2016',
      time: '8:30am - 2:30pm',
      headerSpanish: '8va Feria de Empleo de Primavera',
      locationSpanish: 'Hotel Mayaguez Resort & Casino',
      dateSpanish: 'viernes, 19 de febrero de 2016',
      resumeDeadlineDate: '2016-02-19T00:00:00.000Z',
      showResumeDeadlineDate: true
    }
  };

  // TODO: Make a request to get the job fair date information
  obj.getJobFairDate = function() {
    return this.jobFairGeneralInfo;
  };

  // TODO: Make a request to update the job fair date information
  obj.updateJobFairDateInfo = function(jobFairDate) {
    _.merge(this.jobFairGeneralInfo, jobFairDate);
  };

  return obj;
});
