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

/*
app.config(['$cryptoProvider', function($cryptoProvider){
  $cryptoProvider.setCryptographyKey('SPumKMp6VDSaOv1F3wKVcF9W+5XBNypn52IcHVNpLbs=');
}]);
*/

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
    resolve: {
      locationSearchPromise: ['Registration', function (Registration) {
        Registration.getAllCompanyLocations(Registration.sessionStorage.companyName);
      }]
    },
    data: {
      authorizedRoles: all
    }
  }).state('companySearch', {
    url: '/companySearch',
    templateUrl: 'partials/company-search.html',
    controller: 'CompanySearchCtrl',
    resolve: {
      companySearchPromise: ['Registration', function (Registration) {
        Registration.getAllCompanyNamesForRecruiters();
      }]
    },
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
  }).state('reset', {
    url: '/reset/:token',
    templateUrl: 'partials/reset-password.html',
    controller: 'ResetPasswordCtrl',
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
      },
      resolve: {
        majorsPromise: ['Majors', function(Majors) {
          Majors.getAllMajors();
        }]
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
  // Administrator views
    .state('adminProfile', {
      url: '/adminProfile',
      templateUrl: 'partials/administrators/admin-main.html',
      controller: 'AdminProfileCtrl',
      data: {
        authorizedRoles: all
      }
    }).state('adminRegistration', {
      url: '/adminRegistration',
      templateUrl: 'partials/administrators/admin-registration.html',
      controller: 'AdminRegistrationCtrl',
      data: {
        authorizedRoles: all
      }
    }).state('adminChangeCarousel', {
      url: '/adminChangeCarousel',
      templateUrl: 'partials/administrators/change-carousel.html',
      data: {
        authorizedRoles: all
      }
    }).state('adminCalendar', {
      url: '/adminCalendar',
      templateUrl: 'partials/administrators/calendar.html',
      data: {
        authorizedRoles: all
      }
    }).state('adminJobFairManagement', {
      url: '/adminJobFairManagement',
      templateUrl: 'partials/administrators/job-fair-management.html',
      controller: 'AdminJobFairManagementCtrl',
      resolve: {
        jobFairGeneralInfoPromise: ['JobFairGeneralInfo', function (JobFairGeneralInfo) {
          JobFairGeneralInfo.getJobFairDate();
        }],
        companiesJobFairPromise: ['JobFairCompaniesInfo', function(JobFairCompaniesInfo) {
          JobFairCompaniesInfo.getAllCompaniesForJobFairManagement();
        }],
        jobFairCompaniesInfoPromise: ['JobFairCompaniesInfo', function(JobFairCompaniesInfo) {
          JobFairCompaniesInfo.getJobFairCompaniesInfo();
        }],
        majorsPromise: ['Majors', function(Majors) {
          Majors.getAllMajors();
        }]
      },
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
    }).state('adminJobFair', {
      url: '/adminJobFair',
      templateUrl: 'partials/administrators/career-fair.html',
      controller: 'jobFairCtrl',
      resolve: {
        jobFairPromise: ['JobFairCompaniesInfo', function (JobFairCompaniesInfo) {
          JobFairCompaniesInfo.getAllCompaniesForStudentJobFair();
        }],
        majorsPromise: ['Majors', function(Majors) {
          Majors.getAllMajors();
        }],
        jobFairGeneralInfoPromise: ['JobFairGeneralInfo', function (JobFairGeneralInfo) {
          JobFairGeneralInfo.getJobFairDate();
        }]
      },
      data: {
        authorizedRoles: all
      }
    }).state('adminCompanyProfile', {
      url: '/adminCompanyProfile/:companyName',
      templateUrl: 'partials/administrators/admin-company-profile.html',
      controller: 'AdminCompanyProfileCtrl',
      resolve: {
        adminCompanyPromise: ['$stateParams',  'Companies', function ($stateParams, Companies) {
          return Companies.getCompany($stateParams.companyName);
        }],
        majorsPromise: ['Majors', function(Majors) {
          Majors.getAllMajors();
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
      },
      resolve: {
        jobFairPromise: ['JobFairCompaniesInfo', function (JobFairCompaniesInfo) {
          JobFairCompaniesInfo.getAllCompaniesForStudentJobFair();
        }],
        majorsPromise: ['Majors', function(Majors) {
          Majors.getAllMajors();
        }],
        jobFairGeneralInfoPromise: ['JobFairGeneralInfo', function (JobFairGeneralInfo) {
          JobFairGeneralInfo.getJobFairDate();
        }]
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
      },
      resolve: {
        jobOffersPromise: ['JobOffers', function (JobOffers) {
          JobOffers.getAllJobOffersStudents();
        }]
      }
    }).state('studentCompanyList', {
      url: '/studentCompanyList',
      templateUrl: 'partials/students/student-company-list.html',
      controller: 'companyListCtrl',
      data: {
        authorizedRoles: all
      },
      resolve: {
        studentCompaniesPromise: ['Companies', function (Companies) {
          Companies.getAllCompaniesForStudents();
        }]
      }
    }).state('studentCompanyProfile', {
      url: '/studentCompanyProfile/:companyName',
      templateUrl: 'partials/students/student-company-profile.html',
      controller: 'studentCompanyCtrl',
      data: {
        authorizedRoles: all
      },
      resolve: {
        studentCompanyPromise: ['$stateParams',  'Companies', function ($stateParams, Companies) {
          return Companies.getStudentCompany($stateParams.companyName);
        }],
        majorsPromise: ['Majors', function(Majors) {
          Majors.getAllMajors();
        }]
      }
    }).state('continueStudent', {
      url: '/student?ticket',
      templateUrl: 'partials/students/continue.html',
      controller: 'ContinueStudentCtrl',
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
