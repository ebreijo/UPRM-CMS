'use strict';

var db = require('../models');
var errors = require('errors');
var Sequelize = require('sequelize');

exports.getJobOfferId = function(req, res, next, jobId) {
  db.jobOffers.findById(jobId).then(function(data) {
    if(data) {
      req.jobOffer = data;
      req.params.jobId = jobId;
      next();
    } else {
      return next(new errors.Http404Error('Job Offer Not Found'));
    }
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

exports.getCompanyId = function(req, res, next, compId) {
  req.compId = compId.toString();
};


exports.getAllJobOffers = function(req, res, next) {
  db.jobOffers.findAll()
    .then(function(data) {
      res.json(data);
    })
    .catch(function(err) {
      next(new errors.DatabaseError(err.message));
    });
};

exports.getJobOffer = function(req, res) {
  res.json(req.jobOffer);
};

exports.editJobOffer = function(req, res, next) {
  db.jobOffers.update(
    {
      title : req.body.title,
      description : req.body.description,
      jobPosition : req.body.jobPosition,
      educationLevel : req.body.educationLevel,
      recentGraduate : req.body.recentGraduate,
      expirationDate : req.body.expirationDate,
      announcementNumber : req.body.announcementNumber,
      flyerPath : req.body.flyerPath,
      jobOfferStatus : req.body.jobOfferStatus,
      location : req.body.location
    },
    {
      where: {
        id: req.params.jobId
      }
    }
  ).then(function() {
      res.status(200).json({message:'Job Offer Descriptions Successfully Updated.'});
    }).catch(Sequelize.ValidationError, function (err) {
      next(new errors.ValidationError(err.message));
    }).catch(function(err) {
      next(new errors.DatabaseError(err.message));
    });
};

exports.getAllByCompany = function(req, res, next) {
  db.jobOffers.query('SELECT * FROM job_offer where company_name = ' + req.compId + ';')
    .then(function(data) {
      res.json(data);
    })
    .catch(function(err) {
      next(new errors.DatabaseError(err.message));
    });

    /*
    .findAll(req.compId, {
    where: {
      companyName : req.compId
    }
  })

    */
};
