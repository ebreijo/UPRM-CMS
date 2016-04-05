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
    it('should return true if all elements of check mark are false', function () {
      scope.checkBox = {
        internship: false,
        coop: false,
        partTime: false,
        fullTime: false
      };
      expect(scope.lookingForFilter('Internship')).toEqual(true);
    });

    it('should return true internship is checked and internship is passed to filter (regardless of other values)', function () {
      scope.checkBox = {
        internship: true,
        coop: false,
        partTime: false,
        fullTime: true
      };
      expect(scope.lookingForFilter('Internship')).toEqual(true);
    });
  });

});
