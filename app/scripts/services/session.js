'use strict';

var app = angular.module('uprmcmsApp');

app.service('Session', function (Restangular, $sessionStorage) {
  var login = Restangular.all('/api/login');
  var logout = Restangular.all('/api/logout');

  var studentLogin = Restangular.all('/api/students/login');

  var self = this;
  /**
   * Authenticated user
   * @type {Object}
   */
  this.user = $sessionStorage.user || {};

  /**
   * Authenticates the user and save the session
   * @param  {Object} credentials user's email and password.
   * @return {Promise}
   */
  this.login = function(credentials) {
    return login.post(credentials).then(function(user) {
      self.user = user;
      $sessionStorage.user = user;
      return user;
    });
  };


  /**
   * Authenticate the student and save the session
   * @returns {Promise}
   */
  this.studentLogin = function(user) {
    return studentLogin.post({user: 'student', secret: user.param}).then(function(user) {
      self.user = user;
      $sessionStorage.user = user;
      return user;
    });
  };

  /**
   * Unauthenticate user and remove it from the session
   * @returns {*}
   */
  this.logout = function() {
    return logout.post().then(function() {
      self.user = {};
      $sessionStorage.user = {};
      return true;
    });
  };
});
