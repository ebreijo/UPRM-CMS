'use strict';

var db = require('../models');
var errors = require('errors');
var Sequelize = require('sequelize');
var Promise = require('bluebird');

/**
 * Register for administrators
 * @param req
 * @param res
 * @param next
 */
exports.register = function (req, res, next) {
  var body = req.body;

  // check if the admin has access to register
  db.administratorAccess.findOne({
    where: {
      email: body.email,
      adminAccountStatus: 'pending'
    }
  }).then(function(adminAccess) {
    if (!adminAccess) {
      return Promise.reject(new errors.Http401Error('Not authorized to register or account is already activated'));
    } else {
      return db.administrators.findOne({
        where: {
          email: body.email
        }
      });
    }
  }).then(function (data) {
    if (data) {
      return Promise.reject(new errors.Http400Error('Admin already exists.'));
    } else {
      // Hash the admin's password and store it in the database..
      return db.administrators.hashPassword(body.password);
    }
  }).then(function (hashedPassword) {
    body.password = hashedPassword;
    return db.administrators.create(body);
  }).then(function (admin) {
      // change admin access from 'pending' to 'active'
    res.status(201).json(admin.getJSON());
    return db.administratorAccess.update({'adminAccountStatus': 'active'}, {
      where: {
        email: admin.email
      }
    });
  }).catch(Sequelize.ValidationError, function () {
    next(new errors.ValidationError('Validation Error: Please make sure all the fields are correct'));
  }).catch(Sequelize.DatabaseError, function (err) {
    next(new errors.DatabaseError(err.message));
  }).catch(Error, function (err) {
    next(err);
  });
};

exports.forgot = function () {

};

exports.reset = function () {

};

/**
 * Get my own admin information after login in.
 * @param req
 * @param res
 * @param next
 * @param myId
 */
exports.getMeParamAdmin = function (req, res, next, myId) {
  if (myId === 'me') {
    var admin = req.user;
    if(admin) {
      req.admin = admin;
      return next();
    } else {
      return next(new errors.Http401Error());
    }
  }
};

/**
 * Send my own admin information back after login
 * @param req
 * @param res
 */
exports.getMeAdmin = function (req, res) {
  res.json(req.admin);
};

/**
 * Change/Update the administrator first name, last name and password after login
 * NOTE: If password is sent in the body, then hash it and make the updates.
 * @param req
 * @param res
 * @param next
 */
exports.changeMeAdmin = function(req, res, next) {
  delete req.body.email;
  var body = req.body;

  // if password changed, then hash
  if (body.password) {
    db.administrators.hashPassword(body.password).then(function (hashedPassword) {
      body.password = hashedPassword;
      return db.administrators.update(body, {
        where: {
          email: req.admin.email
        }
      });
    }).then(function () {
      res.status(200).json({message:'Update was successful'});
    }).catch(Sequelize.ValidationError, function (err) {
      next(new errors.ValidationError(err.message));
    }).catch(function(err) {
      next(new errors.DatabaseError(err.message));
    });
  } else {
    db.administrators.update(body, {
      where: {
        email: req.admin.email
      }
    }).then(function() {
      res.status(200).json({message:'Update was successful'});
    }).catch(Sequelize.ValidationError, function (err) {
      next(new errors.ValidationError(err.message));
    }).catch(function(err) {
      next(new errors.DatabaseError(err.message));
    });
  }
};

/**
 * Get the list of all active admins, which means they have access.
 * NOTE: You can also get inactive admins, and pending admins by passing a query parameter: status=inactive
 * @param req
 * @param res
 * @param next
 */
exports.getAllAdminsAccess = function(req, res, next) {
  db.administratorAccess.findAll({
    where: {
      adminAccountStatus: req.query.status || 'active'
    }
  }).then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Grant access to an admin given its email
 * @param req
 * @param res
 * @param next
 */
exports.giveAdminAccess = function(req, res, next) {
  db.administratorAccess.create(req.body).then(function(data) {
    res.status(201).json(data);
  }).catch(Sequelize.UniqueConstraintError, function () {
    next(new errors.Http400Error('Administrator already exists'));
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function (err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Get an admin from the access list given its email
 * @param req
 * @param res
 * @param next
 */
exports.getAdminAccess = function(req, res, next) {
  db.administratorAccess.findById(req.body.email).then(function(data) {
    if (data) {
      res.status(200).json(data);
    } else {
      return next(new errors.Http404Error('Admin not found'));
    }
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Update the access of an admin given its current email.
 * NOTE: You can also update the email of the admin.
 * @param req
 * @param res
 * @param next
 */
exports.updateAdminAccess = function(req, res, next) {
  db.administratorAccess.findById(req.body.currentEmail).then(function(adminAccess) {
    if (adminAccess) {
      if (req.body.email === 'placement@uprm.edu') {
        return Promise.reject(new errors.Http401Error('Cannot update placement@uprm.edu email or status'));
      }

      if ((adminAccess.adminAccountStatus === 'pending') && (req.body.adminAccountStatus === 'active')) {
        return Promise.reject(new errors.Http401Error('Cannot activate the Administrator, it is still pending to register'));
      }
      delete req.body.currentEmail;
      return db.administratorAccess.update(req.body, {
        where: {
          email: adminAccess.email
        }
      });
    } else {
      return Promise.reject(new errors.Http404Error('Admin not found'));
    }
  }).then(function() {
    res.status(200).json({ message:'Admin Successfully Updated'});
  }).catch(Sequelize.UniqueConstraintError, function () {
    next(new errors.Http400Error('Admin already exists'));
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(Sequelize.DatabaseError, function(err) {
    next(new errors.DatabaseError(err.message));
  }).catch(Error, function(err) {
    next(err);
  });
};

/**
 * Change the dates of the job fair.
 * NOTE: All the information is store in a single row.
 * @param req
 * @param res
 * @param next
 */
exports.changeJobFairDates = function(req, res, next) {
  db.jobFairDates.update(req.body, {
    where: {
      id: 1
    }
  }).then(function() {
    res.status(200).json({message: 'Job Fair Date information was successfully updated'});
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function (err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Get the current dates of the job fair.
 * @param req
 * @param res
 * @param next
 */
exports.getJobFairDates = function(req, res, next) {
  db.jobFairDates.findById(1).then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Get all the additional information from companies about job fair
 * @param req
 * @param res
 * @param next
 */
exports.getJobFairInfo = function(req, res, next) {
  db.jobFairCompanyInformation.findAll().then(function (data) {
    res.json(data);
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Get the job fair additional information from a given company
 * @param req
 * @param res
 * @param next
 */
exports.getJobFairInfoPerCompany = function(req, res, next) {
  db.jobFairCompanyInformation.findById(req.company.name).then(function (data) {
    if(data) {
      return res.json(data);
    } else {
      return next(new errors.Http404Error('No Job Fair information found for this company'));
    }
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Add or update additional job fair information for a given company
 * NOTE: If the job fair info already exists, make an update. Otherwise create that information for the given company.
 * @param req
 * @param res
 * @param next
 */
exports.addOrUpdateJobFairInfoPerCompany = function (req, res, next) {

  db.jobFairCompanyInformation.findById(req.company.name).then(function (data) {
    req.body.companyName = req.company.name;
    if (data) {
      return db.jobFairCompanyInformation.update(req.body, {
        where: {
          companyName: req.company.name
        }
      });
    } else {
      return db.jobFairCompanyInformation.create(req.body);
    }
  }).then(function () {
    res.json({message: 'Job Fair information added successfully'});
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};


/**
 * Get all the companies names registered for admins to see
 * Three requests are required to get this information:
 * A parameter is passed (?status=active)
 * A parameter is passed (?status=pending)
 * A parameter is passed (?status=inactive)
 * NOTE: If no parameter is passed, the default will be active companies.
 * @param req
 * @param res
 * @param next
 */
exports.getAllCompanies = function(req, res, next) {
  db.companies.findAll({
    where: {
      companyStatus: req.query.status || 'active'
    }
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
  db.companies.findById(compId).then(function(data) {
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
 * NOTE: Cannot update the registrationDate
 * @param req
 * @param res
 * @param next
 */
exports.updateCompany = function(req, res, next) {
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
 * Create a new company with just the basic information
 * @param req
 * @param res
 * @param next
 */
exports.createCompany = function(req, res, next) {
  delete req.body.registrationDate;

  db.companies.create(req.body).then(function() {
    res.status(201).json({ message:'Company Successfully Created'});
  }).catch(Sequelize.UniqueConstraintError, function () {
    next(new errors.Http400Error('Company already exists'));
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Get the temporary contact information for a given company
 * @param req
 * @param res
 * @param next
 */
exports.getCompTemporaryContact = function(req, res, next) {
  db.temporaryContacts.findAll({
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
 * Add a new temporary contact to a company if the contact does not exist, or update that temporary contact
 * if the company has already a contact.
 * @param req
 * @param res
 * @param next
 */
exports.addOrUpdateCompTemporaryContact = function(req, res, next) {
  db.temporaryContacts.findOne({
    where: {
      companyName: req.company.name
    }
  }).then(function (data) {
    req.body.companyName = req.company.name;
    if (data) {
      return db.temporaryContacts.update(req.body, {
        where: {
          companyName: req.company.name
        }
      });
    } else {
      return db.temporaryContacts.create(req.body);
    }
  }).then(function () {
    res.json({message: 'Temporary Contact added successfully'});
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Get all pending registrations from recruiters
 * Get also the associated location per pending recruiter.
 * @param req
 * @param res
 * @param next
 */
exports.getAllPendingRecruiters = function(req, res, next) {
  db.recruiters.findAll({
    attributes: ['email', 'companyName', 'firstName', 'lastName', 'phoneNumber', 'accountStatus', 'registrationDate'],
    where: {
      accountStatus: 'pending'
    },
    include: [{
      model: db.companyLocations,
      where: {
        companyLocationId: Sequelize.col('id')
      }
    }]
  }).then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Get only one pending recruiter from a given company if it really exists.
 * Get also the associated location of the pending recruiter.
 * NOTE: The recruiter email is sent in the body of the request
 * @param req
 */
function getPendingRecruiterId(req) {
  return new Promise(function(resolve, reject) {
    db.recruiters.findOne({
      attributes: ['email', 'companyName', 'firstName', 'lastName', 'phoneNumber', 'accountStatus', 'registrationDate'],
      where: {
        email: req.body.email,
        accountStatus: 'pending'
      },
      include: [{
        model: db.companyLocations,
        where: {
          companyLocationId: Sequelize.col('id')
        }
      }]
    }).then(function (data) {
      if (data) {
        req.pendingRecruiter = data;
        resolve(data);
      } else {
        reject(new errors.Http404Error('Recruiter not found'));
      }
    }).catch(function(err) {
      reject(err);
    });
  });
}

/**
 * If the recruiter is pending, then send the recruiter object back.
 * @param req
 * @param res
 * @param next
 */
exports.getPendingRecruiter = function(req, res, next) {
  return getPendingRecruiterId(req).then(function (data) {
    res.json(data);
  }).catch(Sequelize.DatabaseError, function (err) {
    next(new errors.DatabaseError(err.message));
  }).catch(function(err) {
    next(err);
  });
};


/**
 * Accept or reject a pending recruiter registration
 * @param req
 * @param res
 * @param next
 */
exports.acceptOrRejectRecruiter = function(req, res, next) {
  if (req.body.accountStatus === 'pending') {
    return next(new errors.Http401Error());
  }

  db.recruiters.update({ accountStatus: req.body.accountStatus }, {
    where: {
      email: req.body.email
    }
  }).then(function(data) {
    if(data[0]) {
      res.status(200).json({ message:'Status successfully changed'});
    } else {
      res.status(400).json({ message:'Status was not successfully changed'});
    }
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};



/**
 * Get all the Job Offers by Status.
 * An Administrator can see all job offers, regardless of status.
 * Returns Approved Job Offers if no status is set in the URL.
 * Three requests are required to get all material:
 * (?status=approved)
 * (?status=rejected)
 * (?status=pending)
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.getJobOffers = function(req, res, next) {
  return db.jobOffers.findAll({
    where: {
      jobOfferStatus: req.query.status || 'approved'
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
 * @param jobId
 */
exports.getJobOfferId = function (req, res, next, jobOfferId) {
  return db.jobOffers.findOne({
    where: {
      id: jobOfferId
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
 *
 * @param req
 * @param res
 * @param next
 * @returns {*|Promise}
 */
exports.editAdminJobOffer = function(req, res, next) {
  delete req.body.id;
  delete req.body.companyName;
  delete req.body.email;
  delete req.body.creationDate;

  db.jobOffers.update(req.body, {
    where: {
      id: req.jobOffer.id
    }
  }).then(function() {
    res.status(200).json({ message:'Job Offer Successfully Updated'});
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Get the promotional material ID and verify if the material exists.
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
 * An Administrator can see all promotional material, regardless of status.
 * Returns Approved Material if no status is set in the URL.
 * Three requests are required to get all material:
 * (?status=approved)
 * (?status=rejected)
 * (?status=pending)
 * @param req
 * @param res
 * @param next
 */
exports.getAdminPromotionalMaterial = function(req, res, next) {
  db.promotionalMaterial.findAll({
    attributes: ['id', 'companyName', 'title', 'expirationDate', 'status'],
    where: {
      status: req.query.status || 'approved'
    }
  }).then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Edit a specific Promotional Material, given its ID.
 * @param req
 * @param res
 * @param next
 */
exports.editAdminPromotionalMaterial = function(req, res, next) {
  delete req.body.id;
  delete req.body.companyName;
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
exports.deleteAdminPromotionalMaterial = function(req, res, next) {
  req.promotionalMaterial.destroy()
    .then(function(data) {
      res.json(data);
    }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};
