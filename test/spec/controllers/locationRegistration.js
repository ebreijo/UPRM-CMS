'use strict';

describe('Controller: Location Registration', function () {

  // load the service's module
  beforeEach(module('uprmcmsApp'));

  var $controller;
  var scope;

  var $state;
  var Registration;
  var $sessionStorage;
  var q;

  // Inject Custom Services:
  beforeEach(inject(function ($injector) {
    Registration = $injector.get('Registration');
    $sessionStorage = $injector.get('$sessionStorage');
    q = $injector.get('$q');
  }));

  // Inject AngularJS Services:
  beforeEach(inject(function (_$controller_, $rootScope, _$state_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    scope = $rootScope.$new();
    $state = _$state_;

    Registration.sessionStorage = $sessionStorage;
    Registration.sessionStorage.companyName = 'IBM';

    $controller('LocationRegistrationCtrl', {
      $scope: scope,
      $state: $state,
      Registration: Registration
    });

  }));

  describe('scope.registerLocation function', function () {

    beforeEach(function() {
      scope.recruiter = {};
      scope.compLocation = {};
      spyOn(Registration, 'registerRecruiter').and.callFake(function() {
        return q.when({});
      });
      spyOn($state, 'go');
    });

    it('It should register the recruiter and location with a valid form and go to the landing page', function () {
      expect(scope.registerLocation(true)).toEqual(true);
      expect(Registration.registerRecruiter).toHaveBeenCalled();
    });

    it('It should stay on the locationRegistration web page if inputs in form are not valid', function () {
      expect(scope.registerLocation(false)).toEqual(false);
      expect(Registration.registerRecruiter).not.toHaveBeenCalled();
      expect($state.go).not.toHaveBeenCalled();
    });

  });


});
