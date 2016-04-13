'use strict';

var app = angular.module('uprmcmsApp');

app.factory('PromotionalMaterial', function(Restangular, _) {
  var obj = {
    promotionalMaterial: []
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

  return obj;
});
