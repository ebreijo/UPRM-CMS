'use strict';

var app = angular.module('uprmcmsApp');

app.factory('AdminAccess', function(Restangular) {
  var obj = {
    adminAccessList: []
  };

  obj.getAdminAccessList = function() {
    return Restangular.all('/api/adminsAccess').getList().then(function(adminAccessList) {
      angular.copy(adminAccessList.plain(), obj.adminAccessList);
    });
  };


  obj.giveAdminAccess = function(newAdminAccess) {
    var self = this;
    Restangular.all('/api/adminsAccess').post(newAdminAccess).then(function() {
      self.adminAccessList.push(newAdminAccess);
    });
  };

  obj.updateAdminAccess = function(tempAdminAccess) {
    return Restangular.all('/api/adminsAccess').customPUT(tempAdminAccess);
  };

  return obj;
});
