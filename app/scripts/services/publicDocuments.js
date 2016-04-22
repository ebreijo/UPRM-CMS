'use strict';

var app = angular.module('uprmcmsApp');

app.factory('PublicDocuments', function(Restangular) {

  var obj = {
    publicDocuments: []
  };

  obj.getAllPublicDocuments = function() {
    return Restangular.all('/api/documents').getList().then(function(data) {
      angular.copy(data.plain(), obj.publicDocuments);
    });
  };



  return obj;

});

  /*
  obj.updateAboutUs = function(aboutUs) {
    var self = this;
    Restangular.all('/api/aboutUs').customPUT(aboutUs).then(function() {
      _.merge(self.aboutUsInfo.aboutUs, aboutUs);
    });
  };

  obj.addStudentService = function(service) {
    return Restangular.all('/api/aboutUs/studentServices').customPOST({'service': service});
  };

  obj.updateStudentServices = function() {
    var updatedServices = _.filter(this.aboutUsInfo.studentServices, function(element) {
      return element.isDeleted !== true;
    });

    Restangular.all('/api/aboutUs/studentServices').customPUT({'studentServices' : updatedServices});
  };

  obj.deleteStudentServices = function() {
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


  obj.addCompanyService = function(service) {
    return Restangular.all('/api/aboutUs/companyServices').customPOST({'service': service});
  };

  obj.updateCompanyServices = function() {
    var updatedServices = _.filter(this.aboutUsInfo.companyServices, function(element) {
      return element.isDeleted !== true;
    });

    Restangular.all('/api/aboutUs/companyServices').customPUT({'companyServices' : updatedServices});
  };

  obj.deleteCompanyServices = function() {
    var deletedServices = _.filter(this.aboutUsInfo.companyServices, function(element) {
      return element.isDeleted === true;
    });
    var self = this;

    _.forEach(deletedServices, function(service) {
      Restangular.one('/api/aboutUs/companyServices', service.id).remove().then(function() {
        _.remove(self.aboutUsInfo.companyServices, function(element) {
          return element.isDeleted === true;
        });
      });
    });
  };

  obj.addPolicy = function(policy) {
    return Restangular.all('/api/aboutUs/policies').customPOST({'policy': policy});
  };

  obj.updatePolicies = function() {
    var updatedPolicies = _.filter(this.aboutUsInfo.policies, function(element) {
      return element.isDeleted !== true;
    });

    Restangular.all('/api/aboutUs/policies').customPUT({'policies' : updatedPolicies});
  };

  obj.deletePolicies = function() {
    var deletedPolicies = _.filter(this.aboutUsInfo.policies, function(element) {
      return element.isDeleted === true;
    });
    var self = this;

    _.forEach(deletedPolicies, function(policy) {
      Restangular.one('/api/aboutUs/policies', policy.id).remove().then(function() {
        _.remove(self.aboutUsInfo.policies, function(element) {
          return element.isDeleted === true;
        });
      });
    });
  };

  obj.addRequirement = function(requirement) {
    return Restangular.all('/api/aboutUs/requirements').customPOST({'requirement': requirement});
  };

  obj.updateRequirements = function() {
    var updatedRequirements = _.filter(this.aboutUsInfo.requirements, function(element) {
      return element.isDeleted !== true;
    });

    Restangular.all('/api/aboutUs/requirements').customPUT({'requirements' : updatedRequirements});
  };

  obj.deleteRequirements = function() {
    var deletedRequirements = _.filter(this.aboutUsInfo.requirements, function(element) {
      return element.isDeleted === true;
    });
    var self = this;

    _.forEach(deletedRequirements, function(requirement) {
      Restangular.one('/api/aboutUs/requirements', requirement.id).remove().then(function() {
        _.remove(self.aboutUsInfo.requirements, function(element) {
          return element.isDeleted === true;
        });
      });
    });
  };

  obj.addStaff = function(staff) {
    return Restangular.all('/api/aboutUs/ourStaff').customPOST({'name': staff.name, 'position': staff.position});
  };

  obj.updateStaff = function() {
    var updatedStaff = _.filter(this.aboutUsInfo.ourStaff, function(element) {
      return element.isDeleted !== true;
    });

    Restangular.all('/api/aboutUs/ourStaff').customPUT({'ourStaff' : updatedStaff});
  };

  obj.deleteStaff = function() {
    var deletedStaff = _.filter(this.aboutUsInfo.ourStaff, function(element) {
      return element.isDeleted === true;
    });
    var self = this;

    _.forEach(deletedStaff, function(staff) {
      Restangular.one('/api/aboutUs/ourStaff', staff.id).remove().then(function() {
        _.remove(self.aboutUsInfo.ourStaff, function(element) {
          return element.isDeleted === true;
        });
      });
    });
  };
  */
