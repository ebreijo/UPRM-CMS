'use strict';

var app = angular.module('uprmcmsApp');

app.controller('CompanyCtrl', function($scope, $state, $stateParams, $timeout, _, Majors, Companies, PromotionalMaterial, Recruiters, JobOffers) {

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


  //---------------------------------------Execute Tab 1---------------------------------------------
  $scope.executeTab1 = function() {

    var companyInfo = {};

    Companies.getCompanyGeneralInformation($scope.getCurrentUser().companyName).then(function() {
      companyInfo = Companies.companyGeneralInfo;
      $scope.companyProfile.generalInfo.push({name: companyInfo.name, websiteUrl: companyInfo.websiteUrl, logoPath: companyInfo.logoPath, companyDescription: companyInfo.companyDescription, companyStatus: companyInfo.companyStatus});
    });

  };
  //---------------------------------------End Tab 1---------------------------------------------

  $scope.executeTab1();
  //For Edit Company Description Modal------------------------------------------------------

  $scope.CompanyDescriptionItem = {};

  $scope.getCompanyDescriptionItem = function(item) {
    $scope.CompanyDescriptionItem = angular.copy(item);
  };

  $scope.submitCompanyDescription = function(form){
    if(form.$valid){
      Companies.updateCompanyGeneralInformation($scope.CompanyDescriptionItem, $scope.getCurrentUser().companyName);
      $scope.getCurrentUser().companyName = $scope.CompanyDescriptionItem.name;
      $('#editCompanyDescriptionModal').modal('hide');
      $('#editCompanyDescriptionModal').on('hidden.bs.modal', function () {
        $state.transitionTo($state.current, $stateParams, {
          reload: true,
          inherit: false,
          notify: true
        });
      });
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
      $scope.companyProfile.interestedMajors.push({id: item.id, companyName: item.companyName, name: item.majorCode, value: false});
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
    var interestedMajorList = {
      interestedMajors: []
    };
    angular.forEach($scope.majorList, function (item){
      if(item.value === true){
        interestedMajorList.interestedMajors.push({majorCode: item.name});
      }
    });

    Majors.addCompanyInterestedMajors(interestedMajorList, $scope.getCurrentUser().companyName);

    angular.forEach($scope.majorList, function (item) {
      if (item.value === true && (contains(item.name, $scope.companyProfile.interestedMajors) === false)){
        $scope.companyProfile.interestedMajors.push({name: item.name, value: false});
      }
    });
    updateLists($scope.majorList, $scope.companyProfile.interestedMajors);
  };

  $scope.removeMajors = function() {
    var listMajors = {
      interestedMajors: []
    };
    angular.forEach($scope.companyProfile.interestedMajors, function (item){
      if(item.value === true){
        listMajors.interestedMajors.push({majorCode: item.name});
      }
    });

    Majors.removeCompanyInterestedMajors(listMajors, $scope.getCurrentUser().companyName);

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

  PromotionalMaterial.getApprovedPromotionalMaterialPerCompany($scope.getCurrentUser().companyName).then(function() {
    promotionalMaterial = PromotionalMaterial.approvedCompanyPromotionalMaterial;

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

    PromotionalMaterial.removePromotionalMaterialPerCompany($scope.getCurrentUser().companyName, item.id);

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
      //PromotionalMaterial.addPromotionalMaterialPerCompany(interestedMajorList, $scope.getCurrentUser().companyName).then(function(newPromotionalMaterial){

     // });
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
  $scope.recruiterLoggedInItem = {};


  Recruiters.getRecruitersPerCompany($scope.getCurrentUser().companyName).then(function() {
    recruiters = Recruiters.companyRecruiters;

    for (var i = 0; i < recruiters.length; i++) {
      $scope.companyProfile.recruiterList.push(recruiters[i]);
      if (recruiters[i].email === $scope.getCurrentUser().email){
        $scope.recruiterLoggedInItem = angular.copy(recruiters[i]);
      }
    }
  });

  $scope.deleteRecruiter = function(item){
    _.remove(this.companyProfile.recruiterList, function(element) {
      return element.email === item.email;
    });
  };

  //For Viewing and deleting Job Offers------------------------------------------------------------
  var jobOffers = [];

  JobOffers.getApprovedJobOffersPerCompany($scope.getCurrentUser().companyName).then(function() {
    jobOffers = JobOffers.approvedCompanyJobOffers;

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
  $scope.indexPendingRequests = 1;
  var pendingPromotionalMaterial = [];
  var pendingJobOffers = [];


  PromotionalMaterial.getPendingPromotionalMaterialPerCompany($scope.getCurrentUser().companyName).then(function() {
    pendingPromotionalMaterial = PromotionalMaterial.pendingCompanyPromotionalMaterial;
    for (var i = 0; i < pendingPromotionalMaterial.length; i++) {
      $scope.companyProfile.pendingRequests.push({id: $scope.companyProfile.pendingRequests.length+1, name: 'Promotional Material: ' +  pendingPromotionalMaterial[i].title, status: 'pending'});
    }
  });

  JobOffers.getPendingJobOffersPerCompany($scope.getCurrentUser().companyName).then(function() {
    pendingJobOffers = JobOffers.pendingCompanyJobOffers;

    for (var i = 0; i < pendingJobOffers.length; i++) {
      $scope.companyProfile.pendingRequests.push({id: $scope.companyProfile.pendingRequests.length+1, name: 'Job Offer: ' + pendingJobOffers[i].title, status: 'pending'});
      $scope.indexPendingRequests++;
    }
  });

  //For Account Settings Tab------------------------------------------------------------
  $scope.recruiterLoggedIn = $scope.getCurrentUser().email;
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

  // For File Uploads -------------------------------------------------------------------
  /* jshint ignore:start */
  $scope.updateLogoConfig = {
    'options': { // passed into the Dropzone constructor
      'url': '/api/companies/logos',
      'paramName': 'image',     // The name that will be used to transfer the file
      'maxFilesize': 2, // in MBs
      'maxFiles': 1,
      'acceptedFiles': 'image/jpeg,image/png',
      'createImageThumbnails': false
    },
    'eventHandlers': {
      'sending': function (file, xhr, formData) {
        console.log('Sending!!!!');
      },
      'success': function (file, response) {
        console.log('Success!!!!');
        this.removeAllFiles();
        Companies.updateCompanyGeneralInformation({"logoPath": response.filePath}, $scope.getCurrentUser().companyName);
        $scope.companyProfile.generalInfo[0].logoPath = response.filePath;
      },
      'error': function(file, response) {
        this.removeAllFiles();
        alert('ERROR: File Too Large!');
      }
    }
  };
  /* jshint ignore:end */

  $scope.promoMaterialFilePath = '';
  $scope.resetDocument = function(){
    console.log('before being called: ' + $scope.promoMaterialFilePath);
    $scope.promoMaterialFilePath = '';
    console.log('after being called: ' + $scope.promoMaterialFilePath);
  };

  /* jshint ignore:start */
  $scope.updatePromotionalMaterialConfig = {
    'options': { // passed into the Dropzone constructor
      'url': '/api/companies/promotionalMaterial/upload',
      'paramName': 'image',     // The name that will be used to transfer the file
      'maxFilesize': 5, // in MBs
      'maxFiles': 1,
      'acceptedFiles': 'application/pdf',
      'createImageThumbnails': false
    },
    'eventHandlers': {
      'sending': function (file, xhr, formData) {
        console.log('Sending!!!!');
      },
      'success': function (file, response) {
        console.log('Success!!!!');
        this.removeAllFiles();
        $scope.promoMaterialFilePath = response.filePath;
      },
      'error': function(file, response) {
        this.removeAllFiles();
        alert('ERROR: File Too Large!');
      }
    }
  };
  /* jshint ignore:end */


});
