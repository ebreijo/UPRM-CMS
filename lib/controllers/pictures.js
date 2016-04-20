'use strict';

var db = require('../models');
var errors = require('errors');
var Sequelize = require('sequelize');
var upload = require('../fileUpload');

/*
 Extract the Picture ID Parameter from the URL.
 */
exports.getParam = function(req, res, next, picId) {
  db.pictures.findById(picId).then(function(data) {
    if(data) {
      req.picture = data;
      req.params.picId = picId;
      next();
    } else {
      return next(new errors.Http404Error('Picture not found'));
    }
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/*
 Return all Pictures from the Database.
 */
exports.getAll = function(req, res, next) {
  db.pictures.findAll().then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

/*
 Return a Picture given its Picture ID.
 */
exports.getPicture = function(req, res) {
  res.json(req.picture);
};

/*
 Create a new Picture in the Database.
 */
exports.createPicture = function(req, res) {
  console.log('got to create pictures function.');

  var pictureUpload = upload.pictureUpload();
  pictureUpload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      console.log('got to error function');
      res.send(err);
      return;
    }
    console.log('no error!!');
    // Upload was successful; create picture entry on database.
    var pictureLocation = 'media/landing/' + req.file.filename;
    res.status(201).json({
      fileLabel: req.file.originalname,
      filePath: pictureLocation
    });

    /*
    db.pictures.create(
      {
        fileLabel: req.file.originalname,
        filePath: pictureLocation
      }
      ).then(function(data) {
        res.status(201).json(data);
        next();
      }).catch(Sequelize.ValidationError, function (err) {
        next(new errors.ValidationError(err.message));
      }).catch(function (err) {
        next(new errors.DatabaseError(err.message));
      });
      */

  });
};

/*
 Update a Picture's Label given a new Value.
 */
exports.updatePicture = function(req, res, next) {
  db.pictures.update(
    {
      fileLabel: req.body.fileLabel,
      filePath: req.body.filePath
    },
    {
      fields: ['fileLabel', 'filePath'],
      where: {
        id: Number(req.params.picId)
      }
    }
  ).then(function() {
      res.status(200).json({ message:'Picture Successfully Updated.'});
    }).catch(Sequelize.ValidationError, function (err) {
      next(new errors.ValidationError(err.message));
    }).catch(function(err) {
      next(new errors.DatabaseError(err.message));
    });
};
