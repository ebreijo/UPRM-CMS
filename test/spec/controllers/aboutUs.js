'use strict';

describe('Controller: AboutUs', function () {

  // load the service's module
  beforeEach(module('uprmcmsApp'));

  var $controller;
  var scope;
  var AboutUs;
  var filter;
  var _;
  var Patterns;
  var q;

  // Get params for About Us controller
  beforeEach(inject(function ($injector) {
    AboutUs = $injector.get('AboutUs');
    Patterns = $injector.get('Patterns');
    _ = $injector.get('_');
    filter = $injector.get('$filter');
    q = $injector.get('$q');
  }));

  // Call the controller and inject it with mock objects
  beforeEach(inject(function (_$controller_, $rootScope) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    scope = $rootScope.$new();

    $controller('AboutUsCtrl', {
      $scope: scope,
      AboutUs: AboutUs,
      _: _,
      $filter: filter,
      Patterns: Patterns
    });

  }));

  describe('scope.checkMission function', function () {
    it('should check the length of the mission string: If we use String \'b\' it will return a message', function () {
      expect(scope.checkMission('b')).toEqual('Mission must be between 2 and 255 characters long');
    });
    it('should check the length of a mission string: If we use String \'abc\' it will be undefined as the function does not return anything', function () {
      expect(scope.checkMission('abc')).toBeUndefined();
    });
  });

  describe('scope.checkVision function', function () {
    it('should check the length of the vision string: If we use String \'b\' it will return a message', function () {
      expect(scope.checkVision('b')).toEqual('Vision must be between 2 and 255 characters long');
    });
  });

  describe('submit About Us general information', function() {
    var form;
    beforeEach(function () {
      form = {};
      scope.aboutUsInfo = {
        aboutUs: [
          {
            id: 1,
            vision: 'Serve as liaison between students and businesses while providing the best and most effective service to all.',
            missionDesc: 'Provide students the necessary tools that will help achieve an effective job search, while maintaining lines of communication with businesses and the College community.',
            policiesDesc: 'The following, apply to all students, seniors, graduate and alumni that request our services:',
            requirementsDesc: 'The following, apply to all students, seniors, graduate and alumni that request our services:'
          }
        ]
      };
      spyOn(AboutUs, 'updateAboutUs');
    });

    describe('with a invalid form', function() {
      beforeEach(function() {
        form.$valid = false;
      });
      it('should not make the updateAboutUs request', function() {
        scope.submitAboutUs(form);
        scope.$digest();
        expect(AboutUs.updateAboutUs).not.toHaveBeenCalled();
      });
    });

    describe('with a valid form', function() {
      beforeEach(function () {
        form.$valid = true;
      });

      it('should make the updateAboutUs request', function () {
        scope.submitAboutUs(form);
        expect(AboutUs.updateAboutUs).toHaveBeenCalledWith(scope.aboutUsInfo.aboutUs[0]);
      });
    });

  });

  describe('scope.filterItems function', function () {
    it('should return true for an item with no isDeleted property set', function () {
      expect(scope.filterItems({})).toBeTruthy();
    });
    it('should return false for an item with isDeleted property set to true', function () {
      var item = {};
      item.isDeleted = true;
      expect(scope.filterItems(item)).toBeFalsy();
    });
  });

  describe('Check deleted items', function() {
    var items;
    items = [
      {
        id: 1,
        requirement: 'Five or more copies of your resume (preferably in English).'
      },
      {
        id: 2,
        requirement: 'Copy of your course program.'
      },
      {
        id: 3,
        requirement: 'Transcript (preferably in English).'
      }
    ];


    describe('scope.deleteItems function', function () {
      it('should return true for an item after calling the function', function () {
        scope.deleteItems(items, items[0]);
        expect(items[0].isDeleted).toBeTruthy();
      });
      it('should be undefined if the function has not been called with an item', function () {
        expect(items[2].isDeleted).not.toBeDefined();
      });
    });

    describe('scope.cancelItems function', function () {
      it('should be undefined after calling the function with the items', function () {
        scope.cancelItems(items);
        expect(items[0].isDeleted).not.toBeDefined();
      });
    });

  });

  describe('scope.checkStudentService function', function () {
    it('should check the length of a student service string: If we use String \'b\' it will return a message', function () {
      expect(scope.checkStudentService('b')).toEqual('Student service must be between 2 and 255 characters long');
    });
  });

  describe('submit add student service', function() {
    var form;
    beforeEach(function () {
      form = {};
      spyOn(AboutUs, 'addStudentService').and.callFake(function () {
        var deferred = q.defer();
        deferred.resolve({
          id: 2,
          service: 'New student service'
        });
        return deferred.promise;
      });
    });

    describe('with a invalid form', function() {
      it('should not make the add student service request', function() {
        form.$valid = false;
        scope.submitAddStudentService(form);
        scope.$digest();
        expect(AboutUs.addStudentService).not.toHaveBeenCalled();
      });
    });

    describe('with a valid form', function() {
      var studentServices = null;
      beforeEach(function() {
        scope.studentService = 'New student service';
        scope.aboutUsInfo.studentServices = [{
          id: 1,
          service: 'Register students and alumni, creating records for our files.'
        }];
        form.$valid = true;
      });
      it('should make the add student service request', function() {
        scope.submitAddStudentService(form);
        scope.$digest();
        expect(AboutUs.addStudentService).toHaveBeenCalledWith('New student service');
        expect(scope.studentService).toBeNull();
        studentServices = scope.aboutUsInfo.studentServices;
      });
      it('should see a new service added in the scope', function() {
        expect(studentServices[1]).toBeDefined();
      });
    });
  });

  describe('submit edit or delete student services', function() {
    var form;
    beforeEach(function () {
      form = {};
      spyOn(AboutUs, 'updateStudentServices');
      spyOn(AboutUs, 'deleteStudentServices');
    });

    describe('with a invalid form', function() {
      it('should not make the update and delete student services request', function() {
        form.$valid = false;
        scope.submitEditOrDeleteStudentServices(form);
        scope.$digest();
        expect(AboutUs.updateStudentServices).not.toHaveBeenCalled();
        expect(AboutUs.deleteStudentServices).not.toHaveBeenCalled();
      });
    });

    describe('with a valid form', function() {
      it('should make the add student service request', function() {
        form.$valid = true;
        scope.submitEditOrDeleteStudentServices(form);
        scope.$digest();
        expect(AboutUs.updateStudentServices).toHaveBeenCalled();
        expect(AboutUs.deleteStudentServices).toHaveBeenCalled();
      });
    });

  });

  describe('submit add company service', function() {
    var form;
    beforeEach(function () {
      form = {};
      spyOn(AboutUs, 'addCompanyService').and.callFake(function () {
        var deferred = q.defer();
        deferred.resolve({
          id: 2,
          service: 'New company service'
        });
        return deferred.promise;
      });
    });

    describe('with a invalid form', function() {
      it('should not make the add company service request', function() {
        form.$valid = false;
        scope.submitAddCompanyService(form);
        scope.$digest();
        expect(AboutUs.addCompanyService).not.toHaveBeenCalled();
      });
    });

    describe('with a valid form', function() {
      var companyServices = null;
      beforeEach(function() {
        scope.aboutUsInfo.companyServices = [{
          id: 1,
          service: 'Announce any job offers (part time, summer and permanent)'
        }];
        form.$valid = true;
      });
      it('should make the add company service request', function() {
        scope.companyService = 'New company service';
        scope.submitAddCompanyService(form);
        scope.$digest();
        expect(AboutUs.addCompanyService).toHaveBeenCalledWith('New company service');
        expect(scope.companyService).toBeNull();
        companyServices = scope.aboutUsInfo.companyServices;
      });
      it('should see a new service added in the scope', function() {
        expect(companyServices[1]).toBeDefined();
      });
    });
  });

  describe('submit edit or delete company services', function() {
    var form;
    beforeEach(function () {
      form = {};
      spyOn(AboutUs, 'updateCompanyServices');
      spyOn(AboutUs, 'deleteCompanyServices');
    });

    describe('with a invalid form', function() {
      it('should not make the update and delete company services request', function() {
        form.$valid = false;
        scope.submitEditOrDeleteCompanyServices(form);
        scope.$digest();
        expect(AboutUs.updateCompanyServices).not.toHaveBeenCalled();
        expect(AboutUs.deleteCompanyServices).not.toHaveBeenCalled();
      });
    });

    describe('with a valid form', function() {
      it('should make the add student service request', function() {
        form.$valid = true;
        scope.submitEditOrDeleteCompanyServices(form);
        scope.$digest();
        expect(AboutUs.updateCompanyServices).toHaveBeenCalled();
        expect(AboutUs.deleteCompanyServices).toHaveBeenCalled();
      });
    });

  });

  describe('scope.checkPolicyDescription function', function () {
    it('should check the length of a policy description: If we use String \'b\' it will return a message', function () {
      expect(scope.checkPolicyDescription('b')).toEqual('Policy description must be between 2 and 255 characters long');
    });
    it('should check the length of a policy description: If we use String \'abc\' it will be undefined as the function does not return anything', function () {
      expect(scope.checkPolicyDescription('abc')).toBeUndefined();
    });
  });

  describe('submit add policy', function() {
    var form;
    beforeEach(function () {
      form = {};
      spyOn(AboutUs, 'addPolicy').and.callFake(function () {
        var deferred = q.defer();
        deferred.resolve({
          id: 2,
          service: 'New policy'
        });
        return deferred.promise;
      });
    });

    describe('with a invalid form', function() {
      it('should not make the add policy request', function() {
        form.$valid = false;
        scope.submitAddPolicy(form);
        scope.$digest();
        expect(AboutUs.addPolicy).not.toHaveBeenCalled();
      });
    });

    describe('with a valid form', function() {
      var policies = null;
      beforeEach(function() {
        scope.aboutUsInfo = {
          aboutUs: [
            {
              id: 1,
              vision: 'Serve as liaison between students and businesses while providing the best and most effective service to all.',
              missionDesc: 'Provide students the necessary tools that will help achieve an effective job search, while maintaining lines of communication with businesses and the College community.',
              policiesDesc: 'The following, apply to all students, seniors, graduate and alumni that request our services:',
              requirementsDesc: 'The following, apply to all students, seniors, graduate and alumni that request our services:'
            }
          ]
        };
        spyOn(AboutUs, 'updateAboutUs');
        scope.aboutUsInfo.policies = [{
          id: 1,
          service: 'Register at the Placement Office with any member of the staff.'
        }];
        form.$valid = true;
      });
      it('should make the add company service request', function() {
        scope.policy = 'New policy';
        scope.submitAddPolicy(form);
        scope.$digest();
        expect(AboutUs.addPolicy).toHaveBeenCalledWith('New policy');
        expect(scope.policy).toBeNull();
        policies = scope.aboutUsInfo.policies;
      });
      it('should see a new policy added in the scope', function() {
        expect(policies[1]).toBeDefined();
      });
    });
  });

  describe('submit edit or delete policies', function() {
    var form;
    beforeEach(function () {
      form = {};
      scope.aboutUsInfo = {
        aboutUs: [
          {
            id: 1,
            vision: 'Serve as liaison between students and businesses while providing the best and most effective service to all.',
            missionDesc: 'Provide students the necessary tools that will help achieve an effective job search, while maintaining lines of communication with businesses and the College community.',
            policiesDesc: 'The following, apply to all students, seniors, graduate and alumni that request our services:',
            requirementsDesc: 'The following, apply to all students, seniors, graduate and alumni that request our services:'
          }
        ]
      };
      spyOn(AboutUs, 'updateAboutUs');
      spyOn(AboutUs, 'updatePolicies');
      spyOn(AboutUs, 'deletePolicies');
    });

    describe('with a invalid form', function() {
      it('should not make the update and delete policies request', function() {
        form.$valid = false;
        scope.submitEditOrDeletePolicies(form);
        scope.$digest();
        expect(AboutUs.updatePolicies).not.toHaveBeenCalled();
        expect(AboutUs.deletePolicies).not.toHaveBeenCalled();
      });
    });

    describe('with a valid form', function() {
      it('should make the add student service request', function() {
        form.$valid = true;
        scope.submitEditOrDeletePolicies(form);
        scope.$digest();
        expect(AboutUs.updateAboutUs).toHaveBeenCalledWith(scope.aboutUsInfo.aboutUs[0]);
        expect(AboutUs.updatePolicies).toHaveBeenCalled();
        expect(AboutUs.deletePolicies).toHaveBeenCalled();
      });
    });

  });

  describe('scope.checkStaffPosition function', function () {
    it('should check the length of a staff position: If we use String \'b\' it will return a message', function () {
      expect(scope.checkStaffPosition('b')).toEqual('Position should be between 2 and 63 characters long');
    });
  });

  describe('submit add new staff member', function() {
    var form;
    beforeEach(function () {
      form = {};
      spyOn(AboutUs, 'addStaff').and.callFake(function () {
        var deferred = q.defer();
        deferred.resolve({
          id: 2,
          name: 'Srta. Margarita Carlo Cuebas',
          position: 'Employment Interviewer'
        });
        return deferred.promise;
      });
    });

    describe('with a invalid form', function() {
      it('should not make the add staff request', function() {
        form.$valid = false;
        scope.submitAddStaff(form);
        scope.$digest();
        expect(AboutUs.addStaff).not.toHaveBeenCalled();
      });
    });

    describe('with a valid form', function() {
      var ourStaff = null;
      beforeEach(function() {
        scope.aboutUsInfo.ourStaff = [{
          id: 1,
          name: 'Sra. Nancy Nieves Arán',
          position: 'Director'
        }];
        form.$valid = true;
      });
      it('should make the add staff request', function() {
        scope.staff = {
          name: 'Srta. Margarita Carlo Cuebas',
          position: 'Employment Interviewer'
        };
        scope.submitAddStaff(form);
        scope.$digest();
        expect(AboutUs.addStaff).toHaveBeenCalledWith({
          name: 'Srta. Margarita Carlo Cuebas',
          position: 'Employment Interviewer'
        });
        expect(scope.staff).toBeNull();
        ourStaff = scope.aboutUsInfo.ourStaff;
      });
      it('should see a new staff added in the scope', function() {
        expect(ourStaff[1]).toBeDefined();
      });
    });
  });

  describe('submit edit or delete staff', function() {
    var form;
    beforeEach(function () {
      form = {};
      spyOn(AboutUs, 'deleteStaff');
      spyOn(AboutUs, 'updateStaff');
    });

    describe('with a invalid form', function() {
      it('should not make the update and delete staff request', function() {
        form.$valid = false;
        scope.submitEditOrDeleteStaff(form);
        scope.$digest();
        expect(AboutUs.deleteStaff).not.toHaveBeenCalled();
        expect(AboutUs.updateStaff).not.toHaveBeenCalled();
      });
    });

    describe('with a valid form', function() {
      it('should make the add student service request', function() {
        form.$valid = true;
        scope.submitEditOrDeleteStaff(form);
        scope.$digest();
        expect(AboutUs.deleteStaff).toHaveBeenCalled();
        expect(AboutUs.updateStaff).toHaveBeenCalled();
      });
    });

  });

});
