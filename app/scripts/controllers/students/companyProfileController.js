'use strict';

var app = angular.module('uprmcmsApp');

app.controller('studentCompanyCtrl', function($scope, _, Majors, JobOffers, Recruiters) {

  var majors = Majors.getAllMajors();

  var jobOffers = JobOffers.getAllJobOffers();

  var recruiters = Recruiters.getAllRecruiters();

  var companyInfo = {
    name: 'IBM',
    websiteUrl: 'http://www.ibm.com/us-en/',
    logoPath: null,
    companyDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat quis elit a vestibulum. Mauris leo sem, lacinia eu dapibus a, tempor eget metus. In vehicula maximus magna. Vestibulum pulvinar purus in tristique pellentesque. Sed porta imperdiet ultricies. Cras ac ipsum aliquam, condimentum risus non, euismod quam. Morbi posuere lobortis auctor. Aliquam massa eros, ultrices a viverra a, lacinia sed sem.',
    companyStatus: 'Active'
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
      status: 'pending'
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

  $scope.companyProfile = {
    'generalInfo':[

    ],
    'interestedMajors':[

    ],
    'promotionalMaterial':[

    ],
    'recruiterList':[

    ],
    'jobOfferList':[

    ],
    'campusServiceRequests':[

    ],
    'pendingRequests':[

    ]
  };


  var today = (new Date()).toISOString();

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
  $scope.showEditPromotionalMaterialDateError = false;

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
    if(form.$valid && $scope.PromotionalMaterialItem.expirationDate.toISOString() > today){
      var promotionalMaterialElement = _.find(this.companyProfile.promotionalMaterial, { id: $scope.PromotionalMaterialItem.id});
      _.merge(promotionalMaterialElement, $scope.PromotionalMaterialItem);
      $scope.showEditPromotionalMaterialDateError = false;
      $('#editCompanyPromotionalMaterialModal').modal('hide');
    }
    else if(($scope.PromotionalMaterialItem.expirationDate.toISOString()) <= today){
      $scope.showEditPromotionalMaterialDateError = true;
    }
  };

  //For Adding Promotional Material Modal------------------------------------------------------------
  $scope.showAddPromotionalMaterialDateError = false;

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

  var indexPromotionalMaterial = 6;

  $scope.submitAddCompanyPromotionalMaterial = function(form){
    if(form.$valid && $scope.addPromotionalMaterialItemExpirationDate.toISOString() > today){
      this.companyProfile.promotionalMaterial.push({id: indexPromotionalMaterial, title: $scope.addPromotionalMaterialItemTitle, expirationDate: $scope.addPromotionalMaterialItemExpirationDate, status: 'pending'});
      $scope.showAddPromotionalMaterialDateError = false;
      $('#addPromotionalMaterialModal').modal('hide');
      indexPromotionalMaterial++;
    }
    else if(($scope.addPromotionalMaterialItemExpirationDate.toISOString()) <= today){
      $scope.showAddPromotionalMaterialDateError = true;
    }
  };

  //For Deleting Recruiters------------------------------------------------------------

  for (i = 0; i < recruiters.length; i++) {
    $scope.companyProfile.recruiterList.push(recruiters[i]);
  }

  $scope.deleteRecruiter = function(item){
    _.remove(this.companyProfile.recruiterList, function(element) {
      return element.email === item.email;
    });
  };

  //For Viewing and deleting Job Offers------------------------------------------------------------
  for (i = 0; i < jobOffers.length; i++) {
    $scope.companyProfile.jobOfferList.push(jobOffers[i]);
  }

  $scope.deleteJobOffer = function(item){
    _.remove(this.companyProfile.jobOfferList, function(element) {
      return element.id === item.id;
    });
  };
  //For adding Job Offers------------------------------------------------------------

  $scope.showJobOfferDateError = false;

  $('#addjobOfferExpirationDatePicker').datepicker({
    format: 'yyyy-mm-dd'
  });

  var indexJobOffers = 20;

  $scope.submitAddCompanyJobOffer = function(form){
    if(form.$valid && $scope.addJobOfferExpirationDate.toISOString() > today){
      this.companyProfile.jobOfferList.push({id:indexJobOffers, title: $scope.addJobOfferTitle, description: $scope.addJobOfferDescription, recentGraduate: $scope.addJobOfferRecentGraduateOption, jobPosition: $scope.addJobOfferPosition, educationLevel: $scope.addJobOfferEducationalLevel, announcementNumber: $scope.addJobOfferAnnouncementNumber, location: $scope.addJobOfferLocation, expirationDate: $scope.addJobOfferExpirationDate.toISOString(), creationDate: today, jobOfferStatus: 'pending', flyerPath: null});
      $scope.showJobOfferDateError = false;
      $('#addJobOfferModal').modal('hide');
      indexJobOffers++;
    }
    else if(($scope.addJobOfferExpirationDate.toISOString()) <= today){
      $scope.showJobOfferDateError = true;
    }
  };

  //Requesting an on Campus Service------------------------------------------------------------
  $scope.showCampusServiceDateError=false;

  $('#requestCampusServiceDatePicker').datepicker({
    format: 'yyyy-mm-dd'
  });

  var indexCampusService = 0;

  $scope.submitCampusService = function(form){
    if(form.$valid && $scope.campusServiceDate.toISOString() > today){
      $('#confirmCampusServiceRequest').modal('show');
      $scope.showCampusServiceDateError=false;
    }
    else if(($scope.campusServiceDate.toISOString()) <= today){
      $scope.showCampusServiceDateError=true;
    }
  };

  $scope.confirmSubmissionCampusService = function(){
    this.companyProfile.campusServiceRequests.push({id: indexCampusService, eventType: $scope.campusServiceEventType, otherEventDescription: $scope.otherTypeOfEvent, eventDate: $scope.campusServiceDate, eventHour: $scope.campusServiceHour, eventCapacity: $scope.campusServiceCapacity, eventAdditionalInformation: $scope.campusServiceAdditionalInformation});
    indexCampusService++;
    $('#confirmCampusServiceRequest').modal('hide');
  };

  //For Pending Requests Tab------------------------------------------------------------
  $scope.indexPendingRequests = 0;

  for (i = 0; i < $scope.companyProfile.jobOfferList.length; i++) {
    if ($scope.companyProfile.jobOfferList[i].jobOfferStatus==='pending'){
      $scope.indexPendingRequests++;
      $scope.companyProfile.pendingRequests.push({id: $scope.indexPendingRequests, name: 'Job Offer: ' + $scope.companyProfile.jobOfferList[i].title, status: 'pending'});
    }
  }

  for (i = 0; i < $scope.companyProfile.promotionalMaterial.length; i++) {
    if ($scope.companyProfile.promotionalMaterial[i].status==='pending'){
      $scope.indexPendingRequests++;
      $scope.companyProfile.pendingRequests.push({id: $scope.indexPendingRequests, name: 'Promotional Material: ' +  $scope.companyProfile.promotionalMaterial[i].title, status: 'pending'});
    }
  }

  //For Account Settings Tab------------------------------------------------------------
  $scope.recruiterLoggedIn = 'sergio@ibm.com';
  $scope.recruiterLoggedInItem = {};

  for (i = 0; i < $scope.companyProfile.recruiterList.length; i++) {
    if ($scope.companyProfile.recruiterList[i].email === 'sergio@ibm.com'){
      $scope.recruiterLoggedInItem = angular.copy($scope.companyProfile.recruiterList[i]);
    }
  }

  $scope.submitAccountSettingsChanges = function(){
    var recruiterLoggedInElement = _.find($scope.companyProfile.recruiterList, { email: $scope.recruiterLoggedInItem.email});
    _.merge(recruiterLoggedInElement, $scope.recruiterLoggedInItem);
    $('#confirmAccountSettingsChangesModal').modal('hide');
  };

  $scope.confirmAccountSettingsChanges  = function(form){
    if(form.$valid){
      $('#confirmAccountSettingsChangesModal').modal('show');
    }
  };

});
