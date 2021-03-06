'use strict';

var db = require('../models');
var errors = require('errors');
var Sequelize = require('sequelize');
var Promise = require('bluebird');
var mailer = require('../mailer');
var fs = require('fs');

/**
 * Register for administrators
 * @param req
 * @param res
 * @param next
 */
exports.register = function (req, res, next) {
  var body = req.body;

  var passwordRegex = new RegExp(/^(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;'<>,.?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{6,40}$/);

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
      if (!passwordRegex.test(body.password)) {
        return Promise.reject(new errors.Http400Error('Invalid password'));
      }
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

  var passwordRegex = new RegExp(/^(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;'<>,.?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{6,40}$/);

  // if password changed, then hash
  if (body.password) {
    if (!passwordRegex.test(body.password)) {
      return next(new errors.Http400Error('Invalid password'));
    }

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
 * @param req
 * @param res
 * @param next
 */
exports.getAllAdminsAccess = function(req, res, next) {
  db.administratorAccess.findAll().then(function(data) {
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
  delete req.body.adminAccountStatus;

  db.administratorAccess.create(req.body).then(function(data) {
    mailer.sendAdminAccessEmail(req);
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
  db.administratorAccess.findById(req.body.currentEmail, {
    include: [{
      attributes: ['email', 'firstName', 'lastName'],
      model: db.administrators
    }]
  }).then(function(adminAccess) {
    if (adminAccess) {
      if (req.body.email === 'placement@uprm.edu') {
        return Promise.reject(new errors.Http401Error('Cannot update placement@uprm.edu email or status'));
      }

      if ((adminAccess.adminAccountStatus === 'pending') && (req.body.adminAccountStatus === 'active')) {
        if (!adminAccess.administrator) {
          return Promise.reject(new errors.Http401Error('Cannot activate the Administrator, it is still pending to register'));
        }
      } else if  ((adminAccess.adminAccountStatus === 'inactive') && (req.body.adminAccountStatus === 'active')) {
        if (!adminAccess.administrator) {
          return Promise.reject(new errors.Http401Error('Cannot activate the Administrator, it has not registered yet'));
        }
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
 * Get all the companies for job fair
 * @param req
 * @param res
 * @param next
 */
exports.getAllCompaniesJobFair = function(req, res, next) {
  db.companies.findAll().then(function(data) {
    res.json(data);
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

  if (req.body.logoPath !== req.company.logoPath) {
    var path = __dirname + '/../../app/' + req.company.logoPath;
    var logoPath = req.company.logoPath;

    fs.exists(path, function(exists) {
      if (exists) {
        fs.unlink(path, function (err) {
          if (err) {
            return console.error(err);
          }
          console.log('File ' + logoPath + ' deleted successfully!');
        });
      } else {
        console.log('No file exists in ' + logoPath);
      }

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
        if (err.message.indexOf('ER_FOREIGN_DUPLICATE_KEY_WITH_CHILD_INFO') > -1) {
          next(new errors.Http400Error('Company already exists'));
        } else {
          next(new errors.DatabaseError(err.message));
        }
      });
    });
  } else {
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
      if (err.message.indexOf('ER_FOREIGN_DUPLICATE_KEY_WITH_CHILD_INFO') > -1) {
        next(new errors.Http400Error('Company already exists'));
      } else {
        next(new errors.DatabaseError(err.message));
      }
    });
  }
};

/**
 * Create a new company with just the basic information
 * @param req
 * @param res
 * @param next
 */
exports.createCompany = function(req, res, next) {
  delete req.body.registrationDate;

  db.companies.create(req.body).then(function(data) {
    res.status(201).json(data);
  }).catch(Sequelize.UniqueConstraintError, function () {
    next(new errors.Http400Error('Company already exists'));
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Get all the promotional material from a specific company for admins.
 * An Admin can see Approved, Pending and Rejected material.
 * Three requests are required to get this information:
 * A query is passed (?status=approved)
 * A query is passed (?status=pending)
 * A query is passed (?status=rejected)
 * @param req
 * @param res
 * @param next
 */
exports.getCompanyPromotionalMaterialForAdmins = function(req, res, next) {
  db.promotionalMaterial.findAll({
    attributes: ['id', 'companyName', 'title', 'expirationDate', 'status', 'filePath'],
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

exports.getAdminPromId = function(req, res, next, promId) {
  db.promotionalMaterial.findById(promId, {
    attributes: ['id', 'companyName', 'title', 'expirationDate', 'status', 'filePath']
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
 * Edit a specific Promotional Material for admins, given its ID.
 * @param req
 * @param res
 * @param next
 */
exports.editCompanyPromotionalMaterialForAdmins = function(req, res, next) {
  delete req.body.id;
  delete req.body.companyName;
  delete req.body.filePath;

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
 * Delete a specific Promotional Material for admins, given its ID
 * @param req
 * @param res
 * @param next
 */
exports.deleteCompanyPromotionalMaterialForAdmins = function(req, res, next) {
  var path = __dirname + '/../../app/' + req.promotionalMaterial.filePath;

  fs.exists(path, function(exists) {
    if (exists) {
      fs.unlink(path, function(err) {
        if (err) {
          return console.error(err);
        }
        console.log('File ' + req.promotionalMaterial.filePath + ' deleted successfully!');
      });
    } else {
      console.log('No file exists in ' + req.promotionalMaterial.filePath);
    }
    req.promotionalMaterial.destroy().then(function(data) {
      res.json(data);
    }).catch(function(err) {
      next(new errors.DatabaseError(err.message));
    });
  });
};

exports.getAllCompanyJobOffersForAdmins = function(req, res, next) {
  if(req.query.status === 'pending') {
    req.query.status = 'approved';
  }
  return db.jobOffers.findAll({
    where: {
      companyName: req.company.name,
      jobOfferStatus: req.query.status || 'approved'
    }
  }).then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

exports.getAdminJobOfferId = function(req, res, next, jobId) {
  return db.jobOffers.findOne({
    where: {
      id: jobId,
      companyName: req.company.name,
      $or: [{
        jobOfferStatus: 'approved'
      }, {
        jobOfferStatus: 'rejected'
      }]
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

exports.getCompanyJobOfferForAdmins = function(req, res) {
  res.json(req.jobOffer);
};

exports.editCompanyJobOfferForAdmins = function(req, res, next) {
  if ((req.body.jobOfferStatus === 'pending')) {
    return next(new errors.Http401Error());
  }

  // If job offer has expired, then it cannot be approved
  if ((req.body.jobOfferStatus === 'approved') && (req.jobOffer.expirationDate < (new Date()))) {
    return next(new errors.Http401Error());
  }

  if (req.body.jobOfferStatus === 'rejected') {
    var path = __dirname + '/../../app/' + req.jobOffer.flyerPath;

    fs.exists(path, function(exists) {
      if (exists) {
        fs.unlink(path, function (err) {
          if (err) {
            return console.error(err);
          }
          console.log('File ' + req.jobOffer.flyerPath + ' deleted successfully!');
        });
      } else {
        console.log('No file exists in ' + req.jobOffer.flyerPath);
      }
      db.jobOffers.update({ jobOfferStatus: req.body.jobOfferStatus, flyerPath: null}, {
        where: {
          id: req.jobOffer.id,
          companyName: req.company.name
        }
      }).then(function(data) {
        if(data[0]) {
          res.status(200).json({ message:'Job Offer was successfully removed'});
        } else {
          res.status(404).json({ message:'Job Offer not found for this company'});
        }
      }).catch(Sequelize.ValidationError, function (err) {
        next(new errors.ValidationError(err.message));
      }).catch(function(err) {
        next(new errors.DatabaseError(err.message));
      });
    });
  } else {
    db.jobOffers.update({ jobOfferStatus: req.body.jobOfferStatus}, {
      where: {
        id: req.jobOffer.id,
        companyName: req.company.name
      }
    }).then(function(data) {
      if(data[0]) {
        res.status(200).json({ message:'Job Offer was successfully removed'});
      } else {
        res.status(404).json({ message:'Job Offer not found for this company'});
      }
    }).catch(Sequelize.ValidationError, function (err) {
      next(new errors.ValidationError(err.message));
    }).catch(function(err) {
      next(new errors.DatabaseError(err.message));
    });
  }

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
  // recruiter INNER JOIN company_location
  db.recruiters.findAll({
    attributes: ['email', 'companyName', 'firstName', 'lastName', 'phoneNumber', 'accountStatus', 'registrationDate'],
    where: {
      accountStatus: 'pending'
    },
    include: [{
      model: db.companyLocations
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
    // recruiter INNER JOIN company_location
    db.recruiters.findOne({
      attributes: ['email', 'companyName', 'firstName', 'lastName', 'phoneNumber', 'accountStatus', 'registrationDate'],
      where: {
        email: req.body.email,
        accountStatus: 'pending'
      },
      include: [{
        model: db.companyLocations
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
 * Accept or reject a pending recruiter registration given the recruiter email
 * @param req
 * @param res
 * @param next
 */
exports.activateOrInactivateRecruiter = function(req, res, next) {
  if (req.body.accountStatus === 'pending') {
    return next(new errors.Http401Error());
  }

  db.recruiters.update({ accountStatus: req.body.accountStatus }, {
    where: {
      email: req.body.email
    }
  }).then(function(data) {
    if(data[0]) {
      mailer.sendRecruiterAcceptanceEmail(req);
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
 * Get all active or inactive recruiters for a given company
 * NOTE: The default response if no parameter is passed are the active recruiters.
 *      You can get the inactive recruiters by passing a query parameter: ?status=inactive
 * @param req
 * @param res
 * @param next
 */
exports.getAllActiveInactiveRecruiters = function(req, res, next) {
  if (req.query.status === 'pending') {
    req.query.status = 'active';
  }

  // recruiter INNER JOIN company_location
  db.recruiters.findAll({
    attributes: ['email', 'firstName', 'lastName', 'phoneNumber', 'accountStatus', 'registrationDate'],
    where: {
      companyName: req.company.name,
      accountStatus: req.query.status || 'active'
    },
    include: [{
      attributes: ['id', 'streetAddress', 'city', 'state', 'country', 'zipCode', 'phoneNumber'],
      model: db.companyLocations
    }]
  }).then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Get an active or inactive recruiter given the email
 * @param req
 * @param res
 * @param next
 */
exports.getActiveInactiveRecruiter = function(req, res, next) {
  // recruiter INNER JOIN company_location
  db.recruiters.findOne({
    attributes: ['email', 'firstName', 'lastName', 'phoneNumber', 'accountStatus', 'registrationDate'],
    where: {
      email: req.body.email,
      companyName: req.company.name,
      $or: [{
        accountStatus: 'active'
      }, {
        accountStatus: 'inactive'
      }]
    },
    include: [{
      attributes: ['id', 'streetAddress', 'city', 'state', 'country', 'zipCode', 'phoneNumber'],
      model: db.companyLocations
    }]
  }).then(function (data) {
    if (data) {
      return res.json(data);
    } else {
      return next(new errors.Http404Error('Recruiter not found'));
    }
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Update the recruiter status for a given company and for a given recruiter email
 * @param req
 * @param res
 * @param next
 */
exports.updateRecruiterStatus = function(req, res, next) {

  if (req.body.accountStatus === 'pending') {
    return next(new errors.Http401Error());
  }

  db.recruiters.update({ accountStatus: req.body.accountStatus }, {
    where: {
      email: req.body.email,
      companyName: req.company.name
    }
  }).then(function(data) {
    if(data[0]) {
      res.status(200).json({ message:'Status successfully changed'});
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

  if (req.body.jobOfferStatus === 'rejected') {
    var path = __dirname + '/../../app/' + req.jobOffer.flyerPath;
    fs.exists(path, function(exists) {
      if (exists) {
        fs.unlink(path, function (err) {
          if (err) {
            return console.error(err);
          }
          console.log('File ' + req.jobOffer.flyerPath + ' deleted successfully!');
        });
      } else {
        console.log('No file exists in ' + req.jobOffer.flyerPath);
      }
      req.body.flyerPath = null;
      db.jobOffers.update(req.body, {
        where: {
          id: req.jobOffer.id
        }
      }).then(function () {
        res.status(200).json({message: 'Job Offer Successfully Updated'});
      }).catch(Sequelize.ValidationError, function (err) {
        next(new errors.ValidationError(err.message));
      }).catch(function (err) {
        next(new errors.DatabaseError(err.message));
      });
    });
  } else {
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
  }
};

/**
 * Get the promotional material ID and verify if the material exists.
 * @param req
 * @param res
 * @param next
 * @param promId
 */
exports.getPromId = function(req, res, next, promId) {
  db.promotionalMaterial.findById(promId).then(function(data) {
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
  var path = __dirname + '/../../app/' + req.promotionalMaterial.filePath;

  fs.exists(path, function(exists) {
    if (exists) {
      fs.unlink(path, function (err) {
        if (err) {
          return console.error(err);
        }
        console.log('File ' + req.promotionalMaterial.filePath + ' deleted successfully!');
      });
    } else {
      console.log('No file exists in ' + req.promotionalMaterial.filePath);
    }
    req.promotionalMaterial.destroy().then(function(data) {
      res.json(data);
    }).catch(function(err) {
      next(new errors.DatabaseError(err.message));
    });
  });
};
