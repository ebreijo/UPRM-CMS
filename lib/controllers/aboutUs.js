'use strict';

var db = require('../models');
var async = require('async');
var aboutUsJson = {};

/*
 Get all data from About Us section and store them in a single JSON.
 This function uses Async to force queries and response to occur Synchronously.
 */
exports.getAllData = function(req, res, next) {
  async.series([
      function(callback) {
        db.aboutUs.findAll().then(function(data) {
          aboutUsJson.aboutUs = data;
          callback();
        }).catch(function(err) {
          next(err.message);
        });
      },
      function(callback) {
        db.requirements.findAll().then(function(data) {
          aboutUsJson.requirements = data;
          callback();
        }).catch(function(err) {
          next(err.message);
        });
      },
      function(callback){
        db.companyServices.findAll().then(function(data) {
          aboutUsJson.companyServices = data;
          callback();
        }).catch(function(err) {
          next(err.message);
        });
      },
      function(callback) {
        db.policies.findAll().then(function(data) {
          aboutUsJson.policies = data;
          callback();
        }).catch(function(err) {
          next(err.message);
        });
      },
      function(callback) {
        res.json(aboutUsJson);
        callback();
      }
    ],
    // optional callback
    function(err){
      next(err);
    });
};
