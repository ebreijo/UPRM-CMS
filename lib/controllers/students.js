'use strict';

var db = require('../models');
var errors = require('errors');
var _ = require('lodash');
var Promise = require('bluebird');

/**
 * Get all the active and unexpired job offers for students
 * @param req
 * @param res
 * @param next
 */
exports.getAllActiveJobOffers = function(req, res, next) {
  db.jobOffers.findAll({
    attributes: ['id', 'companyName', 'title', 'description', 'jobPosition', 'educationLevel', 'recentGraduate', 'creationDate', 'expirationDate', 'announcementNumber', 'flyerPath', 'location'],
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
 * @param studentJobOfferId
 */
exports.getJobId = function(req, res, next, studentJobOfferId) {
  db.jobOffers.findOne({
    attributes: ['id', 'companyName', 'title', 'description', 'jobPosition', 'educationLevel', 'recentGraduate', 'expirationDate', 'announcementNumber', 'flyerPath', 'location'],
    where: {
      id: studentJobOfferId,
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
  Promise.all([
    db.jobFairCompanyInformation.findAll({
      attributes: ['companyName', 'minGpa', 'extraInformation', 'collectingResumesBeforeJobFair', 'mustFillOnline', 'interviewsDuringWeekend', 'websiteApplication'],
      where: {
        attending: true
      }
    }),
    db.jobFairCompanyLookingFor.findAll({
      attributes: ['companyName', 'jobPosition'],
      where: {
        status: true
      }
    }),
    db.companyInterestedMajors.findAll({attributes: ['companyName', 'majorCode']})
  ]).then(function (results) {

    jobFairCompaniesInfo = results[0];

    // Group companyLookingFor and interestedMajors by company name
    var jobFairCompanyLookingForMap = _.groupBy(results[1], function(data) { return data.dataValues.companyName; });
    var companiesInterestedMajorsMap = _.groupBy(results[2], function(data) { return data.dataValues.companyName; });

    // For each company attending the job fair, verify the positions it is looking for and append it to the end
    _.forEach(jobFairCompaniesInfo, function(jobFairCompany) {
      if (jobFairCompanyLookingForMap[jobFairCompany.companyName]) {
        jobFairCompany.dataValues.lookingFor = jobFairCompanyLookingForMap[jobFairCompany.companyName];
      }
    });

    // For each company attending the job fair, verify if it has interested majors, if so append it.
    _.forEach(jobFairCompaniesInfo, function(jobFairCompany) {
      if (companiesInterestedMajorsMap[jobFairCompany.companyName]) {
        jobFairCompany.dataValues.interestedMajors = companiesInterestedMajorsMap[jobFairCompany.companyName];
      }
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
    attributes: ['name', 'websiteUrl', 'logoPath', 'companyDescription', 'companyStatus'],
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
 * @param studCompanyId
 */
exports.getCompanyId = function (req, res, next, studCompanyId) {
  db.companies.findOne({
    attributes: ['name', 'websiteUrl', 'logoPath', 'companyDescription', 'companyStatus'],
    where: {
      name: studCompanyId,
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

/**
 * Get all active the companies job offers for students.
 * @param req
 * @param res
 * @param next
 */
exports.getActiveCompanyJobOffers = function(req, res, next) {
  return db.jobOffers.findAll({
    attributes: ['id', 'companyName', 'title', 'description', 'jobPosition', 'educationLevel', 'recentGraduate', 'creationDate', 'expirationDate', 'announcementNumber', 'flyerPath', 'location'],
    where: {
      companyName: req.company.name,
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
 * Get the job offer ID and verify if the job offer exists and is approved or pending.
 * If so, add the job offer information to the request object.
 * @param req
 * @param res
 * @param next
 * @param companyJobOfferId
 */
exports.getJobOfferId = function (req, res, next, companyJobOfferId) {
  return db.jobOffers.findOne({
    attributes: ['id', 'companyName', 'title', 'description', 'jobPosition', 'educationLevel', 'recentGraduate', 'expirationDate', 'announcementNumber', 'flyerPath', 'location'],
    where: {
      id: companyJobOfferId,
      companyName: req.company.name,
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
 * If job offer is found, then return the object back to the student.
 * @param req
 * @param res
 */
exports.getCompanyJobOffer = function(req, res) {
  res.json(req.jobOffer);
};


/**
 * Get all active promotional material from a specific company.
 * @param req
 * @param res
 * @param next
 */
exports.getActiveCompanyPromotionalMaterial = function(req, res, next) {
  db.promotionalMaterial.findAll({
    attributes: ['id', 'companyName', 'title', 'filePath', 'expirationDate'],
    where: {
      companyName: req.company.name,
      status: 'approved',
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
 * Get the promotional material ID and verify if the material exists and is approved or pending.
 * If so, add the promotional material information to the request object.
 * @param req
 * @param res
 * @param next
 * @param studPromotionalId
 */
exports.getPromId = function (req, res, next, studPromotionalId) {
  return db.promotionalMaterial.findOne({
    attributes: ['id', 'companyName', 'title', 'filePath', 'expirationDate'],
    where: {
      id: studPromotionalId,
      companyName: req.company.name,
      status: 'approved',
      expirationDate: {
        $gte: new Date()
      }
    }
  }).then(function(data) {
    if (data) {
      req.promotionalMaterial = data;
      return next();
    } else {
      return next(new errors.Http404Error('Promotional Material not found'));
    }
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * If Promotional Material is found, then return the object back to the student
 * @param req
 * @param res
 */
exports.getCompanyPromotionalMaterial = function(req, res) {
  res.json(req.promotionalMaterial);
};


/**
 * Get company interested majors from a specific company for students to see.
 * @param req
 * @param res
 * @param next
 */
exports.getCompanyInterestedMajors = function(req, res, next) {
  db.companyInterestedMajors.findAll({
    where: {
      companyName: req.company.name
    }
  }).then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Get my own student information.
 * @param req
 * @param res
 * @param next
 * @param myId
 */
exports.getMeParamStudent = function (req, res, next, myId) {
  if (myId === 'me') {
    console.log(req.user);
    var student = req.user;
    if(student) {
      req.student = student;
      return next();
    } else {
      return next(new errors.Http401Error());
    }
  }
};

/**
 * Send my own student information back
 * @param req
 * @param res
 */
exports.getMeStudent = function (req, res) {
  res.json(req.student);
};
