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
  'chieffancypants.loadingBar',
  'dropzone'
]);

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider.state('landingPage', {
    url: '/',
    templateUrl: 'partials/landing.html'
  }).state('company', {
    url: '/company',
    templateUrl: 'partials/companies/company-main.html',
    controller: 'CompanyCtrl'
  }).state('login', {
    url: '/login',
    templateUrl: 'partials/company-login.html',
    controller: 'LoginCtrl'
  }).state('aboutUs', {
    url: '/aboutUs',
    templateUrl: 'partials/aboutUs.html',
    controller: 'AboutUsCtrl',
    resolve: {
      aboutUsPromise: ['aboutUs', function (aboutUs) {
        aboutUs.getAll();
      }]
    }
  }).state('calendar', {
    url: '/calendar',
    templateUrl: 'partials/calendar.html'
  });

  $urlRouterProvider.otherwise('/');
})
;
