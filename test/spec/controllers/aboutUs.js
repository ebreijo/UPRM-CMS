'use strict';

describe('Controller: AboutUs', function () {

  // load the service's module
  beforeEach(module('uprmcmsApp'));

  var $controller;
  var $scope;
  var AboutUs;
  var filter;
  var _;
  var Patterns;

  // Get params for About Us controller
  beforeEach(inject(function ($injector) {
    AboutUs = $injector.get('AboutUs');
    Patterns = $injector.get('Patterns');
    _ = $injector.get('_');
    filter = $injector.get('$filter');
  }));

  // Call the controller and inject it with mock objects
  beforeEach(inject(function (_$controller_, $rootScope) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $scope = $rootScope.$new();

    $controller('AboutUsCtrl', {
      $scope: $scope,
      AboutUs: AboutUs,
      _: _,
      $filter: filter,
      Patterns: Patterns
    });
  }));

  describe('$scope.checkStaffPosition function', function () {
    it('should check the length of a staff position: If we use String \'b\' it will return a message', function () {
      expect($scope.checkStaffPosition('b')).toEqual('Position should be between 2 and 63 characters long');
    });
  });

});
