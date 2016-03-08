'use strict';

var db = require('../models');

exports.get = function(req, res, next) {

  db.documents.findAll().then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(err.message);
  });

};

exports.post = function(req, res, next) {
  db.documents.create(
    {
      fileLabel: req.body.fileLabel,
      filePath: '/documents/file1'
    }
  ).then(function(data) {
      res.json(data);
    }).catch(function (err) {
      console.log('got into catch');
      next(err.message);
    });
};

exports.getParam = function(req, res, next, docId) {
  req.params.docId = docId;
  next();
};

exports.getDocument = function(req, res, next) {
  db.documents.findById(req.params.docId).then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(err.message);
  });
};

/*
exports.deleteDocument = function(req, res, next) {
  db.documents.findAll().then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(err.message);
  });
};
*/
