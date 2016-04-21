'use strict';

var app = angular.module('uprmcmsApp');

app.controller('StudentCompanyProfileCtrl', function($scope, studentCompanyPromise, Majors, PromotionalMaterial, JobOffers) {

  $scope.company = studentCompanyPromise;
  $scope.majors = Majors.studentCompanyInterestedMajors;
  $scope.promotionalMaterial = PromotionalMaterial.companyPromotionalMaterialForStudents;
  $scope.jobOfferList = JobOffers.companyJobOffersForStudents;

});
