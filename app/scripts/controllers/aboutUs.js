'use strict';

var app = angular.module('uprmcmsApp');

app.controller('AboutUsCtrl', function($scope, AboutUs, _, $filter, Patterns) {

  $scope.aboutUsInfo = AboutUs.aboutUsInfo;

  $scope.hola = 'sadad';

  // Message modal
  $scope.title = null;
  $scope.message = null;

  $scope.studentService = null;
  $scope.companyService = null;
  $scope.policy = null;
  $scope.requirement = null;
  $scope.staff = null;

  $scope.checkMission = function(mission) {
    if (mission.length < 2 || mission.length > 255) {
      return 'Mission must be between 2 and 255 characters long';
    }
  };

  $scope.checkVision = function(vision) {
    if (vision.length < 2 || vision.length > 255) {
      return 'Vision must be between 2 and 255 characters long';
    }
  };

  $scope.submitAboutUs = function(form) {
    if(form.$valid) {
      AboutUs.updateAboutUs($scope.aboutUsInfo.aboutUs[0]);
    }
  };

  // Filter items to show
  $scope.filterItems = function(item) {
    return item.isDeleted !== true;
  };

  // Mark items as deleted
  $scope.deleteItems = function(items, item) {
    var filtered = $filter('filter')(items, {id: item.id}, true);
    if (filtered.length) {
      filtered[0].isDeleted = true;
    }
  };

  // Cancel all item changes
  $scope.cancelItems = function(items) {
    _.forEach(items, function(item) {
      if (item.isDeleted) {
        delete item.isDeleted;
      }
    });
  };

  $scope.checkStudentService = function(studentService) {
    if (studentService.length < 2 || studentService.length > 255) {
      return 'Student service must be between 2 and 255 characters long';
    }
  };

  // Submit edit or delete student services
  $scope.submitEditOrDeleteStudentServices = function(form) {
    if (form.$valid) {
      AboutUs.deleteStudentServices();
      AboutUs.updateStudentServices();
    }
  };

  // Add student service
  $scope.submitAddStudentService = function(form) {
    if (form.$valid) {
      AboutUs.addStudentService($scope.studentService).then(function(newService) {
        $scope.aboutUsInfo.studentServices.push(newService);
        $('#addStudentServiceModal').modal('hide');
        $scope.studentService = null;
      }, function(err) {
        $scope.title = 'Error';
        $scope.message = err.data.explanation;
        console.log(err);
        $('#messageModal').modal('show');
      });
    }
  };

  $scope.checkCompanyService = function(companyService) {
    if (companyService.length < 2 || companyService.length > 255) {
      return 'Company service must be between 2 and 255 characters long';
    }
  };

  // Submit edit or delete company services
  $scope.submitEditOrDeleteCompanyServices = function(form) {
    if (form.$valid) {
      AboutUs.deleteCompanyServices();
      AboutUs.updateCompanyServices();
    }
  };

  // Add company service
  $scope.submitAddCompanyService = function(form) {
    if (form.$valid) {
      AboutUs.addCompanyService($scope.companyService).then(function(newService) {
        $scope.aboutUsInfo.companyServices.push(newService);
        $('#addCompanyServiceModal').modal('hide');
        $scope.companyService = null;
      }, function(err) {
        $scope.title = 'Error';
        $scope.message = err.data.explanation;
        console.log(err);
        $('#messageModal').modal('show');
      });
    }
  };

  $scope.checkPolicyDescription = function(policyDesc) {
    if (policyDesc.length < 2 || policyDesc.length > 255) {
      return 'Policy description must be between 2 and 255 characters long';
    }
  };

  $scope.checkPolicy = function(policy) {
    if (policy.length < 2 || policy.length > 255) {
      return 'Policy must be between 2 and 255 characters long';
    }
  };

  // Submit edit or delete policies
  $scope.submitEditOrDeletePolicies = function(form) {
    if (form.$valid) {
      AboutUs.updateAboutUs($scope.aboutUsInfo.aboutUs[0]);
      AboutUs.deletePolicies();
      AboutUs.updatePolicies();
    }
  };

  // Add policy
  $scope.submitAddPolicy = function(form) {
    if (form.$valid) {
      AboutUs.addPolicy($scope.policy).then(function(newPolicy) {
        $scope.aboutUsInfo.policies.push(newPolicy);
        $('#addPolicyModal').modal('hide');
        $scope.policy = null;
      }, function(err) {
        $scope.title = 'Error';
        $scope.message = err.data.explanation;
        console.log(err);
        $('#messageModal').modal('show');
      });
    }
  };

  $scope.checkRequirementDescription = function(requirementDesc) {
    if (requirementDesc.length < 2 || requirementDesc.length > 255) {
      return 'Requirement description must be between 2 and 255 characters long';
    }
  };

  $scope.checkRequirement = function(requirement) {
    if (requirement.length < 2 || requirement.length > 255) {
      return 'Requirement must be between 2 and 255 characters long';
    }
  };

  // Submit edit or delete requirements
  $scope.submitEditOrDeleteRequirements = function(form) {
    if (form.$valid) {
      AboutUs.updateAboutUs($scope.aboutUsInfo.aboutUs[0]);
      AboutUs.deleteRequirements();
      AboutUs.updateRequirements();
    }
  };

  // Add requirement
  $scope.submitAddRequirement = function(form) {
    if (form.$valid) {
      AboutUs.addRequirement($scope.requirement).then(function(newRequirement) {
        $scope.aboutUsInfo.requirements.push(newRequirement);
        $('#addRequirementModal').modal('hide');
        $scope.requirement = null;
      }, function(err) {
        $scope.title = 'Error';
        $scope.message = err.data.explanation;
        console.log(err);
        $('#messageModal').modal('show');
      });
    }
  };

  $scope.checkStaffName = function(name) {
    if (name.length < 2 || name.length > 63) {
      return 'Name should be between 2 and 63 characters long';
    } else if (!Patterns.ourStaff.name.test(name)) {
      return 'Enter a valid name';
    }
  };

  $scope.checkStaffPosition = function(position) {
    if (position.length < 2 || position.length > 63) {
      return 'Position should be between 2 and 63 characters long';
    }
  };

  // Submit edit or delete staff
  $scope.submitEditOrDeleteStaff = function(form) {
    if (form.$valid) {
      AboutUs.deleteStaff();
      AboutUs.updateStaff();
    }
  };

  // Add staff
  $scope.submitAddStaff = function(form) {
    if (form.$valid) {
      AboutUs.addStaff($scope.staff).then(function(newStaff) {
        $scope.aboutUsInfo.ourStaff.push(newStaff);
        $('#addStaffModal').modal('hide');
        $scope.staff = null;
      }, function(err) {
        $scope.title = 'Error';
        $scope.message = err.data.explanation;
        console.log(err);
        $('#messageModal').modal('show');
      });
    }
  };

});
