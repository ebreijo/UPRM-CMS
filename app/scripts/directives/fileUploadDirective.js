/* global Dropzone */

'use strict';

// FOR REFERENCE:
// https://gist.github.com/compact/8118670#file-dropzone-directive-js-L37

var app = angular.module('uprmcmsApp');

app.directive('uprmFileUploader', function () {
  return function (scope, element, attrs) {
    var config, dropzone;

    config = scope[attrs.uprmFileUploader];

    // create a Dropzone for the element with the given options
    dropzone = new Dropzone(element[0], config.options);

    // bind the given event handlers
    angular.forEach(config.eventHandlers, function (handler, event) {
      dropzone.on(event, handler);
    });
  };
});

/**
 * USAGE:
 * 1. Create the dropzoneConfig file in the AngularJS Controller.
 */

/*
$scope.dropzoneConfig = {
  'options': { // passed into the Dropzone constructor
    'url': '/upload',
    'paramName' : 'image', // The name that will be used to transfer the file
    'maxFilesize': 3, // MB
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
*/

/**
 * 2. Pass this Config file into the directive on the HTML Like this:
 */

/*
<form
action="/file-upload"
class="dropzone"
id="my-awesome-dropzone"
uprm-file-uploader="dropzoneConfig">
  </form>
*/
