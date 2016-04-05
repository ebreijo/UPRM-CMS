'use strict';

var db = require('../models');
var errors = require('errors');
var Sequelize = require('sequelize');

/**
 * Get the major ID (in this case major code) and verify if major exists. If so add it to the request object
 * @param req
 * @param res
 * @param next
 * @param majorId
 */
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

/**
 * Get all the created majors
 * @param req
 * @param res
 * @param next
 */
exports.getAll = function(req, res, next) {
  db.majors.findAll().then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Create/add a new major
 * NOTE: Major code must be unique
 * @param req
 * @param res
 * @param next
 */
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

/**
 * If the major is found, send that major object back
 * @param req
 * @param res
 */
exports.getMajor = function(req, res) {
  res.json(req.major);
};

/**
 * Update the major given a major code
 * NOTE: Major code must be unique if updated
 * @param req
 * @param res
 * @param next
 */
exports.updateMajor = function(req, res, next) {
  db.majors.update(req.body,
    {
      where: {
        majorCode: req.major.majorCode
      }
    }
  ).then(function() {
      res.status(200).json({ message:'Major Successfully Updated.'});
    }).catch(Sequelize.UniqueConstraintError, function () {
      next(new errors.Http400Error('Major already exists'));
    }).catch(Sequelize.ValidationError, function (err) {
      next(new errors.ValidationError(err.message));
    }).catch(function(err) {
      next(new errors.DatabaseError(err.message));
    });
};

/**
 * Delete a major given a major code
 * @param req
 * @param res
 * @param next
 */
exports.deleteMajor = function(req, res, next) {
  req.major.destroy().then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};
