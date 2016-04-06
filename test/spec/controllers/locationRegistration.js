'use strict';

describe('Controller: Location Registration', function () {

  // load the service's module
  beforeEach(module('uprmcmsApp'));

  var $controller;
  var locationRegistration;
  var scope;

  var $state;
  var localStorageService;

  // Inject Custom Services:

  beforeEach(inject(function ($injector) {
    localStorageService = $injector.get('localStorageService');
  }));

  // Inject AngularJS Services:
  beforeEach(inject(function (_$controller_, $rootScope, _$state_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    scope = $rootScope.$new();
    $state = _$state_;

    $controller('LocationRegistrationCtrl', {
      $scope: scope,
      locationRegistration: locationRegistration,
      $state: $state
    });

  }));

  describe('scope.registerLocation function', function () {

    it('It should register the recruiter and location and go to the recruiter company profile page if inputs in form are valid', function () {

      expect(scope.registerLocation(true)).toEqual(true);

    });

    it('It should stay on the locationRegistration web page if inputs in form are not valid', function () {

      expect(scope.registerLocation(false)).toEqual(false);

    });

  });


});
