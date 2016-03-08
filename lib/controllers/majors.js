'use strict';

var db = require('../models');
var errors = require('errors');
var Sequelize = require('sequelize');

exports.getParam = function(req, res, next, majorId) {
  db.majors.findById(majorId).then(function(data) {
    if (data) {
      req.major = data;
      return next();
    } else {
      return next(new errors.Http404Error('Major not found'));
    }
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

exports.getAll = function(req, res, next) {
  db.majors.findAll().then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

exports.create = function(req, res, next) {
  db.majors.create(req.body).then(function(data) {
    res.status(201).json(data);
  }).catch(Sequelize.UniqueConstraintError, function () {
    next(new errors.Http400Error('Major already exists'));
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function (err) {
    next(new errors.DatabaseError(err.message));
  });
};

exports.getMajor = function(req, res) {
  res.json(req.major);
};

exports.updateMajor = function(req, res, next) {
  db.majors.update(req.body,
    {
      where: {
        majorCode: req.major.majorCode
      }
    }
  ).then(function() {
      res.status(200).json({ message:'Major Successfully Updated.'});
    }).catch(Sequelize.ValidationError, function (err) {
      next(new errors.ValidationError(err.message));
    }).catch(function(err) {
      next(new errors.DatabaseError(err.message));
    });
};

exports.deleteMajor = function(req, res, next) {
  req.major.destroy().then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};
