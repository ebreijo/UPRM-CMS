'use strict';

describe('Controller: Location Search', function () {

  // load the service's module
  beforeEach(module('uprmcmsApp'));

  var $controller;
  var recruiterRegistration;
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

    $controller('RecruiterRegistrationCtrl', {
      $scope: scope,
      recruiterRegistration: recruiterRegistration,
      $state: $state
    });

  }));

  describe('scope.registerRecruiter function', function () {

    it('It should register the recruiter and go to the recruiter company profile page if inputs in form are valid', function () {

      expect(scope.registerRecruiter(true)).toEqual(true);

    });

    it('It should stay on the recruiterRegistration web page if inputs in form are not valid', function () {

      expect(scope.registerRecruiter(false)).toEqual(false);

    });

  });


});
