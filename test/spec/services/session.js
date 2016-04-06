'use strict';

describe('Service: Session', function () {

  // load the service's module
  beforeEach(module('uprmcmsApp'));
  // load for transitions transitions
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
  var Session, httpBackend, Restangular;

  beforeEach(inject(function ($injector) {
    Session = $injector.get('Session');
    httpBackend = $injector.get('$httpBackend');
    Restangular = $injector.get('Restangular');

    httpBackend.whenPOST('/api/login', credentials).respond(200, user);

    httpBackend.whenPOST('/api/logout').respond(200);
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('initial state', function() {
    it('should have an empty object from user', function() {
      expect(Session.user).toEqual({});
    });
  });

  describe('login a user', function() {
    it('should login and store the user in the session', function() {
      Session.login(credentials).then(function(response) {
        expect(Restangular.stripRestangular(response)).toEqual(user);
        expect(Restangular.stripRestangular(Session.user)).toEqual(user);
      });
      httpBackend.flush();
    });

    it('should logout and have an empty user object', function() {
      Session.login(credentials).then(function() {
        Session.logout().then(function() {
          expect(Session.user).toEqual({});
        });
      });

      httpBackend.flush();
    });

    describe('invalid credentials', function() {
      var invalidCredentials = {email: 'sio@ibm.com', password: '1q@W#e'};
      beforeEach(function() {
        httpBackend.whenPOST('/api/login', invalidCredentials).respond(401);
      });

      it('should maintain empty the user object', function() {
        Session.login(invalidCredentials).then(function() {
          expect(Session.user).toEqual({});
        });
        httpBackend.flush();
      });
    });
  });
});
