'use strict';

var app = angular.module('uprmcmsApp');


app.controller('AdminCompanyProfileCtrl', function($scope, adminCompanyPromise, Majors, PromotionalMaterial, _) {

  $scope.company = adminCompanyPromise;
  var majorList = Majors.majors;

  Majors.getInterestedMajorsPerCompany(adminCompanyPromise.name).then(function(interestedMajors) {
    $scope.interestedMajors = angular.copy(interestedMajors.plain());
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

  $scope.compStatusSelection = 'approved';
  $scope.$watch('compStatusSelection', function (newValue) {
    $scope.compStatusSelection = newValue;
    PromotionalMaterial.getPromotionalMaterialPerCompanyForAdmIns(adminCompanyPromise.name, $scope.compStatusSelection);
    $scope.promotionalMaterial = PromotionalMaterial.companyPromotionalMaterialForAdmins;
  });

});
