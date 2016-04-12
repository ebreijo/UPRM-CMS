'use strict';

var app = angular.module('uprmcmsApp');

app.factory('Majors', function(Restangular, _) {
  var obj = {
    majors: []
  };

  obj.companyInterestedMajors = [
    {
      id: 1,
      companyName: 'IBM',
      majorCode: 'ICOM'
    },
    {
      id: 2,
      companyName: 'IBM',
      majorCode: 'CCOM'
    },
    {
      id: 3,
      companyName: 'IBM',
      majorCode: 'INSO'
    },
    {
      id: 4,
      companyName: 'Apple',
      majorCode: 'ICOM'
    },
    {
      id: 5,
      companyName: 'Apple',
      majorCode: 'CCOM'
    }
  ];


  obj.getAllMajors = function() {
    Restangular.all('/api/majors').getList().then(function(majors) {
      angular.copy(majors.plain(), obj.majors);
    });
  };

  obj.createNewMajor = function(newMajor) {
    Restangular.all('/api/majors').post(newMajor).then(function(major) {
      obj.majors.push(major);
    });

  };

  obj.editMajor = function(tempMajor) {
    Restangular.one('/api/majors', tempMajor.currentMajorCode).customPUT(tempMajor).then(function() {
      var element = _.find(obj.majors, { majorCode: tempMajor.currentMajorCode});
      _.merge(element, tempMajor);
    });
  };

  obj.deleteMajor = function(tempMajor) {
    Restangular.one('/api/majors', tempMajor.majorCode).remove().then(function() {
      _.remove(obj.majors, function(element) {
        return element.majorCode === tempMajor.majorCode;
      });
    });
  };

  // TODO: Make a request to get company interested majors per company
  obj.getInterestedMajorsPerCompany = function(companyName) {
    return _.filter(this.companyInterestedMajors, { companyName: companyName});
  };

  // TODO: Make a request to add or remove company interested majors per company
  obj.setInterestedMajorsPerCompany = function(companyMajors) {
    var self = this;
    _.forEach(companyMajors, function(major) {
      if (major.isSet && !major.id) {
        major.id = 1000; // simulating an index assigned in by the database
        self.companyInterestedMajors.push(major);
      } else if (!major.isSet && major.id) {
        major.needRemove = true;
      }
    });

    // remove the ones needed to remove
    _.remove(this.companyInterestedMajors, function(element) {
      return element.needRemove === true;
    });
  };

  return obj;
});
