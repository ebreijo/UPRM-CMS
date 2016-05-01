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
  'xeditable',
  'cfp.loadingBar'
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
      authorizedRoles: USER_ROLES.guest
    },
    resolve: {
      picturesPromise: ['Pictures', function(Pictures) {
        Pictures.getAllLandingPagePictures();
      }]
    }
  }).state('companyRegistration', {
    url: '/companyRegistration',
    templateUrl: 'partials/company-registration.html',
    controller: 'CompanyRegistrationCtrl',
    data: {
      authorizedRoles: USER_ROLES.guest
    }
  }).state('locationRegistration', {
    url: '/locationRegistration',
    templateUrl: 'partials/location-registration.html',
    controller: 'LocationRegistrationCtrl',
    data: {
      authorizedRoles: USER_ROLES.guest
    }
  }).state('recruiterRegistration', {
    url: '/recruiterRegistration',
    templateUrl: 'partials/recruiter-registration.html',
    controller: 'RecruiterRegistrationCtrl',
    data: {
      authorizedRoles: USER_ROLES.guest
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
      authorizedRoles: USER_ROLES.guest
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
      authorizedRoles: USER_ROLES.guest
    }
  }).state('media', {
    url: '/media/:mediaFile'
  }).state('login', {
    url: '/login',
    templateUrl: 'partials/company-login.html',
    controller: 'LoginCtrl',
    data: {
      authorizedRoles: USER_ROLES.guest
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
      authorizedRoles: USER_ROLES.guest
    }
  }).state('calendar', {
    url: '/calendar',
    templateUrl: 'partials/calendar.html',
    data: {
      authorizedRoles: USER_ROLES.guest
    }
  }).state('reset', {
    url: '/reset/:token',
    templateUrl: 'partials/reset-password.html',
    controller: 'ResetPasswordCtrl',
    data: {
      authorizedRoles: USER_ROLES.guest
    }
  })
  //Company Views
    .state('company', {
      url: '/company',
      templateUrl: 'partials/companies/company-main.html',
      controller: 'CompanyCtrl',
      data: {
        authorizedRoles: USER_ROLES.recruiter
      },
      resolve: {
        majorsPromise: ['Majors', function(Majors) {
          Majors.getAllMajors();
        }]
      }
    }).state('companyJobFair', {
      url: '/companyJobFair',
      templateUrl: 'partials/companies/company-job-fair.html',
      controller: 'CompanyJobFairCtrl',
      data: {
        authorizedRoles: USER_ROLES.recruiter
      },
      resolve: {
        jobFairPromise: ['JobFairCompaniesInfo', function (JobFairCompaniesInfo) {
          JobFairCompaniesInfo.getAllCompaniesForStudentJobFair();
        }],
        jobFairGeneralInfoPromise: ['JobFairGeneralInfo', function (JobFairGeneralInfo) {
          JobFairGeneralInfo.getJobFairDate();
        }]
      }
    }).state('companyAboutUs', {
      url: '/companyAboutUs',
      templateUrl: 'partials/companies/company-about.html',
      controller: 'AboutUsCtrl',
      data: {
        authorizedRoles: USER_ROLES.recruiter
      },
      resolve: {
        aboutUsPromise: ['AboutUs', function (AboutUs) {
          AboutUs.getAll();
        }]
      }
    }).state('companyCalendar', {
      url: '/companyCalendar',
      templateUrl: 'partials/companies/calendar.html',
      data: {
        authorizedRoles: USER_ROLES.recruiter
      }
    })
  // Administrator views
    .state('adminProfile', {
      url: '/adminProfile',
      templateUrl: 'partials/administrators/admin-main.html',
      controller: 'AdminProfileCtrl',
      data: {
        authorizedRoles: USER_ROLES.administrator
      }
    }).state('adminRegistration', {
      url: '/adminRegistration',
      templateUrl: 'partials/administrators/admin-registration.html',
      controller: 'AdminRegistrationCtrl',
      data: {
        authorizedRoles: USER_ROLES.guest
      }
    }).state('adminChangeCarousel', {
      url: '/adminChangeCarousel',
      controller: 'AdminChangeCarousel',
      templateUrl: 'partials/administrators/change-carousel.html',
      data: {
        authorizedRoles: USER_ROLES.administrator
      },
      resolve: {
        picturesPromise: ['Pictures', function(Pictures) {
          Pictures.getAllLandingPagePictures();
        }]
      }
    }).state('adminCalendar', {
      url: '/adminCalendar',
      templateUrl: 'partials/administrators/calendar.html',
      data: {
        authorizedRoles: USER_ROLES.administrator
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
        authorizedRoles: USER_ROLES.administrator
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
        authorizedRoles: USER_ROLES.administrator
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
        authorizedRoles: USER_ROLES.administrator
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
        }],
        temporaryContactPromise: ['$stateParams', 'Companies', function ($stateParams, Companies) {
          return Companies.getCompanyTemporaryContact($stateParams.companyName);
        }]
      },
      data: {
        authorizedRoles: USER_ROLES.administrator
      }
    })
    // Student Views
    .state('jobFair', {
      url: '/jobFair',
      templateUrl: 'partials/students/jobFair.html',
      controller: 'jobFairCtrl',
      data: {
        authorizedRoles: USER_ROLES.student
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
        authorizedRoles: USER_ROLES.student
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
        authorizedRoles: USER_ROLES.student
      }
    }).state('studentJobOffers', {
      url: '/studentJobOffers',
      templateUrl: 'partials/students/student-job-offers.html',
      controller: 'jobOffersCtrl',
      data: {
        authorizedRoles: USER_ROLES.student
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
        authorizedRoles: USER_ROLES.student
      },
      resolve: {
        studentCompaniesPromise: ['Companies', function (Companies) {
          Companies.getAllCompaniesForStudents();
        }]
      }
    }).state('studentCompanyProfile', {
      url: '/studentCompanyProfile/:companyName',
      templateUrl: 'partials/students/student-company-profile.html',
      controller: 'StudentCompanyProfileCtrl',
      resolve: {
        studentCompanyPromise: ['$stateParams',  'Companies', function ($stateParams, Companies) {
          return Companies.getStudentCompany($stateParams.companyName);
        }],
        studentCompanyInterestedMajorsPromise: ['$stateParams', 'Majors', function($stateParams, Majors) {
          Majors.getInterestedMajorsPerCompanyForStudents($stateParams.companyName);
        }],
        studentCompanyPromotionalMaterialPromise: ['$stateParams', 'PromotionalMaterial', function($stateParams, PromotionalMaterial) {
          PromotionalMaterial.getPromotionalMaterialPerCompanyForStudents($stateParams.companyName);
        }],
        studentCompanyJobOfferPromise: ['$stateParams', 'JobOffers', function($stateParams, JobOffers) {
          JobOffers.getJobOffersPerCompanyForStudents($stateParams.companyName);
        }]
      },
      data: {
        authorizedRoles: USER_ROLES.student
      }
    }).state('continueStudent', {
      url: '/student?ticket',
      templateUrl: 'partials/students/continue.html',
      controller: 'ContinueStudentCtrl',
      data: {
        authorizedRoles: USER_ROLES.guest
      }
    }).state('404Error', {
      url: '/NotFound',
      templateUrl: 'partials/404.html',
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

        if (Auth.getUserRole() === USER_ROLES.recruiter) {
          $state.go('company');
        } else if (Auth.getUserRole() === USER_ROLES.administrator) {
          $state.go('adminProfile');
        } else if (Auth.getUserRole() === USER_ROLES.student) {
          $state.go('jobFair');
        }
      } else {
        // user is not logged in
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        $state.go('landingPage'); // redirect to landing page
      }
    }
  });

  $rootScope.$on('$stateChangeSuccess', function (event, current) {
    $rootScope.bodyClass = current.bodyClass || 'uprmcms';
  });

  $rootScope.$on('$stateChangeError', function() {
    $state.go('404Error');
  });

});

app.run(function(editableOptions, editableThemes) {
  editableThemes.bs3.inputClass = 'input-sm';
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
