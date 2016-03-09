'use strict';

var db = require('../models');
var errors = require('errors');
var Sequelize = require('sequelize');

exports.login = function () {

};

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
          next(new errors.Http400Error('Admin already exists.'));
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

exports.getAdminId = function(req, res, next, adminId) {
  db.administrators.findById(adminId).then(function(data) {
    if (data) {
      req.admin = data;
      return next();
    } else {
      return next(new errors.Http404Error('Admin not found'));
    }
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

exports.getAdmin = function(req, res) {
  res.json(req.admin);
};

exports.updateAdmin = function() {
  // Need to implement
};

exports.getAdminAccessId = function(req, res, next, adminAccessId) {
  db.administratorAccess.findById(adminAccessId).then(function(data) {
    if (data) {
      req.adminAccess = data;
      return next();
    } else {
      return next(new errors.Http404Error('Admin not found'));
    }
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

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

exports.getAdminAccess = function(req, res) {
  res.json(req.adminAccess);
};

exports.updateAdminAccess = function(req, res, next) {
  if (req.adminAccess.email === 'placement@uprm.edu') {
    return next(new  errors.Http401Error('Cannot update placement@uprm.edu email or status'));
  }
  db.administratorAccess.update(req.body, {
    where: {
      email: req.adminAccess.email
    }
  }).then(function() {
    res.status(200).json({ message:'Admin Successfully Updated'});
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};
