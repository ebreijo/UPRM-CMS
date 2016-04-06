'use strict';

describe('Controller: Job Fair', function () {

  // load the service's module
  beforeEach(module('uprmcmsApp'));

  var $controller;
  var scope;

  // Call the controller and inject it with mock objectss
  beforeEach(inject(function (_$controller_, $rootScope) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    scope = $rootScope.$new();
    $controller('jobFairCtrl', {
      $scope: scope
    });
  }));

  describe('scope.getLookingForString function', function () {
    it('should return the correct string with looking for values, given a list of values. ', function () {
      expect(scope.getLookingForString([
        {
          companyName: 'Apple',
          jobPosition: 'Internship'
        },
        {
          companyName: 'Apple',
          jobPosition: 'Full-Time'
        }
      ])).toEqual('Internship, Full-Time');
    });

    it('should return an empty string given an empty list. ', function () {
      expect(scope.getLookingForString([])).toEqual('');
    });
  });

  describe('scope.getInterestedMajorsString function', function () {
    it('should return the correct string with looking for values, given a list of values. ', function () {
      expect(scope.getInterestedMajorsString([
        {
          companyName: 'Drug Enforcement Administration',
          majorCode: 'ICOM'
        },
        {
          companyName: 'Drug Enforcement Administration',
          majorCode: 'CCOM'
        },
        {
          companyName: 'Drug Enforcement Administration',
          majorCode: 'INSO'
        }
      ])).toEqual('ICOM, CCOM, INSO');
    });

    it('should return an empty string given an empty list. ', function () {
      expect(scope.getInterestedMajorsString([])).toEqual('');
    });

  });

  describe('scope.lookingForFilter function', function () {
    it('should always return true if no majors are selected.', function () {
      scope.checkBox = {
        internship: false,
        coop: false,
        partTime: false,
        fullTime: false
      };
      expect(scope.lookingForFilter([])).toEqual(true);
    });

    it('should return true if one value is checked and it is passed to the filter.', function () {
      scope.checkBox = {
        internship: true,
        coop: false,
        partTime: false,
        fullTime: false
      };
      expect(scope.lookingForFilter([
        {
          companyName: 'Drug Enforcement Administration',
          jobPosition: 'Internship'
        }
      ])).toEqual(true);
    });
  });
});
