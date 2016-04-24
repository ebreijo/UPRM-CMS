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


exports.seePDF = function (req, res) {
  var filePath = __dirname + '/../../app/media/promotionalMaterial/ERV7.pdf';

  fs.exists(filePath, function(exists) {
    if (exists) {
      fs.readFile(filePath , function (err, data){
        res.contentType('application/pdf');
        res.send(data);
      });
    } else {
      console.log('No file exists in');
    }
  });
};

exports.seeDocument = function (req, res) {
  //var filePath = __dirname + '/../../app/media/promotionalMaterial/ERV7.pdf';
  console.log(req.params.docId);
  res.send('lol');

  /*
  var filePath = '';

  fs.exists(filePath, function(exists) {
    if (exists) {
      fs.readFile(filePath , function (err, data){
        res.contentType('application/pdf');
        res.send(data);
      });
    } else {
      console.log('No file exists in');
    }
  });
  */

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
