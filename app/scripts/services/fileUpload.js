'use strict';

/* jshint ignore:start */
var app = angular.module('uprmcmsApp');

app.factory('FileUpload', function() {
  return {
    fileUploadConfig: function(route, paramName, maxFileSize) {
      return {
        'options': { // passed into the Dropzone constructor
          'url': route,
          'paramName': paramName,     // The name that will be used to transfer the file
          'maxFilesize': maxFileSize // in MBs
        },
        'eventHandlers': {
          'sending': function (file, xhr, formData) {
            console.log('Sending!!!!');
          },
          'success': function (file, response) {
            console.log('Success!!!!');
          }
        }
      };
    }
  };
});
/* jshint ignore:end */
