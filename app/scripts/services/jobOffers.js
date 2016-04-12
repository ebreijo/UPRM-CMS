'use strict';

var app = angular.module('uprmcmsApp');

app.factory('JobOffers', function(Restangular, _) {
  var obj = {
    jobOffers: []
  };

  obj.getAllJobOffersAdmins = function(status) {
    Restangular.all('/api/admins/jobOffers').getList({status: status}).then(function(pendingJobOffers) {
      angular.copy(pendingJobOffers.plain(), obj.jobOffers);
    });
  };

  obj.getAllApprovedJobOffers = function() {
    return _.filter(this.jobOffers, { jobOfferStatus: 'approved'});
  };


  obj.updateJobOffer = function(jobOffer) {
    return Restangular.one('/api/admins/jobOffers', jobOffer.id).customPUT(jobOffer);
  };

  return obj;
});
