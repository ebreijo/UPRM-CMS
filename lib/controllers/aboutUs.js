'use strict';

var db = require('../models');

exports.get = function(req, res, next) {
  db.aboutUs.findAll().then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(err.message);
  });
};
