'use strict';

var app = angular.module('uprmcmsApp');

app.controller('CompanyCtrl', function($scope, $state, $stateParams, $timeout, _, Majors, Companies, PromotionalMaterial, Recruiters, JobOffers, cfpLoadingBar, $sessionStorage) {

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


  //---------------------------------------Execute Tab 1---------------------------------------------
  $scope.executeTab1 = function() {

    var companyInfo = {};

    Companies.getCompanyGeneralInformation($scope.getCurrentUser().companyName).then(function() {
      companyInfo = Companies.companyGeneralInfo;
      $scope.companyProfile.generalInfo.push({name: companyInfo.name, websiteUrl: companyInfo.websiteUrl, logoPath: companyInfo.logoPath, companyDescription: companyInfo.companyDescription, companyStatus: companyInfo.companyStatus});
    });

    //For Edit Company Description Modal------------------------------------------------------

    $scope.CompanyDescriptionItem = {};

    $scope.getCompanyDescriptionItem = function(item) {
      $scope.CompanyDescriptionItem = angular.copy(item);
    };

    $scope.submitCompanyDescription = function(form){
      if(form.$valid){
        Companies.updateCompanyGeneralInformation($scope.CompanyDescriptionItem, $scope.getCurrentUser().companyName).then(function() {
          $scope.getCurrentUser().companyName = $scope.CompanyDescriptionItem.name;
          _.merge($scope.companyProfile.generalInfo[0], $scope.CompanyDescriptionItem);
          $('#editCompanyDescriptionModal').modal('hide');
        });
        //Jasmine Test
        return true;
      }
      //Jasmine Test
      return false;
    };

  };

  $scope.executeTab1();
  //---------------------------------------End Tab 1---------------------------------------------

  //For Edit Interested Majors Modal------------------------------------------------------------

  var majors = Majors.majors;

  Majors.getInterestedMajorsPerCompany($scope.getCurrentUser().companyName).then(function(interestedMajors) {
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
    format: 'yyyy-mm-dd',
    autoclose: true
  });

  var promotionalMaterial = [];
  $sessionStorage.promotionalMaterialCounter = 0;

  PromotionalMaterial.getApprovedPromotionalMaterialPerCompany($scope.getCurrentUser().companyName).then(function() {
    promotionalMaterial = PromotionalMaterial.approvedCompanyPromotionalMaterial;
    $sessionStorage.promotionalMaterialCounter = promotionalMaterial.length;

    for (var i = 0; i < promotionalMaterial.length; i++) {
      $scope.companyProfile.promotionalMaterial.push(
        {
          id: promotionalMaterial[i].id,
          title: promotionalMaterial[i].title,
          expirationDate: promotionalMaterial[i].expirationDate,
          status: promotionalMaterial[i].status,
          filePath: promotionalMaterial[i].filePath
        });
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

  $scope.deleteCompanyPromotionalMaterial = function(form){
    if (form.$valid) {
      PromotionalMaterial.removePromotionalMaterialPerCompany($scope.getCurrentUser().companyName, $scope.PromotionalMaterialItem.id).then(function() {
        _.remove($scope.companyProfile.promotionalMaterial, {id: $scope.PromotionalMaterialItem.id});
        $sessionStorage.promotionalMaterialCounter -= 1;
        $('#deletePromotionalMaterialConfirmModal').modal('hide');
      });
    }
  };

  $scope.submitCompanyPromotionalMaterial = function(form){
    if(form.$valid && $scope.PromotionalMaterialItem.expirationDate.toISOString() > (new Date()).toISOString()){
      $scope.showEditPromotionalMaterialDateError = false;
      PromotionalMaterial.updatePromotionalMaterialPerCompany($scope.getCurrentUser().companyName, {
        title: $scope.PromotionalMaterialItem.title,
        expirationDate: $scope.PromotionalMaterialItem.expirationDate
      }, $scope.PromotionalMaterialItem.id).then(function() {
        var element = _.find($scope.companyProfile.promotionalMaterial, {id: $scope.PromotionalMaterialItem.id});
        _.merge(element, $scope.PromotionalMaterialItem);
        $('#editCompanyPromotionalMaterialModal').modal('hide');
      });
    }
    else if(($scope.PromotionalMaterialItem.expirationDate.toISOString()) <= (new Date()).toISOString()){
      $scope.showEditPromotionalMaterialDateError = true;
    }
  };

  //For Adding Promotional Material Modal------------------------------------------------------------
  $scope.showAddPromotionalMaterialDateError = false;

  $('#addPromotionalDocumentExpirationDatePicker').datepicker({
    format: 'yyyy-mm-dd',
    autoclose: true
  });

  $scope.openAddCompanyPromotionalMaterialModal = function(){
    if($sessionStorage.promotionalMaterialCounter < 5){
      $('#addPromotionalMaterialModal').modal('show');
      $scope.showPromotionalMaterialError = false;

    }
    else if ($sessionStorage.promotionalMaterialCounter >= 5){
      $scope.showPromotionalMaterialError = true;
    }
  };

  $scope.submitAddCompanyPromotionalMaterial = function(form){
    if(form.$valid && $scope.addPromotionalMaterialItemExpirationDate.toISOString() > (new Date()).toISOString()){
      $scope.showAddPromotionalMaterialDateError = false;
      // if promotional material was selected, upload here.
      if($('#promotionalMaterialUpload').get(0).dropzone.files.length > 0){
        cfpLoadingBar.start();
        $('#promotionalMaterialUpload').get(0).dropzone.processQueue();
      }

      //Jasmine Test
      return true;
    }
    else if(($scope.addPromotionalMaterialItemExpirationDate.toISOString()) <= (new Date()).toISOString()){
      $scope.showAddPromotionalMaterialDateError = true;
      //Jasmine Test
      return false;
    }
  };

  $scope.submitPromotionalMaterialData = function(form) {
    if (form.$valid) {
      var newPromotionalMaterial = {
        title: $scope.addPromotionalMaterialItemTitle,
        expirationDate: $scope.addPromotionalMaterialItemExpirationDate,
        filePath : $scope.promoMaterialFilePath
      };

      PromotionalMaterial.addPromotionalMaterialPerCompany($scope.getCurrentUser().companyName, newPromotionalMaterial).then(function() {
        $scope.companyProfile.pendingRequests.push({id: $scope.companyProfile.pendingRequests.length+1, name: 'Promotional Material: ' +  newPromotionalMaterial.title, status: 'pending'});
        $sessionStorage.promotionalMaterialCounter += 1;
        $scope.addPromotionalMaterialItemTitle = null;
        $scope.addPromotionalMaterialItemExpirationDate = null;
        $scope.promoMaterialFilePath = null;
        form.$setPristine();
        $('#addPromotionalMaterialModal').modal('hide');
      });
    }
  };

  $scope.executeTab2 = function() {
    //For Deleting Recruiters------------------------------------------------------------

    Recruiters.getRecruitersPerCompany($scope.getCurrentUser().companyName).then(function() {
      $scope.companyProfile.recruiterList = Recruiters.companyRecruiters;
    });

    $scope.confirmRecruiter = function(item) {
      $scope.tempRecruiter = angular.copy(item);
    };

    $scope.deleteRecruiter = function() {
      Recruiters.removeRecruitersPerCompany($scope.getCurrentUser().companyName, {
        'email': $scope.tempRecruiter.email,
        'accountStatus': 'inactive'
      }).then(function() {
        _.remove($scope.companyProfile.recruiterList, function(element) {
          return element.email === $scope.tempRecruiter.email;
        });
        $('#deleteRecruiterConfirmModal').modal('hide');
      });

    };
  };

  $('#addjobOfferExpirationDatePicker').datepicker({
    format: 'yyyy-mm-dd',
    autoclose: true
  });

  $scope.executeTab3 = function() {
    //For Viewing and deleting Job Offers------------------------------------------------------------

    JobOffers.getApprovedJobOffersPerCompany($scope.getCurrentUser().companyName).then(function() {
      $scope.companyProfile.jobOfferList = JobOffers.approvedCompanyJobOffers;
    });

    $scope.confirmJobOffer = function(item) {
      $scope.tempJobOffer = angular.copy(item);
    };

    $scope.deleteJobOffer = function() {
      JobOffers.removeJobOffersPerCompany($scope.getCurrentUser().companyName, $scope.tempJobOffer.id, {'jobOfferStatus': 'rejected'});
      _.remove(this.companyProfile.jobOfferList, function(element) {
        return element.id === $scope.tempJobOffer.id;
      });
      $('#confirmDeleteJobOfferModal').modal('hide');
    };
    //For adding Job Offers------------------------------------------------------------

    $scope.showJobOfferDateError = false;

    $scope.submitAddCompanyJobOffer = function(form){
      if(form.$valid && $scope.addJobOfferExpirationDate.toISOString() > (new Date()).toISOString()) {
        // if job offer was selected, upload here.
        if($('#jobOfferUpload').get(0).dropzone.files.length > 0){
          cfpLoadingBar.start();
          $('#jobOfferUpload').get(0).dropzone.processQueue();
        } else {
          $scope.submitCompanyJobOfferData(form);
        }
      }
      else if(($scope.addJobOfferExpirationDate.toISOString()) <= (new Date()).toISOString()){
        $scope.showJobOfferDateError = true;
      }
    };

    $scope.submitCompanyJobOfferData = function(form) {
      if (form.$valid) {
        var newJobOffer = {
          'email': $scope.getCurrentUser().email,
          'title': $scope.addJobOfferTitle,
          'description': $scope.addJobOfferDescription,
          'jobPosition': $scope.addJobOfferPosition,
          'educationLevel': $scope.addJobOfferEducationalLevel,
          'recentGraduate': $scope.addJobOfferRecentGraduateOption,
          'creationDate': new Date(),
          'expirationDate': $scope.addJobOfferExpirationDate,
          'announcementNumber': $scope.addJobOfferAnnouncementNumber,
          'flyerPath': $scope.jobofferFilePath,
          'location': $scope.addJobOfferLocation
        };

        JobOffers.addJobOffersPerCompany($scope.getCurrentUser().companyName, newJobOffer).then(function() {
          $scope.companyProfile.pendingRequests.push({id: $scope.companyProfile.pendingRequests.length+1, name: 'Job Offer: ' + newJobOffer.title, status: 'pending'});
          $scope.addJobOfferTitle = null;
          $scope.addJobOfferDescription = null;
          $scope.addJobOfferPosition = null;
          $scope.addJobOfferEducationalLevel = null;
          $scope.addJobOfferRecentGraduateOption = false;
          $scope.addJobOfferExpirationDate = null;
          $scope.addJobOfferAnnouncementNumber = null;
          $scope.addJobOfferLocation = null;
          $scope.jobofferFilePath = null;
          form.$setPristine();
          $scope.showJobOfferDateError = false;
          $('#addJobOfferModal').modal('hide');
        });
      }
    };

  };

  //Requesting an on Campus Service------------------------------------------------------------
  $scope.showCampusServiceDateError=false;

  $('#requestCampusServiceDatePicker').datepicker({
    format: 'yyyy-mm-dd',
    autoclose: true
  });

  $scope.submitCampusService = function(form) {
    if(form.$valid && (new Date($scope.onCampusService.date) > (new Date()))) {
      $('#confirmCampusServiceRequest').modal('show');
      $scope.showCampusServiceDateError=false;
    }
    else {
      $scope.showCampusServiceDateError=true;
    }
  };

  $scope.confirmSubmissionCampusService = function() {
    $('#confirmCampusServiceRequest').modal('hide');
    $scope.onCampusService.date = new Date($scope.onCampusService.date).toDateString();
    if (!$scope.onCampusService.otherEventDescription) {
      $scope.onCampusService.otherEventDescription = 'No description';
    }
    if (!$scope.onCampusService.additionalInfo) {
      $scope.onCampusService.additionalInfo = 'No description';
    }
    if (!$scope.onCampusService.expectedCapacity) {
      $scope.onCampusService.expectedCapacity = 'No description';
    }
    Companies.submitOnCampusServices($scope.onCampusService).then(function() {
      $scope.onCampusService = null;
      $scope.requestOnCampusServiceForm.$setPristine();
      $scope.title = 'Success';
      $scope.message = 'Your request has been sent successfully';
      $('#messageModal').modal('show');
    }, function() {
      $scope.title = 'Sorry';
      $scope.message = 'Looks like something went wrong';
      $('#messageModal').modal('show');
    });
  };

  //For Pending Requests Tab------------------------------------------------------------


  var pendingPromotionalMaterial = [];
  var pendingJobOffers = [];


  PromotionalMaterial.getPendingPromotionalMaterialPerCompany($scope.getCurrentUser().companyName).then(function() {
    pendingPromotionalMaterial = PromotionalMaterial.pendingCompanyPromotionalMaterial;
    $sessionStorage.promotionalMaterialCounter += pendingPromotionalMaterial.length;

    for (var i = 0; i < pendingPromotionalMaterial.length; i++) {
      $scope.companyProfile.pendingRequests.push({id: $scope.companyProfile.pendingRequests.length+1, name: 'Promotional Material: ' +  pendingPromotionalMaterial[i].title, status: 'pending'});
    }
  });

  JobOffers.getPendingJobOffersPerCompany($scope.getCurrentUser().companyName).then(function() {
    pendingJobOffers = JobOffers.pendingCompanyJobOffers;

    for (var i = 0; i < pendingJobOffers.length; i++) {
      $scope.companyProfile.pendingRequests.push({id: $scope.companyProfile.pendingRequests.length+1, name: 'Job Offer: ' + pendingJobOffers[i].title, status: 'pending'});
    }
  });

  /**
   * Account Settings Tab
   */
  Recruiters.getMyInformation();
  $scope.recruiter = Recruiters.recruiter;

  $scope.confirmPersonalInformationChanges  = function(form) {
    if(form.$valid) {
      $('#confirmPersonalInformationChangesModal').modal('show');
      //Jasmine Test
      return true;
    }
    //Jasmine Test
    return false;
  };

  $scope.submitPersonalInformationChanges = function() {
    Recruiters.updatePersonalInfo($scope.recruiter).then(function() {
      $('#confirmPersonalInformationChangesModal').modal('hide');
    });
  };

  $scope.confirmChangePassword = function(form) {
    if (form.$valid) {
      if ($scope.password !== $scope.newPassword) {
        $scope.title = 'Warning';
        $scope.message = 'Password does not match. Please verify you have entered the same password in both fields.';
        $('#messageModal').modal('show');
        return;
      }
      $('#confirmChangePassword').modal('show');
    }
  };

  $scope.submitChangePassword = function() {
    Recruiters.changePassword($scope.password).then(function() {
      $('#confirmChangePassword').modal('hide');
      $scope.password = null;
      $scope.newPassword = null;
      $scope.changePasswordForm.$setPristine();
      $scope.title = 'Congratulations';
      $scope.message = 'Password was successfully changed. Next time you log in make sure to use the new password!';
      $('#messageModal').modal('show');
    });
  };


  // For File Uploads -------------------------------------------------------------------
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
      'sending': function () {
        console.log('Sending!!!!');
        cfpLoadingBar.start();
      },
      'success': function (file, response) {
        console.log('Success!!!!');
        this.removeAllFiles();
        cfpLoadingBar.complete();
        Companies.updateCompanyGeneralInformation({'logoPath': response.filePath}, $scope.getCurrentUser().companyName);
        $scope.companyProfile.generalInfo[0].logoPath = response.filePath;
      },
      'error': function() {
        this.removeAllFiles();
        /* jshint ignore:start */
        alert('ERROR: File Too Large!');
        /* jshint ignore:end */
      }
    }
  };

  $scope.promoMaterialFilePath = '';
  $scope.jobofferFilePath = '';
  $scope.resetDocument = function(){
    $scope.promoMaterialFilePath = '';
    $scope.jobofferFilePath = '';
  };


  $scope.updatePromotionalMaterialConfig = {
    'options': { // passed into the Dropzone constructor
      'url': '/api/companies/promotionalMaterial/upload',
      'paramName': 'image',     // The name that will be used to transfer the file
      'maxFilesize': 5, // in MBs
      'maxFiles': 1,
      'acceptedFiles': 'application/pdf',
      'createImageThumbnails': false,
      'autoProcessQueue': false
    },
    'eventHandlers': {
      'sending': function () {
        console.log('Sending!!!!');
        cfpLoadingBar.start();
      },
      'success': function (file, response) {
        console.log('Success!!!!');
        cfpLoadingBar.complete();
        this.removeAllFiles();
        //if(this.files.length === 2){
        //  this.removeFile(this.files[0]);
        //}
        $scope.promoMaterialFilePath = response.filePath;
        $scope.submitPromotionalMaterialData($scope.addCompanyPromotionalMaterialForm);
      },
      'error': function() {
        this.removeAllFiles();
        /* jshint ignore:start */
        alert('ERROR: File Too Large!');
        /* jshint ignore:end */
      }
    }
  };


  $scope.updateJobOfferConfig = {
    'options': { // passed into the Dropzone constructor
      'url': '/api/companies/jobOffers/upload',
      'paramName': 'image',     // The name that will be used to transfer the file
      'maxFilesize': 5, // in MBs
      'maxFiles': 1,
      'acceptedFiles': 'application/pdf',
      'createImageThumbnails': false,
      'autoProcessQueue': false
    },
    'eventHandlers': {
      'sending': function () {
        console.log('Sending!!!!');
        cfpLoadingBar.start();
      },
      'success': function (file, response) {
        console.log('Success!!!!');
        cfpLoadingBar.complete();
        this.removeAllFiles();
        $scope.jobofferFilePath = response.filePath;
        $scope.submitCompanyJobOfferData($scope.addCompanyJobOfferForm);
      },
      'error': function() {
        this.removeAllFiles();
        /* jshint ignore:start */
        alert('ERROR: File Too Large!');
        /* jshint ignore:end */
      }
    }
  };


});
