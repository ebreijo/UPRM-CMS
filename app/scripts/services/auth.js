'use strict';

var app = angular.module('uprmcmsApp');

app.factory('Auth', function($rootScope, Session, AUTH_EVENTS, USER_ROLES, Restangular) {

  var obj = {};

  /**
   * Authenticate user
   *
   * @param  {Object}   user - login info
   * @return {Promise}
   */
  obj.login = function(user) {
    return Session.login(user).then(function(user) {
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
      return user;
    }).catch(function(err) {
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed, err);
      throw err;
    });
  };

  /**
   * Unauthenticate user
   * @return {Promise}
   */
  obj.logout = function() {
    return Session.logout().then(function() {
      $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
      return true;
    }).catch(function(err) {
      $rootScope.$broadcast(AUTH_EVENTS.logoutFailed, err);
      throw err;
    });
  };

  obj.forgot = function(user) {
    return Restangular.all('/api/forgot').post(user).then(function(res) {
      return res;
    }).catch(function(err) {
      throw err;
    });
  };

  obj.resetPassword = function(user, token) {
    return Restangular.all('/api/reset').customPOST(user, token).then(function(res) {
      return res;
    }).catch(function(err) {
      throw err;
    });
  };

  obj.getUserRole = function() {
    return (Session.user.authType || USER_ROLES.guest);
  };

  /**
   * Simple check to see if a user is logged in
   *
   * @return {Boolean}
   */
  obj.isAuthenticated = function() {
    return !!Session.user.email;
  };

  obj.isAuthorized = function(authorizedRoles) {
    if(!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }

    return authorizedRoles.indexOf(this.getUserRole()) !== -1;
  };

  obj.hasRole = function(role) {
    return role === this.getUserRole();
  };

  return obj;
});
