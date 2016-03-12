'use strict';

var jobOffers = require('../controllers/jobOffers');

module.exports = function(router) {
  // Get All Job Offers
  router.get('/api/jobOffers', jobOffers.getAllJobOffers);

  // Get JobID Parameter.
  router.param('jobId', jobOffers.getJobOfferId);
  router.param('compId', jobOffers.getCompanyId);

  // Get Job Offer by Job Offer ID.
  router.get('/api/jobOffers/:jobId', jobOffers.getJobOffer);


  // Modify Job Offer Status
  router.put('/api/jobOffers/:jobId', jobOffers.editJobOffer);

  // Get All Job Offers from a Specific Company
  router.get('/api/companies/:compId/jobOffers', jobOffers.getAllByCompany);
};
