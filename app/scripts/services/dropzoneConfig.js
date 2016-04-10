'use strict';

var app = angular.module('uprmcmsApp');

app.factory('Dropzone', function(Restangular, $sessionStorage) {

  var obj = {
    'options': { // passed into the Dropzone constructor
      'url': '/api/pictures',
      'paramName' : 'image', // The name that will be used to transfer the file
      'maxFilesize': 10 // MB
    },
    'eventHandlers': {
      'sending': function (file, xhr, formData) {
        console.log('Sending!!!!');
        console.log(file + xhr + formData);
      },
      'success': function (file, response) {
        console.log('Success!!!!');
        console.log(file + response);
      }
    }
  };

  obj.companyNames = [];

  obj.sessionStorage = $sessionStorage;

  obj.companyLocations = [];

  obj.registerAdmin = function(user) {
    return Restangular.all('api/admins/register').post(user);
  };

  return obj;

});
