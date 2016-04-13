'use strict';

var app = angular.module('uprmcmsApp');

app.factory('Administrator', function(Restangular) {
  var obj = {
    administrator: {}
  };

  obj.getMyInformation = function() {
    return Restangular.one('/api/administrators', 'me').get().then(function(admin) {
      angular.copy(admin.plain(), obj.administrator);
    });
  };

  obj.updateNames = function(changes) {
    return Restangular.one('/api/administrators', 'me').customPOST(changes);
  };

  obj.changePassword = function(password) {
    return Restangular.one('/api/administrators', 'me').customPOST({password: password});
  };

  return obj;
});
