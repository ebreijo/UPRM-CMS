'use strict';

describe('Controller: AdminJobFairManagement', function () {

  // load the service's module
  beforeEach(module('uprmcmsApp'));

  var $controller;
  var scope;
  var JobFairGeneralInfo;
  var JobFairCompaniesInfo;
  var CompanyLookingForPositions;
  var Majors;
  var Patterns;
  var _;
  var q;
  var httpBackend;

  // Get params for AdminJobFairManagement controller
  beforeEach(inject(function ($injector) {
    JobFairGeneralInfo = $injector.get('JobFairGeneralInfo');
    JobFairCompaniesInfo = $injector.get('JobFairCompaniesInfo');
    CompanyLookingForPositions = $injector.get('CompanyLookingForPositions');
    Majors = $injector.get('Majors');
    Patterns = $injector.get('Patterns');
    _ = $injector.get('_');
    q = $injector.get('$q');
    httpBackend = $injector.get('$httpBackend');
  }));

  // Call the controller and inject it with mock objects
  beforeEach(inject(function (_$controller_, $rootScope) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    scope = $rootScope.$new();

    $controller('AdminJobFairManagementCtrl', {
      $scope: scope,
      JobFairGeneralInfo: JobFairGeneralInfo,
      JobFairCompaniesInfo: JobFairCompaniesInfo,
      CompanyLookingForPositions: CompanyLookingForPositions,
      Majors: Majors,
      Patterns: Patterns,
      _: _
    });

    httpBackend.whenGET('/api/companies/Apple/companyLookingFor').respond(200, []);
    httpBackend.whenGET('/api/admins/jobFairInformation').respond(200, []);

  }));

  describe('initial state', function () {
    it('should have job fair general information object defined', function () {
      expect(scope.jobFairGeneralInformation).toBeDefined();
    });

    it('should have a company list defined', function () {
      expect(scope.jobFairCompaniesList).toBeDefined();
    });

    it('should have a patterns object defined', function () {
      expect(scope.patterns).toBeDefined();
    });

    it('should have a company selection string to be defined and equal to Select Company', function () {
      expect(scope.companySelection).toEqual('Select Company');
    });

    it('should have a all the job fair management information disabled', function () {
      expect(scope.isDisable).toBeTruthy();
    });

    it('should have job fair resume dead line date error to be false', function () {
      expect(scope.showJobFairResumeDeadlineDateError).toBeFalsy();
    });
  });

  describe('Company Selection', function () {

    beforeEach(function() {
      scope.companySelection = 'Apple';
      scope.jobFairCompanyAdditionalInfo = {};
      spyOn(JobFairCompaniesInfo, 'getJobFairInfoPerCompany').and.callFake(function() {
        return {
          companyName: 'Apple',
          minGpa: 3.4,
          extraInformation: 'This is Apple attending the Job Fair',
          collectingResumesBeforeJobFair: true,
          mustFillOnline: false,
          interviewsDuringWeekend: true,
          attending: true,
          websiteApplication: 'http://www.apple.com/jobs/us/'
        };
      });
      scope.$digest();
    });

    it('should enable all the job fair management input fields', function() {
      expect(scope.isDisable).toBeFalsy();
    });

    it('should have company job fair additional information defined for Apple', function() {
      expect(scope.jobFairCompanyAdditionalInfo.companyName).toEqual('Apple');
    });

    it('should have company interested majors defined for Apple', function() {
      expect(scope.majors).toBeDefined();
    });

    it('should have company looking for positions defined for Apple', function() {
      expect(scope.companyJobPositions).toBeDefined();
    });

  });

  describe('Check Resume Deadline Date', function() {
    var form = {};

    describe('with an invalid form', function() {

      it('should not make the createNewCompany request', function() {
        form.$valid = false;
        scope.checkResumeDeadlineDate(form);
        scope.$digest();
        expect(scope.showJobFairResumeDeadlineDateError).toBeFalsy();
      });
    });

    describe('with a valid form', function() {

      it('should display an error if the date is in the past', function() {
        form.$valid = true;
        scope.jobFairGeneralInformation.showResumeDeadlineDate = true;
        scope.jobFairGeneralInformation.resumeDeadlineDate = new Date('October 13, 2014');
        scope.checkResumeDeadlineDate(form);
        scope.$digest();
        expect(scope.showJobFairResumeDeadlineDateError).toBeTruthy();
      });

      it('should not display an error if the date is in the future', function() {
        form.$valid = true;
        scope.jobFairGeneralInformation.showResumeDeadlineDate = true;
        scope.jobFairGeneralInformation.resumeDeadlineDate = new Date(Date.now() + (8.64e+7)*10);
        scope.checkResumeDeadlineDate(form);
        scope.$digest();
        expect(scope.showJobFairResumeDeadlineDateError).toBeFalsy();
      });
    });
  });

  describe('Submit job fair general information', function() {
    var form = {};

    beforeEach(function() {
      scope.jobFairGeneralInfo = {
        id: 1,
        headerEnglish: '8th Spring Job Fair',
        locationEnglish: 'Mayaguez Resort & Casino',
        dateEnglish: 'Friday, February 19, 2016',
        time: '8:30am - 2:30pm',
        headerSpanish: '8va Feria de Empleo de Primavera',
        locationSpanish: 'Hotel Mayaguez Resort & Casino',
        dateSpanish: 'viernes, 19 de febrero de 2016',
        resumeDeadlineDate: '2016-02-19T00:00:00.000Z',
        showResumeDeadlineDate: true
      };
      spyOn(JobFairGeneralInfo, 'updateJobFairDateInfo').and.callFake(function() {
        return q.when(scope.jobFairGeneralInfo);
      });
    });

    describe('with an invalid form', function() {
      it('should not make the submit JobFair General Information request', function() {
        form.$valid = false;
        scope.submitJobFairGeneralInfo(form);
        scope.$digest();
        expect(JobFairGeneralInfo.updateJobFairDateInfo).not.toHaveBeenCalled();
      });
    });
  });

  describe('Submit Job Fair management changes', function() {
    var form = {};

    beforeEach(function() {
      scope.companySelection = 'Apple';
      scope.companyJobPositions = [
        {
          companyName: 'Apple',
          jobPosition: 'Internship',
          status: true
        },
        {
          companyName: 'Apple',
          jobPosition: 'Full-Time',
          status: true
        }
      ];
      scope.majors = [
        {
          id: 4,
          companyName: 'Apple',
          majorCode: 'ICOM'
        },
        {
          id: 5,
          companyName: 'Apple',
          majorCode: 'CCOM'
        }
      ];
      spyOn(JobFairCompaniesInfo, 'updateJobFairInfoPerCompany');
      spyOn(CompanyLookingForPositions, 'updateCompanyLookingForPositions');
      spyOn(Majors, 'setInterestedMajorsPerCompany');
      scope.$digest();
    });

    describe('with an invalid form', function() {
      it('should not make the submit Job Fair management changes request', function() {
        form.$valid = false;
        scope.submitJobFairManagementChanges(form);
        scope.$digest();
        expect(JobFairCompaniesInfo.updateJobFairInfoPerCompany).not.toHaveBeenCalled();
        expect(CompanyLookingForPositions.updateCompanyLookingForPositions).not.toHaveBeenCalled();
        expect(Majors.setInterestedMajorsPerCompany).not.toHaveBeenCalled();
      });
    });

    describe('with a valid form', function() {
      it('should make the submit Job Fair management changes request', function() {
        form.$valid = true;
        scope.jobFairCompanyAdditionalInfo = {
          companyName: 'Apple',
          minGpa: 3.40,
          extraInformation: 'This is Apple attending the Job Fair',
          collectingResumesBeforeJobFair: true,
          mustFillOnline: false,
          interviewsDuringWeekend: false,
          attending: true,
          websiteApplication: 'http://www.apple.com/jobs/us/'
        };
        scope.submitJobFairManagementChanges(form);
        scope.$digest();
        expect(JobFairCompaniesInfo.updateJobFairInfoPerCompany).toHaveBeenCalledWith(scope.jobFairCompanyAdditionalInfo);
        expect(CompanyLookingForPositions.updateCompanyLookingForPositions).toHaveBeenCalledWith(scope.companySelection, scope.companyJobPositions);
        expect(Majors.setInterestedMajorsPerCompany).toHaveBeenCalledWith(scope.majors);
      });
    });
  });

});


