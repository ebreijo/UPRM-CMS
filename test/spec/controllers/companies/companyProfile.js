'use strict';

describe('Controller: Company Profile', function () {

  // load the service's module
  beforeEach(module('uprmcmsApp'));

  var $controller;
  var companyProfile;
  var scope;
  var _;

  // Inject Custom Services:

  beforeEach(inject(function ($injector) {
    _ = $injector.get('_');
  }));

  // Inject AngularJS Services:
  beforeEach(inject(function (_$controller_, $rootScope) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    scope = $rootScope.$new();

    $controller('CompanyCtrl', {
      $scope: scope,
      companyProfile: companyProfile,
      _: _
    });

  }));

  describe('scope.getCompanyDescriptionItem', function () {

    it('Get the company general information of company.', function () {

      var companyInfo = {
        name: 'IBM',
        websiteUrl: 'http://www.ibm.com/us-en/',
        logoPath: null,
        companyDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat quis elit a vestibulum. Mauris leo sem, lacinia eu dapibus a, tempor eget metus. In vehicula maximus magna. Vestibulum pulvinar purus in tristique pellentesque. Sed porta imperdiet ultricies. Cras ac ipsum aliquam, condimentum risus non, euismod quam. Morbi posuere lobortis auctor. Aliquam massa eros, ultrices a viverra a, lacinia sed sem.',
        companyStatus: 'Active'
      };

      scope.CompanyDescriptionItem = {};

      scope.getCompanyDescriptionItem(companyInfo);

      expect(angular.equals(scope.CompanyDescriptionItem, companyInfo)).toBeTruthy();

    });

  });

  describe('scope.submitCompanyDescription', function () {

    it('Company General Information should not be updated if inputs in form are not valid', function () {

      var myForm = {};

      scope.CompanyDescriptionItem = {
        name: 'IBM',
        websiteUrl: 'http://www.ibm.com/us-en/',
        logoPath: null,
        companyDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat quis elit a vestibulum. Mauris leo sem, lacinia eu dapibus a, tempor eget metus. In vehicula maximus magna. Vestibulum pulvinar purus in tristique pellentesque. Sed porta imperdiet ultricies. Cras ac ipsum aliquam, condimentum risus non, euismod quam. Morbi posuere lobortis auctor. Aliquam massa eros, ultrices a viverra a, lacinia sed sem.',
        companyStatus: 'Active'
      };

      scope.companyProfile = {
        'generalInfo':[
          {
            websiteUrl: '',
            companyDescription: ''
          }
        ]
      };

      myForm.$invalid = false;

      expect(scope.submitCompanyDescription(myForm)).toEqual(false);

    });

    it('Company General Information should be updated if inputs in form are valid', function () {

      var myForm = {};

      scope.CompanyDescriptionItem = {};

      scope.CompanyDescriptionItem = {
        name: 'IBM',
        websiteUrl: 'http://www.ibm.com/us-en/',
        logoPath: null,
        companyDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        companyStatus: 'Active'
      };

      scope.companyProfile = {
        'generalInfo':[
          {
            websiteUrl: '',
            companyDescription: ''
          }
        ]
      };

      myForm.$valid = true;

      scope.CompanyDescriptionItem.websiteUrl = 'http://www.test_url.com';
      scope.CompanyDescriptionItem.companyDescription = 'This is a company description';

      var websiteURL = false;
      var companyDescription = false;

      scope.submitCompanyDescription(myForm);

      if (scope.companyProfile.generalInfo[0].websiteUrl === 'http://www.test_url.com'){
        websiteURL = true;
      }
      else {
        websiteURL = false;
      }

      if (scope.companyProfile.generalInfo[0].companyDescription === 'This is a company description'){
        companyDescription = true;
      }
      else {
        companyDescription = false;
      }
      expect(websiteURL&&companyDescription).toEqual(true);
    });

  });


});
