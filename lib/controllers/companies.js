'use strict';

var db = require('../models');
var errors = require('errors');
var Sequelize = require('sequelize');
var Promise = require('bluebird');
var mailer = require('../mailer');


exports.register = function(req, res, next) {
  var companyInfo = req.body.companyInfo;
  var companyLocation = req.body.companyLocation;
  var recruiterInfo = req.body.recruiterInfo;

  var transaction = null;

  if (companyInfo) {
    delete companyInfo.companyStatus;
    delete companyInfo.registrationDate;

    delete companyLocation.id;

    delete recruiterInfo.accountStatus;
    delete recruiterInfo.registrationDate;

    return db.companies.findById(companyInfo.name).then(function (data) {
      if (data) {
        return Promise.reject(new errors.Http400Error('Company already exists'));
      } else {
        return db.sequelize.transaction();
      }
    }).then(function(t) {
      transaction = t;
      return db.companies.create(companyInfo, {transaction: transaction});
    }).then(function(newCompany) {
      companyLocation.companyName = newCompany.name;
      recruiterInfo.companyName = newCompany.name;

      return db.companyLocations.create(companyLocation, {transaction: transaction});
    }).then(function(newCompanyLocation) {
      recruiterInfo.companyLocation = newCompanyLocation.id;

      return db.recruiters.findById(recruiterInfo.email);
    }).then(function(data) {
      if (data) {
        return Promise.reject(new errors.Http400Error('Email already exists'));
      } else {
        return db.recruiters.hashPassword(recruiterInfo.password);
      }
    }).then(function(hashedPassword) {
      recruiterInfo.password = hashedPassword;
      return db.recruiters.create(recruiterInfo, {transaction: transaction});
    }).then(function(newRecruiter) {
      transaction.commit();
      res.status(201).json(newRecruiter.getJSON());
    }).catch(Sequelize.ValidationError, function () {
      transaction.rollback();
      next(new errors.ValidationError('Validation Error: Please make sure all the recruiter info fields are correct'));
    }).catch(Sequelize.DatabaseError, function (err) {
      transaction.rollback();
      next(new errors.DatabaseError(err.message));
    }).catch(Error, function (err) {
      transaction.rollback();
      next(err);
    }).catch(function (err) {
      transaction.rollback();
      next(new errors.Http500Error(err.message));
    });
  } else if (companyLocation) {

    delete companyLocation.id;

    delete recruiterInfo.accountStatus;
    delete recruiterInfo.registrationDate;

    return db.sequelize.transaction().then(function(t) {
      transaction = t;
      return db.companyLocations.create(companyLocation, {transaction: transaction});
    }).then(function(newCompanyLocation) {
      recruiterInfo.companyLocation = newCompanyLocation.id;

      return db.recruiters.findById(recruiterInfo.email);
    }).then(function(data) {
      if (data) {
        return Promise.reject(new errors.Http400Error('Email already exists'));
      } else {
        return db.recruiters.hashPassword(recruiterInfo.password);
      }
    }).then(function(hashedPassword) {
      recruiterInfo.password = hashedPassword;
      recruiterInfo.companyName = companyLocation.companyName;
      return db.recruiters.create(recruiterInfo, {transaction: transaction});
    }).then(function(newRecruiter) {
      transaction.commit();
      res.status(201).json(newRecruiter.getJSON());
    }).catch(Sequelize.ValidationError, function (err) {
      console.log(err.message);
      transaction.rollback();
      next(new errors.ValidationError('Validation Error: Please make sure all the recruiter info fields are correct'));
    }).catch(Sequelize.DatabaseError, function (err) {
      transaction.rollback();
      next(new errors.DatabaseError(err.message));
    }).catch(Error, function (err) {
      transaction.rollback();
      next(err);
    }).catch(function (err) {
      transaction.rollback();
      next(new errors.Http500Error(err.message));
    });
  } else if (recruiterInfo) {

    delete recruiterInfo.accountStatus;
    delete recruiterInfo.registrationDate;

    return db.recruiters.findById(recruiterInfo.email).then(function(data) {
      if (data) {
        return Promise.reject(new errors.Http400Error('Email already exists'));
      } else {
        return db.recruiters.hashPassword(recruiterInfo.password);
      }
    }).then(function(hashedPassword) {
      recruiterInfo.password = hashedPassword;
      return db.recruiters.create(recruiterInfo);
    }).then(function() {
      res.status(201).json({message:'Registration Completed. We will review your information before you can LogIn'});
    }).catch(Sequelize.ValidationError, function () {
      next(new errors.ValidationError('Validation Error: Please make sure all the recruiter info fields are correct'));
    }).catch(Sequelize.DatabaseError, function (err) {
      next(new errors.DatabaseError(err.message));
    }).catch(Error, function (err) {
      next(err);
    }).catch(function (err) {
      next(new errors.Http500Error(err.message));
    });
  }
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
 */
var getActiveRecruiterIdFromCompany = function(req) {
  return new Promise(function(resolve, reject) {
    db.recruiters.findOne({
      attributes: ['email', 'companyName', 'firstName', 'lastName', 'phoneNumber'],
      where: {
        email: req.body.email,
        companyName: req.company.name,
        accountStatus: 'active'
      }
    }).then(function (data) {
      if (data) {
        req.recruiter = data;
        resolve(data);
      } else {
        reject(new errors.Http404Error('Recruiter not found'));
      }
    });
  });
};

/**
 * If the recruiter is active, then send the recruiter object back.
 * @param req
 * @param res
 * @param next
 */
exports.getActiveRecruiterFromCompany = function(req, res, next) {
  return getActiveRecruiterIdFromCompany(req).then(function (data) {
    res.json(data);
  }).catch(Sequelize.DatabaseError, function (err) {
    next(new errors.DatabaseError(err.message));
  }).catch(function(err) {
    next(err);
  });
};

/**
 * Remove a recruiter from a given company
 * NOTE: The recruiter email is sent in the body of the request.
 * NOTE: Cannot update any other information, just disable the accountStatus
 * @param req
 * @param res
 * @param next
 */
exports.removeOtherRecruiter = function(req, res, next) {

  if ((req.body.accountStatus === 'pending') || (req.body.accountStatus === 'active')) {
    return next(new errors.Http401Error());
  }

  db.recruiters.update({ accountStatus: req.body.accountStatus },
    {
    where: {
      email: req.body.email,
      companyName: req.company.name
    }
  }).then(function(data) {
    if(data[0]) {
      res.status(200).json({ message:'Recruiter was successfully removed'});
    } else {
      res.status(404).json({ message:'Recruiter not found for this company'});
    }
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
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
  return db.companyLocations.findOne({
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

/**
 * Get my own information as recruiter after login in.
 * @param req
 * @param res
 * @param next
 * @param myId
 */
exports.getMeParamRecruiter = function (req, res, next, myId) {
  if (myId === 'me') {
    var recruiter = req.user;
    if(recruiter) {
      req.recruiterMe = recruiter;
      return next();
    } else {
      return next(new errors.Http401Error());
    }
  }
};

/**
 * Send my own information back after login
 * @param req
 * @param res
 */
exports.getMeRecruiter = function (req, res) {
  res.json(req.recruiterMe);
};

/**
 * Change/Update my own recruiter information after login
 * NOTE: Can disable my account, but not enable it
 * NOTE: If password is passed in the body, then hash the new password and make the updates
 * @param req
 * @param res
 * @param next
 */
exports.changeMeRecruiter = function (req, res, next) {
  delete req.body.email;
  delete req.body.companyName;
  delete req.body.registrationDate;
  var body = req.body;

  if ((body.accountStatus === 'pending') || (body.accountStatus === 'active')) {
    return next(new errors.Http401Error());
  }

  if (body.accountStatus === 'inactive') {
    db.recruiters.update({ accountStatus: body.accountStatus }, {
      where: {
        email: req.recruiterMe.email,
        companyName: req.recruiterMe.companyName
      }
    }).then(function() {
      req.logout();
      return res.json('Thank you for being an awesome recruiter');
    }).catch(function(err) {
      return next(new errors.DatabaseError(err.message));
    });
  }

  if (body.password) {
    db.recruiters.hashPassword(body.password).then(function (hashedPassword) {
      body.password = hashedPassword;
      return db.recruiters.update(body, {
        where: {
          email: req.recruiterMe.email,
          companyName: req.recruiterMe.companyName
        }
      });
    }).then(function () {
      res.status(200).json({ message:'Update was successful'});
    }).catch(Sequelize.ValidationError, function (err) {
      next(new errors.ValidationError(err.message));
    }).catch(function(err) {
      next(new errors.DatabaseError(err.message));
    });

  } else {
    db.recruiters.update(body, {
      where: {
        email: req.recruiterMe.email,
        companyName: req.recruiterMe.companyName
      }
    }).then(function() {
      res.status(200).json({ message:'Update was successful'});
    }).catch(Sequelize.ValidationError, function (err) {
      next(new errors.ValidationError(err.message));
    }).catch(function(err) {
      next(new errors.DatabaseError(err.message));
    });
  }
};


/**
 * Get companies job offers.
 * A recruiter can see Approved and Pending material.
 * Two requests are required to get this information:
 * A query is passed (?status=approved)
 * A query is passed (?status=pending)
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.getCompanyJobOffers = function(req, res, next) {
  if(req.query.status === 'rejected') {
    req.query.status = 'approved';
  }
  return db.jobOffers.findAll({
    where: {
      companyName: req.company.name,
      jobOfferStatus: req.query.status || 'approved',
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
 * Post a new job offer.
 * NOTE: Company and recruiter must match in order to be able to post a job offer for that company.
 * @param req
 * @param res
 * @param next
 */
exports.addJobOffer = function(req, res, next) {
  delete req.body.id;
  delete req.body.jobOfferStatus;
  delete req.body.creationDate;

  req.body.companyName = req.company.name;

  return getActiveRecruiterIdFromCompany(req).then(function() {
    req.body.email = req.recruiter.email;
    return db.jobOffers.create(req.body);
  }).then(function(data) {
    res.status(201).json(data);
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(Sequelize.DatabaseError, function (err) {
    next(new errors.DatabaseError(err.message));
  }).catch(function(err) {
    next(err);
  });
};

/**
 * Get the job offer ID and verify if the job offer exists and is approved or pending.
 * If so, add the job offer information to the request object.
 * @param req
 * @param res
 * @param next
 * @param jobId
 */
exports.getJobOfferId = function (req, res, next, jobId) {
  return db.jobOffers.findOne({
    where: {
      id: jobId,
      companyName: req.company.name,
      $or: [{
        jobOfferStatus: 'approved'
      }, {
        jobOfferStatus: 'pending'
      }],
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
 * If job offer is found, then return the object back.
 * @param req
 * @param res
 */
exports.getCompanyJobOffer = function(req, res) {
  res.json(req.jobOffer);
};

/**
 * Get the promotional material ID and verify if the company exists. If so, add the company information to the request object
 * @param req
 * @param res
 * @param next
 * @param promId
 */
exports.getPromId = function(req, res, next, promId) {
  db.promotionalMaterial.findById(promId, {
    attributes: ['id', 'companyName', 'title', 'expirationDate', 'status']
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
 * Get all the promotional material from a specific company.
 * A Recruiter can see Approved and Pending material.
 * Two requests are required to get this information:
 * A query is passed (?status=approved)
 * A query is passed (?status=pending)
 * @param req
 * @param res
 * @param next
 */
exports.getCompanyPromotionalMaterial = function(req, res, next) {
  if(req.query.status === 'rejected') {
    req.query.status = 'approved';
  }
  db.promotionalMaterial.findAll({
    attributes: ['id', 'companyName', 'title', 'expirationDate', 'status'],
    where: {
        companyName: req.company.name,
        status: req.query.status || 'approved'
      }
    }).then(function(data) {
      res.json(data);
    }).catch(function(err) {
      next(new errors.DatabaseError(err.message));
    });
};

/**
 * Add a new promotional material for a given company.
 * @param req
 * @param res
 * @param next
 */
exports.addCompanyPromotionalMaterial = function(req, res, next) {

  req.body.filePath = '/lib/promotionalMaterial';

  db.promotionalMaterial.count({
    where: {
      companyName: req.company.name
    }
  }).then(function (c) {
    if (c >= 5) {
      return next(new errors.Http401Error('You have reached the maximum capacity to upload promotional material'));
    } else {
      return db.promotionalMaterial.create({
        'companyName': req.company.name,
        'title' : req.body.title,
        'expirationDate': req.body.expirationDate,
        'filePath': req.body.filePath
      });
    }
  }).then(function(data) {
    res.status(201).json(data.getJSON());
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function (err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Edit a specific Promotional Material, given its ID.
 * @param req
 * @param res
 * @param next
 */
exports.editCompanyPromotionalMaterial = function(req, res, next) {
  delete req.body.id;
  delete req.body.companyName;
  delete req.body.filePath;
  delete req.body.status;

  db.promotionalMaterial.update(req.body, {
    where: {
      id: req.promotionalMaterial.id
    }
  }).then(function() {
    res.status(200).json({ message:'Promotional Material Updated.'});
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Delete a specific Promotional Material, given its ID.
 * @param req
 * @param res
 * @param next
 */
exports.deleteCompanyPromotionalMaterial = function(req, res, next) {
  req.promotionalMaterial.destroy().then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Get the company interested major ID and verify if the major exists.
 * @param req
 * @param res
 * @param next
 * @param compInterestedMajorId
 */
exports.getCompInterestedMajorId = function(req, res, next, compInterestedMajorId) {
  db.companyInterestedMajors.findById(compInterestedMajorId).then(function(data) {
    if (data) {
      req.compInterestedMajor = data;
      return next();
    } else {
      return next(new errors.Http404Error('Interested Major not found'));
    }
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Get all interested majors from a specific company.
 * @param req
 * @param res
 * @param next
 */
exports.getAllCompanyInterestedMajors = function(req, res, next) {
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
 * Add a new interested major for a given company.
 * @param req
 * @param res
 * @param next
 */
exports.addNewCompanyInterestedMajor = function(req, res, next) {
  delete req.body.id;
  req.body.companyName = req.company.name;

  db.majors.findById(req.body.majorCode).then(function (data) {
    if (data) {
      return db.companyInterestedMajors.create(req.body);
    } else {
      return next(new errors.Http404Error('Major not found'));
    }
  }).then(function(data) {
    res.status(201).json(data);
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function (err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Remove an interested major from a given company
 * @param req
 * @param res
 * @param next
 */
exports.removeCompanyInterestedMajor = function(req, res, next) {
  req.compInterestedMajor.destroy().then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Get all the positions a company is looking for
 * @param req
 * @param res
 * @param next
 */
exports.companyLookingFor = function(req, res, next) {
  db.jobFairCompanyLookingFor.findAll({
    attributes: ['jobPosition'],
    where: {
      companyName: req.company.name,
      status: true
    }
  }).then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Add or remove company positions they are looking for.
 * NOTE: Company positions must be one of these: 'Full-Time', 'Part-Time', 'CO-OP', 'Internship'
 * NOTE: This is done by a post. If the position already exists, just update it with req.body.status which is a boolean.
 *       If the position does not exist yet, add it with req.body.status = true as default.
 * @param req
 * @param res
 * @param next
 */
exports.addRemoveCompanyLookingFor = function(req, res, next) {
  delete req.body.id;
  req.body.companyName = req.company.name;

  db.jobFairCompanyLookingFor.findOne({
    where: {
      companyName: req.company.name,
      jobPosition: req.body.jobPosition
    }
  }).then(function(data) {
    if (data) {
      return db.jobFairCompanyLookingFor.update(req.body, {
        where: {
          companyName: req.company.name,
          jobPosition: req.body.jobPosition
        }
      });
    } else {
      req.body.status = true;
      return db.jobFairCompanyLookingFor.create(req.body);
    }
  }).then(function() {
    res.json({ message: 'Change successful' });
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function (err) {
    next(new errors.DatabaseError(err.message));
  });
};

exports.requestOnCampusServices = function(req, res) {
  req.body.companyName = req.user.companyName;
  req.body.recruiterEmail = req.user.email;
  req.body.recruiterFirstName = req.user.firstName;
  req.body.recruiterLastName = req.user.lastName;
  mailer.sendOnCampusServiceEmail(req.body);
  res.json({ message: 'Thanks for your submission. We will contact you shortly' });
};
