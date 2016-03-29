'use strict';

var app = angular.module('uprmcmsApp');

app.factory('AdminAccess', function(_) {
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

  // TODO: Make a request to give access to an admin given the email and account status
  obj.giveAdminAccess = function(newAdminAccess) {
    this.adminAccessList.push(newAdminAccess);
  };

  // TODO: Make a request to update the access of an admin
  obj.updateAdminAccess = function(tempAdminAccess) {
    var element = _.find(this.adminAccessList, { email: tempAdminAccess.currentEmail});
    _.merge(element, tempAdminAccess);
  };

  return obj;
});
