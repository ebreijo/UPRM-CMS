'use strict';

var authType = require('./authType');
var db = require('./models');
var _ = require('lodash');
var errors = require('errors');
var Promise = require('bluebird');
var fs = require('fs');

var auth = function(predicate) {

  return function(req, res, next) {
    if (req.isAuthenticated() && predicate(req.user)) {
      return next();
    }

    res.sendStatus(401);
  };

};

/**
*  Protect routes on your api from unauthenticated access
*/
exports.auth = auth(function() { return true; });

exports.authAdmin = auth(authType.isAdmin);

exports.authRecruiter = auth(authType.isRecruiter);

exports.authStudent = auth(authType.isStudent);

exports.authRecruiterOrAdmin = auth(function(user) {
  return authType.isRecruiter(user) || authType.isAdmin(user);
});

/**
* Set a cookie for angular so it knows we have an http session
*/
exports.setUserCookie = function(req, res, next) {
  if(req.user) {
    res.cookie('user', JSON.stringify(req.user.userInfo));
  }
  next();
};

/**
 * Clean up job offers and promotional material every day.
 * Check whether an approved or pending job offer has expired. If so, set it to inactive.
 * Check whether an approved or pending promotional material has experied. If so, set it to inactive.
 */
setInterval(function() {

  var jobOffers = null;
  var promotionalMaterial = null;

  Promise.all([
    db.jobOffers.findAll({
      where: {
        $or: [{
          jobOfferStatus: 'approved'
        }, {
          jobOfferStatus: 'pending'
        }]
      }
    }),
    db.promotionalMaterial.findAll({
      where: {
        $or: [{
          status: 'approved'
        }, {
          status: 'pending'
        }]
      }
    })
  ]).then(function(results) {
    jobOffers = results[0];
    promotionalMaterial = results[1];

    if (jobOffers) {
      _.forEach(jobOffers, function (jobOffer) {

        if (jobOffer.expirationDate <= (new Date())) {
          jobOffer.jobOfferStatus = 'rejected';
          var jobId = jobOffer.id;

          var path = __dirname + '/../app/' + jobOffer.flyerPath;
          var flyerPath = jobOffer.flyerPath;

          fs.exists(path, function(exists) {
            if (exists) {
              fs.unlink(path, function(err) {
                if (err) {
                  return console.error(err);
                }
                console.log('File ' + flyerPath + ' deleted successfully!');
              });
            } else {
              console.log('No file exists in ' + flyerPath);
            }
            jobOffer.flyerPath = null;
            db.jobOffers.update(jobOffer.dataValues, {
              where: {
                id: jobId
              }
            }).catch(function(err) {
              console.error(new errors.DatabaseError(err.message));
            });
          });
        } else {
          console.log('Job offer \"' + jobOffer.title + '\" from company \"' + jobOffer.companyName + '\" has not expired yet');
        }
      });
    } else {
      console.log('No active/pending job offers found');
    }

    if (promotionalMaterial) {
      _.forEach(promotionalMaterial, function (promMaterial) {

        if (promMaterial.expirationDate <= (new Date())) {
          promMaterial.status = 'rejected';
          var promId = promMaterial.id;

          var path = __dirname + '/../app/' + promMaterial.filePath;
          var filePath = promMaterial.filePath;

          fs.exists(path, function(exists) {
            if (exists) {
              fs.unlink(path, function (err) {
                if (err) {
                  return console.error(err);
                }
              });
              console.log('File ' + filePath + ' deleted successfully!');
            } else {
              console.log('No file exists in ' + filePath);
            }
            db.promotionalMaterial.destroy({
              where: {
                id: promId
              }
            }).catch(function(err) {
              console.error(new errors.DatabaseError(err.message));
            });
          });
        } else {
          console.log('Promotional material \"' + promMaterial.title + '\" from company ' + promMaterial.companyName + ' has not expired yet');
        }
      });
    } else {
      console.log('No active/pending promotional material found');
    }
  }).catch(function(err) {
    console.error(new errors.DatabaseError(err.message));
  });
}, 1000 * 60 * 60 * 24);

