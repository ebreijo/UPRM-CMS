'use strict';

describe('Controller: Login', function () {

  // load the service's module
  beforeEach(module('uprmcmsApp'));

  var $controller;
  var login;
  var scope;

  var $state;

  // Inject AngularJS Services:
  beforeEach(inject(function (_$controller_, $rootScope, _$state_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    scope = $rootScope.$new();
    $state = _$state_;

    $controller('LoginCtrl', {
      $scope: scope,
      login: login,
      $state: $state
    });

    scope.USER_ROLES = {
      guest: 'guest',
      student: 'student',
      recruiter: 'recruiter',
      administrator: 'admin'
    };

  }));

  describe('$scope.login function', function () {


  });

});
