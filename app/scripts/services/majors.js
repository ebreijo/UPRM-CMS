'use strict';

var app = angular.module('uprmcmsApp');

app.factory('Majors', function(Restangular, _) {
  var obj = {
    majors: [],
    majorsForASpecificCompany: []
  };

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

  obj.getInterestedMajorsPerCompany = function(companyName) {
    return Restangular.one('/api/companies', companyName).getList('companyInterestedMajors');
  };

  obj.setAddInterestedMajorsPerCompany = function(companyName, companyMajors) {
    var addedCompanyInterestedMajors = _.filter(companyMajors, function(major) { return !major.id && major.isSet; });
    if (addedCompanyInterestedMajors[0]) {
      return Restangular.one('/api/companies', companyName).customPOST({interestedMajors: addedCompanyInterestedMajors}, 'companyInterestedMajors');
    }
  };

  obj.setRemoveInterestedMajorsPerCompany = function(companyName, companyMajors) {
    var removedCompanyInterestedMajors = _.filter(companyMajors, function(major) { return major.id && !major.isSet; });
    if (removedCompanyInterestedMajors[0]) {
      return Restangular.one('/api/companies', companyName).customPUT({interestedMajors: removedCompanyInterestedMajors}, 'companyInterestedMajors');
    }
  };

  return obj;
});
