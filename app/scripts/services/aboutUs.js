'use strict';

var app = angular.module('uprmcmsApp');

app.factory('aboutUs', function(Restangular) {
  var obj = {
    aboutUsInfo: []
  };

  obj.getAll = function() {
    return Restangular.all('/api/aboutUs').getList().then(function(data) {
      angular.copy(data, obj.aboutUsInfo);
    });
  };

  return obj;
});
