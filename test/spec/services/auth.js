'use strict';

describe('Service: Auth', function () {

  // load the service's module
  beforeEach(module('uprmcmsApp'));

  beforeEach(module('stateMock'));

  var credentials = {email: 'sergio@ibm.com', password: '1q@W#e'};

  var user = {
    email: 'sergio@ibm.com',
    companyName: 'IBM',
    companyLocationId: 1,
    firstName: 'Sergio',
    lastName: 'Rivera',
    phoneNumber: '787-555-5555',
    authType: 'recruiter'
  };

  // instantiate service
  var Auth;
  var rootScope;
  var AUTH_EVENTS;
  var USER_ROLES;
  var Session;
  var $q;
  var httpBackend;

  beforeEach(inject(function ($injector) {
    Auth = $injector.get('Auth');
    rootScope = $injector.get('$rootScope');
    AUTH_EVENTS = $injector.get('AUTH_EVENTS');
    USER_ROLES = $injector.get('USER_ROLES');
    Session = $injector.get('Session');
    $q = $injector.get('$q');
    httpBackend = $injector.get('$httpBackend');
  }));

  var mockSessionValid = function () {
    spyOn(Session, 'login').and.callFake(function() {
      Session.user = user;
      return $q.when(user);
    });

    spyOn(Session, 'logout').and.callFake(function() {
      Session.user = {};
      return $q.when({});
    });
  };

  var mockSessionInvalid = function() {
    spyOn(Session, 'login').and.callFake(function() {
      Session.user = {};
      return $q.reject('An error');
    });

    spyOn(Session, 'logout').and.callFake(function() {
      Session.user = {};
      return $q.when({});
    });
  };


  describe('initial state', function() {
    it('should have a role of guest', function() {
      Auth.hasRole(USER_ROLES.guest);
    });

    it('should not be authenticated', function() {
      expect(Auth.isAuthenticated()).toBe(false);
    });

    it('should have a guest user role', function() {
      expect(Auth.getUserRole()).toEqual(USER_ROLES.guest);
    });

    it('should be authorized to access pages with a guest user role in them', function() {
      expect(Auth.isAuthorized([USER_ROLES.guest])).toBe(true);
    });
  });

  describe('authentication events', function() {
    beforeEach(function () {
      spyOn(rootScope, '$broadcast').and.callThrough();
    });

    describe('with valid credentials', function () {
      beforeEach(function () {
        mockSessionValid();
      });

      it('should broadcast loginSuccess on user login', function () {
        Auth.login(credentials).then(function (user) {
          expect(rootScope.$broadcast).toHaveBeenCalledWith(AUTH_EVENTS.loginSuccess, user);
        });
        rootScope.$apply();

      });

      it('should broadcast logoutSuccess on logout', function () {
        Auth.logout().then(function () {
          expect(rootScope.$broadcast).toHaveBeenCalledWith(AUTH_EVENTS.logoutSuccess);
        });
        rootScope.$apply();
      });
    });
  });

  describe('login', function() {
    var login;
    beforeEach(function() {
      mockSessionValid();
      login = Auth.login(credentials);
    });

    it('should be able to login and say that the user is authenticated', function() {
      login.then(function() {
        expect(Auth.isAuthenticated()).toBe(true);
      });
      rootScope.$apply();

    });

    it('should say that the recruiter is authorized', function() {
      login.then(function() {
        expect(Auth.isAuthorized([USER_ROLES.recruiter])).toBe(true);
      });
      rootScope.$apply();
    });

    it('should have the user role of a recruiter', function() {
      login.then(function() {
        Auth.hasRole(USER_ROLES.recruiter);
      });
      rootScope.$apply();
    });
  });

  describe('login with invalid credentials', function() {
    beforeEach(function () {
      mockSessionInvalid();
    });

    it('should have a guest role', function() {
      expect(Auth.hasRole(USER_ROLES.guest)).toBe(true);
      expect(Auth.hasRole(USER_ROLES.recruiter)).toBe(false);
    });

    it('should not be authorized to access the other roles', function() {
      expect(Auth.isAuthorized([USER_ROLES.admin, USER_ROLES.student])).toBe(false);
    });

    it('should be authorized if the guest roles is in the authorizedRoles', function() {
      expect(Auth.isAuthorized([USER_ROLES.admin, USER_ROLES.recruiter, USER_ROLES.guest])).toBe(true);
    });

  });

  describe('forgot password', function() {
    var email;
    beforeEach(function () {
      email = {email: 'sergio@ibm.com'};
      httpBackend.whenPOST('/api/forgot', email).respond(200, 'A message');
    });

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    it('should be able to get a message with a valid email', function() {
      Auth.forgot(email).then(function(response) {
        expect(response).toEqual('A message');
      });
      httpBackend.flush();
    });
  });

});
