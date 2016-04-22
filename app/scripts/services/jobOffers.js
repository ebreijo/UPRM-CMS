'use strict';

var app = angular.module('uprmcmsApp');

app.factory('JobOffers', function(Restangular, _) {
  var obj = {
    jobOffers: [],
    studentJobOffers: [],
    approvedCompanyJobOffers: [],
    pendingCompanyJobOffers: [],
    companyJobOffers: [],
    companyJobOffersForAdmins: [],
    companyJobOffersForStudents: [],
    jobOffer: {}
  };

  obj.getAllJobOffersAdmins = function(status) {
    Restangular.all('/api/admins/jobOffers').getList({status: status}).then(function(pendingJobOffers) {
      angular.copy(pendingJobOffers.plain(), obj.jobOffers);
    });
  };

  obj.getAllJobOffersStudents = function() {
    Restangular.all('/api/students/jobOffers').getList().then(function(approvedJobOffers) {
      angular.copy(approvedJobOffers.plain(), obj.studentJobOffers);
    });
  };

  obj.getJobOffersPerCompanyForStudents = function(companyName) {
    Restangular.one('/api/students/companies', companyName).getList('jobOffers').then(function(companyJobOffers) {
      angular.copy(companyJobOffers.plain(), obj.companyJobOffersForStudents);
    });
  };

  obj.getAllApprovedJobOffers = function() {
    return _.filter(this.jobOffers, { jobOfferStatus: 'approved'});
  };

  obj.updateJobOfferFromAdmins = function(jobOffer) {
    return Restangular.one('/api/admins/jobOffers', jobOffer.id).customPUT(jobOffer);
  };

  obj.getJobOffersPerCompany = function(companyName) {
    return Restangular.one('/api/companies', companyName).getList('jobOffers').then(function(compJobOffers){
      angular.copy(compJobOffers.plain(), obj.companyJobOffers);
    });
  };

  obj.removeJobOffersPerCompany = function(companyName, id, jobOffer) {
    return Restangular.one('/api/companies', companyName).one('jobOffers', id).customPUT(jobOffer);
  };

  obj.addJobOffersPerCompany = function(companyName, jobOffer) {
    return Restangular.one('/api/companies', companyName).customPOST(jobOffer, 'jobOffers');
  };

  obj.getJobOffersPerCompanyForAdmins = function(companyName, status) {
    return Restangular.one('/api/admins/companies', companyName).getList('jobOffers', {status: status}).then(function(compJobOffers) {
      angular.copy(compJobOffers.plain(), obj.companyJobOffersForAdmins);
    });
  };

  obj.updateJobOfferStatusPerCompanyForAdmins = function(companyName, jobOffer) {
    return Restangular.one('/api/admins/companies', companyName).one('jobOffers', jobOffer.id).customPUT(jobOffer);
  };

  obj.getApprovedJobOffersPerCompany = function(companyName) {
    return Restangular.one('/api/companies', companyName).getList('jobOffers').then(function(compJobOffers){
      angular.copy(compJobOffers.plain(), obj.approvedCompanyJobOffers);
    });
  };

  obj.getPendingJobOffersPerCompany = function(companyName) {
    return Restangular.one('/api/companies', companyName).getList('jobOffers?status=pending').then(function(compJobOffers){
      angular.copy(compJobOffers.plain(), obj.pendingCompanyJobOffers);
    });
  };

  obj.addJobOfferPerCompany = function(companyName, jobOffer) {
    return Restangular.one('/api/companies', companyName).one('jobOffers').customPOST(jobOffer);
  };

  return obj;
});
