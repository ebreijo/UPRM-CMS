'use strict';

describe('Controller: Recruiter Registration', function () {

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
    Registration.sessionStorage.companyLocation = {
      id: 1,
      companyName: 'IBM',
      streetAddress: '3039 E Cornwallis Road',
      city: 'Durham',
      state: 'NC',
      country: 'United States',
      zipCode: '27709',
      phoneNumber: '787-344-4444'
    };

    $controller('RecruiterRegistrationCtrl', {
      $scope: scope,
      $state: $state,
      Registration: Registration
    });

  }));

  describe('scope.registerRecruiter function', function () {

    beforeEach(function() {
      scope.recruiter = {};
      spyOn(Registration, 'registerRecruiter').and.callFake(function() {
        return q.when({});
      });
    });

    describe('with an invalid form', function() {
      it('It should stay on the recruiterRegistration web page if inputs in form are not valid', function () {
        scope.registerRecruiter(false);
        expect(Registration.registerRecruiter).not.toHaveBeenCalled();
      });
    });

    it('It should register the recruiter with a valid form', function () {
      scope.registerRecruiter(true);
      expect(Registration.registerRecruiter).toHaveBeenCalled();
    });

  });


});
