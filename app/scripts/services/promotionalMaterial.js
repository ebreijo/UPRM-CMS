'use strict';

var app = angular.module('uprmcmsApp');

app.factory('PromotionalMaterial', function(_) {
  var obj = {
    PromotionalMaterial: [
      {
        id: 2,
        companyName: 'IBM',
        title: 'Promotion2',
        filePath: 'lib/promotionalMaterial',
        expirationDate: '2016-07-22T16:12:12.000Z',
        status: 'pending'
      },
      {
        id: 1,
        companyName: 'IBM',
        title: 'Promotion1',
        filePath: 'lib/promotionalMaterial',
        expirationDate: '2016-07-22T16:12:12.000Z',
        status: 'approved'
      },
      {
        id: 4,
        companyName: 'Apple',
        title: 'Promotion4',
        filePath: 'lib/promotionalMaterial',
        expirationDate: '2016-07-22T16:12:12.000Z',
        status: 'approved'
      },
      {
        id: 3,
        companyName: 'IBM',
        title: 'Promotion3',
        filePath: 'lib/promotionalMaterial',
        expirationDate: '2016-07-22T16:12:12.000Z',
        status: 'rejected'
      }
    ]
  };

  obj.getAllApprovedPromotionalMaterial = function() {
    return _.filter(this.PromotionalMaterial, { status: 'approved'});
  };

  // TODO: Make a request to get all pending promotional material
  obj.getAllPendingPromotionalMaterial = function() {
    return _.filter(this.PromotionalMaterial, { status: 'pending'});
  };

  // TODO: Make a request to update a promotional material given the prom id
  obj.updatePromotionalMaterial = function(promMaterial) {
    var element = _.find(this.PromotionalMaterial, { id: promMaterial.id});
    _.merge(element, promMaterial);
  };

  return obj;
});
