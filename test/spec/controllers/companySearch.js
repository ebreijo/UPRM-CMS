'use strict';

describe('Controller: Company Search', function () {

  // load the service's module
  beforeEach(module('uprmcmsApp'));

  var $controller;
  var scope;

  var $state;
  var Registration;

  // Inject Custom Services:

  beforeEach(inject(function ($injector) {
    Registration = $injector.get('Registration');
  }));

  // Inject AngularJS Services:
  beforeEach(inject(function (_$controller_, $rootScope, _$state_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    scope = $rootScope.$new();
    $state = _$state_;

    $controller('CompanySearchCtrl', {
      $scope: scope,
      Registration: Registration
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

  describe('Initial state', function() {
    it('should have the continue button disabled', function() {
      expect(scope.disableContinueBtn).toBeTruthy();
    });
  });

  describe('scope.selectCompany function', function () {

    beforeEach(function() {
      spyOn(Registration, 'setCompanyName');
    });

    it('It should go to the locationSearch web page if a company is selected and the user presses continue', function () {
      scope.selectCompany('Apple');
      expect(Registration.setCompanyName).toHaveBeenCalled();
      expect(scope.disableContinueBtn).toBeFalsy();
    });

    it('It should stay on the companySearch web page if a company is not selected', function () {
      scope.selectCompany(null);
      expect(Registration.setCompanyName).not.toHaveBeenCalled();
      expect(scope.disableContinueBtn).toBeTruthy();
    });

  });

});
