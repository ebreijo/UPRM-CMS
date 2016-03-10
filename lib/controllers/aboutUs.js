'use strict';

var db = require('../models');
var errors = require('errors');

/*
 Get all data from About Us section and store them in a single JSON.
 */

exports.getAllData = function(req, res, next) {
  db.aboutUs.findAll().then(function(aboutUs) {
    db.requirements.findAll().then(function(requirements) {
      db.companyServices.findAll().then(function(services) {
        db.policies.findAll().then(function(policies) {
          db.ourStaff.findAll().then(function(ourStaff) {
            db.ourStaff.findAll().then(function(studentServices) {
              res.json({
                aboutUs: aboutUs,
                requirements: requirements,
                services: services,
                policies: policies,
                ourStaff: ourStaff,
                studentServices: studentServices
              });
            });
          });
        });
      });
    });
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};
