'use strict';

var authType = require('./authType');
var db = require('./models');
var _ = require('lodash');
var errors = require('errors');

var auth = function(predicate) {

  return function(req, res, next) {
    if (req.isAuthenticated() && predicate(req.user)) {
      return next();
    }

    res.send(401);
  };

};

/**
*  Protect routes on your api from unauthenticated access
*/
exports.auth = auth(function() { return true; });

exports.authAdmin = auth(authType.isAdmin);

exports.authRecruiter = auth(authType.isRecruiter);

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
 * Clean up job offers every day.
 * Check whether an approved or pending job offer has expired. If so, set it to inactive.
 */
setInterval(function() {
  db.jobOffers.findAll({
    where: {
      $or: [{
        jobOfferStatus: 'approved'
      }, {
        jobOfferStatus: 'pending'
      }]
    }
  }).then(function (jobOffers) {
    if (jobOffers) {
      _.forEach(jobOffers, function (jobOffer) {

        if (jobOffer.expirationDate <= (new Date())) {
          jobOffer.jobOfferStatus = 'rejected';
          var jobId = jobOffer.id;
          console.log(jobOffer.dataValues);
          db.jobOffers.update(jobOffer.dataValues, {
            where: {
              id: jobId
            }
          }).catch(function(err) {
            console.error(new errors.DatabaseError(err.message));
          });
        } else {
          console.log('No job offer expired today');
        }
      });
    } else {
      console.log('No active/pending job offers found');
    }
  }).catch(function(err) {
    console.error(new errors.DatabaseError(err.message));
  });
}, 1000 * 60 * 60 * 24);

