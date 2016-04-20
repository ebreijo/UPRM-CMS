'use strict';

var app = angular.module('uprmcmsApp');


app.controller('AdminCompanyProfileCtrl', function($scope, adminCompanyPromise, Majors, PromotionalMaterial, Recruiters, JobOffers, temporaryContactPromise, Companies, Patterns, $state, _) {

  $scope.company = adminCompanyPromise;
  var majorList = Majors.majors;

  $scope.patterns = Patterns.user;

  $scope.executeTab1 = function() {

    $scope.getCompanyDescriptionItem = function(companyInfo) {
      $scope.CompanyDescriptionItem = angular.copy(companyInfo);
    };

    $scope.submitCompanyDescription = function(form) {
      if (form.$valid) {
        Companies.updateCompanyFromAdmins(adminCompanyPromise.name, $scope.CompanyDescriptionItem).then(function() {
          $state.go('.', {companyName: $scope.CompanyDescriptionItem.name}, {notify: false});
          _.merge($scope.company, $scope.CompanyDescriptionItem);
          $('#editCompanyDescriptionModal').modal('hide');
        });
      }
    };

    Majors.getInterestedMajorsPerCompany(adminCompanyPromise.name).then(function(interestedMajors) {
      $scope.majors = angular.copy(interestedMajors.plain());

      var majorCodes = [];
      _.forEach($scope.majors,  function(major) {
        major.isSet = true;
        majorCodes.push(major.majorCode);
      });

      _.forEach(majorList,  function(major) {
        if(majorCodes.indexOf(major.majorCode) < 0) {
          var dummyObject = {
            companyName: $scope.companySelection,
            majorCode: major.majorCode,
            isSet: false
          };
          $scope.majors.push(dummyObject);
        }
      });
    });

    $scope.submitCompanyInterestedMajors = function(form) {
      if (form.$valid) {
        var setAddInterestedMajorsPromise = Majors.setAddInterestedMajorsPerCompany(adminCompanyPromise.name, $scope.majors);
        if (setAddInterestedMajorsPromise) {
          setAddInterestedMajorsPromise.then(function(results) {
            _.forEach(results, function(element) {
              var major = _.find($scope.majors, function(major) { return (major.majorCode === element.majorCode) && major.isSet; });
              _.merge(major, element);
            });
          });
        }
        var setRemoveInterestedMajorsPromise = Majors.setRemoveInterestedMajorsPerCompany(adminCompanyPromise.name, $scope.majors);
        if (setRemoveInterestedMajorsPromise) {
          setRemoveInterestedMajorsPromise.then(function(results) {
            _.forEach(results, function(element) {
              var major = _.find($scope.majors, function(major) { return (major.majorCode === element.majorCode) && !major.isSet; });
              delete major.id;
            });
          });
        }
        $('#editInterestedMajorsModal').modal('hide');
      }
    };

    $scope.promMaterialStatusSelection = 'approved';
    $scope.$watch('promMaterialStatusSelection', function (newValue) {
      $scope.promMaterialStatusSelection = newValue;
      PromotionalMaterial.getPromotionalMaterialPerCompanyForAdmins(adminCompanyPromise.name, $scope.promMaterialStatusSelection);
      $scope.promotionalMaterial = PromotionalMaterial.companyPromotionalMaterialForAdmins;
    });

    $('#editPromotionalDocumentExpirationDatePicker').datepicker({
      format: 'yyyy-mm-dd'
    });

    $scope.setPromotionalMaterialItem = function(promMaterial) {
      $scope.promotionalMaterialItem = angular.copy(promMaterial);
    };

    $scope.submitCompanyPromotionalMaterialChanges = function (form) {
      if (form.$valid && (new Date($scope.promotionalMaterialItem.expirationDate) > (new Date()))) {
        PromotionalMaterial.updatePromotionalMaterialPerCompanyFromAdmins(adminCompanyPromise.name, $scope.promotionalMaterialItem).then(function() {
          var element = _.find($scope.promotionalMaterial, { id: $scope.promotionalMaterialItem.id});
          _.merge(element, $scope.promotionalMaterialItem);
          $('#editCompanyPromotionalMaterialModal').modal('hide');
        });
      } else {
        $scope.showEditPromotionalMaterialDateError = true;
      }
    };

    $scope.setCompanyPromotionalMaterial = function(promMaterial) {
      $scope.promotionalMaterialItem = angular.copy(promMaterial);
    };

    $scope.submitDeleteCompanyPromotionalMaterial = function(form) {
      if (form.$valid) {
        PromotionalMaterial.deletePromotionalMaterialPerCompanyFromAdmins(adminCompanyPromise.name, $scope.promotionalMaterialItem.id).then(function() {
          _.remove($scope.promotionalMaterial, { id: $scope.promotionalMaterialItem.id});
          $('#confirmDeletePromotionalMaterialModal').modal('hide');
        });
      }
    };
  };
  $scope.executeTab1();

  $scope.executeTab2 = function() {
    $scope.recruiterStatusSelection = 'active';
    $scope.$watch('recruiterStatusSelection', function (newValue) {
      $scope.recruiterStatusSelection = newValue;
      Recruiters.getRecruitersPerCompanyForAdmins(adminCompanyPromise.name, $scope.recruiterStatusSelection);
      $scope.recruiterList = Recruiters.companyRecruitersForAdmins;
    });

    $scope.changeRecruiterStatus = function(recruiter) {
      $scope.tempRecruiter = angular.copy(recruiter);
    };

    $scope.submitRecruiterStatusChange = function(form) {
      if (form.$valid) {
        Recruiters.updateRecruiterStatusPerCompanyForAdmins(adminCompanyPromise.name, $scope.tempRecruiter).then(function() {
          var element = _.find($scope.recruiterList, { email: $scope.tempRecruiter.email});
          _.merge(element, $scope.tempRecruiter);
          $('#editRecruiterStatusModal').modal('hide');
        });
      }
    };
  };

  $scope.executeTab3 = function() {
    $scope.jobOfferStatusSelection = 'approved';
    $scope.$watch('jobOfferStatusSelection', function (newValue) {
      $scope.jobOfferStatusSelection = newValue;
      JobOffers.getJobOffersPerCompanyForAdmins(adminCompanyPromise.name, $scope.jobOfferStatusSelection);
      $scope.jobOfferList = JobOffers.companyJobOffersForAdmins;
    });

    $scope.setJobOfferItem =  function(item) {
      $scope.tempJobOffer = angular.copy(item);
    };

    $scope.submitJobOfferStatus = function(form) {
      if (form.$valid) {
        JobOffers.updateJobOfferStatusPerCompanyForAdmins(adminCompanyPromise.name, $scope.tempJobOffer).then(function() {
          var element = _.find($scope.jobOfferList, { id: $scope.tempJobOffer.id});
          _.merge(element, $scope.tempJobOffer);
          $('#editJobOfferStatusModal').modal('hide');
        }, function() {
          $scope.showJobOfferExpirationError = true;
        });
      }
    };
  };

  $scope.tempContact = temporaryContactPromise[0];


});
