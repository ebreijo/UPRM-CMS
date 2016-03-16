'use strict';

var db = require('../models');
var errors = require('errors');
var _ = require('lodash');

/**
 * Get all the active and unexpired job offers for students
 * @param req
 * @param res
 * @param next
 */
exports.getAllActiveJobOffers = function(req, res, next) {
  db.jobOffers.findAll({
    where: {
      jobOfferStatus: 'approved',
      expirationDate: {
        $gte: new Date()
      }
    }
  }).then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Get the job offer ID  and verify if the job offer exists. If so add it to the request object
 * @param req
 * @param res
 * @param next
 * @param jobId
 */
exports.getJobId = function(req, res, next, jobId) {
  db.jobOffers.findOne({
    where: {
      id: jobId,
      jobOfferStatus: 'approved',
      expirationDate: {
        $gte: new Date()
      }
    }
  }).then(function(data) {
    if (data) {
      req.jobOffer = data;
      return next();
    } else {
      return next(new errors.Http404Error('Job Offer not found'));
    }
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};


/**
 * If the job offer is found, send that job offer object back
 * @param req
 * @param res
 */
exports.getJobOffer = function(req, res) {
  res.json(req.jobOffer);
};

/**
 * Get the job fair company information. That is, companies attending the job fair with additional information.
 * @param req
 * @param res
 * @param next
 */
exports.getJobFairInformation = function (req, res, next) {
  var jobFairCompaniesInfo = [];
  db.jobFairCompanyInformation.findAll({
    attributes: ['companyName', 'minGpa', 'extraInformation', 'collectingResumesBeforeJobFair', 'mustFillOnline', 'interviewsDuringWeekend', 'websiteApplication'],
    where: {
      attending: true
    }
  }).then(function (data) {
    jobFairCompaniesInfo = data;
    return db.jobFairCompanyLookingFor.findAll({
      where: {
        status: true
      }
    });
  }).then(function(jobFairLookingPositions) {
    _.forEach(jobFairCompaniesInfo, function(jobFairCompany) {
      var matches = [];
      _.forEach(jobFairLookingPositions, function(jobFairLookingPosition) {
        if (_.isEqual(jobFairCompany.companyName, jobFairLookingPosition.companyName)) {
          matches.push(jobFairLookingPosition.jobPosition);
        }
      });
      jobFairCompany.dataValues.lookingFor = matches;
    });

    return db.companyInterestedMajors.findAll();
  }).then(function (CompaniesInterestedMajors) {
    _.forEach(jobFairCompaniesInfo, function(jobFairCompany) {
      var matches = [];
      _.forEach(CompaniesInterestedMajors, function(CompanyInterestedMajors) {
        if (_.isEqual(jobFairCompany.companyName, CompanyInterestedMajors.companyName)) {
          matches.push(CompanyInterestedMajors.majorCode);
        }
      });
      jobFairCompany.dataValues.interestedMajors = matches;
    });
    res.json(jobFairCompaniesInfo);
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Get all the active companies for student to see
 * @param req
 * @param res
 * @param next
 */
exports.getAllActiveCompanies = function (req, res, next) {
  db.companies.findAll({
    where: {
      companyStatus: 'active'
    }
  }).then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Get a single active company for students to see given the company name
 * @param req
 * @param res
 * @param next
 * @param compId
 */
exports.getCompanyId = function (req, res, next, compId) {
  db.companies.findOne({
    attributes: ['name', 'websiteUrl', 'logoPath', 'companyDescription', 'companyStatus'],
    where: {
      name: compId,
      companyStatus: 'active'
    }
  }).then(function(data) {
    if (data) {
      req.company = data;
      return next();
    } else {
      return next(new errors.Http404Error('Company not found'));
    }
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * If the company is found, send the company information back to the client
 * @param req
 * @param res
 */
exports.getCompany = function (req, res) {
  res.json(req.company);
};
