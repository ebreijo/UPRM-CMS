'use strict';

var request = require('supertest');
var help = require('../help.js');
var app = require('../../../server');

describe('About Us Controller: ', function() {

  describe('Get all descriptions from aboutUs.', function() {
    it('should fetch all existing about us descriptions in the database.', function(done) {
      request(app)
        .put('/api/aboutUs')
        .send({
          "vision" : "updated vision",
          "missionDesc" : "updated desc",
          "policiesDesc" : "updated desc ",
          "requirementsDesc" : "updated desc"
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "message": "About Us Descriptions Successfully Updated."
        }, done));
    });
  });

  /*
    Requirements Tests
   */

  describe('Update a List of Requirement.', function() {
    it('should update a list of requirements, given their IDs.', function(done) {
      request(app)
        .put('/api/aboutUs/requirements')
        .send({
          "requirements" : [{
            "id" : 1,
            "requirement" : "update first req"
          }, {
            "id" : 2,
            "requirement" : "update second req"
          },{
            "id" : 3,
            "requirement" : "update third req"
          }]
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "message": "All Requirements Successfully Updated."
        }, done));
    });
  });

  describe('Add a Requirement.', function() {
    it('should add a new requirement to the database, given its description.', function(done) {
      request(app)
        .post('/api/aboutUs/requirements')
        .send({ "requirement" : "new requirement" })
        .expect('Content-Type', /json/)
        .expect(201)
        .end(help.isBodyEqual({
          "id": 7,
          "requirement": "new requirement"
        }, done));
    });
  });

  describe('Delete a Requirement.', function() {
    it('should delete a requirement, given its ID.', function(done) {
      request(app)
        .del('/api/aboutUs/requirements')
        .send({ "id" : 1 })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "message": "Requirement Successfully Deleted."
        }, done));
    });
  });

  /*
    Company Services Tests
   */

  describe('Update a List of Company Services. ', function() {
    it('should update a list of company services, given their IDs.', function(done) {
      request(app)
        .put('/api/aboutUs/companyServices')
        .send({
          "companyServices" : [{
            "id" : 1,
            "service" : "update first serv"
          }, {
            "id" : 2,
            "service" : "update second serv"
          },{
            "id" : 3,
            "service" : "update third serv"
          }]
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "message": "All Company Services Successfully Updated."
        }, done));
    });
  });

  describe('Add a Company Service.', function() {
    it('should add a new company service to the database, given its service description.', function(done) {
      request(app)
        .post('/api/aboutUs/companyServices')
        .send({ "service" : "new service" })
        .expect('Content-Type', /json/)
        .expect(201)
        .end(help.isBodyEqual({
          "id": 8,
          "service": "new service"
        }, done));
    });
  });

  describe('Delete a Company Service.', function() {
    it('should delete a service, given its ID.', function(done) {
      request(app)
        .del('/api/aboutUs/companyServices')
        .send({ "id" : 1 })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "message": "Company Service Successfully Deleted."
        }, done));
    });
  });

  /*
   Policies Tests
   */

  describe('Update a List of Policies. ', function() {
    it('should update a list of policies, given their IDs.', function(done) {
      request(app)
        .put('/api/aboutUs/policies')
        .send({
          "companyServices" : [{
            "id" : 1,
            "policy" : "update first policy"
          }, {
            "id" : 2,
            "policy" : "update second policy"
          },{
            "id" : 3,
            "policy" : "update third policy"
          }]
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "message": "All Policies Successfully Updated."
        }, done));
    });
  });


  describe('Add a Policy.', function() {
    it('should add a new policy to the database, given its policy description.', function(done) {
      request(app)
        .post('/api/aboutUs/policies')
        .send({ "policy" : "new policy" })
        .expect('Content-Type', /json/)
        .expect(201)
        .end(help.isBodyEqual({
          "id": 6,
          "policy" : "new policy"
        }, done));
    });
  });

  describe('Delete a Policy.', function() {
    it('should delete a policy, given its ID.', function(done) {
      request(app)
        .del('/api/aboutUs/policies')
        .send({ "id" : 1 })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "message": "Policy Successfully Deleted."
        }, done));
    });
  });

  /*
   Our Staff Tests
   */

  describe('Update a List of Staff Members. ', function() {
    it('should update a list of policies, given their IDs.', function(done) {
      request(app)
        .put('/api/aboutUs/ourStaff')
        .send({
          "ourStaff" : [{
            "id" : 1,
            "name" : "juanito",
            "position" : "reclu"
          }, {
            "id" : 2,
            "name" : "junito",
            "position" : "el reclu"
          },{
            "id" : 3,
            "name" : "junita",
            "position" : "la reclu"
          }]
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "message": "All Staff Members Successfully Updated."
        }, done));
    });
  });


  describe('Add a Staff Member.', function() {
    it('should add a new staff member to the database, given his or her name and position.', function(done) {
      request(app)
        .post('/api/aboutUs/ourStaff')
        .send({
          "name" : "breijo",
          "position" : "recruiter" })
        .expect('Content-Type', /json/)
        .expect(201)
        .end(help.isBodyEqual({
          "id": 5,
          "name" : "breijo",
          "position" : "recruiter"
        }, done));
    });
  });

  describe('Delete a Staff Member.', function() {
    it('should delete a staff member, given its ID.', function(done) {
      request(app)
        .del('/api/aboutUs/ourStaff')
        .send({ "id" : 1 })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "message": "Staff Member Successfully Deleted."
        }, done));
    });
  });

  /*
   Student Services Tests
   */

  describe('Update a List of Student Services. ', function() {
    it('should update a list of student services, given their IDs.', function(done) {
      request(app)
        .put('/api/aboutUs/studentServices')
        .send({
          "studentServices" : [{
            "id" : 1,
            "service" : "update first serv"
          }, {
            "id" : 2,
            "service" : "update second serv"
          },{
            "id" : 3,
            "service" : "update third serv"
          }]
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "message": "All Student Services Successfully Updated."
        }, done));
    });
  });

  describe('Add a Student Service.', function() {
    it('should add a new student service to the database, given its service description.', function(done) {
      request(app)
        .post('/api/aboutUs/studentServices')
        .send({ "service" : "new service" })
        .expect('Content-Type', /json/)
        .expect(201)
        .end(help.isBodyEqual({
          "id": 14,
          "service": "new service"
        }, done));
    });
  });

  describe('Delete a Student Service.', function() {
    it('should delete a service, given its ID.', function(done) {
      request(app)
        .del('/api/aboutUs/studentServices')
        .send({ "id" : 1 })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(help.isBodyEqual({
          "message": "Student Service Successfully Deleted."
        }, done));
    });
  });

  /*
  // PUT, POST, and DELETE Routes for Student Services.
  router.put('/api/aboutUs/studentServices', aboutUs.updateStudentServices);
  router.post('/api/aboutUs/studentServices', aboutUs.addStudentService);
  router.delete('/api/aboutUs/studentServices', aboutUs.deleteStudentService);
  */
});
