'use strict';

describe('Controller: AdminProfile', function () {

  // load the service's module
  beforeEach(module('uprmcmsApp'));

  var $controller;
  var scope;
  var Companies;
  var AdminAccess;
  var Majors;
  var Recruiters;
  var JobOffers;
  var PromotionalDocuments;
  var Patterns;
  var filter;
  var _;
  var q;
  var state;

  var adminProfileController;

  // Get params for AdminProfile controller and other necessary objects
  beforeEach(inject(function ($injector) {
    Companies = $injector.get('Companies');
    AdminAccess = $injector.get('AdminAccess');
    Majors = $injector.get('Majors');
    Recruiters = $injector.get('Recruiters');
    JobOffers = $injector.get('JobOffers');
    PromotionalDocuments = $injector.get('PromotionalDocuments');
    Patterns = $injector.get('Patterns');
    filter = $injector.get('$filter');
    _ = $injector.get('_');
    q = $injector.get('$q');
    state = $injector.get('$state');
  }));

  // Call the controller and inject it with mock objects
  beforeEach(inject(function (_$controller_, $rootScope) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    scope = $rootScope.$new();

    adminProfileController = $controller('AdminProfileCtrl', {
      $scope: scope,
      Companies: Companies,
      AdminAccess: AdminAccess,
      Majors: Majors,
      Recruiters: Recruiters,
      JobOffers: JobOffers,
      PromotionalDocuments: PromotionalDocuments,
      Patterns: Patterns,
      $filter: filter,
      _: _
    });

    scope.$digest();

  }));

  describe('initial state', function () {
    it('should have a pattern object defined', function () {
      expect(scope.patternEmail).toBeDefined();
    });

    it('should have a company status selection defined', function () {
      expect(scope.compStatusSelection).toEqual('active');
    });

    it('should have a company object defined', function () {
      expect(scope.company).toBeDefined();
    });

    it('should have an array companies object defined', function () {
      expect(scope.companies).toBeDefined();
    });

    it('should have a pending company registration object defined', function () {
      expect(scope.pendingCompanies).toBeDefined();
    });

    it('should have a pending recruiter object defined', function () {
      expect(scope.pendingRecruiters).toBeDefined();
    });

    it('should have a pending company registration object defined', function () {
      expect(scope.pendingJobOffers).toBeDefined();
    });

    it('should have a pending recruiter object defined', function () {
      expect(scope.pendingPromotionalDocuments).toBeDefined();
    });
  });


  describe('Companies Tab', function() {

    describe('submit to create a new company', function(){

      var form;
      beforeEach(function () {
        form = {};
        spyOn(Companies, 'createNewCompany');
        spyOn(Companies, 'getAllCompanies');
      });

      describe('with a invalid form', function() {
        beforeEach(function() {
          form.$valid = false;
        });
        it('should not make the createNewCompany request', function() {
          scope.submitCreateCompany(form);
          scope.$digest();
          expect(Companies.createNewCompany).not.toHaveBeenCalled();
        });
      });

      describe('with a valid form', function() {
        beforeEach(function () {
          form.$valid = true;
          scope.companies = [
            {
              name: 'Apple',
              websiteUrl: 'http://www.apple.com/',
              logoPath: null,
              companyDescription: 'This is Apple',
              companyStatus: 'active',
              registrationDate: '2016-03-27T20:01:47.000Z'
            },
            {
              name: 'IBM',
              websiteUrl: 'http://www.ibm.com/us-en/',
              logoPath: 'images/company.png',
              companyDescription: 'This is IBM',
              companyStatus: 'active',
              registrationDate: '2016-03-27T20:01:47.000Z'
            }
          ];
        });

        it('should make the createNewCompany request', function () {
          scope.company = {
            name: 'Pepes Company',
            websiteUrl: 'http://www.pepe.com/',
            logoPath: null,
            companyDescription: 'This is Pepe',
            companyStatus: 'active'
          };
          scope.submitCreateCompany(form);
          scope.$digest();
          expect(Companies.createNewCompany).toHaveBeenCalled();
          expect(Companies.getAllCompanies).toHaveBeenCalled();
        });

        it('should not make the createNewCompany request when company already exists', function () {
          scope.company = {
            name: 'Apple',
            websiteUrl: 'http://www.apple.com/',
            logoPath: null,
            companyDescription: 'This is Apple',
            companyStatus: 'active'
          };
          scope.submitCreateCompany(form);
          scope.$digest();
          expect(scope.title).toBeDefined();
          expect(scope.message).toBeDefined();
          expect(Companies.createNewCompany).not.toHaveBeenCalled();
          expect(Companies.getAllCompanies).not.toHaveBeenCalledWith('active');
        });
      });
    });

    describe('submit to update the status of a company', function(){
      var form;
      beforeEach(function () {
        form = {};
        spyOn(Companies, 'updateCompanyStatus');
      });

      describe('with a invalid form', function() {
        beforeEach(function() {
          form.$valid = false;
        });
        it('should not make the updateCompanyStatus request', function() {
          scope.submitCompanyStatusEdit(form);
          scope.$digest();
          expect(Companies.updateCompanyStatus).not.toHaveBeenCalled();
        });
      });

      describe('with a valid form', function() {
        beforeEach(function () {
          form.$valid = true;
          scope.tempCompany = {
            name: 'Apple',
            websiteUrl: 'http://www.apple.com/',
            logoPath: null,
            companyDescription: 'This is Apple',
            companyStatus: 'inactive'
          };
        });

        it('should make the updateCompanyStatus request', function () {
          scope.submitCompanyStatusEdit(form);
          scope.$digest();
          expect(Companies.updateCompanyStatus).toHaveBeenCalledWith(scope.tempCompany);
        });

      });
    });
  });

});
