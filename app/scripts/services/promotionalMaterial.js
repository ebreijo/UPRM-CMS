'use strict';

var app = angular.module('uprmcmsApp');

app.factory('PromotionalMaterial', function(Restangular, _) {
  var obj = {
    promotionalMaterial: [],
    companyPromotionalMaterial: [],
    companyPromotionalMaterialForAdmins: []

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

  obj.getPromotionalMaterialPerCompany = function(companyName) {
    return Restangular.one('/api/companies', companyName).getList('promotionalMaterial').then(function(compPromoMaterial){
      angular.copy(compPromoMaterial.plain(), obj.companyPromotionalMaterial);
    });
  };

  obj.updatePromotionalMaterialPerCompany = function(companyName, promotionalMaterial) {
    return Restangular.one('/api/companies', companyName).one('promotionalMaterial', promotionalMaterial.id).customPUT(promotionalMaterial);
  };

  obj.updatePromotionalMaterialPerCompanyFromAdmins = function(companyName, promotionalMaterial) {
    return Restangular.one('/api/admins/companies', companyName).one('promotionalMaterial', promotionalMaterial.id).customPUT(promotionalMaterial);
  };

  return obj;
});
