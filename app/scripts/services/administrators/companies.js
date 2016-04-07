'use strict';

var app = angular.module('uprmcmsApp');

app.factory('Companies', function(_) {
  var obj = {
    companies: [
      {
        name: 'Apple',
        websiteUrl: 'http://www.apple.com/',
        logoPath: null,
        companyDescription: 'This is Apple',
        companyStatus: 'active',
        registrationDate: '2016-03-27T20:01:47.000Z'
      },
      {
        name: 'IBM',
        websiteUrl: 'http://www.ibm.com/us-en/',
        logoPath: 'images/company.png',
        companyDescription: 'This is IBM',
        companyStatus: 'active',
        registrationDate: '2016-03-27T20:01:47.000Z'
      },
      {
        name: 'EVERTEC',
        websiteUrl: 'https://www.evertecinc.com/',
        logoPath: null,
        companyDescription: 'This is EVERTEC',
        companyStatus: 'inactive',
        registrationDate: '2016-03-27T20:27:54.000Z'
      },
      {
        name: 'Google',
        websiteUrl: 'https://www.google.com/',
        logoPath: null,
        companyDescription: 'This is Google',
        companyStatus: 'pending',
        registrationDate: '2016-03-28T23:13:10.000Z'
      }
    ]
  };

  obj.temporaryContact = [
    {
      email: 'chencho@gmail.com',
      companyName: 'Google',
      firstName: 'Chencho',
      lastName: 'Ramos',
      phoneNumber: '787-555-5555'
    }
  ];

  // TODO: Make a request to get all active, inactive or pending companies by passing a parameter ?status='active'
  obj.getAllCompanies = function(status) {
    return _.filter(this.companies, { companyStatus: status});
  };

  // TODO: Make a request to get a specific company given the company name
  obj.getCompany = function(companyName) {
    return obj.companies.filter(function(company) {
      return company.name === companyName;
    })[0];
  };

  // TODO: Make a request to create a new company with basic information
  obj.createNewCompany = function(company) {
    this.companies.push(company);
  };

  // TODO: Make a request to update the status of a given company
  obj.updateCompanyStatus = function(company) {
    var element = _.find(this.companies, { name: company.name});
    _.merge(element, company);
  };

  // TODO: Make a request to get the company temporary contact
  obj.getCompanyTemporaryContact = function(companyName) {
    return _.find(this.temporaryContact, { companyName: companyName});
  };

  // TODO: Make a request to create or update the company temporary contact
  obj.createOrUpdateCompanyTemporaryContact = function(temporaryContact) {
    this.temporaryContact.push(temporaryContact);
  };

  return obj;
});
