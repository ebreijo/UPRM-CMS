'use strict';

var app = angular.module('uprmcmsApp');

app.factory('AboutUs', function(Restangular, _) {
  var obj = {};

  obj.aboutUsInfo = {};

  obj.getAll = function() {
    return Restangular.all('/api/aboutUs').customGET().then(function(data) {
      angular.copy(data, obj.aboutUsInfo);
    });
  };

  obj.updateAboutUs = function(aboutUs) {
    Restangular.all('/api/aboutUs').customPUT(aboutUs).then(function() {
      _.merge(this.aboutUsInfo.aboutUs, aboutUs);
    });
  };

  obj.updateStudentService = function() {
    var updatedServices = _.filter(this.aboutUsInfo.studentServices, function(element) {
      return (element.isDeleted !== true) && (element.isNew !== true);
    });

    Restangular.all('/api/aboutUs/studentServices').customPUT({'studentServices' : updatedServices});
  };

  obj.addStudentService = function(service) {
    return Restangular.all('/api/aboutUs/studentServices').customPOST({'service': service});
  };

  obj.deleteStudentService = function() {
    var deletedServices = _.filter(this.aboutUsInfo.studentServices, function(element) {
      return element.isDeleted === true;
    });
    var self = this;

    _.forEach(deletedServices, function(service) {
      Restangular.one('/api/aboutUs/studentServices', service.id).remove().then(function() {
        _.remove(self.aboutUsInfo.studentServices, function(element) {
          return element.isDeleted === true;
        });
      });
    });
  };

  return obj;
});
