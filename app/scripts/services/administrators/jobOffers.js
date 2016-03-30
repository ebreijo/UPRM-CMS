'use strict';

var app = angular.module('uprmcmsApp');

app.factory('JobOffers', function(_) {
  var obj = {
    jobOffers: [
      {
        id: 2,
        companyName: 'IBM',
        email: 'sergio@ibm.com',
        title: 'Different Job Offer',
        description: 'This is a job offer which is different',
        jobPosition: 'CO-OP',
        educationLevel: 'Bachelors',
        recentGraduate: false,
        creationDate: '2016-02-22T16:12:12.000Z',
        expirationDate: '2016-07-22T16:12:12.000Z',
        announcementNumber: null,
        flyerPath: null,
        jobOfferStatus: 'pending',
        location: 'Durham, NC'
      },
      {
        id: 1,
        companyName: 'IBM',
        email: 'sergio@ibm.com',
        title: 'New Job Offer',
        description: 'This is a job offer',
        jobPosition: 'Full-Time',
        educationLevel: 'Bachelors',
        recentGraduate: true,
        creationDate: '2016-02-22T16:12:12.000Z',
        expirationDate: '2016-07-22T16:12:12.000Z',
        announcementNumber: null,
        flyerPath: null,
        jobOfferStatus: 'approved',
        location: 'Durham, NC'
      },
      {
        id: 4,
        companyName: 'Apple',
        email: 'pepe@apple.com',
        title: 'Apple Job Offer',
        description: 'This is a job offer',
        jobPosition: 'Full-Time',
        educationLevel: 'Bachelors',
        recentGraduate: true,
        creationDate: '2016-02-22T16:12:12.000Z',
        expirationDate: '2016-07-22T16:12:12.000Z',
        announcementNumber: null,
        flyerPath: null,
        jobOfferStatus: 'approved',
        location: 'Cupertino, CA'
      },
      {
        id: 3,
        companyName: 'IBM',
        email: 'sergio@ibm.com',
        title: 'Another different Job Offer',
        description: 'This is a job offer which is different from all the job offers',
        jobPosition: 'Internship',
        educationLevel: 'Bachelors',
        recentGraduate: false,
        creationDate: '2016-02-22T16:12:12.000Z',
        expirationDate: '2016-07-22T16:12:12.000Z',
        announcementNumber: null,
        flyerPath: null,
        jobOfferStatus: 'rejected',
        location: 'Durham, NC'
      }
    ]
  };

  // TODO: Make a request to get all pending job offers
  obj.getAllPendingJobOffers = function() {
    return _.filter(this.jobOffers, { jobOfferStatus: 'pending'});
  };

  // TODO: Make a request to update a job offer given the job offer id
  obj.updateJobOffer = function(jobOffer) {
    var element = _.find(this.jobOffers, { id: jobOffer.id});
    _.merge(element, jobOffer);
  };

  return obj;
});
