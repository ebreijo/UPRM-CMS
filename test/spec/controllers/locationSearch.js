'use strict';

describe('Controller: Location Search', function () {

  // load the service's module
  beforeEach(module('uprmcmsApp'));

  var $controller;
  var locationSearch;
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

    $controller('LocationSearchCtrl', {
      $scope: scope,
      locationSearch: locationSearch,
      $state: $state
    });

    scope.apple = [
      {
        id: 2,
        companyName: 'Apple',
        streetAddress: 'Street 2nd',
        city: 'Durham',
        state: 'NY',
        country: 'United States',
        zipCode: '10504',
        phoneNumber: null
      },
      {
        id: 2,
        companyName: 'Apple',
        streetAddress: 'Street 1rst',
        city: 'Armonk',
        state: 'NY',
        country: 'United States',
        zipCode: '10504',
        phoneNumber: null
      }
    ];

  }));

  describe('scope.selectCompany function', function () {

    it('It should go to the recruiterRegistration web page if a valid location is selected', function () {
      scope.companyLocation = 'Durham, United States';

      expect(scope.selectLocation(true)).toEqual(true);

    });

    it('It should stay on the locationSearch web page if a location that is not registered is selected', function () {
      scope.companyLocation = 'Caguas, Puerto Rico';

      expect(scope.selectLocation(true)).toEqual(false);

    });

    it('It should stay on the locationSearch web page if a location that is not selected', function () {
      scope.companyLocation = null;

      expect(scope.selectLocation(false)).toEqual(false);

    });

  });


});
