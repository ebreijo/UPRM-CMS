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

    describe('submit to create a new company', function() {

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
          expect(scope.title).toEqual('Warning');
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

  describe('Admin Access Tab', function() {

    beforeEach(function () {
      scope.executeTab2();
    });

    it('should have admin access list', function() {
      expect(scope.adminAccessList).toBeDefined();
    });

    describe('submit give new admin access', function() {
      var form;
      beforeEach(function () {
        form = {};
        spyOn(AdminAccess, 'giveAdminAccess');
      });

      describe('with a invalid form', function() {
        it('should not make the giveAdminAccess request', function() {
          form.$valid = false;
          scope.giveAdminAccess(form);
          scope.$digest();
          expect(AdminAccess.giveAdminAccess).not.toHaveBeenCalled();
        });
      });

      describe('with a valid form', function() {

        beforeEach(function () {
          form.$valid = true;
        });

        it('should make the giveAdminAccess request', function() {
          scope.newAdminAccess = {
            email: 'pedro@upr.edu'
          };
          scope.giveAdminAccess(form);
          scope.$digest();
          expect(AdminAccess.giveAdminAccess).toHaveBeenCalledWith({
            email: 'pedro@upr.edu',
            isRoot: false,
            adminAccountStatus: 'pending'
          });
        });

        it('should not make the giveAdminAccess request if admin already exists', function() {
          scope.newAdminAccess = {
            email: 'placement@uprm.edu'
          };
          scope.giveAdminAccess(form);
          scope.$digest();
          expect(AdminAccess.giveAdminAccess).not.toHaveBeenCalled();
          expect(scope.title).toEqual('Warning');
          expect(scope.message).toBeDefined();
        });
      });
    });

    describe('submit admin access edit', function() {
      var form;
      beforeEach(function () {
        form = {};
        spyOn(AdminAccess, 'updateAdminAccess');
      });

      describe('with a invalid form', function() {
        it('should not make the updateAdminAccess request', function() {
          form.$valid = false;
          scope.submitAdminAccessEdit(form);
          scope.$digest();
          expect(AdminAccess.updateAdminAccess).not.toHaveBeenCalled();
        });
      });

      describe('with a valid form', function() {

        beforeEach(function () {
          form.$valid = true;
          scope.adminAccessList = [
            {
              email: 'juan.rodriguez@upr.edu',
              isRoot: false,
              adminAccountStatus: 'active'
            },
            {
              email: 'placement@uprm.edu',
              isRoot: true,
              adminAccountStatus: 'active'
            },
            {
              email: 'pedro.rivera@upr.edu',
              isRoot: false,
              adminAccountStatus: 'pending'
            }
          ];
        });

        it('should not make the updateAdminAccess request if changing status from pending to active', function() {
          scope.tempAdminAccess = {
            email: 'pedro.rivera@upr.edu',
            currentEmail: 'pedro.rivera@upr.edu',
            adminAccountStatus: 'active',
            adminTempAccountStatus: 'pending'
          };
          scope.submitAdminAccessEdit(form);
          scope.$digest();
          expect(AdminAccess.updateAdminAccess).not.toHaveBeenCalled();
          expect(scope.title).toEqual('Warning');
          expect(scope.message).toBeDefined();
        });

        it('should not make the updateAdminAccess request when updating admin email to another that already exists', function() {
          scope.tempAdminAccess = {
            email: 'juan.rodriguez@upr.edu',
            currentEmail: 'pedro.rivera@upr.edu',
            adminAccountStatus: 'active',
            adminTempAccountStatus: 'active'
          };
          scope.submitAdminAccessEdit(form);
          scope.$digest();
          expect(AdminAccess.updateAdminAccess).not.toHaveBeenCalled();
          expect(scope.title).toEqual('Warning');
          expect(scope.message).toBeDefined();
        });

        it('should make the updateAdminAccess request', function() {
          scope.tempAdminAccess = {
            email: 'pedro.rivera@upr.edu',
            currentEmail: 'pedro.rivera@upr.edu',
            adminAccountStatus: 'inactive',
            adminTempAccountStatus: 'pending'
          };
          scope.submitAdminAccessEdit(form);
          scope.$digest();
          expect(AdminAccess.updateAdminAccess).toHaveBeenCalled();
        });
      });
    });
  });

  describe('Majors Tab', function() {

    beforeEach(function () {
      scope.executeTab3();
    });

    it('should have majors list', function () {
      expect(scope.majors).toBeDefined();
    });

    describe('submit add new major', function () {
      var form;
      beforeEach(function () {
        form = {};
        spyOn(Majors, 'createNewMajor');
      });

      describe('with a invalid form', function () {
        it('should not make the create New Major request', function () {
          form.$valid = false;
          scope.submitAddMajor(form);
          scope.$digest();
          expect(Majors.createNewMajor).not.toHaveBeenCalled();
        });
      });

      describe('with a valid form', function () {

        beforeEach(function () {
          form.$valid = true;
        });

        it('should make the create New Major request', function () {
          scope.major = {
            majorCode: 'INGL',
            nameEnglish: 'English',
            nameSpanish: 'Ingles'
          };
          scope.submitAddMajor(form);
          scope.$digest();
          expect(Majors.createNewMajor).toHaveBeenCalledWith({
            majorCode: 'INGL',
            nameEnglish: 'English',
            nameSpanish: 'Ingles'
          });
        });

        it('should not make the create New Major request if a major already exists', function () {
          scope.major = {
            majorCode: 'CCOM',
            nameEnglish: 'Computer Science',
            nameSpanish: 'Ciencias de Computos'
          };
          scope.submitAddMajor(form);
          scope.$digest();
          expect(Majors.createNewMajor).not.toHaveBeenCalled();
          expect(scope.title).toEqual('Warning');
          expect(scope.message).toBeDefined();
        });
      });
    });

    describe('submit edit major', function() {
      var form;
      beforeEach(function () {
        form = {};
        spyOn(Majors, 'editMajor');
      });

      describe('with a invalid form', function() {
        it('should not make the edit major request', function() {
          form.$valid = false;
          scope.submitMajorEdit(form);
          scope.$digest();
          expect(Majors.editMajor).not.toHaveBeenCalled();
        });
      });

      describe('with a valid form', function() {

        beforeEach(function () {
          form.$valid = true;
          scope.majors = [
            {
              majorCode: 'CCOM',
              nameEnglish: 'Computer Science',
              nameSpanish: 'Ciencias de Computos'
            },
            {
              majorCode: 'ICOM',
              nameEnglish: 'Computer Engineering',
              nameSpanish: 'Ingenieria en Computadoras'
            },
            {
              majorCode: 'ININ',
              nameEnglish: 'Industrial Engineering',
              nameSpanish: 'Ingenieria Industrial'
            }
          ];
        });

        it('should not make the edit Major request when updating major code to another that already exists', function() {
          scope.tempMajor = {
            majorCode: 'ICOM',
            currentMajorCode: 'CCOM',
            nameEnglish: 'Computer Science',
            nameSpanish: 'Ciencias de Computos'
          };
          scope.submitMajorEdit(form);
          scope.$digest();
          expect(Majors.editMajor).not.toHaveBeenCalled();
          expect(scope.title).toEqual('Warning');
          expect(scope.message).toBeDefined();
        });

        it('should make the edit Major request', function() {
          scope.tempMajor = {
            majorCode: 'CCOM',
            currentMajorCode: 'CCOM',
            nameEnglish: 'New Major',
            nameSpanish: 'Ciencias de Computos'
          };
          scope.submitMajorEdit(form);
          scope.$digest();
          expect(Majors.editMajor).toHaveBeenCalled();
        });
      });
    });

    describe('submit delete major', function() {
      describe('with a valid form', function() {

        it('should  make the delete Major request', function() {
          var form = {};
          spyOn(Majors, 'deleteMajor');
          form.$valid = true;
          scope.tempMajor = {
            majorCode: 'ICOM',
            currentMajorCode: 'ICOM',
            nameEnglish: 'Computer Science',
            nameSpanish: 'Ciencias de Computos'
          };
          scope.submitMajorDelete(form);
          scope.$digest();
          expect(Majors.deleteMajor).toHaveBeenCalled();
        });
      });
    });
  });


  describe('Company Registration Tab', function() {

    beforeEach(function () {
      scope.executeTab4();
    });

    describe('submit to Accept a new company registration', function () {
      var form;
      beforeEach(function () {
        form = {};
        spyOn(Companies, 'updateCompanyStatus');
      });

      describe('with a invalid form', function () {
        it('should not make the update Company Status request', function () {
          form.$valid = false;
          scope.submitAcceptCompany(form);
          scope.$digest();
          expect(Companies.updateCompanyStatus).not.toHaveBeenCalled();
        });
      });

      describe('with a valid form', function () {
        it('should make the update Company Status request with active company status', function () {
          form.$valid = true;
          scope.tempCompany = {
            name: 'Google',
            websiteUrl: 'https://www.google.com/',
            logoPath: null,
            companyDescription: 'This is Google',
            companyStatus: 'pending',
            registrationDate: '2016-03-28T23:13:10.000Z'
          };
          scope.submitAcceptCompany(form);
          scope.$digest();
          expect(scope.tempCompany.companyStatus).toEqual('active');
          expect(Companies.updateCompanyStatus).toHaveBeenCalledWith({
            name: 'Google',
            websiteUrl: 'https://www.google.com/',
            logoPath: null,
            companyDescription: 'This is Google',
            companyStatus: 'active',
            registrationDate: '2016-03-28T23:13:10.000Z'
          });
        });
      });
    });

    describe('submit to Reject a new company registration', function () {
      var form;
      beforeEach(function () {
        form = {};
        spyOn(Companies, 'updateCompanyStatus');
      });

      describe('with a invalid form', function () {
        it('should not make the update Company Status request', function () {
          form.$valid = false;
          scope.submitRejectCompany(form);
          scope.$digest();
          expect(Companies.updateCompanyStatus).not.toHaveBeenCalled();
        });
      });

      describe('with a valid form', function () {
        it('should make the update Company Status request with inactive company status', function () {
          form.$valid = true;
          scope.tempCompany = {
            name: 'Google',
            websiteUrl: 'https://www.google.com/',
            logoPath: null,
            companyDescription: 'This is Google',
            companyStatus: 'pending',
            registrationDate: '2016-03-28T23:13:10.000Z'
          };
          scope.submitRejectCompany(form);
          scope.$digest();
          expect(scope.tempCompany.companyStatus).toEqual('inactive');
          expect(Companies.updateCompanyStatus).toHaveBeenCalledWith({
            name: 'Google',
            websiteUrl: 'https://www.google.com/',
            logoPath: null,
            companyDescription: 'This is Google',
            companyStatus: 'inactive',
            registrationDate: '2016-03-28T23:13:10.000Z'
          });
        });
      });
    });

  });
});
