'use strict';

describe('Controller: Location Search', function () {

  // load the service's module
  beforeEach(module('uprmcmsApp'));

  var $controller;
  var scope;

  var $state;
  var Registration;
  var $sessionStorage;

  // Inject Custom Services:

  beforeEach(inject(function ($injector) {
    Registration = $injector.get('Registration');
    $sessionStorage = $injector.get('$sessionStorage');
  }));

  // Inject AngularJS Services:
  beforeEach(inject(function (_$controller_, $rootScope, _$state_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    scope = $rootScope.$new();
    $state = _$state_;

    Registration.sessionStorage = $sessionStorage;
    Registration.sessionStorage.companyName = 'IBM';

    $controller('LocationSearchCtrl', {
      $scope: scope,
      $state: $state,
      Registration: Registration
    });

    scope.companyLocations = [
      {
        id: 1,
        companyName: 'IBM',
        streetAddress: '3039 E Cornwallis Road',
        city: 'Durham',
        state: 'NC',
        country: 'United States',
        zipCode: '27709',
        phoneNumber: null
      },
      {
        id: 2,
        companyName: 'IBM',
        streetAddress: '1 New Orchard Road',
        city: 'Armonk',
        state: 'NY',
        country: 'United States',
        zipCode: '10504',
        phoneNumber: null
      }
    ];

  }));

  describe('scope.selectCompany function', function () {

    beforeEach(function() {
      spyOn(Registration, 'setCompanyLocation');
    });

    it('It should go to the recruiterRegistration web page if a valid location is selected', function () {
      scope.companyLocation = {
        id: 1,
        companyName: 'IBM',
        streetAddress: '3039 E Cornwallis Road',
        city: 'Durham',
        state: 'NC',
        country: 'United States',
        zipCode: '27709',
        phoneNumber: null
      };
      expect(scope.selectLocation(true)).toEqual(true);
      expect(Registration.setCompanyLocation).toHaveBeenCalled();
    });

    it('It should stay on the locationSearch web page if a location that is not registered is selected', function () {
      scope.companyLocation = {
        id: 5,
        companyName: 'Apple',
        streetAddress: 'Apple Street',
        city: 'Cuppertino',
        state: 'CA',
        country: 'United States',
        zipCode: '27709',
        phoneNumber: null
      };
      expect(scope.selectLocation(true)).toEqual(false);
      expect(Registration.setCompanyLocation).not.toHaveBeenCalled();
    });

    it('It should stay on the locationSearch web page if a location that is not selected', function () {
      scope.companyLocation = null;
      expect(scope.selectLocation(false)).toEqual(false);
      expect(Registration.setCompanyLocation).not.toHaveBeenCalled();
    });

  });


});
