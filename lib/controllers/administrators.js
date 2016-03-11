'use strict';

var db = require('../models');
var errors = require('errors');
var Sequelize = require('sequelize');

exports.login = function () {

};

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
      return next(new errors.Http401Error('Not authorized to register or account is already activated'));
    } else {
      db.administrators.findOne({
        where: {
          email: body.email
        }
      }).then(function (data) {
        if (data) {
          return next(new errors.Http400Error('Admin already exists.'));
        } else {
          // Hash the admin's password and store it in the database.
          db.administrators.hashPassword(body.password).then(function (hashedPassword) {
            body.password = hashedPassword;
            return db.administrators.create(body);
          }).then(function (admin) {
            // change admin access from 'pending' to 'active'
            db.administratorAccess.update({'adminAccountStatus': 'active'}, {
              where: {
                email: admin.email
              }
            });
            res.status(201).json(admin.getJSON());
          }).catch(Sequelize.ValidationError, function () {
            next(new errors.ValidationError('Validation Error: Please make sure all the fields are correct'));
          }).catch(Sequelize.DatabaseError, function (err) {
            next(new errors.DatabaseError(err.message));
          }).catch(function (err) {
            next(new errors.Http500Error(err.message));
          });
        }
      }).catch(function (err) {
        next(new errors.DatabaseError(err.message));
      });
    }
  }).catch(function (err) {
    next(new errors.DatabaseError(err.message));
  });
};

exports.forgot = function () {

};

exports.reset = function () {

};

/**
 * Get an administrator given its email
 * @param req
 * @param res
 * @param next
 */
exports.getAdmin = function(req, res, next) {
  db.administrators.findById(req.body.email).then(function(data) {
    if (data) {
      res.status(200).json(data.getJSON());
    } else {
      return next(new errors.Http404Error('Admin not found'));
    }
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Update the administrator first name, last name and password given its email
 * @param req
 * @param res
 * @param next
 */
exports.updateAdmin = function(req, res, next) {
  var adminId = req.body.email;
  delete req.body.email;
  var body = req.body;

  // if password changed, then hash
  if (body.password) {
    db.administrators.hashPassword(body.password).then(function (hashedPassword) {
      body.password = hashedPassword;
      return db.administrators.update(body, {
        where: {
          email: adminId
        }
      });
    }).then(function (data) {
      if(data[0]) {
        res.status(200).json({message:'Update was successful'});
      } else {
        res.status(404).json({message:'Admin not found'});
      }
    }).catch(Sequelize.ValidationError, function (err) {
      next(new errors.ValidationError(err.message));
    }).catch(function(err) {
      next(new errors.DatabaseError(err.message));
    });

  } else {
    db.administrators.update(body, {
      where: {
        email: adminId
      }
    }).then(function(data) {
      if(data[0]) {
        res.status(200).json({message:'Update was successful'});
      } else {
        res.status(404).json({message:'Admin not found'});
      }
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
        return next(new errors.Http401Error('Cannot update placement@uprm.edu email or status'));
      }

      if ((adminAccess.adminAccountStatus === 'pending') && (req.body.adminAccountStatus === 'active')) {
        return next(new errors.Http401Error('Cannot activate the Administrator, it is still pending to register'));
      }
      delete req.body.currentEmail;
      db.administratorAccess.update(req.body, {
        where: {
          email: adminAccess.email
        }
      }).then(function() {
        res.status(200).json({ message:'Admin Successfully Updated'});
      }).catch(Sequelize.UniqueConstraintError, function () {
        next(new errors.Http400Error('Admin already exists'));
      }).catch(Sequelize.ValidationError, function (err) {
        next(new errors.ValidationError(err.message));
      }).catch(function(err) {
        next(new errors.DatabaseError(err.message));
      });
    } else {
      return next(new errors.Http404Error('Admin not found'));
    }
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
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
