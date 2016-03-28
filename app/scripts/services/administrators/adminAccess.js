'use strict';

var app = angular.module('uprmcmsApp');

app.factory('AdminAccess', function() {
  var obj = {
    adminAccessList: [
      {
        email: 'juan.rodriguez@upr.edu',
        isRoot: false,
        adminAccountStatus: 'active'
      },
      {
        email: 'placement@uprm.edu',
        isRoot: true,
        adminAccountStatus: 'active'
      },
      {
        email: 'pedro.rivera@upr.edu',
        isRoot: false,
        adminAccountStatus: 'pending'
      },
      {
        email: 'maria.hernandez@upr.edu',
        isRoot: false,
        adminAccountStatus: 'inactive'
      }
    ]
  };

  return obj;
});
