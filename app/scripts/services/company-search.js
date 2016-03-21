'use strict';

var app = angular.module('uprmcmsApp');

app.factory('companySearchService', function() {

  var savedData = 'First';
  var company = 'IBM';

  function set(data) {
    savedData = data;
  }
  function getIBM(){
    return company;
  }
  function get() {
    return savedData;
  }

  return {
    set: set,
    get: get,
    getIBM: getIBM
  };

});
