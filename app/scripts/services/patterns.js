'use strict';

var app = angular.module('uprmcmsApp');

app.factory('Patterns', function() {
  return {
    user: {
      email: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
    },
    ourStaff: {
      name: /^([a-zA-ZñÑáéíóúÁÉÍÓÚ.][\s]?){2,63}$/
    }
  };
});
