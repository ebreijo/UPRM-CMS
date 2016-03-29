'use strict';

var app = angular.module('uprmcmsApp');

app.factory('Majors', function(_) {
  var obj = {
    majors: [
      {
        majorCode: 'CCOM',
        nameEnglish: 'Computer Science',
        nameSpanish: 'Ciencias de Computos'
      },
      {
        majorCode: 'ICOM',
        nameEnglish: 'Computer Engineering',
        nameSpanish: 'Ingenieria en Computadoras'
      },
      {
        majorCode: 'ININ',
        nameEnglish: 'Industrial Engineering',
        nameSpanish: 'Ingenieria Industrial'
      },
      {
        majorCode: 'INME',
        nameEnglish: 'Mechanical Engineering',
        nameSpanish: 'Ingenieria Mecanica'
      },
      {
        majorCode: 'INSO',
        nameEnglish: 'Software Engineering',
        nameSpanish: 'Ingenieria de Software'
      }
    ]
  };

  // TODO: Make a request to get all majors
  obj.getAllMajors = function() {
    return this.majors;
  };

  // TODO: Make a request to create a new major
  obj.createNewMajor = function(newMajor) {
    this.majors.push(newMajor);
  };

  // TODO: Make a request to update a major given the major code
  obj.editMajor = function(tempMajor) {
    var element = _.find(this.majors, { majorCode: tempMajor.currentMajorCode});
    _.merge(element, tempMajor);
  };

  // TODO: Make a request to delete a major given the major code
  obj.deleteMajor = function(tempMajor) {
    _.remove(this.majors, function(element) {
      return element.majorCode === tempMajor.majorCode;
    });
  };

  return obj;
});