'use strict';

var app = angular.module('uprmcmsApp');

app.factory('Pictures', function(Restangular) {

  var obj = {
    pictures:[]
  };

  obj.getAllLandingPagePictures = function() {
    return Restangular.all('/api/pictures').getList().then(function(data) {
      angular.copy(data.plain(), obj.pictures);
    });
  };

  return obj;
});
