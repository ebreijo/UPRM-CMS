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
  });

  describe('scope.checkVision function', function () {
    it('should check the length of the vision string: If we use String \'b\' it will return a message', function () {
      expect(scope.checkVision('b')).toEqual('Vision must be between 2 and 255 characters long');
    });
  });

  describe('submit submitAboutUs', function() {
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

  describe('submit AddStudentService', function() {
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
      beforeEach(function() {
        form.$valid = false;
      });
      it('should not make the register request', function() {
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
        studentServices = scope.aboutUsInfo.studentServices;
      });
      it('should see a new service added in the scope', function() {
        expect(studentServices[1]).toBeDefined();
      });
    });

  });

  describe('scope.checkStaffPosition function', function () {
    it('should check the length of a staff position: If we use String \'b\' it will return a message', function () {
      expect(scope.checkStaffPosition('b')).toEqual('Position should be between 2 and 63 characters long');
    });
  });

});
