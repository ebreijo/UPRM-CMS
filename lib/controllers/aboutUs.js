'use strict';

var db = require('../models');
var errors = require('errors');
var Promise = require('bluebird');
var Sequelize = require('sequelize');

function successUpdateJSON(data) {
  return {message: 'All ' + data + ' Successfully Updated.'};
}

function successDeleteJSON(data) {
  return {message: data + ' Successfully Deleted.'};
}

/*
 About Us
 */

/**
 * Get all data from About Us section and store them in a single JSON.
 * @param req
 * @param res
 * @param next
 */
exports.getAllData = function(req, res, next) {
  Promise.all([db.aboutUs.findAll(), db.requirements.findAll(), db.companyServices.findAll(),
      db.policies.findAll(), db.ourStaff.findAll(), db.studentServices.findAll()])
    .then(function (results) {
      res.json({
        aboutUs: results[0],
        requirements: results[1],
        companyServices: results[2],
        policies: results[3],
        ourStaff: results[4],
        studentServices: results[5]
      });
    }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Update About Us description
 * @param req
 * @param res
 * @param next
 */
exports.updateAboutUs = function(req, res, next) {
  delete req.body.id;

  db.aboutUs.update(req.body, {
    where: {
      // This table only has one row.
      id: 1
    }
  }).then(function() {
    res.status(200).json({message:'About Us Descriptions Successfully Updated.'});
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/*
 Requirements
 */

/**
 * Update an existing Requirement.
 * @param req
 * @param res
 * @param next
 */
exports.updateRequirements = function(req, res, next) {

  Promise.each(req.body.requirements, function(requirement) {
    // Update Each Requirement Here
    return db.requirements.update(
      {
        requirement : requirement.requirement
      },
      {
        where: {
          id: requirement.id
        }
      });

  }).then(function() {
    res.status(200).json(successUpdateJSON('Requirements'));
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });

};

/**
 * Add a Requirement.
 * NOTE: Only one Requirement can be added at the same time.
 * @param req
 * @param res
 * @param next
 */
exports.addRequirement = function(req, res, next) {
  db.requirements.create({
    requirement: req.body.requirement
  }).then(function(data) {
    res.status(201).json(data);
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function (err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Delete an existing Requirement.
 * NOTE: Only one Requirement can be deleted at the same time.
 * @param req
 * @param res
 * @param next
 */
exports.deleteRequirement = function(req, res, next) {
  db.requirements.destroy({
    where: {
      id: req.body.id
    }
  }).then(function(){
    res.status(200).json(successDeleteJSON('Requirement'));
  }, function(err){
    next(new errors.DatabaseError(err.message));
  });
};

/*
 Company Services
 */

/**
 * Update an existing Company Service.
 * @param req
 * @param res
 * @param next
 */
exports.updateCompanyServices = function(req, res, next) {

  Promise.each(req.body.companyServices, function(companyService) {
    // Update Each Requirement Here
    return db.companyServices.update(
      {
        service : companyService.service
      },
      {
        where: {
          id: companyService.id
        }
      });
  }).then(function() {
    // Send user a Success JSON.
    res.status(200).json(successUpdateJSON('Company Services'));
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Add a Company Service.
 * NOTE: Only one Company Service can be added at the same time.
 * @param req
 * @param res
 * @param next
 */
exports.addCompanyService = function(req, res, next) {
  db.companyServices.create({
    service: req.body.service
  }).then(function(data) {
    res.status(201).json(data);
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function (err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Delete an existing Company Service.
 * NOTE: Only one Company Service can be deleted at the same time.
 * @param req
 * @param res
 * @param next
 */
exports.deleteCompanyService = function(req, res, next) {
  db.companyServices.destroy({
    where: {
      id: req.body.id
    }
  }).then(function(){
    res.status(200).json(successDeleteJSON('Company Service'));
  }, function(err){
    next(new errors.DatabaseError(err.message));
  });
};

/*
 Policies
 */

/**
 * Update an existing Policy.
 * @param req
 * @param res
 * @param next
 */
exports.updatePolicies = function(req, res, next) {

  Promise.each(req.body.policies, function(policy) {
    // Update Each Requirement Here
    return db.policies.update(
      {
        policy : policy.policy
      },
      {
        where: {
          id: policy.id
        }
      });
  }).then(function() {
    // Send user a Success JSON.
    res.status(200).json(successUpdateJSON('Policies'));
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Add a Policy.
 * NOTE: Only one Policy can be added at the same time.
 * @param req
 * @param res
 * @param next
 */
exports.addPolicy = function(req, res, next) {
  db.policies.create({
    policy: req.body.policy
  }).then(function(data) {
    res.status(201).json(data);
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function (err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Delete an existing Policy.
 * NOTE: Only one Policy can be deleted at the same time.
 * @param req
 * @param res
 * @param next
 */
exports.deletePolicy = function(req, res, next) {
  db.policies.destroy({
    where: {
      id: req.body.id
    }
  }).then(function(){
    res.status(200).json({message: 'Policy Successfully Deleted.'});
  }, function(err){
    next(new errors.DatabaseError(err.message));
  });
};

/*
 Our Staff
 */

/**
 * Update an existing Staff Member.
 * @param req
 * @param res
 * @param next
 */
exports.updateOurStaff = function(req, res, next) {

  Promise.each(req.body.ourStaff, function(staff) {
    // Update Each staff member Here
    return db.ourStaff.update(
      {
        name : staff.name,
        position : staff.position
      },
      {
        where: {
          id: staff.id
        }
      });
  }).then(function() {
    // Send user a Success JSON.
    res.status(200).json(successUpdateJSON('Staff Members'));
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Add a Staff Member.
 * NOTE: Only one Staff Member can be added at the same time.
 * @param req
 * @param res
 * @param next
 */
exports.addStaff = function(req, res, next) {
  db.ourStaff.create({
    name: req.body.name,
    position : req.body.position
  }).then(function(data) {
    res.status(201).json(data);
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function (err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Delete an existing Staff Member.
 * NOTE: Only one Staff Member can be deleted at the same time.
 * @param req
 * @param res
 * @param next
 */
exports.deleteStaff = function(req, res, next) {
  db.ourStaff.destroy({
    where: {
      id: req.body.id
    }
  }).then(function(){
    res.status(200).json({message: 'Staff Member Successfully Deleted.'});
  }, function(err){
    next(new errors.DatabaseError(err.message));
  });
};

/*
 Student Services
 */

/**
 * Update an existing Student Service.
 * @param req
 * @param res
 * @param next
 */
exports.updateStudentServices = function(req, res, next) {

  Promise.each(req.body.studentServices, function(studentService) {
    // Update Each Requirement Here
    return db.studentServices.update(
      {
        service : studentService.service
      },
      {
        where: {
          id: studentService.id
        }
      });
  }).then(function() {
    // Send user a Success JSON.
    res.status(200).json(successUpdateJSON('Student Services'));
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });

};

/**
 * Add a Student Service.
 * NOTE: Only one Student Service can be added at the same time.
 * @param req
 * @param res
 * @param next
 */
exports.addStudentService = function(req, res, next) {
  db.studentServices.create({
    service: req.body.service
  }).then(function(data) {
    res.status(201).json(data);
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function (err) {
    next(new errors.DatabaseError(err.message));
  });
};

/**
 * Delete an existing Student Service.
 * NOTE: Only one Student Service can be deleted at the same time.
 * @param req
 * @param res
 * @param next
 */
exports.deleteStudentService = function(req, res, next) {
  db.studentServices.destroy({
    where: {
      id: req.body.id
    }
  }).then(function(){
    res.status(200).json(successDeleteJSON('Student Service'));
  }, function(err){
    next(new errors.DatabaseError(err.message));
  });
};
