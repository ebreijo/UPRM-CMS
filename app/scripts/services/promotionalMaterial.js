'use strict';

var app = angular.module('uprmcmsApp');

app.factory('PromotionalMaterial', function(Restangular, _) {
  var obj = {
    promotionalMaterial: [],
    approvedCompanyPromotionalMaterial: [],
    pendingCompanyPromotionalMaterial: []
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

  obj.removePromotionalMaterialPerCompany = function(companyName, id) {
    return Restangular.one('/api/companies', companyName).customDELETE('promotionalMaterial/' + id);
  };

  return obj;
});
