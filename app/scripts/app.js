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

app.constant('_', window._);

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
    controller: 'AboutUsCtrl'
    /*
    resolve: {
      aboutUsPromise: ['AboutUs', function (AboutUs) {
        AboutUs.getAll();
      }]
    }
    */
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
      url: '/adminAboutUs',
      templateUrl: 'partials/administrators/admin-about.html',
      controller: 'AboutUsCtrl'
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
    .state('jobFair', {
      url: '/jobFair',
      templateUrl: 'partials/students/jobFair.html',
      controller: 'jobFairCtrl'
    }).state('studentCalendar', {
      url: '/studentCalendar',
      templateUrl: 'partials/students/calendar.html'
    }).state('studentAboutUs', {
      url: '/studentAboutUs',
      templateUrl: 'partials/students/student-about.html',
      controller: 'AboutUsCtrl'
    }).state('studentJobOffers', {
      url: '/studentJobOffers',
      templateUrl: 'partials/students/student-job-offers.html',
      controller: 'jobOffersCtrl'
    }).state('studentCompanyList', {
      url: '/studentCompanyList',
      templateUrl: 'partials/students/student-company-list.html',
      controller: 'companyListCtrl'
    });

  $urlRouterProvider.otherwise('/');
});
