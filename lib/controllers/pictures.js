'use strict';

var db = require('../models');
var errors = require('errors');
var Sequelize = require('sequelize');
var multer  = require('multer');
var path = require('path');
var crypto = require('crypto');
var mime = require('mime');

/*
var upload = multer({
  dest: path.resolve(__dirname + '/../../app/media/landingPagePictures/'),
  limits: {
    fileSize: 1000000,
    files: 1
  }
}).single('image');
*/

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.resolve(__dirname + '/../../app/media/landingPagePictures/'));
  },
  filename: function (req, file, callback) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      callback(null, raw.toString('hex') + '.' + mime.extension(file.mimetype));
    });
  }
});

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000,
    files: 1
  }
}).single('image');


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
 Create a new Picture in th Database.
 */
exports.createPicture = function(req, res, next) {
  upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      res.send(err);
      return;
    }
    // Upload was successful; create picture entry on database.
    var pictureLocation = 'media/landingPagePictures/' + req.file.filename;
    db.pictures.create(
      {
        fileLabel: req.file.originalname,
        filePath: pictureLocation
      }
      ).then(function(data) {
        res.status(201).json(data);
      }).catch(Sequelize.ValidationError, function (err) {
        next(new errors.ValidationError(err.message));
      }).catch(function (err) {
        next(new errors.DatabaseError(err.message));
      });
  });
};

/*
 Update a Picture's Label given a new Value.
 */
exports.updatePicture = function(req, res, next) {
  db.pictures.update(
    {
      fileLabel: req.body.fileLabel
    },
    {
      fields: ['fileLabel'],
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
