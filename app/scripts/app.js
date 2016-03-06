'use strict';

var app = angular.module('uprmcmsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'ui.jq',
  'ngStorage',
  'restangular',
  'chieffancypants.loadingBar'
]);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider.state('landingPage', {
    url: '/',
    templateUrl: 'partials/landing.html'
  }).state('login', {
    url: '/login',
    templateUrl: 'partials/login.html'
  }).state('aboutUs', {
    url: '/aboutUs',
    templateUrl: 'partials/aboutUs.html',
    controller: 'AboutUsCtrl',
    resolve: {
      aboutUsPromise: ['aboutUs', function(aboutUs) {
        aboutUs.getAll();
      }]
    }

  });

  $urlRouterProvider.otherwise('/');
});
