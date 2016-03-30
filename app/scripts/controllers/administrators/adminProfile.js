'use strict';

var app = angular.module('uprmcmsApp');

app.controller('AdminProfileCtrl', function($scope, Companies, AdminAccess, Majors, Recruiters, JobOffers, Patterns, $filter, _) {

  $scope.patternEmail = Patterns.user.email;

  /**
   * Companies Tab
   */
  $scope.executeTab1 = function() {
    $scope.compStatusSelection = 'active';
    $scope.$watch('compStatusSelection', function (newValue) {
      $scope.compStatusSelection = newValue;
      $scope.companies = Companies.getAllCompanies($scope.compStatusSelection);
    });

    $scope.tempCompany = {};

    $scope.editCompanyStatus = function(company) {
      $scope.tempCompany = angular.copy(company);
    };

    $scope.submitCompanyStatusEdit = function(form) {
      if (form.$valid) {
        Companies.updateCompanyStatus($scope.tempCompany);
        $('#editCompanyStatusModal').modal('hide');
      }
    };
  };
  $scope.executeTab1();


  /**
   * Admins Tab
   */
  $scope.executeTab2 = function() {
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
        }
      }
    };

    $scope.editAdminAccess = function(adminAccess) {
      $scope.tempAdminAccess = angular.copy(adminAccess);
      $scope.tempAdminAccess.currentEmail = adminAccess.email;
      $scope.tempAdminAccess.adminTempAccountStatus = adminAccess.adminAccountStatus;
    };

    $scope.submitAdminAccessEdit = function(form) {
      if ($scope.tempAdminAccess.adminTempAccountStatus === 'pending' && $scope.tempAdminAccess.adminAccountStatus === 'active') {
        $scope.title = 'Warning';
        $scope.message = 'Cannot activate the Administrator, it is still pending to register';
        $('#messageModal').modal('toggle');
      } else if (form.$valid) {
        $scope.tempAdminAccess.isRoot = false;
        AdminAccess.updateAdminAccess($scope.tempAdminAccess);
        $('#editAdminAccessModal').modal('hide');
      }
    };
  };


  /**
   * Majors Tab
   */
  $scope.executeTab3 = function() {
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
        }
      }
    };

    $scope.editMajor = function(major) {
      $scope.tempMajor = angular.copy(major);
      $scope.tempMajor.currentMajorCode = major.majorCode;
    };

    $scope.submitMajorEdit = function(form) {
      if(form.$valid) {
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
        console.log('hola');
        Majors.deleteMajor($scope.tempMajor);
        $('#deleteMajorModal').modal('hide');
      }
    };
  };


  /**
   * Company Registration Tab
   */
  $scope.pendingCompanies = Companies.getAllCompanies('pending');

  $scope.executeTab4 = function() {

    $scope.acceptCompanyConfirm = function(company) {
      $scope.tempCompany = angular.copy(company);
    };

    $scope.submitAcceptCompany = function (form) {
      if (form.$valid) {
        $scope.tempCompany.companyStatus = 'active';
        Companies.updateCompanyStatus($scope.tempCompany);
        removeCompanyFromPendingList();
        $('#acceptCompanyModal').modal('hide');
      }
    };

    $scope.rejectCompanyConfirm = function(company) {
      $scope.tempCompany = angular.copy(company);
    };

    $scope.submitRejectCompany = function (form) {
      if (form.$valid) {
        $scope.tempCompany.companyStatus = 'inactive';
        Companies.updateCompanyStatus($scope.tempCompany);
        removeCompanyFromPendingList();
        $('#rejectCompanyModal').modal('hide');
      }
    };

    function removeCompanyFromPendingList() {
      // Remove element from the pending companies array once reject
      _.remove($scope.pendingCompanies, function(element) {
        return element.name === $scope.tempCompany.name;
      });
    }
  };

  /**
   * Recruiter Registration Tab
   */
  $scope.pendingRecruiters = Recruiters.getAllPendingRecruiters();

  $scope.executeTab5 = function() {

    $scope.acceptRecruiterConfirm = function(recruiter) {
      $scope.tempRecruiter = angular.copy(recruiter);
    };

    $scope.submitAcceptRecruiter = function(form) {
      if (form.$valid) {
        $scope.tempRecruiter.accountStatus = 'active';
        Recruiters.updateRecruiterStatus($scope.tempRecruiter);
        removeRecruiterFromPendingList();
        $('#acceptRecruiterModal').modal('hide');
      }
    };

    $scope.rejectRecruiterConfirm = function(recruiter) {
      $scope.tempRecruiter = angular.copy(recruiter);
    };

    $scope.submitRejectRecruiter = function(form) {
      if (form.$valid) {
        $scope.tempRecruiter.accountStatus = 'inactive';
        Recruiters.updateRecruiterStatus($scope.tempRecruiter);
        removeRecruiterFromPendingList();
        $('#rejectRecruiterModal').modal('hide');
      }
    };

    function removeRecruiterFromPendingList() {
      // Remove element from the pending companies array once accepted or rejected
      _.remove($scope.pendingRecruiters, function(element) {
        return element.email === $scope.tempRecruiter.email;
      });
    }
  };

  /**
   * Pending Job Offers Tab
   */
  $scope.pendingJobOffers = JobOffers.getAllPendingJobOffers();

  $scope.executeTab6 = function() {

    $('#jobOfferExpirationDatePicker').datepicker({
      format: 'yyyy-mm-dd'
    });

    $scope.tempJobOffer = {};

    $scope.reviewAcceptJobOfferConfirm = function(jobOffer) {
      $scope.tempJobOffer = angular.copy(jobOffer);
    };

    $scope.submitJobOfferReviewAccept = function(form) {
      if(form.$valid) {
        $scope.tempJobOffer.jobOfferStatus = 'approved';
        JobOffers.updateJobOffer($scope.tempJobOffer);
        removeJobOfferFromPendingList();
        $('#reviewAcceptJobOfferModal').modal('hide');
      }
    };

    $scope.rejectJobOfferConfirm = function(jobOffer) {
      $scope.tempJobOffer = angular.copy(jobOffer);
    };

    $scope.submitRejectJobOffer = function(form) {
      if (form.$valid) {
        $scope.tempJobOffer.accountStatus = 'rejected';
        JobOffers.updateJobOffer($scope.tempJobOffer);
        removeJobOfferFromPendingList();
        $('#rejectJobOfferModal').modal('hide');
      }
    };

    function removeJobOfferFromPendingList() {
      // Remove element from the pending companies array once accepted or rejected
      _.remove($scope.pendingJobOffers, function(element) {
        return element.id === $scope.tempJobOffer.id;
      });
    }
  };

});
