'use strict';

var app = angular.module('uprmcmsApp');

app.factory('Patterns', function() {
  return {
    user: {
      email: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
      firstName: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ]{2,45}$/,
      lastName: /^([a-zA-ZñÑáéíóúÁÉÍÓÚ][\s]?){2,45}$/,
      phoneNumber: /^\+?([1]{1})?[-]?([0-9]{3})\)?[-]([0-9]{3})[-]([0-9]{4})$/
    },
    ourStaff: {
      name: /^([a-zA-ZñÑáéíóúÁÉÍÓÚ.][\s]?){2,63}$/
    },
    jobFairManagement: {
      companyAdditionalInformation: /^[-a-z0-9 =¿?¡!/:._$,;*&@#%+'-()ñÑáéíóúÁÉÍÓÚ]+(\.)?$/i,
      minGpa: /^([0-3]\.\d\d?|4\.00?)$/i,
      applicationWebsiteUrl: /^[-a-z0-9 =?/:._$,;*&@#%+'-()ñÑáéíóúÁÉÍÓÚ]+(\.)?$/i
    }
  };
});
