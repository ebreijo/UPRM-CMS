'use strict';

var app = angular.module('uprmcmsApp');

app.controller('ApplicationCtrl', function ($scope, $state, USER_ROLES, Auth, AUTH_EVENTS, Session, _) {

  // variables for use in child scopes.
  $scope.currentUser = null;
  $scope.userRoles = USER_ROLES;

  // Logout function to use in child scopes
  $scope.logout = Auth.logout;

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


  //For Document Items in Navbar
  var documents = [
    {
      'id': 1,
      'fileLabel': 'Job Fair Dress Code',
      'filePath': '/lib/documents'
    },
    {
      'id': 2,
      'fileLabel': 'Resume Template',
      'filePath': '/lib/documents'
    },
    {
      'id': 3,
      'fileLabel': '8th Job Fair',
      'filePath': '/lib/documents'
    },
    {
      'id': 4,
      'fileLabel': 'Interview Tips',
      'filePath': '/lib/documents'
    }
  ];

  $scope.documentList = [];
  $scope.addDocumentTitle = null;


  for (var i =0; i < documents.length; i++) {
    $scope.documentList.push(documents[i]);
  }

  $scope.deleteDocumentItem = function(item){
    _.remove(this.documentList, function(element) {
      return element.id === item.id;
    });
  };

  var index = 102;
  $scope.submitAddGeneralDocuments = function(form){
    if(form.$valid){
      $scope.documentList.push({id: index,fileLabel: form.documentTitle.$viewValue,filePath: '/lib/documents'});
      index++;
    }
  };

});
