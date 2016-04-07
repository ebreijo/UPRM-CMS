'use strict';

describe('Controller: Company Profile', function () {

  // load the service's module
  beforeEach(module('uprmcmsApp'));

  var $controller;
  var companyProfile;
  var scope;
  var _;

  // Inject Custom Services:

  beforeEach(inject(function ($injector) {
    _ = $injector.get('_');
  }));

  // Inject AngularJS Services:
  beforeEach(inject(function (_$controller_, $rootScope) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    scope = $rootScope.$new();

    $controller('CompanyCtrl', {
      $scope: scope,
      companyProfile: companyProfile,
      _: _
    });

  }));

  describe('scope.getCompanyDescriptionItem', function () {

    it('Get the company general information of company.', function () {

      var companyInfo = {
        name: 'IBM',
        websiteUrl: 'http://www.ibm.com/us-en/',
        logoPath: null,
        companyDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat quis elit a vestibulum. Mauris leo sem, lacinia eu dapibus a, tempor eget metus. In vehicula maximus magna. Vestibulum pulvinar purus in tristique pellentesque. Sed porta imperdiet ultricies. Cras ac ipsum aliquam, condimentum risus non, euismod quam. Morbi posuere lobortis auctor. Aliquam massa eros, ultrices a viverra a, lacinia sed sem.',
        companyStatus: 'Active'
      };

      scope.CompanyDescriptionItem = {};

      scope.getCompanyDescriptionItem(companyInfo);

      expect(angular.equals(scope.CompanyDescriptionItem, companyInfo)).toBeTruthy();

    });

  });

  describe('scope.submitCompanyDescription', function () {

    it('Company General Information should not be updated if inputs in form are not valid', function () {

      var myForm = {};

      scope.CompanyDescriptionItem = {
        name: 'IBM',
        websiteUrl: 'http://www.ibm.com/us-en/',
        logoPath: null,
        companyDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat quis elit a vestibulum. Mauris leo sem, lacinia eu dapibus a, tempor eget metus. In vehicula maximus magna. Vestibulum pulvinar purus in tristique pellentesque. Sed porta imperdiet ultricies. Cras ac ipsum aliquam, condimentum risus non, euismod quam. Morbi posuere lobortis auctor. Aliquam massa eros, ultrices a viverra a, lacinia sed sem.',
        companyStatus: 'Active'
      };

      scope.companyProfile = {
        'generalInfo':[
          {
            websiteUrl: '',
            companyDescription: ''
          }
        ]
      };

      myForm.$invalid = false;

      expect(scope.submitCompanyDescription(myForm)).toEqual(false);

    });

    it('Company General Information should be updated if inputs in form are valid. Case 1: Both Company Description and Website URL copy successfully', function () {

      var myForm = {};

      scope.CompanyDescriptionItem = {};

      scope.CompanyDescriptionItem = {
        name: 'IBM',
        websiteUrl: 'http://www.ibm.com/us-en/',
        logoPath: null,
        companyDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        companyStatus: 'Active'
      };

      scope.companyProfile = {
        'generalInfo':[
          {
            websiteUrl: '',
            companyDescription: ''
          }
        ]
      };

      myForm.$valid = true;

      scope.CompanyDescriptionItem.websiteUrl = 'http://www.test_url.com';
      scope.CompanyDescriptionItem.companyDescription = 'This is a company description';

      var websiteURL = false;
      var companyDescription = false;

      scope.submitCompanyDescription(myForm);

      if (scope.companyProfile.generalInfo[0].websiteUrl === 'http://www.test_url.com'){
        websiteURL = true;
      }
      else {
        websiteURL = false;
      }

      if (scope.companyProfile.generalInfo[0].companyDescription === 'This is a company description'){
        companyDescription = true;
      }
      else {
        companyDescription = false;
      }
      expect(websiteURL&&companyDescription).toEqual(true);
    });

  });

  describe('scope.openAddCompanyPromotionalMaterialModal', function () {

    it('Open the Modal for Adding a Promotional document if max capacity(5) has not been reached.', function () {

      scope.companyProfile = {
        'promotionalMaterial':[
          {},
          {},
          {},
          {}
        ]
      };

      scope.showPromotionalMaterialError = null;

      scope.openAddCompanyPromotionalMaterialModal();

      expect(!scope.showPromotionalMaterialError).toBeTruthy();

    });

    it('Open the Modal for Adding a Promotional document if max capacity(5) has been reached.', function () {

      scope.companyProfile = {
        'promotionalMaterial':[
          {},
          {},
          {},
          {},
          {}
        ]
      };

      scope.showPromotionalMaterialError = null;

      scope.openAddCompanyPromotionalMaterialModal();

      expect(scope.showPromotionalMaterialError).toBeTruthy();

    });

  });

  describe('scope.submitAddCompanyPromotionalMaterial', function () {

    it('Company Promotional Material Information should be updated if inputs in form are valid and selected Expiration Date is after today. ' +
       'Case 1: Inputs are valid and expiration date is after today.', function () {

      var myForm = {};

      scope.companyProfile = {
        'promotionalMaterial':[
          {},
          {},
          {},
          {}
        ]
      };
      myForm.$valid = true;
      var date = new Date();
      var today = date.toISOString();
      scope.showAddPromotionalMaterialDateError = null;
      scope.addPromotionalMaterialItemTitle = 'PromotionalMaterial5';
      scope.addPromotionalMaterialItemExpirationDate = new Date('2016-05-07T13:52:52.933Z');
      console.info('Selected Date: ' + scope.addPromotionalMaterialItemExpirationDate.toISOString() + ' Today Date: ' + today + ' Comparison (selected > today): ' + (scope.addPromotionalMaterialItemExpirationDate.toISOString()>today));
      scope.submitAddCompanyPromotionalMaterial(myForm);
      expect(scope.submitAddCompanyPromotionalMaterial(myForm)).toEqual(true);
    });

    it('Company Promotional Material Information should be updated if inputs in form are valid and selected Expiration Date is after today. ' +
       'Case 2: Inputs are valid and expiration date is before today.', function () {

      var myForm = {};

      scope.companyProfile = {
        'promotionalMaterial':[
          {},
          {},
          {},
          {}
        ]
      };
      myForm.$valid = true;
      var date = new Date();
      var today = date.toISOString();
      scope.showAddPromotionalMaterialDateError = null;
      scope.addPromotionalMaterialItemTitle = 'PromotionalMaterial5';
      scope.addPromotionalMaterialItemExpirationDate = new Date('2016-03-07T13:52:52.933Z');
      console.info('Selected Date: ' + scope.addPromotionalMaterialItemExpirationDate.toISOString() + ' Today Date: ' + today + ' Comparison (selected > today): ' + (scope.addPromotionalMaterialItemExpirationDate.toISOString()>today));
      scope.submitAddCompanyPromotionalMaterial(myForm);
      expect(scope.submitAddCompanyPromotionalMaterial(myForm)).toEqual(false);
    });

  });

  describe('scope.getPromotionalMaterialItem', function () {

    it('Copy a promotional material item from the list.', function () {
      var promotional = [
        {
          id: 1,
          companyName: 'IBM',
          title: 'PromotionalMaterial1',
          expirationDate: '2016-07-22T16:12:12.000Z',
          status: 'approved'
        },
        {
          id: 2,
          companyName: 'IBM',
          title: 'PromotionalMaterial2',
          expirationDate: '2016-07-22T16:12:12.000Z',
          status: 'pending'
        }
      ];

      scope.PromotionalMaterialItem = {};

      scope.getPromotionalMaterialItem(promotional[1]);
      expect(scope.PromotionalMaterialItem.companyName).toBe('IBM');
      expect(scope.PromotionalMaterialItem.title).toBe('PromotionalMaterial2');
      expect(scope.PromotionalMaterialItem.status).toBe('pending');


    });

    it('Copy a promotional material item from the list.', function () {
      var promotional = [
        {
          id: 1,
          companyName: 'Apple',
          title: 'PromotionalMaterial1',
          expirationDate: '2016-07-22T16:12:12.000Z',
          status: 'approved'
        },
        {
          id: 2,
          companyName: 'IBM',
          title: 'PromotionalMaterial2',
          expirationDate: '2016-07-22T16:12:12.000Z',
          status: 'pending'
        }
      ];
      scope.PromotionalMaterialItem = {};

      scope.getPromotionalMaterialItem(promotional[0]);
      expect(scope.PromotionalMaterialItem.companyName).not.toBe('IBM');
      expect(scope.PromotionalMaterialItem.title).not.toBe('PromotionalMaterial2');
      expect(scope.PromotionalMaterialItem.status).not.toBe('pending');
    });
  });

  describe('scope.deleteCompanyPromotionalMaterial', function () {

    it('The passed promotional material should be successfully removed if valid.', function () {

      scope.companyProfile = {
        'promotionalMaterial':[{
          id: 1,
          companyName: 'IBM',
          title: 'PromotionalMaterial1',
          expirationDate: '2016-07-22T16:12:12.000Z',
          status: 'approved'
        },
          {
            id: 2,
            companyName: 'IBM',
            title: 'PromotionalMaterial2',
            expirationDate: '2016-07-22T16:12:12.000Z',
            status: 'pending'
          }]
        };

      scope.deleteCompanyPromotionalMaterial(scope.companyProfile.promotionalMaterial[0]);

      expect(scope.companyProfile.promotionalMaterial.length).toBe(1);

    });

    it('The passed promotional material should be unsuccessfully removed if invalid.', function () {

      scope.companyProfile = {
        'promotionalMaterial':[{
          id: 1,
          companyName: 'IBM',
          title: 'PromotionalMaterial1',
          expirationDate: '2016-07-22T16:12:12.000Z',
          status: 'approved'
        },
          {
            id: 2,
            companyName: 'IBM',
            title: 'PromotionalMaterial2',
            expirationDate: '2016-07-22T16:12:12.000Z',
            status: 'pending'
          }]
        };

      scope.deleteCompanyPromotionalMaterial(
        {
          id: 6,
          companyName: 'Apple',
          title: 'PromotionalMaterial8',
          expirationDate: '2016-07-22T16:12:12.000Z',
          status: 'approved'
        });

      expect(scope.companyProfile.promotionalMaterial.length).toBe(2);

    });

  });

  //TODO:
  /*
  describe('scope.submitCompanyPromotionalMaterial', function () {

    it('Company Promotional Material Information should be updated if inputs in form are valid and selected Expiration Date is after today. ' +
      'Case 1: Inputs are valid and expiration date is after today.', function () {

    });
  });
  */

  describe('scope.deleteRecruiter', function () {

    it('The passed recruiter should be successfully removed if valid.', function () {

      scope.companyProfile = {
        'recruiterList':[{
          email: 'juanito@gmail.com',
          companyName: 'IBM',
          firstName: 'Juanito',
          lastName: 'Perez',
          phoneNumber: '787-555-5555',
          accountStatus: 'pending',
          registrationDate: '2016-03-29T01:31:59.000Z',
          companyLocation: {
            id: 4,
            companyName: 'Google',
            streetAddress: '1600 Amphitheatre Parkway',
            city: 'Mountain View',
            state: 'CA',
            country: 'United States',
            zipCode: '94043',
            phoneNumber: null
          }
        },
          {
            email: 'leonardo@ibm.com',
            companyName: 'IBM',
            firstName: 'Leonardo',
            lastName: 'Dicaprio',
            phoneNumber: '787-555-5555',
            accountStatus: 'inactive',
            registrationDate: '2016-03-29T14:51:52.000Z',
            companyLocation: {
              id: 2,
              streetAddress: '1 New Orchard Road',
              city: 'Armonk',
              state: 'NY',
              country: 'United States',
              zipCode: '10504',
              phoneNumber: null
            }
          }]
        };

      scope.deleteRecruiter(scope.companyProfile.recruiterList[0]);

      expect(scope.companyProfile.recruiterList.length).toBe(1);

    });


    it('The passed recruiter should be unsuccessfully removed if invalid.', function () {

      scope.companyProfile = {
        'recruiterList':[{
          email: 'juanito@gmail.com',
          companyName: 'IBM',
          firstName: 'Juanito',
          lastName: 'Perez',
          phoneNumber: '787-555-5555',
          accountStatus: 'pending',
          registrationDate: '2016-03-29T01:31:59.000Z',
          companyLocation: {
            id: 4,
            companyName: 'Google',
            streetAddress: '1600 Amphitheatre Parkway',
            city: 'Mountain View',
            state: 'CA',
            country: 'United States',
            zipCode: '94043',
            phoneNumber: null
          }
        },
          {
            email: 'leonardo@ibm.com',
            companyName: 'IBM',
            firstName: 'Leonardo',
            lastName: 'Dicaprio',
            phoneNumber: '787-555-5555',
            accountStatus: 'inactive',
            registrationDate: '2016-03-29T14:51:52.000Z',
            companyLocation: {
              id: 2,
              streetAddress: '1 New Orchard Road',
              city: 'Armonk',
              state: 'NY',
              country: 'United States',
              zipCode: '10504',
              phoneNumber: null
            }
          }]
        };

      scope.deleteRecruiter(
        {
          email: 'juanitoHello@gmail.com',
          companyName: 'Medtronic',
          firstName: 'Juanito',
          lastName: 'Perez',
          phoneNumber: '787-555-5555',
          accountStatus: 'pending',
          registrationDate: '2016-03-29T01:31:59.000Z',
          companyLocation: {
            id: 4,
            companyName: 'Google',
            streetAddress: '1600 Amphitheatre Parkway',
            city: 'Mountain View',
            state: 'CA',
            country: 'United States',
            zipCode: '94043',
            phoneNumber: null
          }
        });

      expect(scope.companyProfile.recruiterList.length).toBe(2);

    });
  });

  describe('scope.deleteJobOffer', function () {

    it('The passed recruiter should be successfully removed if valid.', function () {

      scope.companyProfile = {
        'jobOfferList':[{
          id: 1,
          companyName: 'IBM',
          email: 'sergio@ibm.com',
          title: 'Engineering Support Assistant',
          description: 'Job summary, consectetur adipiscing elit. Sed facilisis magna fermentum mauris posuere convallis. Sed fermentum cursus lacinia. Phasellus ac tortor massa. Mauris eget nisi blandit.',
          jobPosition: 'Full-Time',
          educationLevel: 'Bachelors',
          recentGraduate: true,
          creationDate: '2016-02-22T16:12:12.000Z',
          expirationDate: '2016-07-22T16:12:12.000Z',
          announcementNumber: 17177328217,
          flyerPath: 'documents/pdf-sample.pdf',
          jobOfferStatus: 'approved',
          location: 'Durham, NC'
        },
          {
            id: 2,
            companyName: 'IBM',
            email: 'juanito@gmail.com',
            title: 'Chief Electronics Engineer',
            description: 'Job summary, consectetur adipiscing elit. Sed facilisis magna fermentum mauris posuere convallis. Sed fermentum cursus lacinia. Phasellus ac tortor massa. Mauris eget nisi blandit.',
            jobPosition: 'Part-Time',
            educationLevel: 'Bachelors',
            recentGraduate: false,
            creationDate: '2016-02-22T16:12:12.000Z',
            expirationDate: '2016-07-22T16:12:12.000Z',
            announcementNumber: 33243554354,
            flyerPath: 'documents/pdf-sample.pdf',
            jobOfferStatus: 'pending',
            location: 'Durham, NC'
          }]
        };

      scope.deleteJobOffer(scope.companyProfile.jobOfferList[0]);

      expect(scope.companyProfile.jobOfferList.length).toBe(1);

    });


    it('The passed job offer should be unsuccessfully removed if invalid.', function () {

      scope.companyProfile = {
        'jobOfferList':[{
          id: 1,
          companyName: 'IBM',
          email: 'sergio@ibm.com',
          title: 'Engineering Support Assistant',
          description: 'Job summary, consectetur adipiscing elit. Sed facilisis magna fermentum mauris posuere convallis. Sed fermentum cursus lacinia. Phasellus ac tortor massa. Mauris eget nisi blandit.',
          jobPosition: 'Full-Time',
          educationLevel: 'Bachelors',
          recentGraduate: true,
          creationDate: '2016-02-22T16:12:12.000Z',
          expirationDate: '2016-07-22T16:12:12.000Z',
          announcementNumber: 17177328217,
          flyerPath: 'documents/pdf-sample.pdf',
          jobOfferStatus: 'approved',
          location: 'Durham, NC'
        },
          {
            id: 2,
            companyName: 'IBM',
            email: 'juanito@gmail.com',
            title: 'Chief Electronics Engineer',
            description: 'Job summary, consectetur adipiscing elit. Sed facilisis magna fermentum mauris posuere convallis. Sed fermentum cursus lacinia. Phasellus ac tortor massa. Mauris eget nisi blandit.',
            jobPosition: 'Part-Time',
            educationLevel: 'Bachelors',
            recentGraduate: false,
            creationDate: '2016-02-22T16:12:12.000Z',
            expirationDate: '2016-07-22T16:12:12.000Z',
            announcementNumber: 33243554354,
            flyerPath: 'documents/pdf-sample.pdf',
            jobOfferStatus: 'pending',
            location: 'Durham, NC'
          }]
        };

      scope.deleteJobOffer(
        {
          id: 10,
          companyName: 'Medtronic',
          email: 'sergio@ibm.com',
          title: 'Engineering Support Assistant',
          description: 'Job summary, consectetur adipiscing elit. Sed facilisis magna fermentum mauris posuere convallis. Sed fermentum cursus lacinia. Phasellus ac tortor massa. Mauris eget nisi blandit.',
          jobPosition: 'Full-Time',
          educationLevel: 'Bachelors',
          recentGraduate: true,
          creationDate: '2016-02-22T16:12:12.000Z',
          expirationDate: '2016-07-22T16:12:12.000Z',
          announcementNumber: 17177328217,
          flyerPath: 'documents/pdf-sample.pdf',
          jobOfferStatus: 'approved',
          location: 'Durham, NC'
        });
      expect(scope.companyProfile.jobOfferList.length).toBe(2);
    });
  });

  describe('scope.confirmSubmissionCampusService', function () {

    it('Should increase the size of confirmSubmissionCampusService list', function () {
      scope.companyProfile = {
        campusServiceRequests : []
      };

      scope.campusServiceEventType = 'sample event';

      scope.confirmSubmissionCampusService();
      expect(scope.companyProfile.campusServiceRequests.length).toBe(1);
    });
  });



});
