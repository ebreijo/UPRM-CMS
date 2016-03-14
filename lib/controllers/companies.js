'use strict';

var db = require('../models');
var errors = require('errors');
var Sequelize = require('sequelize');


exports.register = function() {

};

/**
 * Get all the companies names registered
 * @param req
 * @param res
 * @param next
 */
exports.getAllCompanies = function(req, res, next) {
  db.companies.findAll({
    attributes: ['name']
  }).then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Get the company ID and verify if the company exists. If so, add the company information to the request object
 * @param req
 * @param res
 * @param next
 * @param compId
 */
exports.getCompanyId = function(req, res, next, compId) {
  db.companies.findById(compId, {
    attributes: ['name', 'websiteUrl', 'logoPath', 'companyDescription', 'companyStatus']
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

/**
 * If the company information is found, send that company object back
 * @param req
 * @param res
 */
exports.getCompany = function(req, res) {
  res.json(req.company);
};

/**
 * Update the company information for a given company
 * NOTE: Company name must be unique
 * NOTE: Cannot update the companyStatus and registrationDate
 * @param req
 * @param res
 * @param next
 */
exports.updateCompany = function(req, res, next) {
  delete req.body.companyStatus;
  delete req.body.registrationDate;

  db.companies.update(req.body, {
    where: {
      name: req.company.name
    }
  }).then(function() {
    res.status(200).json({ message:'Company Successfully Updated'});
  }).catch(Sequelize.UniqueConstraintError, function () {
    next(new errors.Http400Error('Company already exists'));
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Get only all the 'active' recruiters from a given company and send back the data
 * @param req
 * @param res
 * @param next
 */
exports.getAllActiveRecruitersFromCompany = function(req, res, next) {
  db.recruiters.findAll({
    attributes: ['email', 'companyName', 'firstName', 'lastName', 'phoneNumber'],
    where: {
      companyName: req.company.name,
      accountStatus: 'active'
    }
  }).then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Get only one active recruiter from a given company if it really exists.
 * NOTE: The recruiter email is sent in the body of the request
 * @param req
 * @param res
 * @param next
 */
exports.getActiveRecruiterFromCompany = function(req, res, next) {
  db.recruiters.findOne({
    attributes: ['email', 'companyName', 'firstName', 'lastName', 'phoneNumber'],
    where: {
      email: req.body.email,
      companyName: req.company.name,
      accountStatus: 'active'
    }
  }).then(function(data) {
    if (data) {
      res.status(200).json(data);
    } else {
      return next(new errors.Http404Error('Recruiter not found'));
    }
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Update the recruiter information for a given company
 * NOTE: The recruiter email is sent in the body of the request.
 * NOTE: Cannot update the recruiter email, company name, accountStatus and registrationDate
 * NOTE: If password changed, then it is hashed. Password is never sent back to the recruiter
 * @param req
 * @param res
 * @param next
 */
exports.updateRecruiter = function(req, res, next) {
  var recId = req.body.email;
  delete req.body.email;
  delete req.body.companyName;
  delete req.body.accountStatus;
  delete req.body.registrationDate;
  var body = req.body;

  if (body.password) {
    db.recruiters.hashPassword(body.password).then(function (hashedPassword) {
      body.password = hashedPassword;
      return db.recruiters.update(body, {
        where: {
          email: recId,
          companyName: req.company.name
        }
      });
    }).then(function (data) {
      if(data[0]) {
        res.status(200).json({ message:'Update was successful'});
      } else {
        res.status(400).json({ message:'Recruiter not found for this company'});
      }
    }).catch(Sequelize.ValidationError, function (err) {
      next(new errors.ValidationError(err.message));
    }).catch(function(err) {
      next(new errors.DatabaseError(err.message));
    });

  } else {
    db.recruiters.update(body, {
      where: {
        email: recId,
        companyName: req.company.name
      }
    }).then(function(data) {
      if(data[0]) {
        res.status(200).json({ message:'Update was successful'});
      } else {
        res.status(404).json({ message:'Recruiter not found for this company'});
      }
    }).catch(Sequelize.ValidationError, function (err) {
      next(new errors.ValidationError(err.message));
    }).catch(function(err) {
      next(new errors.DatabaseError(err.message));
    });
  }
};

/**
 * Get all the company locations for a given company
 * @param req
 * @param res
 * @param next
 */
exports.getAllCompanyLocations = function(req, res, next) {
  db.companyLocations.findAll({
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
 * Get the location ID for a given company and verify if the location exists. If so, add it to the request object.
 * @param req
 * @param res
 * @param next
 * @param locationId
 */
exports.getLocationId = function(req, res, next, locationId) {
  db.companyLocations.findOne({
    where: {
      id: locationId,
      companyName: req.company.name
    }
  }).then(function(data) {
    if (data) {
      req.companyLocation = data;
      return next();
    } else {
      return next(new errors.Http404Error('Company Location not found'));
    }
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * If the company location is found, send that company location object back
 * @param req
 * @param res
 */
exports.getCompanyLocation = function(req, res) {
  res.json(req.companyLocation);
};

/**
 * Update the company location for a given company and given company location ID.
 * NOTE: Cannot update the id of the location nor the company name
 * @param req
 * @param res
 * @param next
 */
exports.updateCompanyLocation = function(req, res, next) {
  delete req.body.id;
  delete req.body.companyName;

  db.companyLocations.update(req.body, {
    where: {
      id: req.companyLocation.id,
      companyName: req.company.name
    }
  }).then(function() {
    res.status(200).json({ message:'Company Location Successfully Updated'});
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
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

exports.addJobOffer = function(req, res, next) {
  db.jobOffers.create({
      companyName: req.body.companyName,
      recruiterEmail: req.body.recruiterEmail,
      title: req.body.title,
      description: req.body.description,
      jobPosition: req.body.jobPosition,
      educationLevel: req.body.educationLevel,
      recentGraduate: req.body.recentGraduate,
      expirationDate: req.body.expirationDate,
      announcementNumber: req.body.announcementNumber,
      flyerPath: req.body.flyerPath,
      jobOfferStatus: req.body.jobOfferStatus,
      location: req.body.location
    })
    .then(function(data) {
      res.status(201).json(data);
    }).catch(Sequelize.ValidationError, function (err) {
      next(new errors.ValidationError(err.message));
    }).catch(function (err) {
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

//TODO: fix this route
exports.getAllJobOffersByCompany = function(req, res, next) {
  db.jobOffers.findAll(
    {
      where:{
        companyName : req.compId
      }
    })
    .then(function(data) {
      res.json(data);
    })
    .catch(function(err){
      next(new errors.DatabaseError(err.message));
    });
};
