'use strict';

var app = angular.module('uprmcmsApp');

app.factory('PublicDocuments', function(Restangular) {

  var obj = {
    publicDocuments: []
  };

  obj.getAllPublicDocuments = function() {
    return Restangular.all('/api/documents').getList().then(function(data) {
      angular.copy(data.plain(), obj.publicDocuments);
    });
  };

  obj.addPublicDocuments = function(data) {
    return Restangular.all('/api/documents').customPOST(data);
  };

  obj.deletePublicDocument = function(id){
    return Restangular.one('/api/documents', id).remove();
  };

  return obj;

});
