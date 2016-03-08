'use strict';

var db = require('../models');

exports.getParam = function(req, res, next, picId) {
  req.params.picId = picId;
  next();
};

exports.get = function(req, res, next) {
  db.pictures.findAll().then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(err.message);
  });
};

exports.getPicture = function(req, res, next) {
  db.pictures.findById(req.params.picId).then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(err.message);
  });
};

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
  ).then(function(){
      res.status(200).json({ message:'Picture Successfully Updated.'});
    }, function(err){
      next(err.message);
    });
};
