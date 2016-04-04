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
  'LocalStorageModule',
  'xeditable'
]);

// Add lodash to the angular app
app.constant('_', window._);

app.config(['localStorageServiceProvider', function(localStorageServiceProvider) {
  localStorageServiceProvider.setPrefix('uprmcmsApp');
}]);

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider, USER_ROLES) {
  $locationProvider.html5Mode(true);

  var all = [USER_ROLES.guest, USER_ROLES.student, USER_ROLES.recruiter, USER_ROLES.administrator];

  $stateProvider.state('landingPage', {
    url: '/',
    templateUrl: 'partials/landing.html',
    controller: 'LandingPageCtrl',
    data: {
      authorizedRoles: all
    }
  }).state('companyRegistration', {
    url: '/companyRegistration',
    templateUrl: 'partials/company-registration.html',
    controller: 'CompanyRegistrationCtrl',
    data: {
      authorizedRoles: all
    }
  }).state('locationRegistration', {
    url: '/locationRegistration',
    templateUrl: 'partials/location-registration.html',
    controller: 'LocationRegistrationCtrl',
    data: {
      authorizedRoles: all
    }
  }).state('recruiterRegistration', {
    url: '/recruiterRegistration',
    templateUrl: 'partials/recruiter-registration.html',
    controller: 'RecruiterRegistrationCtrl',
    data: {
      authorizedRoles: all
    }
  }).state('locationSearch', {
    url: '/locationSearch',
    templateUrl: 'partials/location-search.html',
    controller: 'LocationSearchCtrl',
    data: {
      authorizedRoles: all
    }
  }).state('companySearch', {
    url: '/companySearch',
    templateUrl: 'partials/company-search.html',
    controller: 'CompanySearchCtrl',
    data: {
      authorizedRoles: all
    }
  }).state('media', {
    url: '/media/:mediaFile'
  }).state('login', {
    url: '/login',
    templateUrl: 'partials/company-login.html',
    controller: 'LoginCtrl',
    data: {
      authorizedRoles: all
    }
  }).state('aboutUs', {
    url: '/aboutUs',
    templateUrl: 'partials/aboutUs.html',
    controller: 'AboutUsCtrl',
    resolve: {
      aboutUsPromise: ['AboutUs', function (AboutUs) {
        AboutUs.getAll();
      }]
    },
    data: {
      authorizedRoles: all
    }
  }).state('calendar', {
    url: '/calendar',
    templateUrl: 'partials/calendar.html',
    data: {
      authorizedRoles: all
    }
  })
  //Company Views
    .state('company', {
      url: '/company',
      templateUrl: 'partials/companies/company-main.html',
      controller: 'CompanyCtrl',
      data: {
        authorizedRoles: all
      }
    }).state('companyAboutUs', {
      url: '/companyAboutUs',
      templateUrl: 'partials/companies/company-about.html',
      controller: 'AboutUsCtrl',
      data: {
        authorizedRoles: all
      },
      resolve: {
        aboutUsPromise: ['AboutUs', function (AboutUs) {
          AboutUs.getAll();
        }]
      }
    }).state('studentCatalogue', {
      url: '/studentCatalogue',
      templateUrl: 'partials/companies/company-codia+1.html',
      data: {
        authorizedRoles: all
      }
    }).state('companyCalendar', {
      url: '/companyCalendar',
      templateUrl: 'partials/companies/calendar.html',
      data: {
        authorizedRoles: all
      }
    })
    .state('recoverPassword', {
      url: '/recoverPassword',
      templateUrl: 'partials/companies/reset-password.html',
      data: {
        authorizedRoles: all
      }
    })
  // Administrator views
    .state('adminProfile', {
      url: '/adminProfile',
      templateUrl: 'partials/administrators/admin-main.html',
      controller: 'AdminProfileCtrl',
      data: {
        authorizedRoles: all
      }
    }).state('adminCalendar', {
      url: '/adminCalendar',
      templateUrl: 'partials/administrators/calendar.html',
      data: {
        authorizedRoles: all
      }
    }).state('adminAboutUs', {
      url: '/adminAboutUs',
      templateUrl: 'partials/administrators/admin-about.html',
      controller: 'AboutUsCtrl',
      resolve: {
        aboutUsPromise: ['AboutUs', function (AboutUs) {
          AboutUs.getAll();
        }]
      },
      data: {
        authorizedRoles: all
      }
    }).state('adminCareerFair', {
      url: '/adminCareerFair',
      templateUrl: 'partials/administrators/career-fair.html',
      controller: 'jobFairCtrl',
      data: {
        authorizedRoles: all
      }
    }).state('adminCompanyProfile', {
      url: '/adminCompanyProfile/:companyName',
      templateUrl: 'partials/administrators/admin-company-profile.html',
      controller: 'AdminCompanyProfileCtrl',
      resolve: {
        adminCompanyPromise: ['$stateParams',  'Companies', function ($stateParams, Companies) {
          console.log($stateParams.companyName);
          return Companies.getCompany($stateParams.companyName);
        }]
      },
      data: {
        authorizedRoles: all
      }
    })
    // Student Views
    .state('jobFair', {
      url: '/jobFair',
      templateUrl: 'partials/students/jobFair.html',
      controller: 'jobFairCtrl',
      data: {
        authorizedRoles: all
      }
    }).state('studentCalendar', {
      url: '/studentCalendar',
      templateUrl: 'partials/students/calendar.html',
      data: {
        authorizedRoles: all
      }
    }).state('studentAboutUs', {
      url: '/studentAboutUs',
      templateUrl: 'partials/students/student-about.html',
      controller: 'AboutUsCtrl',
      resolve: {
        aboutUsPromise: ['AboutUs', function (AboutUs) {
          AboutUs.getAll();
        }]
      },
      data: {
        authorizedRoles: all
      }
    }).state('studentJobOffers', {
      url: '/studentJobOffers',
      templateUrl: 'partials/students/student-job-offers.html',
      controller: 'jobOffersCtrl',
      data: {
        authorizedRoles: all
      }
    }).state('studentCompanyList', {
      url: '/studentCompanyList',
      templateUrl: 'partials/students/student-company-list.html',
      controller: 'companyListCtrl',
      data: {
        authorizedRoles: all
      }
    });

  $urlRouterProvider.otherwise('/');
});

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});

app.run(function($rootScope, $state, Auth, AUTH_EVENTS, USER_ROLES) {

  $rootScope.$on('$stateChangeStart', function(event, toState) {

    function getAuthorizedRoles(state) {
      var authorizedRoles = USER_ROLES.guest; // default authorized role

      if(state.data && state.data.authorizedRoles) {
        authorizedRoles = state.data.authorizedRoles;
      }

      return authorizedRoles;
    }

    var authorizedRoles = getAuthorizedRoles(toState);

    // if user is not authorized prevent attempted state change and redirect to the landing page
    if (!Auth.isAuthorized(authorizedRoles)) {
      console.log('not authorized', authorizedRoles, Auth.getUserRole());
      event.preventDefault(); // Prevent the change to other states
      if (Auth.isAuthenticated()) {
        // user is not allowed
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      } else {
        // user is not logged in
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      }
      $state.go('landingPage'); // redirect to landing page
    }
  });

  $rootScope.$on('$stateChangeSuccess', function (event, current) {
    $rootScope.bodyClass = current.bodyClass || 'uprmcms';
  });

});

app.run(function(editableOptions, editableThemes) {
  editableThemes.bs3.inputClass = 'input-sm';
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
