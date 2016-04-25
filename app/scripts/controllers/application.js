'use strict';

var app = angular.module('uprmcmsApp');

app.controller('ApplicationCtrl', function ($scope, $state, USER_ROLES, Auth, AUTH_EVENTS, Session, _, PublicDocuments, cfpLoadingBar) {

  // variables for use in child scopes.
  $scope.currentUser = null;
  $scope.userRoles = USER_ROLES;

  // Logout function to use in child scopes
  $scope.logout = function() {
    Auth.logout().then(function() {
      $state.go('landingPage');
    });
  };

  $scope.$on(AUTH_EVENTS.loginSuccess, function(event, user) {
    $scope.currentUser = user;
  });

  $scope.$on(AUTH_EVENTS.logoutSuccess, function() {
    $scope.currentUser = null;
  });

  // Get current user in the session
  $scope.getCurrentUser = function() {
    return Session.user;
  };

  $scope.studentLogin = function() {
    Auth.studentLogin();
  };

  $scope.addDocumentTitle = null;

  PublicDocuments.getAllPublicDocuments().then(function() {
    $scope.documentList = PublicDocuments.publicDocuments;
  });

  $scope.deleteDocumentItem = function(item) {
    PublicDocuments.deletePublicDocument(item.id).then(function() {
      _.remove($scope.documentList, function(element) {
        return element.id === item.id;
      });
    });
  };

  $scope.publicDocumentsForm = {};

  $scope.submitAddGeneralDocuments = function(form) {
    if(form.$valid) {
      $scope.publicDocumentsForm = form;
      // if promotional material was selected, upload here.
      if($('#publicDocumentUpload').get(0).dropzone.files.length > 0){
        cfpLoadingBar.start();
        $('#publicDocumentUpload').get(0).dropzone.processQueue();
      }
    }
  };

  $scope.document = {};

  $scope.submitAddPublicDocumentsData = function(form) {
    var publicDoc = {
      fileLabel: $scope.document.title,
      filePath: $scope.document.filePath
    };

    PublicDocuments.addPublicDocuments(publicDoc).then(function(addedDocument) {
      $scope.document = {};
      form.$setPristine();
      $scope.documentList.push(addedDocument);
    });
  };


  // Public Documents Uploads:

  $scope.addPublicDocumentConfig = {
    'options': { // passed into the Dropzone constructor
      'url': '/api/documents/upload',
      'paramName': 'image',     // The name that will be used to transfer the file
      'maxFilesize': 5, // in MBs
      'maxFiles': 1,
      'acceptedFiles': 'application/pdf',
      'createImageThumbnails': false,
      'autoProcessQueue': false
    },
    'eventHandlers': {
      'sending': function () {
        console.log('Sending!!!!');
      },
      'success': function (file, response) {
        console.log('Success!!!!');
        cfpLoadingBar.complete();
        this.removeAllFiles();
        $scope.document.filePath = response.filePath;
        $scope.submitAddPublicDocumentsData($scope.publicDocumentsForm);
      },
      'error': function() {
        this.removeAllFiles();
        /* jshint ignore:start */
        alert('ERROR: File Too Large!');
        /* jshint ignore:end */
      }
    }
  };

});
