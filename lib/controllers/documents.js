'use strict';

var db = require('../models');
var errors = require('errors');
var Sequelize = require('sequelize');

/*
 Extract the Document ID Parameter from the URL.
 */
exports.getParam = function(req, res, next, docId) {
  db.documents.findById(docId).then(function(data) {
    if(data) {
      req.document = data;
      req.params.docId = docId;
      next();
    } else {
      return next(new errors.Http404Error('Document not found'));
    }
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/*
 Return all Documents from the Database.
 */
exports.getAll = function(req, res, next) {
  db.documents.findAll().then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/*
 Create a new Document in th Database.
 */
exports.create = function(req, res, next) {
  db.documents.create(
    {
      fileLabel: req.body.fileLabel,
      filePath: '/documents/file1'
    }
  ).then(function(data) {
      res.status(201).json(data);
    }).catch(Sequelize.ValidationError, function (err) {
      next(new errors.ValidationError(err.message));
    }).catch(function (err) {
      next(new errors.DatabaseError(err.message));
    });
};

/*
 Return a Document given its Document ID.
 */
exports.getDocument = function(req, res) {
  res.json(req.document);
};

/*
 Delete a Document given its Document ID.
 */
exports.deleteDocument = function(req, res, next) {
  db.documents.destroy({
    where: {
      id: Number(req.params.docId)
    }
  }).then(function(){
    res.status(200).json({message: 'Document Successfully Deleted.'});
  }, function(err){
    next(new errors.DatabaseError(err.message));
  });
};
