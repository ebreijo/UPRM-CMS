'use strict';

describe('Controller: Company Registration', function () {

  // load the service's module
  beforeEach(module('uprmcmsApp'));

  var $controller;
  var companyRegistration;
  var scope;

  var $state;

  // Inject AngularJS Services:
  beforeEach(inject(function (_$controller_, $rootScope, _$state_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    scope = $rootScope.$new();
    $state = _$state_;

    $controller('CompanyRegistrationCtrl', {
      $scope: scope,
      companyRegistration: companyRegistration,
      $state: $state
    });

  }));

  describe('scope.registerCompany function', function () {

    it('It should register the recruiter, location and company and go to the recruiter company profile page if inputs in form are valid', function () {

      expect(scope.registerCompany(true)).toEqual(true);

    });

    it('It should stay on the companyRegistration web page if inputs in form are not valid', function () {

      expect(scope.registerCompany(false)).toEqual(false);

    });

  });

  describe('scope.addMajors function', function () {

    it('It should add majors selected from all majors available to the list of interested majors of a company. Case 1: List of interested majors is empty', function () {

      scope.majorList = [
        {
          'name': 'CCOM',
          'value': true
        },
        {
          'name': 'ICOM',
          'value': true
        },
        {
          'name': 'INSO',
          'value': true
        },
        {
          'name': 'INME',
          'value': true
        },
        {
          'name': 'INEL',
          'value': true
        }
      ];

      scope.majorsSelected = [

      ];

      var resultingList = [
        {
          'name': 'CCOM',
          'value': false
        },
        {
          'name': 'ICOM',
          'value': false
        },
        {
          'name': 'INSO',
          'value': false
        },
        {
          'name': 'INME',
          'value': false
        },
        {
          'name': 'INEL',
          'value': false
        }
      ];

      scope.addMajors();

      expect(angular.equals(scope.majorsSelected, resultingList)).toBeTruthy();

    });

    it('It should add majors selected from all majors available to the list of interested majors of a company. Case 2: List of all majors is empty', function () {

      scope.majorList = [

      ];

      scope.majorsSelected = [
        {
          'name': 'CCOM',
          'value': false
        },
        {
          'name': 'ICOM',
          'value': false
        },
        {
          'name': 'INSO',
          'value': false
        },
        {
          'name': 'INME',
          'value': false
        },
        {
          'name': 'INEL',
          'value': false
        }
      ];

      var resultingList = [
        {
          'name': 'CCOM',
          'value': false
        },
        {
          'name': 'ICOM',
          'value': false
        },
        {
          'name': 'INSO',
          'value': false
        },
        {
          'name': 'INME',
          'value': false
        },
        {
          'name': 'INEL',
          'value': false
        }
      ];

      scope.addMajors();

      expect(angular.equals(scope.majorsSelected, resultingList)).toBeTruthy();

    });

    it('It should add majors selected from all majors available to the list of interested majors of a company. Case 3: Some majors are selected from all majors available', function () {

      scope.majorList = [
        {
          'name': 'INSO',
          'value': false
        },
        {
          'name': 'INME',
          'value': true
        },
        {
          'name': 'INEL',
          'value': true
        }
      ];

      scope.majorsSelected = [
        {
          'name': 'CCOM',
          'value': false
        },
        {
          'name': 'ICOM',
          'value': false
        },

      ];

      var resultingList = [
        {
          'name': 'CCOM',
          'value': false
        },
        {
          'name': 'ICOM',
          'value': false
        },
        {
          'name': 'INME',
          'value': false
        },
        {
          'name': 'INEL',
          'value': false
        }
      ];

      scope.addMajors();

      expect(angular.equals(scope.majorsSelected, resultingList)).toBeTruthy();

    });

  });

  describe('scope.removeMajors function', function () {

    it('It should add majors selected from the list of interested majors to the list of all majors available. Case 1: List of all majors is empty', function () {

      scope.majorList = [

      ];

      scope.majorsSelected = [
        {
          'name': 'CCOM',
          'value': true
        },
        {
          'name': 'ICOM',
          'value': true
        },
        {
          'name': 'INSO',
          'value': true
        },
        {
          'name': 'INME',
          'value': true
        },
        {
          'name': 'INEL',
          'value': true
        }
      ];

      var resultingList = [
        {
          'name': 'CCOM',
          'value': false
        },
        {
          'name': 'ICOM',
          'value': false
        },
        {
          'name': 'INSO',
          'value': false
        },
        {
          'name': 'INME',
          'value': false
        },
        {
          'name': 'INEL',
          'value': false
        }
      ];

      scope.removeMajors();

      expect(angular.equals(scope.majorList, resultingList)).toBeTruthy();

    });


    it('It should add majors selected from all majors available to the list of interested majors of a company. Case 2: List of interested majors is empty', function () {

      scope.majorList = [
        {
          'name': 'CCOM',
          'value': false
        },
        {
          'name': 'ICOM',
          'value': false
        },
        {
          'name': 'INSO',
          'value': false
        },
        {
          'name': 'INME',
          'value': false
        },
        {
          'name': 'INEL',
          'value': false
        }
      ];

      scope.majorsSelected = [

      ];

      var resultingList = [
        {
          'name': 'CCOM',
          'value': false
        },
        {
          'name': 'ICOM',
          'value': false
        },
        {
          'name': 'INSO',
          'value': false
        },
        {
          'name': 'INME',
          'value': false
        },
        {
          'name': 'INEL',
          'value': false
        }
      ];

      scope.removeMajors();

      expect(angular.equals(scope.majorList, resultingList)).toBeTruthy();

    });

    it('It should add majors selected from all majors available to the list of interested majors of a company. Case 3: Some majors are selected from the list of interested majors', function () {

      scope.majorList = [
        {
          'name': 'INSO',
          'value': false
        },
        {
          'name': 'INME',
          'value': false
        }
      ];

      scope.majorsSelected = [
        {
          'name': 'CCOM',
          'value': true
        },
        {
          'name': 'ICOM',
          'value': false
        },
        {
          'name': 'INEL',
          'value': true
        }
      ];

      var resultingList = [
        {
          'name': 'INSO',
          'value': false
        },
        {
          'name': 'INME',
          'value': false
        },

        {
          'name': 'CCOM',
          'value': false
        },

        {
          'name': 'INEL',
          'value': false
        }
      ];

      scope.removeMajors();

      expect(angular.equals(scope.majorList, resultingList)).toBeTruthy();

    });

  });

});
