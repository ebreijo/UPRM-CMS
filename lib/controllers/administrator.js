'use strict';

var db = require('../models');
var errors = require('errors');
var Sequelize = require('sequelize');

exports.login = function () {

};

exports.register = function (req, res, next) {
  var body = req.body;

  db.administratorAccess.findOne({
    where: {
      email: body.email,
      adminAccountStatus: 'pending'
    }
  }).then(function(adminAccess) {
    if (!adminAccess) {
      return next(new errors.Http401Error('Not authorized to register or account is already activated'));
    } else {
      db.administrator.findOne({
        where: {
          email: body.email
        }
      }).then(function (data) {
        if (data) {
          next(new errors.Http400Error('Admin already exists.'));
        } else {
          // Hash the admin's password and store it in the database.
          db.administrator.hashPassword(body.password).then(function (hashedPassword) {
            body.password = hashedPassword;
            return db.administrator.create(body);
          }).then(function (admin) {
            res.status(201).json(admin.getJSON());
          }).catch(Sequelize.ValidationError, function (err) {
            next(new errors.ValidationError(err.message));
          }).catch(function (err) {
            console.log(err);
            next(new errors.DatabaseError(err.message));
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

exports.getParam = function(req, res, next, adminId) {
  db.administratorAccess.findById(adminId).then(function(data) {
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

exports.getAllAdmins = function(req, res, next) {
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

exports.giveAccess = function(req, res, next) {
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

exports.getAdmin = function(req, res) {
  res.json(req.admin);
};

exports.updateAdmin = function(req, res, next) {
  if (req.admin.email === 'placement@uprm.edu') {
    return next(new  errors.Http401Error('Cannot update placement@uprm.edu email or status'));
  }
  db.administratorAccess.update(req.body, {
    where: {
      email: req.admin.email
    }
  }).then(function() {
    res.status(200).json({ message:'Admin Successfully Updated.'});
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};
