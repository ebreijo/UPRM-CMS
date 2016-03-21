'use strict';

var app = angular.module('uprmcmsApp');

app.factory('companySearchService', function() {
  var savedData = {};

  function set(data) {
    savedData = data;
  }
  function get() {
    return savedData;
  }

  return {
    set: set,
    get: get
  };

});
