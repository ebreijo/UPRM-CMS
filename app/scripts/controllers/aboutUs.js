'use strict';

var app = angular.module('uprmcmsApp');

app.controller('AboutUsCtrl', function($scope, AboutUs, _, $filter) {

  $scope.aboutUsInfo = AboutUs.aboutUsInfo;

  // Message modal
  $scope.title = null;
  $scope.message = null;

  $scope.studentService = null;
  var isStudentServiceDeleted = false;

  $scope.submitAboutUs = function(form) {
    if(form.$valid) {
      AboutUs.updateAboutUs($scope.aboutUsInfo.aboutUs[0]);
    }
  };

  // Filter services to show
  $scope.filterStudentServices= function(service) {
    return service.isDeleted !== true;
  };

  // Mark studentService as deleted
  $scope.deleteStudentService = function(service) {
    var serv = $filter('filter')($scope.aboutUsInfo.studentServices, {id: service.id}, true);
    if (serv.length) {
      serv[0].isDeleted = true;
      isStudentServiceDeleted =  true;
    }
  };

  // Cancel all student services changes
  $scope.cancelStudentServices = function() {
    _.forEach($scope.aboutUsInfo.studentServices, function(service) {
      if (service.isDeleted) {
        delete service.isDeleted;
      }
    });
  };

  // Submit edit or delete student services
  $scope.submitEditOrDeleteStudentServices = function(form) {
    if (form.$valid) {
      if (isStudentServiceDeleted) {
        AboutUs.deleteStudentService();
      }

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

});
