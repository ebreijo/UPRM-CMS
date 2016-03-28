'use strict';

var app = angular.module('uprmcmsApp');

app.filter('capitalize', function() {
  return function(s) {
    return (angular.isString(s) && s.length > 0) ? s[0].toUpperCase() + s.substr(1).toLowerCase() : s;
  };
});
