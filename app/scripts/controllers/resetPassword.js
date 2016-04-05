'use strict';

var app = angular.module('uprmcmsApp');

app.controller('ResetPasswordCtrl', function($scope, Auth, $stateParams, $state) {

  $scope.user = {};

  $scope.submitResetPassword = function(isValid) {
    if (isValid) {
      Auth.resetPassword($scope.user, $stateParams.token).then(function(res) {
        $scope.title = 'Congratulations';
        $scope.message = res;
        $('#messageModal').modal('show');
      }).catch(function() {
        $scope.show = true;
      });
    }
  };

  // once modal is hidden, then redirect to the login page
  $('#messageModal').on('hidden.bs.modal', function () {
    $state.go('login');
  });

});
