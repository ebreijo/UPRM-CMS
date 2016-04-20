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

  obj.updateLandingPagePicture = function(changes, pictureId) {
    return Restangular.one('/api/pictures', pictureId).customPUT(changes);
  };

  return obj;
});
