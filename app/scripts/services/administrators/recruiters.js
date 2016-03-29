'use strict';

var app = angular.module('uprmcmsApp');

app.factory('Recruiters', function(_) {
  var obj = {
    recruiters: [
      {
        email: 'juanito@gmail.com',
        companyName: 'Google',
        firstName: 'Juanito',
        lastName: 'Perez',
        phoneNumber: '787-555-5555',
        accountStatus: 'pending',
        registrationDate: '2016-03-29T01:31:59.000Z',
        companyLocation: {
          id: 4,
          companyName: 'Google',
          streetAddress: '1600 Amphitheatre Parkway',
          city: 'Mountain View',
          state: 'CA',
          country: 'United States',
          zipCode: '94043',
          phoneNumber: null
        }
      }
    ]
  };

  // TODO: Make a request to get all pending recruiters
  obj.getAllPendingRecruiters = function() {
    return _.filter(this.recruiters, { accountStatus: 'pending'});
  };

  // TODO: Make a request to update the status of a recruiter given the recruiter email
  obj.updateRecruiterStatus = function(recruiter) {
    var element = _.find(this.recruiters, { email: recruiter.email});
    _.merge(element, recruiter);
  };

  return obj;
});
