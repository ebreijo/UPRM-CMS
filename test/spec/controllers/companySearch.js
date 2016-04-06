'use strict';

describe('Controller: Company Search', function () {

  // load the service's module
  beforeEach(module('uprmcmsApp'));

  var $controller;
  var companySearch;
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

    $controller('CompanySearchCtrl', {
      $scope: scope,
      companySearch: companySearch,
      $state: $state
    });

    scope.companies = [
      {
        name: 'Apple'
      },
      {
        name: 'Verizon'
      },
      {
        name: 'Accenture'
      },
      {
        name: 'EVERTEC'
      },
      {
        name: 'Google'
      },
      {
        name: 'Microsoft'
      },
      {
        name: 'IBM'
      }
    ];

  }));

  describe('scope.selectCompany function', function () {

    it('It should go to the locationSearch web page if form is true', function () {
      scope.companyName = 'Apple';

      expect(scope.selectCompany(true)).toEqual(true);

    });
  });

  describe('scope.selectCompany function', function () {

    it('It should stay on the companySearch web page if form is false', function () {
      scope.companyName = 'Apple';

      expect(scope.selectCompany(false)).toEqual(false);

    });
  });

  describe('scope.selectCompany function', function () {

    it('It should stay on the companySearch web page if no company is selected', function () {
      scope.companyName = null;

      expect(scope.selectCompany(true)).toEqual(false);

    });
  });

});
