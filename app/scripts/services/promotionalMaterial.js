'use strict';

var app = angular.module('uprmcmsApp');

app.factory('PromotionalMaterial', function(Restangular, _) {
  var obj = {
    promotionalMaterial: [],
    companyPromotionalMaterial: [],
    approvedCompanyPromotionalMaterial: [],
    pendingCompanyPromotionalMaterial: [],
    companyPromotionalMaterialForAdmins: [],
    companyPromotionalMaterialForStudents: []
  };

  obj.getAllApprovedPromotionalMaterial = function() {
    return _.filter(this.promotionalMaterial, { status: 'approved'});
  };

  obj.getAllPendingPromotionalMaterialForAdmins = function(status) {
    Restangular.all('/api/admins/promotionalMaterial').getList({status: status}).then(function(promoMaterial) {
      angular.copy(promoMaterial.plain(), obj.promotionalMaterial);
    });
  };

  obj.updatePromotionalMaterialFromAdmins = function(promMaterial) {
    return Restangular.one('/api/admins/promotionalMaterial', promMaterial.id).customPUT(promMaterial);
  };

  obj.getPromotionalMaterialPerCompanyForAdmins = function(companyName, status) {
    return Restangular.one('/api/admins/companies', companyName).getList('promotionalMaterial', {status: status}).then(function(compPromoMaterialForAdmins) {
      angular.copy(compPromoMaterialForAdmins.plain(), obj.companyPromotionalMaterialForAdmins);
    });
  };

  obj.updatePromotionalMaterialPerCompanyFromAdmins = function(companyName, promotionalMaterial) {
    return Restangular.one('/api/admins/companies', companyName).one('promotionalMaterial', promotionalMaterial.id).customPUT(promotionalMaterial);
  };

  obj.deletePromotionalMaterialPerCompanyFromAdmins = function(companyName, promotionalMaterialId) {
    return Restangular.one('/api/admins/companies', companyName).one('promotionalMaterial', promotionalMaterialId).remove();
  };

  obj.getPromotionalMaterialPerCompany = function(companyName) {
    return Restangular.one('/api/companies', companyName).getList('promotionalMaterial').then(function(compPromoMaterial){
      angular.copy(compPromoMaterial.plain(), obj.companyPromotionalMaterial);
    });
  };

  obj.getApprovedPromotionalMaterialPerCompany = function(companyName) {
    return Restangular.one('/api/companies', companyName).getList('promotionalMaterial').then(function(compPromoMaterial){
      angular.copy(compPromoMaterial.plain(), obj.approvedCompanyPromotionalMaterial);
    });
  };

  obj.getPendingPromotionalMaterialPerCompany = function(companyName) {
    return Restangular.one('/api/companies', companyName).getList('promotionalMaterial?status=pending').then(function(compPromoMaterial){
      angular.copy(compPromoMaterial.plain(), obj.pendingCompanyPromotionalMaterial);
    });
  };

  obj.updatePromotionalMaterialPerCompany = function(companyName, promotionalMaterial) {
    return Restangular.one('/api/companies', companyName).one('promotionalMaterial', promotionalMaterial.id).customPUT(promotionalMaterial);
  };

  obj.removePromotionalMaterialPerCompany = function(companyName, id) {
    return Restangular.one('/api/companies', companyName).customDELETE('promotionalMaterial/' + id);
  };

  obj.getPromotionalMaterialPerCompanyForStudents = function(companyName) {
    return Restangular.one('/api/students/companies', companyName).getList('promotionalMaterial').then(function(promotionalMaterial) {
      angular.copy(promotionalMaterial.plain(), obj.companyPromotionalMaterialForStudents);
    });
  };

  return obj;
});
