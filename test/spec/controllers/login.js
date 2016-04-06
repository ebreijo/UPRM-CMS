'use strict';

describe('Controller: Login', function () {

  // load the service's module
  beforeEach(module('uprmcmsApp'));

  var recruiter = {
    email: 'sergio@ibm.com',
    companyName: 'IBM',
    companyLocationId: 1,
    firstName: 'Sergio',
    lastName: 'Rivera',
    phoneNumber: '787-555-5555',
    authType: 'recruiter'
  };

  var administrator = {
    email: 'juan.rodriguez@upr.edu',
    firstName: 'Juan',
    lastName: 'Rodriguez',
    authType: 'admin'
  };

  var $controller;
  var scope;
  var state;
  var Auth;
  var USER_ROLES;
  var q;

  // Get params for Login controller
  beforeEach(inject(function ($injector) {
    Auth = $injector.get('Auth');
    USER_ROLES = $injector.get('USER_ROLES');
    q = $injector.get('$q');
  }));

  // get controller and root scope
  beforeEach(inject(function (_$controller_, $rootScope, _$state_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    scope = $rootScope.$new();
    state = _$state_;

    $controller('LoginCtrl', {
      $scope: scope,
      $state: state,
      Auth: Auth,
      USER_ROLES: USER_ROLES
    });

  }));

  describe('initial state', function() {
    it('should have a user object defined', function () {
      expect(scope.user).toEqual({});
    });
    it('should have a errors object defined', function () {
      expect(scope.errors).toEqual({});
    });
  });

  describe('login function', function () {
    var form = {};
    beforeEach(function() {
      spyOn(state, 'go');
    });

    describe('with a invalid form', function() {
      it('should not make the login request', function() {
        spyOn(Auth, 'login').and.callFake(function() {
          return q.when(recruiter);
        });
        form.$valid = false;
        scope.login(form);
        scope.$digest();
        expect(Auth.login).not.toHaveBeenCalled();
      });
    });

    describe('with a valid form', function() {
      it('should make the login request and send the recruiter to the company profile page', function() {
        spyOn(Auth, 'login').and.callFake(function() {
          return q.when(recruiter);
        });
        scope.user = {
          email: 'sergio@ibm.com',
          password: '1q@W#e'
        };
        form.$valid = true;
        scope.login(form);
        scope.$digest();
        expect(Auth.login).toHaveBeenCalledWith(scope.user);
        expect(state.go).toHaveBeenCalledWith('company');
      });

      it('should make the login request and send the administrator to the admin profile page', function() {
        spyOn(Auth, 'login').and.callFake(function() {
          return q.when(administrator);
        });
        scope.user = {
          email: 'juan.rodriguez@upr.edu',
          password: '1q@W#e'
        };
        form.$valid = true;
        scope.login(form);
        scope.$digest();
        expect(Auth.login).toHaveBeenCalledWith(scope.user);
        expect(state.go).toHaveBeenCalledWith('adminProfile');
      });

      it('should make the login request but show a message for users not able to login', function() {
        spyOn(Auth, 'login').and.callFake(function() {
          return q.reject('Error');
        });
        scope.user = {
          email: 'jn.rodriguez@upr.edu',
          password: '1q@W#e'
        };
        form.$valid = true;
        scope.login(form);
        scope.$digest();
        expect(Auth.login).toHaveBeenCalledWith(scope.user);
        expect(state.go).not.toHaveBeenCalledWith('company');
        expect(state.go).not.toHaveBeenCalledWith('adminProfile');
        expect(scope.show).toEqual(true);
      });
    });
  });


  describe('forgot password function', function () {
    var form = {};
    beforeEach(function() {
      spyOn(state, 'go');
    });

    describe('with a invalid form', function() {
      it('should not make the forgot request', function() {
        spyOn(Auth, 'forgot').and.callFake(function() {
          return q.when({});
        });
        form.$valid = false;
        scope.forgot(form);
        scope.$digest();
        expect(Auth.forgot).not.toHaveBeenCalled();
      });
    });

    describe('with a valid form', function() {
      it('should make the forgot request and get a message with further instructions', function() {
        spyOn(Auth, 'forgot').and.callFake(function() {
          return q.when({});
        });
        scope.forgotEmail = 'sergio@ibm.com';
        form.$valid = true;
        scope.forgot(form);
        scope.$digest();
        expect(Auth.forgot).toHaveBeenCalledWith({email: scope.forgotEmail});
        expect(scope.title).toBeDefined();
        expect(scope.message).toBeDefined();
      });

      it('should make the forgot request but show a message for users', function() {
        spyOn(Auth, 'forgot').and.callFake(function() {
          return q.reject('Error');
        });
        scope.forgotEmail = 'sio@ibm.com';
        form.$valid = true;
        scope.forgot(form);
        scope.$digest();
        expect(Auth.forgot).toHaveBeenCalledWith({email: scope.forgotEmail});
        expect(scope.modalShowMessage).toEqual(true);
      });
    });
  });

});
