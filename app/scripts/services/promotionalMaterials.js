'use strict';

var app = angular.module('uprmcmsApp');

app.factory('PromotionalMaterials', function(_) {
  var obj = {
    PromotionalMaterials: [
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

  // TODO: Make a request to get all pending promotional material
  obj.getAllPendingPromotionalMaterials = function() {
    return _.filter(this.PromotionalMaterials, { status: 'pending'});
  };

  // TODO: Make a request to update a promotional material given the prom id
  obj.updatePromotionalMaterials = function(promMaterial) {
    var element = _.find(this.PromotionalMaterials, { id: promMaterial.id});
    _.merge(element, promMaterial);
  };

  return obj;
});
