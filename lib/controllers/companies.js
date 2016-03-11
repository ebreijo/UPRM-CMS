'use strict';

var db = require('../models');
var errors = require('errors');
var Sequelize = require('sequelize');


exports.register = function() {

};

exports.getAllCompanies = function(req, res, next) {
  db.companies.findAll({
    attributes: ['name']
  }).then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

exports.getCompanyId = function(req, res, next, compId) {
  db.companies.findById(compId, {
    attributes: ['name', 'websiteUrl', 'logoPath', 'companyDescription', 'companyStatus']
  }).then(function(data) {
    if (data) {
      req.company = data;
      return next();
    } else {
      return next(new errors.Http404Error('Company not found'));
    }
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

exports.getCompany = function(req, res) {
  res.json(req.company);
};

exports.updateCompany = function(req, res, next) {
  delete req.body.companyStatus;
  delete req.body.registrationDate;

  db.companies.update(req.body, {
    where: {
      name: req.company.name
    }
  }).then(function() {
    res.status(200).json({ message:'Company Successfully Updated'});
  }).catch(Sequelize.UniqueConstraintError, function () {
    next(new errors.Http400Error('Company already exists'));
  }).catch(Sequelize.ValidationError, function (err) {
    next(new errors.ValidationError(err.message));
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

exports.getAllActiveRecruitersFromCompany = function(req, res, next) {
  db.recruiters.findAll({
    attributes: ['email', 'companyName', 'firstName', 'lastName', 'phoneNumber'],
    where: {
      companyName: req.company.name,
      accountStatus: 'active'
    }
  }).then(function(data) {
    res.json(data);
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

exports.getActiveRecruiterFromCompany = function(req, res, next) {
  db.recruiters.findOne({
    attributes: ['email', 'companyName', 'firstName', 'lastName', 'phoneNumber'],
    where: {
      email: req.body.email,
      companyName: req.company.name,
      accountStatus: 'active'
    }
  }).then(function(data) {
    if (data) {
      res.status(200).json(data);
    } else {
      return next(new errors.Http404Error('Recruiter not found'));
    }
  }).catch(function(err) {
    next(new errors.DatabaseError(err.message));
  });
};

exports.updateRecruiter = function(req, res, next) {
  var recId = req.body.email;
  delete req.body.email;
  delete req.body.companyName;
  delete req.body.accountStatus;
  delete req.body.registrationDate;
  var body = req.body;

  if (body.password) {
    db.recruiters.hashPassword(body.password).then(function (hashedPassword) {
      body.password = hashedPassword;
      return db.recruiters.update(body, {
        where: {
          email: recId,
          companyName: req.company.name
        }
      });
    }).then(function (data) {
      if(data[0]) {
        res.status(200).json({ message:'Update was successful'});
      } else {
        res.status(400).json({ message:'Recruiter not found for this company'});
      }
    }).catch(Sequelize.ValidationError, function (err) {
      next(new errors.ValidationError(err.message));
    }).catch(function(err) {
      next(new errors.DatabaseError(err.message));
    });

  } else {
    db.recruiters.update(body, {
      where: {
        email: recId,
        companyName: req.company.name
      }
    }).then(function(data) {
      if(data[0]) {
        res.status(200).json({ message:'Update was successful'});
      } else {
        res.status(404).json({ message:'Recruiter not found for this company'});
      }
    }).catch(Sequelize.ValidationError, function (err) {
      next(new errors.ValidationError(err.message));
    }).catch(function(err) {
      next(new errors.DatabaseError(err.message));
    });
  }
};


