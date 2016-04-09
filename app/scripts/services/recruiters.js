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
      },
      {
        email: 'leonardo@ibm.com',
        firstName: 'Leonardo',
        lastName: 'Dicaprio',
        phoneNumber: '787-555-5555',
        accountStatus: 'active',
        registrationDate: '2016-03-29T14:51:52.000Z',
        companyLocation: {
          id: 2,
          streetAddress: '1 New Orchard Road',
          city: 'Armonk',
          state: 'NY',
          country: 'United States',
          zipCode: '10504',
          phoneNumber: null
        }
      },
      {
        email: 'sergio@ibm.com',
        firstName: 'Sergio',
        lastName: 'Rivera',
        phoneNumber: '787-555-5555',
        accountStatus: 'active',
        registrationDate: '2016-03-29T14:51:52.000Z',
        companyLocation: {
          id: 1,
          streetAddress: '3039 E Cornwallis Road',
          city: 'Durham',
          state: 'NC',
          country: 'United States',
          zipCode: '27709',
          phoneNumber: null
        }
      }
    ]
  };

  obj.getAllRecruiters = function() {
    return this.recruiters;
  };

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
