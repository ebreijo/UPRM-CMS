'use strict';

var app = angular.module('uprmcmsApp');

app.controller('AboutUsCtrl', function($scope, AboutUs, _, $filter) {

  $scope.aboutUsInfo = AboutUs.aboutUsInfo;

  // Message modal
  $scope.title = null;
  $scope.message = null;

  $scope.studentService = null;
  $scope.companyService = null;

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

  // Submit edit or delete student services
  $scope.submitEditOrDeleteStudentServices = function(form) {
    if (form.$valid) {
      AboutUs.deleteStudentService();
      AboutUs.updateStudentService();
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

  // Submit edit or delete company services
  $scope.submitEditOrDeleteCompanyServices = function(form) {
    if (form.$valid) {
      AboutUs.deleteCompanyService();
      AboutUs.updateCompanyService();
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

});
