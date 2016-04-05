'use strict';

describe('Controller: Job Offers', function () {

  // load the service's module
  beforeEach(module('uprmcmsApp'));

  var $controller;
  var JobOffers;
  var scope;

  // Inject Custom Services:
  beforeEach(inject(function ($injector) {
    JobOffers = $injector.get('JobOffers');
  }));

  // Inject AngularJS Services:
  beforeEach(inject(function (_$controller_, $rootScope) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    scope = $rootScope.$new();

    $controller('jobOffersCtrl', {
      $scope: scope,
      JobOffers: JobOffers
    });
  }));

  describe('scope.lookingForFilter function', function () {

    /**
     * All Options Checked
     */
    it('should return true if all elements of check mark are false', function () {
      scope.checkBox = {
        internship: false,
        coop: false,
        partTime: false,
        fullTime: false
      };
      expect(scope.lookingForFilter('Internship')).toEqual(true);
    });

    /**
     * Internship
     */
    it('should return true if internship is checked and internship is passed to filter (regardless of other values)', function () {
      scope.checkBox = {
        internship: true,
        coop: false,
        partTime: false,
        fullTime: true
      };
      expect(scope.lookingForFilter('Internship')).toEqual(true);
    });


    it('should return false if internship is not checked and internship is passed to filter (regardless of other values)', function () {
      scope.checkBox = {
        internship: false,
        coop: false,
        partTime: false,
        fullTime: true
      };
      expect(scope.lookingForFilter('Internship')).toEqual(false);
    });

    /**
     * Co-Op
     */
    it('should return true if coop is checked and coop is passed to filter (regardless of other values)', function () {
      scope.checkBox = {
        internship: true,
        coop: true,
        partTime: true,
        fullTime: true
      };
      expect(scope.lookingForFilter('CO-OP')).toEqual(true);
    });


    it('should return false if coop is not checked and coop is passed to filter (regardless of other values)', function () {
      scope.checkBox = {
        internship: false,
        coop: false,
        partTime: false,
        fullTime: true
      };
      expect(scope.lookingForFilter('CO-OP')).toEqual(false);
    });

    /**
     * Part-Time
     */
    it('should return true if part time is checked and part time is passed to filter (regardless of other values)', function () {
      scope.checkBox = {
        internship: true,
        coop: false,
        partTime: true,
        fullTime: true
      };
      expect(scope.lookingForFilter('Part-Time')).toEqual(true);
    });


    it('should return false if part time is not checked and part time is passed to filter (regardless of other values)', function () {
      scope.checkBox = {
        internship: false,
        coop: false,
        partTime: false,
        fullTime: true
      };
      expect(scope.lookingForFilter('Part-Time')).toEqual(false);
    });

    /**
     * Full-Time
     */
    it('should return true if full time is checked and full time is passed to filter (regardless of other values)', function () {
      scope.checkBox = {
        internship: true,
        coop: true,
        partTime: false,
        fullTime: true
      };
      expect(scope.lookingForFilter('Full-Time')).toEqual(true);
    });

    it('should return false if full time is not checked and full time is passed to filter (regardless of other values)', function () {
      scope.checkBox = {
        internship: true,
        coop: false,
        partTime: false,
        fullTime: false
      };
      expect(scope.lookingForFilter('Full-Time')).toEqual(false);
    });

  });

});
