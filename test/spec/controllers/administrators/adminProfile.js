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
  var PromotionalMaterial;
  var Patterns;
  var filter;
  var _;
  var q;
  var state;
  var httpBackend;

  var adminProfileController;

  // Get params for AdminProfile controller and other necessary objects
  beforeEach(inject(function ($injector) {
    Companies = $injector.get('Companies');
    AdminAccess = $injector.get('AdminAccess');
    Majors = $injector.get('Majors');
    Recruiters = $injector.get('Recruiters');
    JobOffers = $injector.get('JobOffers');
    PromotionalMaterial = $injector.get('PromotionalMaterial');
    Patterns = $injector.get('Patterns');
    filter = $injector.get('$filter');
    _ = $injector.get('_');
    q = $injector.get('$q');
    state = $injector.get('$state');
    httpBackend = $injector.get('$httpBackend');
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
      PromotionalMaterial: PromotionalMaterial,
      Patterns: Patterns,
      $filter: filter,
      _: _
    });

    httpBackend.whenGET('/api/admins/companies?status=pending').respond(200, []);
    httpBackend.whenGET('/api/admins/companies?status=active').respond(200, []);
    httpBackend.whenGET('/api/admins/companies?status=inactive').respond(200, []);
  }));

  describe('initial state', function () {
    it('should have a pattern object defined', function () {
      expect(scope.patterns).toBeDefined();
    });

    it('should have a company status selection defined', function () {
      expect(scope.compStatusSelection).toEqual('active');
    });

    it('should have a company object defined', function () {
      expect(scope.company).toBeDefined();
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
      expect(scope.pendingPromotionalMaterial).toBeDefined();
    });
  });


  describe('Companies Tab', function() {

    describe('submit to create a new company', function() {

      var form;
      beforeEach(function () {
        form = {};
        spyOn(Companies, 'createNewCompany');
        spyOn(Companies, 'createOrUpdateCompanyTemporaryContact');
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
          expect(Companies.createOrUpdateCompanyTemporaryContact).not.toHaveBeenCalled();
        });
      });

      describe('with a valid form', function() {
        beforeEach(function () {
          form = {
            $valid: true,
            $setPristine: function() {}
          };
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
          httpBackend.whenPOST('/api/admins/companies/PepesCompany/tempContact').respond(201);
        });

        it('should make the createNewCompany request', function () {
          scope.company = {
            name: 'PepesCompany',
            websiteUrl: 'http://www.pepe.com/',
            logoPath: null,
            companyDescription: 'This is Pepe',
            companyStatus: 'active'
          };
          scope.submitCreateCompany(form);
          scope.$digest();
          expect(Companies.createNewCompany).toHaveBeenCalled();
          expect(Companies.createOrUpdateCompanyTemporaryContact).toHaveBeenCalled();
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
          expect(Companies.createOrUpdateCompanyTemporaryContact).not.toHaveBeenCalled();
          expect(Companies.getAllCompanies).toHaveBeenCalledWith('active');
        });
      });
    });

    describe('submit to update the status of a company', function(){
      var form;
      beforeEach(function () {
        form = {};
        spyOn(Companies, 'updateCompanyStatus').and.callFake(function() {
          return q.when({});
        });
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
      AdminAccess.getAdminAccessList();
      httpBackend.whenGET('/api/adminsAccess').respond(200, []);
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
          form = {
            $valid: true,
            $setPristine: function() {}
          };
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
          scope.adminAccessList = [
            {
              email: 'juan.rodriguez@upr.edu',
              isRoot: false,
              adminAccountStatus: 'active'
            },
            {
              email: 'maria.hernandez@upr.edu',
              isRoot: false,
              adminAccountStatus: 'inactive'
            },
            {
              email: 'pedro.rivera@upr.edu',
              isRoot: false,
              adminAccountStatus: 'pending'
            },
            {
              email: 'placement@uprm.edu',
              isRoot: true,
              adminAccountStatus: 'active'
            }
          ];
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
      });

      describe('with a invalid form', function() {
        it('should not make the updateAdminAccess request', function() {
          spyOn(AdminAccess, 'updateAdminAccess').and.callFake(function() {
            return q.when({});
          });
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

        it('should make the updateAdminAccess request if changing status from pending to active but should receive a warning message', function() {
          spyOn(AdminAccess, 'updateAdminAccess').and.callFake(function() {
            return q.reject({
              data: {
                message: 'an error'
              }
            });
          });
          scope.tempAdminAccess = {
            email: 'pedro.rivera@upr.edu',
            currentEmail: 'pedro.rivera@upr.edu',
            adminAccountStatus: 'active',
            adminTempAccountStatus: 'pending'
          };
          scope.submitAdminAccessEdit(form);
          scope.$digest();
          expect(AdminAccess.updateAdminAccess).toHaveBeenCalled();
          expect(scope.title).toEqual('Warning');
          expect(scope.message).toBeDefined();
        });

        it('should not make the updateAdminAccess request when updating admin email to another that already exists', function() {
          spyOn(AdminAccess, 'updateAdminAccess').and.callFake(function() {
            return q.when({});
          });
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
          spyOn(AdminAccess, 'updateAdminAccess').and.callFake(function() {
            return q.when({});
          });
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
      httpBackend.whenGET('/api/majors').respond(200, []);
    });

    it('should have majors list', function () {
      expect(scope.majors).toBeDefined();
    });

    describe('submit add new major', function () {
      var form;
      beforeEach(function () {
        form = {};
        spyOn(Majors, 'createNewMajor');
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
          },
          {
            majorCode: 'INME',
            nameEnglish: 'Mechanical Engineering',
            nameSpanish: 'Ingenieria Mecanica'
          },
          {
            majorCode: 'INSO',
            nameEnglish: 'Software Engineering',
            nameSpanish: 'Ingenieria de Software'
          }
        ];
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
          form = {
            $valid: true,
            $setPristine: function() {}
          };
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
    var form;
    beforeEach(function () {
      scope.executeTab4();
      form = {};
      spyOn(Companies, 'updateCompanyStatus').and.callFake(function() {
        return q.when({});
      });
      scope.tempCompany = {
        name: 'Google',
        websiteUrl: 'https://www.google.com/',
        logoPath: null,
        companyDescription: 'This is Google',
        companyStatus: 'pending',
        registrationDate: '2016-03-28T23:13:10.000Z'
      };
    });

    describe('submit to Accept a new company registration', function () {

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
          scope.submitAcceptCompany(form);
          scope.$digest();
          expect(scope.tempCompany.companyStatus).toEqual('active');
          expect(Companies.updateCompanyStatus).toHaveBeenCalledWith(scope.tempCompany);
        });
      });
    });

    describe('submit to Reject a new company registration', function () {

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
          scope.submitRejectCompany(form);
          scope.$digest();
          expect(scope.tempCompany.companyStatus).toEqual('inactive');
          expect(Companies.updateCompanyStatus).toHaveBeenCalledWith(scope.tempCompany);
        });
      });
    });
  });

  describe('Recruiter Registration Tab', function() {
    var form;
    beforeEach(function () {
      scope.executeTab5();
      form = {};
      spyOn(Recruiters, 'updateRecruiterStatus');
      scope.tempRecruiter = {
        email: 'juanito@gmail.com',
        companyName: 'Google',
        firstName: 'Juanito',
        lastName: 'Perez',
        phoneNumber: '787-555-5555',
        accountStatus: 'pending',
        registrationDate: '2016-03-29T01:31:59.000Z',
        companyLocation: {
          id: 4,
          companyName: 'Google',
          streetAddress: '1600 Amphitheatre Parkway',
          city: 'Mountain View',
          state: 'CA',
          country: 'United States',
          zipCode: '94043',
          phoneNumber: null
        }
      };
    });

    describe('submit to Accept a new recruiter registration', function () {

      describe('with a invalid form', function () {
        it('should not make the update Recruiter Status request', function () {
          form.$valid = false;
          scope.submitAcceptRecruiter(form);
          scope.$digest();
          expect(Recruiters.updateRecruiterStatus).not.toHaveBeenCalled();
        });
      });

      describe('with a valid form', function () {
        it('should make the update Recruiter Status request with active recruiter account status', function () {
          form.$valid = true;
          scope.submitAcceptRecruiter(form);
          scope.$digest();
          expect(scope.tempRecruiter.accountStatus).toEqual('active');
          expect(Recruiters.updateRecruiterStatus).toHaveBeenCalledWith(scope.tempRecruiter);
        });
      });
    });

    describe('submit to Reject a new recruiter registration', function () {

      describe('with a invalid form', function () {
        it('should not make the update Recruiter Status request', function () {
          form.$valid = false;
          scope.submitRejectRecruiter(form);
          scope.$digest();
          expect(Recruiters.updateRecruiterStatus).not.toHaveBeenCalled();
        });
      });

      describe('with a valid form', function () {
        it('should make the update Recruiter Status request with inactive recruiter account status', function () {
          form.$valid = true;
          scope.submitRejectRecruiter(form);
          scope.$digest();
          expect(scope.tempRecruiter.accountStatus).toEqual('inactive');
          expect(Recruiters.updateRecruiterStatus).toHaveBeenCalledWith(scope.tempRecruiter);
        });
      });
    });
  });

  describe('Job Offers Tab', function() {
    var form;
    beforeEach(function () {
      scope.executeTab6();
      spyOn(JobOffers, 'updateJobOffer');
      form = {};
      scope.tempJobOffer = {
        id: 2,
        companyName: 'IBM',
        email: 'sergio@ibm.com',
        title: 'Different Job Offer',
        description: 'This is a job offer which is different',
        jobPosition: 'CO-OP',
        educationLevel: 'Bachelors',
        recentGraduate: false,
        creationDate: '2016-02-22T16:12:12.000Z',
        expirationDate: '2016-07-22T16:12:12.000Z',
        announcementNumber: 34234,
        flyerPath: null,
        jobOfferStatus: 'pending',
        location: 'Durham, NC'
      };
    });

    it('should have today\'s date defined', function () {
      expect(scope.today).toBeDefined();
    });

    describe('submit to accept a new job offer from a company', function () {

      describe('with a invalid form', function () {
        it('should not make the accept job offer request', function () {
          form.$valid = false;
          scope.submitJobOfferReviewAccept(form);
          scope.$digest();
          expect(JobOffers.updateJobOffer).not.toHaveBeenCalled();
        });
      });

      describe('with a valid form', function () {
        it('should not make the accept job offer request if expiration date is a past date', function () {
          form.$valid = true;
          scope.tempJobOffer.expirationDate = new Date('October 13, 2013 11:13:00');
          scope.submitJobOfferReviewAccept(form);
          scope.$digest();
          expect(JobOffers.updateJobOffer).not.toHaveBeenCalled();
        });

        it('should make the accept job offer request if expiration date is a future date', function () {
          form.$valid = true;
          scope.tempJobOffer.expirationDate = new Date(Date.now() + (8.64e+7)*10);
          scope.submitJobOfferReviewAccept(form);
          scope.$digest();
          expect(scope.tempJobOffer.jobOfferStatus).toEqual('approved');
          expect(JobOffers.updateJobOffer).toHaveBeenCalledWith(scope.tempJobOffer);
        });
      });
    });

    describe('submit to reject a new job offer from a company', function () {

      describe('with a invalid form', function () {
        it('should not make the reject job offer request', function () {
          form.$valid = false;
          scope.submitRejectJobOffer(form);
          scope.$digest();
          expect(JobOffers.updateJobOffer).not.toHaveBeenCalled();
        });
      });

      describe('with a valid form', function () {
        it('should make the reject job offer request', function () {
          form.$valid = true;
          scope.submitRejectJobOffer(form);
          scope.$digest();
          expect(scope.tempJobOffer.jobOfferStatus).toEqual('rejected');
          expect(JobOffers.updateJobOffer).toHaveBeenCalledWith(scope.tempJobOffer);
        });
      });
    });
  });

  describe('Promotional Documents Tab', function() {
    var form;
    beforeEach(function () {
      scope.executeTab7();
      spyOn(PromotionalMaterial, 'updatePromotionalMaterial');
      form = {};
      scope.tempPromotionalDocument = {
        id: 2,
        companyName: 'IBM',
        title: 'Promotion2',
        filePath: 'lib/promotionalMaterial',
        expirationDate: '2016-07-22T16:12:12.000Z',
        status: 'pending'
      };
    });

    describe('submit to accept a new promotional document from a company', function () {
      var form;
      beforeEach(function () {
        form = {};
      });

      describe('with a invalid form', function () {
        it('should not make the accept promotional document request', function () {
          form.$valid = false;
          scope.submitAcceptPromotionalDocument(form);
          scope.$digest();
          expect(PromotionalMaterial.updatePromotionalMaterial).not.toHaveBeenCalled();
        });
      });

      describe('with a valid form', function () {
        it('should make the accept promotional document request', function () {
          form.$valid = true;
          scope.submitAcceptPromotionalDocument(form);
          scope.$digest();
          expect(scope.tempPromotionalDocument.status).toEqual('approved');
          expect(PromotionalMaterial.updatePromotionalMaterial).toHaveBeenCalledWith(scope.tempPromotionalDocument);
        });
      });
    });

    describe('submit to reject a new promotional document from a company', function () {

      describe('with a invalid form', function () {
        it('should not make the reject promotional document request', function () {
          form.$valid = false;
          scope.submitRejectPromotionalDocument(form);
          scope.$digest();
          expect(PromotionalMaterial.updatePromotionalMaterial).not.toHaveBeenCalled();
        });
      });

      describe('with a valid form', function () {
        it('should make the reject promotional document request', function () {
          form.$valid = true;
          scope.submitRejectPromotionalDocument(form);
          scope.$digest();
          expect(scope.tempPromotionalDocument.status).toEqual('rejected');
          expect(PromotionalMaterial.updatePromotionalMaterial).toHaveBeenCalledWith(scope.tempPromotionalDocument);
        });
      });
    });
  });

});
