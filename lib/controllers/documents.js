'use strict';

var db = require('../models');
var errors = require('errors');
var Sequelize = require('sequelize');
var fs = require('fs');
var upload = require('../fileUpload');

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
      filePath: req.body.filePath
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

  var path = __dirname + '/../../app/' + req.document.filePath;

  fs.exists(path, function(exists) {
    if (exists) {
      fs.unlink(path, function (err) {
        if (err) {
          return console.error(err);
        }
        console.log('File ' + req.document.filePath + ' deleted successfully!');
      });
    } else {
      console.log('No file exists in ' + req.document.filePath);
    }

    db.documents.destroy({
      where: {
        id: Number(req.params.docId)
      }
    }).then(function(){
      res.status(200).json({message: 'Document Successfully Deleted.'});
    }, function(err){
      next(new errors.DatabaseError(err.message));
    });
  });
};


exports.uploadDocument = function(req, res) {
  console.log('got to create logo function.');

  var publicDocumentUpload = upload.publicDocumentUpload();
  publicDocumentUpload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      console.log('got to error function');
      res.send(err);
      return;
    }
    console.log('no error!!');
    // Upload was successful; create picture entry on database.
    var jobOfferLocation = 'media/publicDocuments/' + req.file.filename;

    res.status(201).json({
      fileLabel: req.file.originalname,
      filePath: jobOfferLocation
    });

  });
};
