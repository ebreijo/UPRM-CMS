'use strict';

var app = angular.module('uprmcmsApp');

app.controller('AdminProfileCtrl', function($scope, Companies, AdminAccess, Majors, Recruiters, JobOffers, PromotionalMaterial, Administrator, Patterns, $filter, _) {

  $scope.patterns = Patterns.user;

  /**
   * Companies Tab
   */
  $scope.executeTab1 = function() {
    $scope.compStatusSelection = 'active';
    $scope.$watch('compStatusSelection', function (newValue) {
      $scope.compStatusSelection = newValue;
      Companies.getAllCompaniesForAdmins($scope.compStatusSelection);
      $scope.companies = Companies.companies;
    });

    $scope.company = {};
    $scope.tempCompany = {};
    $scope.tempContact = {};

    $scope.submitCreateCompany = function(form) {
      if(form.$valid) {
        var element = _.find($scope.companies, { name: $scope.company.name});

        if (element) { // If company already exists, show a Warning
          $scope.title = 'Warning';
          $scope.message = 'Company already exists';
          $('#messageModal').modal('toggle');
        }
        else {
          $scope.company.companyStatus = 'active';
          $scope.company.registrationDate = new Date().toISOString();
          Companies.createNewCompany($scope.company).then(function(newCompany) {
            $scope.tempContact.companyName = newCompany.plain().name;
            Companies.createOrUpdateCompanyTemporaryContact($scope.tempContact);
            $scope.company = null;
            $scope.tempContact = null;
            form.$setPristine();
            Companies.getAllCompaniesForAdmins($scope.compStatusSelection);
            $scope.companies = Companies.companies;
            $('#createCompanyModal').modal('hide');
          }, function() {
            $scope.title = 'Warning';
            $scope.message = 'Company already exists';
            $('#messageModal').modal('toggle');
          });
        }
      }
    };

    $scope.editCompanyStatus = function(company) {
      $scope.tempCompany = angular.copy(company);
    };

    $scope.submitCompanyStatusEdit = function(form) {
      if (form.$valid) {
        Companies.updateCompanyFromAdmins($scope.tempCompany.name, $scope.tempCompany).then(function() {
          var element = _.find($scope.companies, { name: $scope.tempCompany.name});
          _.merge(element, $scope.tempCompany);
          $('#editCompanyStatusModal').modal('hide');
        });
      }
    };

  };
  $scope.executeTab1();


  /**
   * Admins Tab
   */
  $scope.executeTab2 = function() {
    AdminAccess.getAdminAccessList();
    $scope.adminAccessList = AdminAccess.adminAccessList;
    $scope.newAdminAccess = {};
    $scope.tempAdminAccess = {};

    $scope.giveAdminAccess = function(form) {
      if (form.$valid) {
        var element = _.find($scope.adminAccessList, { email: $scope.newAdminAccess.email});

        if (element) { // If admin already exists, show a Warning
          $scope.title = 'Warning';
          $scope.message = 'Admin already exists';
          $('#messageModal').modal('toggle');
        } else {
          $scope.newAdminAccess.isRoot = false;
          $scope.newAdminAccess.adminAccountStatus = 'pending';
          AdminAccess.giveAdminAccess($scope.newAdminAccess);
          $scope.newAdminAccess = null;
          form.$setPristine();
        }
      }
    };

    $scope.editAdminAccess = function(adminAccess) {
      $scope.tempAdminAccess = angular.copy(adminAccess);
      $scope.tempAdminAccess.currentEmail = adminAccess.email;
      $scope.tempAdminAccess.adminTempAccountStatus = adminAccess.adminAccountStatus;
    };

    $scope.submitAdminAccessEdit = function(form) {
      if (form.$valid) {
        // if admin access email changed, then check if that new email already exists.
        if (!_.isEqual($scope.tempAdminAccess.email, $scope.tempAdminAccess.currentEmail)) {
          var element = _.find($scope.adminAccessList, { email: $scope.tempAdminAccess.email});
          if (element) { // If admin already exists, show a Warning
            $scope.title = 'Warning';
            $scope.message = 'Admin already exists';
            $('#messageModal').modal('toggle');
            return;
          }
        }

        $scope.tempAdminAccess.isRoot = false;
        AdminAccess.updateAdminAccess($scope.tempAdminAccess).then(function() {
          var element = _.find($scope.adminAccessList, { email: $scope.tempAdminAccess.currentEmail});
          _.merge(element, $scope.tempAdminAccess);
          $('#editAdminAccessModal').modal('hide');
        }, function(err) {
          $scope.title = 'Warning';
          $scope.message = err.data.message;
          $('#messageModal').modal('toggle');
        });

      }
    };
  };


  /**
   * Majors Tab
   */
  $scope.executeTab3 = function() {
    Majors.getAllMajors();
    $scope.majors = Majors.majors;

    $scope.major = {};
    $scope.tempMajor = {};

    $scope.submitAddMajor = function(form) {
      if(form.$valid) {
        var element = _.find($scope.majors, { majorCode: $scope.major.majorCode});

        if (element) { // If major already exists, show a Warning
          $scope.title = 'Warning';
          $scope.message = 'Major already exists';
          $('#messageModal').modal('toggle');
        }
        else {
          $scope.major.majorCode = $scope.major.majorCode.toUpperCase();
          Majors.createNewMajor($scope.major);
          $scope.major = null;
          form.$setPristine();
        }
      }
    };

    $scope.editMajor = function(major) {
      $scope.tempMajor = angular.copy(major);
      $scope.tempMajor.currentMajorCode = major.majorCode;
    };

    $scope.submitMajorEdit = function(form) {
      if(form.$valid) {
        // if major code changed, then check if that new major code already exists.
        if (!_.isEqual($scope.tempMajor.majorCode, $scope.tempMajor.currentMajorCode)) {
          var element = _.find($scope.majors, { majorCode: $scope.tempMajor.majorCode});
          if (element) { // If major already exists, show a Warning
            $scope.title = 'Warning';
            $scope.message = 'Major already exists';
            $('#messageModal').modal('toggle');
            return;
          }
        }

        $scope.tempMajor.majorCode = $scope.tempMajor.majorCode.toUpperCase();
        Majors.editMajor($scope.tempMajor);
        $('#editMajorModal').modal('hide');
      }
    };

    $scope.deleteMajor = function(major) {
      $scope.tempMajor = angular.copy(major);
    };

    $scope.submitMajorDelete = function(form) {
      if(form.$valid) {
        Majors.deleteMajor($scope.tempMajor);
        $('#deleteMajorModal').modal('hide');
      }
    };
  };


  /**
   * Company Registration Tab
   */
  Companies.getAllCompaniesForAdmins('pending');
  $scope.pendingCompanies = Companies.pendingCompanies;

  $scope.executeTab4 = function() {

    Companies.getAllCompaniesForAdmins('pending');
    $scope.pendingCompanies = Companies.pendingCompanies;

    $scope.setCompanyToConfirm = function(company) {
      $scope.tempCompany = angular.copy(company);
    };

    $scope.submitAcceptCompany = function (form) {
      if (form.$valid) {
        $scope.tempCompany.companyStatus = 'active';
        Companies.updateCompanyFromAdmins($scope.tempCompany.name, $scope.tempCompany).then(function() {
          removeCompanyFromPendingList();
          $('#acceptCompanyModal').modal('hide');
        });
      }
    };

    $scope.submitRejectCompany = function (form) {
      if (form.$valid) {
        $scope.tempCompany.companyStatus = 'inactive';
        Companies.updateCompanyFromAdmins($scope.tempCompany.name, $scope.tempCompany).then(function() {
          removeCompanyFromPendingList();
          $('#rejectCompanyModal').modal('hide');
        });
      }
    };

    function removeCompanyFromPendingList() {
      // Remove element from the pending recruiters array once accepted or rejected
      _.remove($scope.pendingCompanies, function(element) {
        return element.name === $scope.tempCompany.name;
      });
    }
  };

  /**
   * Recruiter Registration Tab
   */
  Recruiters.getAllPendingRecruitersForAdmins();
  $scope.pendingRecruiters = Recruiters.pendingRecruiters;

  $scope.executeTab5 = function() {

    Recruiters.getAllPendingRecruitersForAdmins();
    $scope.pendingRecruiters = Recruiters.pendingRecruiters;

    $scope.setRecruiterToConfirm = function(recruiter) {
      $scope.tempRecruiter = angular.copy(recruiter);
    };

    $scope.submitAcceptRecruiter = function(form) {
      if (form.$valid) {
        $scope.tempRecruiter.accountStatus = 'active';
        Recruiters.updateRecruiterStatusFromAdmins($scope.tempRecruiter).then(function() {
          removeRecruiterFromPendingList();
          $('#acceptRecruiterModal').modal('hide');
        });
      }
    };

    $scope.submitRejectRecruiter = function(form) {
      if (form.$valid) {
        $scope.tempRecruiter.accountStatus = 'inactive';
        Recruiters.updateRecruiterStatusFromAdmins($scope.tempRecruiter).then(function() {
          removeRecruiterFromPendingList();
          $('#rejectRecruiterModal').modal('hide');
        });
      }
    };

    function removeRecruiterFromPendingList() {
      // Remove element from the pending recruiters array once accepted or rejected
      _.remove($scope.pendingRecruiters, function(element) {
        return element.email === $scope.tempRecruiter.email;
      });
    }
  };

  /**
   * Pending Job Offers Tab
   */
  JobOffers.getAllJobOffersAdmins('pending');
  $scope.pendingJobOffers = JobOffers.jobOffers;

  $scope.executeTab6 = function() {

    $('#jobOfferExpirationDatePicker').datepicker({
      format: 'yyyy-mm-dd',
      autoclose: true
    });

    $scope.tempJobOffer = {};

    $scope.setJobOfferToConfirm = function(jobOffer) {
      $scope.tempJobOffer = angular.copy(jobOffer);
    };

    $scope.submitJobOfferReviewAccept = function(form) {
      if(form.$valid && (new Date($scope.tempJobOffer.expirationDate) > (new Date()))) {
        $scope.showJobOfferDateError = false;
        $scope.tempJobOffer.jobOfferStatus = 'approved';
        JobOffers.updateJobOfferFromAdmins($scope.tempJobOffer).then(function() {
          removeJobOfferFromPendingList();
          $scope.tempJobOffer.expirationDate = null;
          $('#reviewAcceptJobOfferModal').modal('hide');
        });
      } else {
        $scope.showJobOfferDateError = true;
      }
    };

    $scope.submitRejectJobOffer = function(form) {
      if (form.$valid) {
        $scope.tempJobOffer.jobOfferStatus = 'rejected';
        JobOffers.updateJobOfferFromAdmins($scope.tempJobOffer).then(function() {
          removeJobOfferFromPendingList();
          $('#rejectJobOfferModal').modal('hide');
        });
      }
    };

    function removeJobOfferFromPendingList() {
      // Remove element from the pending job offers array once accepted or rejected
      _.remove($scope.pendingJobOffers, function(element) {
        return element.id === $scope.tempJobOffer.id;
      });
    }
  };


  /**
   * Promotional Documents
   */
  PromotionalMaterial.getAllPendingPromotionalMaterialForAdmins('pending');
  $scope.pendingPromotionalMaterial = PromotionalMaterial.promotionalMaterial;

  $scope.executeTab7 = function() {

    $scope.tempPromotionalDocument = {};

    $scope.setPromotionalDocumentToConfirm = function(promotionalDocument) {
      $scope.tempPromotionalDocument = angular.copy(promotionalDocument);
    };

    $scope.submitAcceptPromotionalDocument = function(form) {
      if(form.$valid) {
        $scope.tempPromotionalDocument.status = 'approved';
        PromotionalMaterial.updatePromotionalMaterialFromAdmins($scope.tempPromotionalDocument).then(function() {
          removePromotionalDocumentFromPendingList();
          $('#acceptPromotionalDocumentModal').modal('hide');
        });
      }
    };

    $scope.submitRejectPromotionalDocument = function(form) {
      if(form.$valid) {
        $scope.tempPromotionalDocument.status = 'rejected';
        PromotionalMaterial.updatePromotionalMaterialFromAdmins($scope.tempPromotionalDocument).then(function() {
          removePromotionalDocumentFromPendingList();
          $('#rejectPromotionalDocumentModal').modal('hide');
        });
      }
    };

    function removePromotionalDocumentFromPendingList() {
      // Remove element from the pending promotional documents array once accepted or rejected
      _.remove($scope.pendingPromotionalMaterial, function(element) {
        return element.id === $scope.tempPromotionalDocument.id;
      });
    }
  };

  /**
   * Account Settings Tab
   */
  Administrator.getMyInformation();
  $scope.admin = Administrator.administrator;


  $scope.confirmNameChanges = function(form) {
    if (form.$valid) {
      $('#confirmNameChanges').modal('show');
    }
  };

  $scope.submitNameChanges = function() {
    Administrator.updateNames($scope.admin).then(function() {
      $('#confirmNameChanges').modal('hide');
    });
  };

  $scope.confirmChangePassword = function(form) {
    if (form.$valid) {
      if ($scope.password !== $scope.newPassword) {
        $scope.title = 'Warning';
        $scope.message = 'Password does not match. Please verify you have entered the same password in both fields.';
        $('#messageModal').modal('show');
        return;
      }
      $('#confirmChangePassword').modal('show');
    }
  };

  $scope.submitChangePassword = function() {
    Administrator.changePassword($scope.password).then(function() {
      $('#confirmChangePassword').modal('hide');
      $scope.password = null;
      $scope.newPassword = null;
      $scope.changePasswordForm.$setPristine();
      $scope.title = 'Congratulations';
      $scope.message = 'Password was successfully changed. Next time you log in make sure to use the new password!';
      $('#messageModal').modal('show');
    });
  };

});
