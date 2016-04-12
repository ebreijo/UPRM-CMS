'use strict';

describe('Controller: Company Registration', function () {

  // load the service's module
  beforeEach(module('uprmcmsApp'));

  var $controller;
  var scope;

  var $state;
  var Registration;
  var q;

  // Inject Custom Services:
  beforeEach(inject(function ($injector) {
    Registration = $injector.get('Registration');
    q = $injector.get('$q');
  }));

  // Inject AngularJS Services:
  beforeEach(inject(function (_$controller_, $rootScope, _$state_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    scope = $rootScope.$new();
    $state = _$state_;

    $controller('CompanyRegistrationCtrl', {
      $scope: scope,
      $state: $state,
      Registration: Registration
    });

  }));

  describe('scope.registerCompany function', function () {

    beforeEach(function() {
      scope.company = {};
      scope.recruiter = {};
      scope.compLocation = {};
      spyOn(Registration, 'registerRecruiter').and.callFake(function() {
        return q.when({});
      });
      spyOn($state, 'go');
    });

    it('It should register the recruiter, location and company with a valid form and go to the landing page', function () {
      expect(scope.registerCompany(true)).toEqual(true);
      expect(Registration.registerRecruiter).toHaveBeenCalled();
    });

    it('It should stay on the companyRegistration web page if inputs in form are not valid', function () {
      expect(scope.registerCompany(false)).toEqual(false);
      expect(Registration.registerRecruiter).not.toHaveBeenCalled();
      expect($state.go).not.toHaveBeenCalled();
    });
  });

});
