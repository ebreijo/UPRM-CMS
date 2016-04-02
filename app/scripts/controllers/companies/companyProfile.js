'use strict';

var app = angular.module('uprmcmsApp');

//app.controller('AboutUsCtrl', function($scope, aboutUs) {
//$scope.aboutUs = aboutUs.aboutUsInfo;
app.controller('CompanyCtrl', function($scope, _) {

  var majors = [
    {
      'majorCode': 'CCOM'
    },
    {
      'majorCode': 'ICOM'
    },
    {
      'majorCode': 'INSO'
    },
    {
      'majorCode': 'INME'
    },
    {
      'majorCode': 'INEL'
    }
  ];

  var recruiters = [
    {
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
      accountStatus: 'active',
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
    },
    {
      email: 'sergio@ibm.com',
      companyName: 'IBM',
      firstName: 'Sergio',
      lastName: 'Rivera',
      phoneNumber: '787-555-5555',
      accountStatus: 'active',
      registrationDate: '2016-03-29T14:51:52.000Z',
      companyLocation: {
        id: 1,
        streetAddress: '3039 E Cornwallis Road',
        city: 'Durham',
        state: 'NC',
        country: 'United States',
        zipCode: '27709',
        phoneNumber: null
      }
    }
  ];

  var companyInfo = {
    name: 'IBM',
    websiteUrl: 'http://www.ibm.com/us-en/',
    logoPath: null,
    companyDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat quis elit a vestibulum. Mauris leo sem, lacinia eu dapibus a, tempor eget metus. In vehicula maximus magna. Vestibulum pulvinar purus in tristique pellentesque. Sed porta imperdiet ultricies. Cras ac ipsum aliquam, condimentum risus non, euismod quam. Morbi posuere lobortis auctor. Aliquam massa eros, ultrices a viverra a, lacinia sed sem.',
    companyStatus: 'Active'
  };

  $scope.companyProfile = {
    'generalInfo':[

    ],
    'interestedMajors':[

    ],
    'promotionalMaterial':[

    ],
    'recruiterList':[

    ],
    'requestsInfo':[
      {

      }
    ]
  };

  var promotionalMaterial = [
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
      status: 'approved'
    },
    {
      id: 3,
      companyName: 'IBM',
      title: 'PromotionalMaterial3',
      expirationDate: '2016-07-22T16:12:12.000Z',
      status: 'approved'
    },
    {
      id: 4,
      companyName: 'IBM',
      title: 'PromotionalMaterial4',
      expirationDate: '2016-07-22T16:12:12.000Z',
      status: 'approved'
    }
  ];

  //For Edit Company Description Modal------------------------------------------------------------

  $scope.CompanyDescriptionItem = {};

  $scope.companyProfile.generalInfo.push({name: companyInfo.name, websiteUrl: companyInfo.websiteUrl, logoPath: companyInfo.logoPath, companyDescription: companyInfo.companyDescription, companyStatus: companyInfo.companyStatus});

  $scope.getCompanyDescriptionItem = function(item) {
    $scope.CompanyDescriptionItem = angular.copy(item);
  };

  $scope.submitCompanyDescription = function(form){
    if(form.$valid){
      $scope.companyProfile.generalInfo[0].websiteUrl = $scope.CompanyDescriptionItem.websiteUrl;
      $scope.companyProfile.generalInfo[0].companyDescription = $scope.CompanyDescriptionItem.companyDescription;
      $('#editCompanyDescriptionModal').modal('hide');
    }
  };

  //For Edit Interested Majors Modal------------------------------------------------------------

  $scope.majorList = [];

  for (var i = 0; i < majors.length; i++) {
    $scope.majorList.push({name: majors[i].majorCode, value: false});
  }

  $scope.addMajors = function() {
    angular.forEach($scope.majorList, function (item) {
      if (item.value === true && (contains(item.name, $scope.companyProfile.interestedMajors) === false)){
        $scope.companyProfile.interestedMajors.push({name: item.name, value: false});
      }
    });
    updateLists($scope.majorList, $scope.companyProfile.interestedMajors);
  };

  $scope.removeMajors = function() {
    angular.forEach($scope.companyProfile.interestedMajors, function (item) {
      if (item.value === true && (contains(item.name, $scope.majorList) === false)){
        $scope.majorList.push({name: item.name, value: false});
      }
    });
    updateLists($scope.companyProfile.interestedMajors, $scope.majorList);
  };

  var updateLists = function(list1, list2) {
    var tempList = [];
    angular.forEach(list1, function(item) {
      if(!contains(item.name, list2)){
        tempList.push(item);
      }
    });
    clearList(list1);
    angular.forEach(tempList, function(item) {
      list1.push(item);
    });
  };

  var contains = function(element, list){
    for (var i = 0; i < list.length; i++) {
      if (list[i].name === element){
        return true;
      }
    }
    return false;
  };

  var clearList = function(list) {
    while(list.length > 0){
      list.pop();
    }
  };


  //For Edit Promotional Material Modal------------------------------------------------------------

  $('#editPromotionalDocumentExpirationDatePicker').datepicker({
    format: 'yyyy-mm-dd'
  });

  $scope.PromotionalMaterialItem = {};
  $scope.addPromotionalMaterialItemTitle = null;
  $scope.addPromotionalMaterialItemExpirationDate = null;
  $scope.showPromotionalMaterialError = false;

  for (i = 0; i < promotionalMaterial.length; i++) {
    $scope.companyProfile.promotionalMaterial.push({id: promotionalMaterial[i].id, title: promotionalMaterial[i].title, expirationDate: promotionalMaterial[i].expirationDate, status: promotionalMaterial[i].status});
  }

  $scope.getPromotionalMaterialItem = function(item) {
    $scope.PromotionalMaterialItem = angular.copy(item);
  };

  $scope.deleteCompanyPromotionalMaterial = function(item){
    _.remove(this.companyProfile.promotionalMaterial, function(element) {
      return element.id === item.id;
    });
  };

  $scope.submitCompanyPromotionalMaterial = function(form){
    if(form.$valid){
      var promotionalMaterialElement = _.find(this.companyProfile.promotionalMaterial, { id: $scope.PromotionalMaterialItem.id});
      _.merge(promotionalMaterialElement, $scope.PromotionalMaterialItem);
      $('#editCompanyPromotionalMaterialModal').modal('hide');
    }
  };

  //For Adding Promotional Material Modal------------------------------------------------------------

  $('#addPromotionalDocumentExpirationDatePicker').datepicker({
    format: 'yyyy-mm-dd'
  });

  $scope.openAddCompanyPromotionalMaterialModal = function(){
    if($scope.companyProfile.promotionalMaterial.length < 5){
      $('#addPromotionalMaterialModal').modal('show');
      $scope.showPromotionalMaterialError = false;

    }
    else if ($scope.companyProfile.promotionalMaterial.length >= 5){
      $scope.showPromotionalMaterialError = true;
    }
  };

  var index = 6;

  $scope.submitAddCompanyPromotionalMaterial = function(form){
    if(form.$valid){
      this.companyProfile.promotionalMaterial.push({id: index, title: $scope.addPromotionalMaterialItemTitle, expirationDate: $scope.addPromotionalMaterialItemExpirationDate, status: 'pending'});
      $('#addPromotionalMaterialModal').modal('hide');
      index++;
    }
  };

  //For Deleting Recruiters------------------------------------------------------------

  $scope.recruiterItem = {};

  for (i = 0; i < recruiters.length; i++) {
    $scope.companyProfile.recruiterList.push(recruiters[i]);
  }

  $scope.deleteRecruiter = function(item){
    _.remove(this.companyProfile.recruiterList, function(element) {
      return element.email === item.email;
    });
  };

});
