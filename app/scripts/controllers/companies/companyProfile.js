'use strict';

var app = angular.module('uprmcmsApp');

app.controller('CompanyCtrl', function($scope, _, FileUpload, Majors, Companies, PromotionalMaterial, Recruiters, JobOffers) {

  $scope.jobOfferUploadConfig = FileUpload.fileUploadConfig('/api/companies/jobOffers', 'image', 10);
  $scope.promotionalMaterialUploadConfig = FileUpload.fileUploadConfig('/api/companies/promotionalMaterial/upload', 'image', 10);

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
  var companyInfo = {};
  Companies.getCompanyGeneralInformation($scope.getCurrentUser().companyName).then(function() {
    companyInfo = Companies.companyGeneralInfo;
    $scope.companyProfile.generalInfo.push({name: companyInfo.name, websiteUrl: companyInfo.websiteUrl, logoPath: companyInfo.logoPath, companyDescription: companyInfo.companyDescription, companyStatus: companyInfo.companyStatus});

  });

  $scope.CompanyDescriptionItem = {};

  //$scope.companyProfile.generalInfo.push({name: companyInfo.name, websiteUrl: companyInfo.websiteUrl, logoPath: companyInfo.logoPath, companyDescription: companyInfo.companyDescription, companyStatus: companyInfo.companyStatus});

  $scope.getCompanyDescriptionItem = function(item) {
    $scope.CompanyDescriptionItem = angular.copy(item);
  };

  $scope.submitCompanyDescription = function(form){
    if(form.$valid){
      $scope.companyProfile.generalInfo[0].websiteUrl = $scope.CompanyDescriptionItem.websiteUrl;
      $scope.companyProfile.generalInfo[0].companyDescription = $scope.CompanyDescriptionItem.companyDescription;
      $('#editCompanyDescriptionModal').modal('hide');
      //Jasmine Test
      return true;
    }
    //Jasmine Test
    return false;
  };

  //For Edit Interested Majors Modal------------------------------------------------------------

  var majors = Majors.majors;

  Majors.getInterestedMajorsPerCompany($scope.getCurrentUser().companyName).then(function(interestedMajors) {
    console.log('current company name is: ' + $scope.getCurrentUser().companyName);
    angular.forEach(interestedMajors.plain(), function (item) {
      $scope.companyProfile.interestedMajors.push({name: item.majorCode, value: false});
    });

    angular.forEach(majors, function(item) {
      if(!contains(item.majorCode, $scope.companyProfile.interestedMajors)){
        $scope.majorList.push({name: item.majorCode, value: false});
      }
    });
  });

  $scope.majorList = [];

  var contains = function(element, list){
    for (var i = 0; i < list.length; i++) {
      if (list[i].name === element){
        return true;
      }
    }
    return false;
  };

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


  var clearList = function(list) {
    while(list.length > 0){
      list.pop();
    }
  };

  //For Edit Promotional Material Modal------------------------------------------------------------

  $('#editPromotionalDocumentExpirationDatePicker').datepicker({
    format: 'yyyy-mm-dd'
  });

  var promotionalMaterial = [];

  PromotionalMaterial.getPromotionalMaterialPerCompany($scope.getCurrentUser().companyName).then(function() {
    promotionalMaterial = PromotionalMaterial.companyPromotionalMaterial;

    for (var i = 0; i < promotionalMaterial.length; i++) {
      $scope.companyProfile.promotionalMaterial.push({id: promotionalMaterial[i].id, title: promotionalMaterial[i].title, expirationDate: promotionalMaterial[i].expirationDate, status: promotionalMaterial[i].status});
    }
  });

  $scope.PromotionalMaterialItem = {};
  $scope.addPromotionalMaterialItemTitle = null;
  $scope.addPromotionalMaterialItemExpirationDate = null;
  $scope.showPromotionalMaterialError = false;
  $scope.showEditPromotionalMaterialDateError = false;



  $scope.getPromotionalMaterialItem = function(item) {
    $scope.PromotionalMaterialItem = angular.copy(item);
  };

  $scope.deleteCompanyPromotionalMaterial = function(item){
    _.remove(this.companyProfile.promotionalMaterial, function(element) {
      return element.id === item.id;
    });
  };
  // TODO
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
      //Jasmine Test
      return true;
    }
    else if(($scope.addPromotionalMaterialItemExpirationDate.toISOString()) <= today){
      $scope.showAddPromotionalMaterialDateError = true;
      //Jasmine Test
      return false;
    }
  };

  //For Deleting Recruiters------------------------------------------------------------

  var recruiters = [];

  Recruiters.getRecruitersPerCompany($scope.getCurrentUser().companyName).then(function() {
    recruiters = Recruiters.companyRecruiters;

    for (var i = 0; i < recruiters.length; i++) {
      $scope.companyProfile.recruiterList.push(recruiters[i]);
    }
  });

  $scope.deleteRecruiter = function(item){
    _.remove(this.companyProfile.recruiterList, function(element) {
      return element.email === item.email;
    });
  };

  //For Viewing and deleting Job Offers------------------------------------------------------------
  var jobOffers = [];

  JobOffers.getJobOffersPerCompany($scope.getCurrentUser().companyName).then(function() {
    jobOffers = JobOffers.companyJobOffers;

    for (var i = 0; i < jobOffers.length; i++) {
      $scope.companyProfile.jobOfferList.push(jobOffers[i]);
    }
  });

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
  // TODO
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
  // TODO
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

  for (var i = 0; i < $scope.companyProfile.jobOfferList.length; i++) {
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
  $scope.recruiterLoggedIn = $scope.getCurrentUser().email;
  $scope.recruiterLoggedInItem = {};

  for (i = 0; i < $scope.companyProfile.recruiterList.length; i++) {
    if ($scope.companyProfile.recruiterList[i].email === $scope.getCurrentUser().email){
      $scope.recruiterLoggedInItem = angular.copy($scope.companyProfile.recruiterList[i]);
    }
  }
  // TODO
  $scope.submitAccountSettingsChanges = function(){
    var recruiterLoggedInElement = _.find($scope.companyProfile.recruiterList, { email: $scope.recruiterLoggedInItem.email});
    _.merge(recruiterLoggedInElement, $scope.recruiterLoggedInItem);
    $('#confirmAccountSettingsChangesModal').modal('hide');
  };
  // TODO
  $scope.confirmAccountSettingsChanges  = function(form){
    if(form.$valid){
      $('#confirmAccountSettingsChangesModal').modal('show');
      //Jasmine Test
      return true;
    }
    //Jasmine Test
    return false;
  };

});
