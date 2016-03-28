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
  'LocalStorageModule'
]);

app.config(['localStorageServiceProvider', function(localStorageServiceProvider){
  localStorageServiceProvider.setPrefix('uprmcmsApp');
}]);

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider.state('landingPage', {
    url: '/',
    templateUrl: 'partials/landing.html',
    controller: 'LandingPageCtrl'
  }).state('company', {
    url: '/company',
    templateUrl: 'partials/companies/company-main.html',
    controller: 'CompanyCtrl'
  }).state('companyRegistration', {
    url: '/companyRegistration',
    templateUrl: 'partials/company-registration.html',
    controller: 'CompanyRegistrationCtrl'
  }).state('locationRegistration', {
    url: '/locationRegistration',
    templateUrl: 'partials/location-registration.html',
    controller: 'LocationRegistrationCtrl'
  }).state('recruiterRegistration', {
    url: '/recruiterRegistration',
    templateUrl: 'partials/recruiter-registration.html',
    controller: 'RecruiterRegistrationCtrl'
  }).state('locationSearch', {
    url: '/locationSearch',
    templateUrl: 'partials/location-search.html',
    controller: 'LocationSearchCtrl'
  }).state('companySearch', {
    url: '/companySearch',
    templateUrl: 'partials/company-search.html',
    controller: 'CompanySearchCtrl'
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
  })
  // Administrator views
    .state('adminProfile', {
      url: '/adminProfile',
      templateUrl: 'partials/administrators/admin-main.html',
      controller: 'AdminProfileCtrl'
    }).state('adminCalendar', {
      url: '/adminCalendar',
      templateUrl: 'partials/administrators/calendar.html'
    }).state('adminAboutUs', {
      url: '/adminAboutUS',
      templateUrl: 'partials/administrators/admin-about.html'
    }).state('adminCareerFair', {
      url: '/adminJobFair',
      templateUrl: 'partials/administrators/career-fair.html'
    }).state('adminCompanyProfile', {
      url: '/adminCompanyProfile/:companyName',
      templateUrl: 'partials/administrators/admin-company-profile.html',
      controller: 'AdminCompanyProfileCtrl',
      resolve: {
        adminCompanyPromise: ['$stateParams',  'Companies', function ($stateParams, Companies) {
          console.log($stateParams.companyName);
          return Companies.getCompany($stateParams.companyName);
        }]
      }
    })
    // Student Views
    .state('careerFair', {
      url: '/jobFair',
      templateUrl: 'partials/students/career-fair.html',
      controller: 'CareerFairCtrl'
    });

  $urlRouterProvider.otherwise('/');
});
