'use strict';

var multer  = require('multer');
var path = require('path');
var crypto = require('crypto');
var mime = require('mime');

var PICTURE_SIZE = 100000;
var PROMOTIONAL_MATERIAL_SIZE = 100000;
var JOB_OFFER_SIZE = 100000;
var LOGO_SIZE = 200000;

// Example of Location that works (in route):
// '/../../app/media/landingPagePictures/'
// Example of Location that works (in this module):
// '/../app/media/landingPagePictures/'

var HOME_LOCATION = '/../app/media/';
var PICTURE_LOCATION = HOME_LOCATION + 'landing/';
var PROMOTIONAL_MATERIAL_LOCATION = HOME_LOCATION + 'promotionalMaterial/';
var JOB_OFFER_LOCATION = HOME_LOCATION + 'jobOffers/';
var LOGO_LOCATION = HOME_LOCATION + 'companyLogos/';

var PICTURE_ID = 'image';
var PROMOTIONAL_MATERIAL_ID = 'image';
var JOB_OFFER_ID = 'image';
var LOGO_ID = 'image';

function getStorage(fileLocation) {
  var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, path.resolve(__dirname + fileLocation));
    },
    filename: function (req, file, callback) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        callback(null, raw.toString('hex') + '.' + mime.extension(file.mimetype));
      });
    }
  });
  return storage;
}

function getUpload(storage, fileSize, fileId) {

  var upload = multer({
    storage: storage,
    limits: {
      fileSize: fileSize,
      files: 1
    }
  }).single(fileId);
  return upload;
}

/**
 * Get the Multer upload function for a picture.
 */
exports.pictureUpload = function(){
  var storage = getStorage(PICTURE_LOCATION);
  var upload = getUpload(storage, PICTURE_SIZE, PICTURE_ID);
  return upload;
};

/**
 * Get the Multer upload function for a job offer.
 */
exports.jobOfferUpload = function(){
  var storage = getStorage(JOB_OFFER_LOCATION);
  var upload = getUpload(storage, JOB_OFFER_SIZE, JOB_OFFER_ID);
  return upload;
};

/**
 * Get the Multer upload function for a Promotional Material.
 */
exports.promotionalMaterialUpload = function(){
  var storage = getStorage(PROMOTIONAL_MATERIAL_LOCATION);
  var upload = getUpload(storage, PROMOTIONAL_MATERIAL_SIZE, PROMOTIONAL_MATERIAL_ID);
  return upload;
};

/**
 * Get the Multer upload function for a Logo.
 */
exports.logoUpload = function(){
  var storage = getStorage(LOGO_LOCATION);
  var upload = getUpload(storage, LOGO_SIZE, LOGO_ID);
  return upload;
};
