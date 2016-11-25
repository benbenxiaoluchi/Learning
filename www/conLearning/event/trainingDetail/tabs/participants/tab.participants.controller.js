/**
 * Created by ling.a.liu on 11/18/2016.
 */
'use strict';

controllers.controller('participantsCtrl',
    ['$scope', '$rootScope', 'trainingService', '$ionicHistory', '$ionicLoading','$cordovaToast','environmentData','localStorageService','menuService','$ionicModal','authService','$filter',
        function ($scope, $rootScope, trainingService, $ionicHistory, $ionicLoading,$cordovaToast,environmentData,localStorageService,menuService,$ionicModal,authService,$filter) {

            var activityId;
            $scope.participants = [];
            $scope.peopleLikeMe = [];
            $scope.peopleOnSite = [];
            $scope.boolOpenPeopleLikeMe = false;    // people like me expand flag
            $scope.boolPeopleLikeMeShow = true;     // people like me show flag
            $scope.PeopleLikeMeTitle = 'People Like ME';
            $scope.PeopleLikeMeIcon = 'icon ion-chevron-right placeholder-icon';

            $scope.DemographicTitle = 'Demographic Type';
            $scope.boolOpenDemographic = false;     // Demographic Type expand flag
            $scope.boolDemographicShow = true;      // Demographic Type show flag
            $scope.DemographicIcon = 'icon ion-chevron-right placeholder-icon';

            $scope.DemographicsTitle = '';
            $scope.boolOpenDemographics = false;    // Demographics expand flag
            $scope.boolDemographicsShow = false;      // Demographics show flag
            $scope.DemographicsIcon = 'icon ion-chevron-right placeholder-icon';

            $scope.initParticipants = function () {
                activityId = $rootScope.trainingItem.currentTrainingId;
                $scope.initializeDropdownValue();
                saveDropdownValue(2);
                saveDropdownValue(4);
                restoreDropdownValue(4);
                $scope.getDemographicType('1');
                $scope.getPeopleLikeMe(($rootScope.ImpersonateStatus == true ? $rootScope.impersonationPeopleKey : $rootScope.peoplekey), activityId, 1);
                $scope.getParticipants(activityId, 0, '', '');
                $scope.tabIndex = "Participants";
                $scope.initNotification();
            };

            $scope.initPeopleOnSite = function () {
                activityId = $rootScope.trainingItem.currentTrainingId;
                $scope.initializeDropdownValue();
                saveDropdownValue(2);
                saveDropdownValue(4);
                restoreDropdownValue(4);
                $scope.getDemographicType('4');
                $scope.getPeopleLikeMe($rootScope.peoplekey, activityId, 4);
                $scope.getPeopleOnSite(activityId, 0, '', '');
                $scope.tabIndex = "People On Site";
            };

            // Initialize the dropdown list values
            $scope.initializeDropdownValue = function () {
                $scope.boolOpenPeopleLikeMe = false;
                $scope.boolPeopleLikeMeShow = true;
                $scope.PeopleLikeMeTitle = 'People Like ME';
                $scope.PeopleLikeMeIcon = 'icon ion-chevron-right placeholder-icon';
                $scope.DemographicTitle = 'Demographic Type';
                $scope.boolOpenDemographic = false;
                $scope.boolDemographicShow = true;
                $scope.DemographicIcon = 'icon ion-chevron-right placeholder-icon';
            };

            var par_boolOpenPeopleLikeMe, par_boolPeopleLikeMeShow, par_PeopleLikeMeTitle, par_PeopleLikeMeIcon, par_DemographicTitle, par_boolOpenDemographic, par_boolDemographicShow
                , par_DemographicIcon, par_demographics, par_boolOpenDemographics, par_boolDemographicsShow, par_DemographicsTitle, peo_peopleLikeMe,
                peo_boolOpenPeopleLikeMe, peo_boolPeopleLikeMeShow, peo_PeopleLikeMeTitle, peo_PeopleLikeMeIcon, peo_DemographicTitle, peo_boolOpenDemographic, peo_boolDemographicShow
                , peo_DemographicIcon, peo_demographics, peo_boolOpenDemographics, peo_boolDemographicsShow, peo_DemographicsTitle, par_peopleLikeMe;
            var saveDropdownValue = function (type) {
                if (type == 2) {
                    par_boolOpenPeopleLikeMe = $scope.boolOpenPeopleLikeMe;
                    par_boolPeopleLikeMeShow = $scope.boolPeopleLikeMeShow;
                    par_PeopleLikeMeTitle = $scope.PeopleLikeMeTitle;
                    par_PeopleLikeMeIcon = $scope.PeopleLikeMeIcon;
                    par_DemographicTitle = $scope.DemographicTitle;
                    par_boolOpenDemographic = $scope.boolOpenDemographic;
                    par_boolDemographicShow = $scope.boolDemographicShow;
                    par_DemographicIcon = $scope.DemographicIcon;
                    par_demographics = $scope.demographics;
                    par_boolOpenDemographics = $scope.boolOpenDemographics;    // Demographics expand flag
                    par_boolDemographicsShow = $scope.boolDemographicsShow;      // Demographics show flag
                    par_DemographicsTitle = $scope.DemographicsTitle;
                    par_peopleLikeMe = $scope.peopleLikeMe;
                } else if (type == 4) {
                    peo_boolOpenPeopleLikeMe = $scope.boolOpenPeopleLikeMe;
                    peo_boolPeopleLikeMeShow = $scope.boolPeopleLikeMeShow;
                    peo_PeopleLikeMeTitle = $scope.PeopleLikeMeTitle;
                    peo_PeopleLikeMeIcon = $scope.PeopleLikeMeIcon;
                    peo_DemographicTitle = $scope.DemographicTitle;
                    peo_boolOpenDemographic = $scope.boolOpenDemographic;
                    peo_boolDemographicShow = $scope.boolDemographicShow;
                    peo_DemographicIcon = $scope.DemographicIcon;
                    peo_demographics = $scope.demographics;
                    peo_boolOpenDemographics = $scope.boolOpenDemographics;    // Demographics expand flag
                    peo_boolDemographicsShow = $scope.boolDemographicsShow;      // Demographics show flag
                    peo_DemographicsTitle = $scope.DemographicsTitle;
                    peo_peopleLikeMe = $scope.peopleLikeMe;
                }
            };

            var restoreDropdownValue = function (type) {
                if (type == 2) {
                    $scope.boolOpenPeopleLikeMe = par_boolOpenPeopleLikeMe;
                    $scope.boolPeopleLikeMeShow = par_boolPeopleLikeMeShow;
                    $scope.PeopleLikeMeTitle = par_PeopleLikeMeTitle;
                    $scope.PeopleLikeMeIcon = par_PeopleLikeMeIcon;
                    $scope.DemographicTitle = par_DemographicTitle;
                    $scope.boolOpenDemographic = par_boolOpenDemographic;
                    $scope.boolDemographicShow = par_boolDemographicShow;
                    $scope.DemographicIcon = par_DemographicIcon;
                    $scope.demographics = par_demographics;
                    $scope.boolOpenDemographics = par_boolOpenDemographics;
                    $scope.boolDemographicsShow = par_boolDemographicsShow;
                    $scope.DemographicsTitle = par_DemographicsTitle;
                    $scope.peopleLikeMe = par_peopleLikeMe;
                } else if (type == 4) {
                    $scope.boolOpenPeopleLikeMe = peo_boolOpenPeopleLikeMe;
                    $scope.boolPeopleLikeMeShow = peo_boolPeopleLikeMeShow;
                    $scope.PeopleLikeMeTitle = peo_PeopleLikeMeTitle;
                    $scope.PeopleLikeMeIcon = peo_PeopleLikeMeIcon;
                    $scope.DemographicTitle = peo_DemographicTitle;
                    $scope.boolOpenDemographic = peo_boolOpenDemographic;
                    $scope.boolDemographicShow = peo_boolDemographicShow;
                    $scope.DemographicIcon = peo_DemographicIcon;
                    $scope.demographics = peo_demographics;
                    $scope.boolOpenDemographics = peo_boolOpenDemographics;
                    $scope.boolDemographicsShow = peo_boolDemographicsShow;
                    $scope.DemographicsTitle = peo_DemographicsTitle;
                    $scope.peopleLikeMe = peo_peopleLikeMe;
                }
            };

            //get Demographic Type DropDownList
            $scope.getDemographicType = function (source) {
                $scope.demographicType = [];
                trainingService.getDemographicType(source).then(
                    function (data2) {
                        angular.forEach(data2, function (data3) {
                            data3.label = data3.label;
                            $scope.demographicType.push(data3);
                        });
                    },
                    function (data2, status) {
                        var msg = 'System fails to load data of demographic type.';
                        console.log(msg);
                        $scope.showToast(msg, 'short', 'bottom');
                        $ionicLoading.hide();
                    }
                );
            };

            $scope.showToast = function (message, duration, location) {
                $cordovaToast.show(message, duration, location).then(function (success) {
                    console.log("The toast was shown");
                }, function (error) {
                    console.log("The toast was not shown due to " + error);
                });
            };

            //get People Like Me DropDownList
            $scope.getPeopleLikeMe = function (peopleKey, activityId, source) {
                //$scope.peopleLikeMe=[
                //{ text: '1.Total people on site'},
                //{ text: '2.Org Level 2'},
                //{ text: '3.Career Track'}];
                $ionicLoading.show();
                $scope.peopleLikeMe = [];
                trainingService.getPeopleLikeMe(peopleKey, activityId, source).then(
                    function (data2) {
                        angular.forEach(data2, function (data3) {
                            data3.text = data3.count + ' - ' + data3.label;
                            data3.pplLikeMeDemogCat = data3.pplLikeMeDemogCat;
                            data3.pplLikeMeDemogFK = data3.pplLikeMeDemogFK;
                            $scope.peopleLikeMe.push(data3);
                        });
                    },
                    function (data2, status) {
                        var msg = 'System fails to load data of people like me.';
                        console.log(msg);
                        $scope.showToast(msg, 'short', 'bottom');
                        $ionicLoading.hide();
                    }
                );
            };

            //get participants list
            $scope.getParticipants = function (activityId, positionFlag, demogCategory, demogKey) {
                $ionicLoading.show();
                if (positionFlag == 0) {
                    $ionicLoading.show();
                }
                authService.callService({
                    serviceName: environmentData.services.myLearningService.serviceName,
                    action: trainingService.searchPeople,
                    params: {
                        activityId: activityId,
                        ReturnSetFlag: 1,
                        RecordCount: positionFlag,
                        SearchStr: '',
                        DemogCategory: demogCategory,
                        DemogKey: demogKey
                    }
                }).then(
                    function (data2) {
                        //var eid = '';
                        angular.forEach(data2, function (data3, index, array) {
                            var eid = data3.EnterpriseID;
                            data3.fullName = data3.lastName + ', ' + data3.firstName;

                            var cached = localStorageService.get("ACLMOBILE_IMAGE_" + eid);
                            if (cached == null || cached == "") {
                                authService.callService({
                                    serviceName: environmentData.services.myLearningService.serviceName,
                                    action: menuService.getProfileImageModel,
                                    params: {
                                        eID: eid
                                    }
                                }).then(
                                    function (data5) {
                                    var url = data5[0].m_Uri;
                                    data3.imgUrl = url;
                                    localStorageService.set("ACLMOBILE_IMAGE_" + eid, url);
                                });
                            }
                            else {
                                data3.imgUrl = cached;
                            }

                            data3.standardjobdescr = data3.CareerLevel;

                            $scope.participants.push(data3);

                        });

                        if (data2 == null || data2.length < 20) {
                            $scope.moreParticipantsData = false;
                        } else {
                            $scope.moreParticipantsData = true;
                        }

                        $scope.positionPartFlag = $scope.positionPartFlag + 20;
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    },
                    function (data2, status2) {
                        var msg = 'System fails to load data.';
                        console.log(msg);
                        $scope.showToast(msg, 'short', 'bottom');
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                );
            };

            $scope.openSearch = function () {
                $ionicModal.fromTemplateUrl('conLearning/event/trainingDetail/tabs/search.html', {
                    scope: $scope
                }).then(function (modal) {
                    $scope.search_modal = modal;
                    modal.show();
                    //cordova.plugins.Keyboard.show();
                });
                $scope.clearSearch();
            };

            $scope.clearSearch = function () {
                $scope.Venue = [];
                $scope.searchText = '';
                $scope.noDataText = '';
                $scope.noDataShow = false;
                $scope.moreVenueData = false;
                $scope.positionSearchFlag = 0;
                $scope.peopleOnSiteSearchPositionFlag = 0;
                cordova.plugins.Keyboard.close();
            };

            $scope.closeSearch = function () {
                $scope.search_modal.hide();
                $scope.clearSearch();
            };

            $scope.performSearch = function (searchText) {
                $scope.searchText = searchText;
                //alert($scope.searchText);
                /*if (typeof $scope.tabIndex !== "undefined" && $rootScope.tabDict.length !== 0 && typeof $rootScope.tabDict[$scope.tabIndex] !== "" && $rootScope.tabDict[$scope.tabIndex].value === "Participants") {
                 $scope.Venue = [];
                 $scope.noDataShow = false;
                 $scope.searchPeople($scope.currentTrainingId, $scope.positionSearchFlag, 1);
                 } else if (typeof $scope.tabIndex !== "undefined" && $rootScope.tabDict.length !== 0 && typeof $rootScope.tabDict[$scope.tabIndex] !== "" && $rootScope.tabDict[$scope.tabIndex].value === "People On Site") {
                 $scope.Venue = [];
                 $scope.noDataShow = false;
                 $scope.searchPeopleOnSite($scope.currentTrainingId, $scope.peopleOnSiteSearchPositionFlag);
                 }*/

                if (typeof $scope.tabIndex !== "undefined" && $scope.tabIndex === "Participants") {
                    $scope.Venue = [];
                    $scope.noDataShow = false;
                    $scope.searchPeople(activityId, $scope.positionSearchFlag, 1);
                } else if (typeof $scope.tabIndex !== "undefined" && $scope.tabIndex === "People On Site") {
                    $scope.Venue = [];
                    $scope.noDataShow = false;
                    $scope.searchPeopleOnSite(activityId, $scope.peopleOnSiteSearchPositionFlag);
                }

            };

            $scope.loadMoreSearch = function () {
                if (!$scope.searchInprogress) {
                    $scope.searchPeople(activityId, $scope.positionSearchFlag, 1);
                    $scope.searchPeopleOnSite(activityId, $scope.peopleOnSiteSearchPositionFlag);
                }
            };

            $scope.moreSearchCanBeLoaded = function () {
                if (typeof $scope.tabIndex !== "undefined" && $rootScope.tabDict.length !== 0 && typeof $rootScope.tabDict[$scope.tabIndex] !== "" && $rootScope.tabDict[$scope.tabIndex].value === "Participants") {
                    return $scope.moreVenueData;
                } else if (typeof $scope.tabIndex !== "undefined" && $rootScope.tabDict.length !== 0 && typeof $rootScope.tabDict[$scope.tabIndex] !== "" && $rootScope.tabDict[$scope.tabIndex].value === "People On Site") {
                    return $scope.morePeopleOnSiteData;
                }
            };

            // search in participant page
            $scope.searchPeople = function (activityId, positionFlag, type) {

                //alert('search text = ' + $scope.searchText);
                if ($scope.inSearchProgress) {
                    return;
                }
                $scope.inSearchProgress = true;

                if (positionFlag == 0) {
                    $ionicLoading.show();
                }

                authService.callService({
                    serviceName: environmentData.services.myLearningService.serviceName,
                    action: trainingService.searchPeople,
                    params: {
                        activityId: activityId,
                        ReturnSetFlag: type,
                        RecordCount: positionFlag,
                        SearchStr: $scope.searchText,
                        DemogCategory: '',
                        DemogKey: ''
                    }
                }).then(
                    function (venuedata) {
                        //var eid = '';
                        $scope.inSearchProgress = false;
                        angular.forEach(venuedata, function (profiledata, index, array) {

                            var eid = profiledata.EnterpriseID;
                            profiledata.fullName = profiledata.lastName + ', ' + profiledata.firstName;

                            var cached = localStorageService.get("ACLMOBILE_IMAGE_" + eid);
                            if (cached == null || cached == "") {
                                authService.callService({
                                    serviceName: environmentData.services.myLearningService.serviceName,
                                    action: menuService.getProfileImageModel,
                                    params: {
                                        eID: eid
                                    }
                                }).then(
                                    function (imgedata) {
                                    var url = imgedata[0].m_Uri;
                                    profiledata.imgUrl = url;
                                    localStorageService.set("ACLMOBILE_IMAGE_" + eid, url);
                                });
                            }
                            else {
                                profiledata.imgUrl = cached;
                            }

                            //Get profile infomationf
                            authService.callService({
                                serviceName: environmentData.services.myLearningService.serviceName,
                                action: menuService.getProfileInfoModel,
                                params: {
                                    eID: eid
                                }
                            }).then(
                                function (titledata) {
                                profiledata.standardjobdescr = titledata["CupsProfile"][0].standardjobdescr;
                            });

                            $scope.Venue.push(profiledata);
                        });


                        if (venuedata.length == null || venuedata.length == 0) {
                            $scope.moreVenueData = false;
                            $scope.noDataShow = true;
                            $scope.noDataText = $scope.searchText;
                            $scope.positionSearchFlag = 0;
                        } else if (venuedata.length < 20) {
                            $scope.moreVenueData = false;
                            //$scope.positionSearchFlag = $scope.positionSearchFlag + 20;
                        } else {
                            $scope.moreVenueData = true;
                            $scope.positionSearchFlag = $scope.positionSearchFlag + 20;
                        }

                        //$scope.positionSearchFlag = $scope.positionSearchFlag + 20;
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.infiniteScrollComplete');

                        //after search succ, disable the search button. will enable when text change and length >= 3
                        $scope.canSearch = false;
                    },
                    function (venuedata, status2) {
                        $scope.inSearchProgress = false;
                        var msg = 'System fails to load data.';
                        console.log(msg);
                        $scope.showToast(msg, 'short', 'bottom');
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                );
            };

            // Search in people on site list
            $scope.searchPeopleOnSite = function (activityId, positionFlag) {

                //alert('search text = ' + $scope.searchText);
                if ($scope.searchPeopleOnSiteInProgress) {
                    return;
                }
                $scope.searchPeopleOnSiteInProgress = true;

                if (positionFlag == 0) {
                    $ionicLoading.show();
                }

                authService.callService({
                    serviceName: environmentData.services.myLearningService.serviceName,
                    action: trainingService.getPeopleOnSite,
                    params: {
                        activityId: activityId,
                        SearchStr: $scope.searchText,
                        RecordCount: positionFlag,
                        DemogCategory: '',
                        DemogKey: ''
                    }
                }).then(
                    //trainingService.getPeopleOnSite(activityId, $scope.searchText, positionFlag, '', '').then(
                    function (venuedata) {
                        $scope.searchPeopleOnSiteInProgress = false;
                        angular.forEach(venuedata, function (profiledata, index, array) {
                            profiledata.fullName = profiledata.lastName + ', ' + profiledata.firstName;

                            var cached = localStorageService.get("ACLMOBILE_IMAGE_" + profiledata.enterpriseID);
                            if (cached == null || cached == "") {
                                authService.callService({
                                    serviceName: environmentData.services.myLearningService.serviceName,
                                    action: menuService.getProfileImageModel,
                                    params: {
                                        eID: profiledata.enterpriseID
                                    }
                                }).then(
                                    function (imgedata) {
                                    profiledata.imgUrl = imgedata[0].m_Uri;
                                    localStorageService.set("ACLMOBILE_IMAGE_" + profiledata.enterpriseID, imgedata[0].m_Uri);
                                });
                            }
                            else {
                                profiledata.imgUrl = cached;
                            }

                            //Get profile infomation

                            authService.callService({
                                serviceName: environmentData.services.myLearningService.serviceName,
                                action: menuService.getProfileInfoModel,
                                params: {
                                    eID: profiledata.enterpriseID
                                }
                            }).then(
                                function (titledata) {
                                profiledata.standardjobdescr = titledata["CupsProfile"][0].standardjobdescr;
                            });

                            $scope.Venue.push(profiledata);
                        });

                        if (venuedata.length == null || venuedata.length == 0) {
                            $scope.moreVenueData = false;
                            $scope.noDataShow = true;
                            $scope.noDataText = $scope.searchText;
                            $scope.peopleOnSiteSearchPositionFlag = 0;
                        } else if (venuedata.length < 20) {
                            $scope.moreVenueData = false;
                            //$scope.peopleOnSiteSearchPositionFlag = $scope.peopleOnSiteSearchPositionFlag + 20;
                        } else {
                            $scope.moreVenueData = true;
                            $scope.peopleOnSiteSearchPositionFlag = $scope.peopleOnSiteSearchPositionFlag + 20;
                        }

                        //$scope.peopleOnSiteSearchPositionFlag = $scope.peopleOnSiteSearchPositionFlag + 20;
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.infiniteScrollComplete');

                        //after search succ, disable the search button. will enable when text change and length >= 3
                        $scope.canSearch = false;
                    },
                    function (venuedata, status) {
                        $scope.searchPeopleOnSiteInProgress = false;
                        var msg = 'System fails to load data.';
                        console.log(msg);
                        $scope.showToast(msg, 'short', 'bottom');
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                );
            };

            //Expand or merger DemographicType
            $scope.isShowDemographicType = function (value) {
                $scope.boolOpenDemographic = !$scope.boolOpenDemographic;
                if ($scope.boolOpenDemographic == false && value == '') {
                    $scope.DemographicIcon = 'icon ion-chevron-right placeholder-icon';
                    $scope.boolPeopleLikeMeShow = true;
                }
                else if ($scope.boolOpenDemographic == false && value != '') {
                    $scope.DemographicIcon = 'icon ion-chevron-left placeholder-icon';
                    $scope.boolPeopleLikeMeShow = false;
                }
                else if ($scope.boolOpenDemographic == true) {
                    $scope.DemographicIcon = 'icon ion-chevron-left placeholder-icon';
                    $scope.boolPeopleLikeMeShow = false;
                }
                $scope.DemographicTitle = 'Demographic Type';
            };

            // The event of choice the option of Demographic Type
            $scope.selectDemographicType = function (value, Type) {
                $scope.isShowDemographicType(value);
                $scope.boolDemographicShow = false;

                $scope.boolDemographicsShow = true;
                if (Type == '1')//participants
                {
                    $scope.getDemographics(activityId, 1, value);
                }
                if (Type == '2')//PeopleOnSite
                {
                    $scope.getDemographics(activityId, 4, value);
                }
                $scope.isShowDemographics(value);
                $scope.DemographicsTitle = value;
            };

            //Expand or merger Demographics
            $scope.isShowDemographics = function (value) {
                $scope.boolOpenDemographics = !$scope.boolOpenDemographics;
                if ($scope.boolOpenDemographics == false && value == '') {
                    //$scope.DemographicsIcon = 'icon ion-chevron-right placeholder-icon';
                    $scope.isShowDemographicType(value);
                    $scope.boolDemographicShow = true;

                    $scope.boolDemographicsShow = false;
                }
                else if ($scope.boolOpenDemographics == false && value != '') {
                    $scope.DemographicsIcon = 'icon ion-chevron-left placeholder-icon';
                }
                else if ($scope.boolOpenDemographics == true) {
                    $scope.DemographicsIcon = 'icon ion-chevron-left placeholder-icon';
                }

                if ($scope.DemographicsTitle.indexOf("-") > 0) {
                    var tempArr = $scope.DemographicsTitle.split("-");
                    $scope.DemographicsTitle = tempArr[0];
                }


            };

            //get Demographics DropDownList
            $scope.getDemographics = function (activityId, source, demogTypeLabel) {

                $ionicLoading.show();
                $scope.demographics = [];
                trainingService.getDemographics(activityId, source, demogTypeLabel).then(
                    function (data2) {
                        angular.forEach(data2, function (data3) {
                            data3.text = data3.count + ' - ' + data3.pplLikeMeDemogName;
                            data3.pplLikeMeDemogCat = data3.pplLikeMeDemogCat;
                            data3.pplLikeMeDemogFK = data3.pplLikeMeDemogFK;
                            $scope.demographics.push(data3);
                        });
                        $ionicLoading.hide();
                    },
                    function (data2, status) {
                        var msg = 'System fails to load data.';
                        console.log(msg);
                        $scope.showToast(msg, 'short', 'bottom');
                        $ionicLoading.hide();
                    }
                );
            };

            // The event of choice the option of Demographics
            $scope.selectDemographics = function (value, DemogCategory, DemogKey, Type) {
                $scope.isShowDemographics(value);

                if (DemogCategory == 'all') {
                    DemogCategory = '';
                }

                if (DemogKey == 'all') {
                    DemogKey = '';
                }

                var tempArr = [];
                if (value.indexOf("-") > 0) {
                    tempArr = value.split("-");
                }
                $scope.DemographicsTitle = $scope.DemographicsTitle + ' - ' + tempArr[1];
                if (Type == '1')//participants
                {
                    $scope.participants = [];
                    $scope.getParticipants(activityId, 0, DemogCategory, DemogKey);
                }
                if (Type == '2')//PeopleOnSite
                {
                    $scope.peopleOnSite = [];
                    $scope.getPeopleOnSite(activityId, 0, DemogCategory, DemogKey);
                }
            };

            //get People On Site
            $scope.getPeopleOnSite = function (activityId, positionFlag, DemogCategory, DemogKey) {
                if (positionFlag == 0) {
                    $ionicLoading.show();
                }

                authService.callService({
                    serviceName: environmentData.services.myLearningService.serviceName,
                    action: trainingService.getPeopleOnSite,
                    params: {
                        activityId: activityId,
                        SearchStr: '',
                        RecordCount: positionFlag,
                        DemogCategory: DemogCategory,
                        DemogKey: DemogKey
                    }
                }).then(
                    function (data) {
                        angular.forEach(data, function (item, index, array) {
                            item.fullName = item.lastName + ', ' + item.firstName;
                            authService.callService({
                                serviceName: environmentData.services.myLearningService.serviceName,
                                action: menuService.getProfileImageModel,
                                params: {
                                    eID: item.enterpriseID
                                }
                            }).then(
                                function (result) {
                                item.imgUrl = result[0].m_Uri;
                            });

                            authService.callService({
                                serviceName: environmentData.services.myLearningService.serviceName,
                                action: menuService.getProfileInfoModel,
                                params: {
                                    eID: item.enterpriseID
                                }
                            }).then(
                                function (levelResult) {
                                item.standardjobdescr = levelResult["CupsProfile"][0].standardjobdescr;
                            });

                            item.currentTrainingDate = $filter('date')(new Date(item.startDtLocal), 'MMM d, y') + ' to ' + $filter('date')(new Date(item.endDtLocal), 'MMM d, y');

                            $scope.peopleOnSite.push(item);
                        });

                        if (data == null || data.length < 20) {
                            $scope.morePeopleData = false;
                        } else {
                            $scope.morePeopleData = true;
                        }

                        //if (data.length == null || data.length == 0) {
                        //    $scope.noPeopleonsiteDataShow = true;
                        //}

                        $scope.positionPeopleFlag = $scope.positionPeopleFlag + 20;
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    },
                    function (data, status) {
                        var msg = 'System fails to load data.';
                        console.log(msg);
                        $scope.showToast(msg, 'short', 'bottom');
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                );
            };

            //Expand or merger People Like Me
            $scope.isShowPeopleLikeMe = function (value) {
                $scope.boolOpenPeopleLikeMe = !$scope.boolOpenPeopleLikeMe;
                if ($scope.boolOpenPeopleLikeMe == false && value == '') {
                    $scope.PeopleLikeMeIcon = 'icon ion-chevron-right placeholder-icon';
                    $scope.boolDemographicShow = true;
                }
                else if ($scope.boolOpenPeopleLikeMe == false && value != '') {
                    $scope.PeopleLikeMeIcon = 'icon ion-chevron-left placeholder-icon';
                    $scope.boolDemographicShow = false;
                }
                else if ($scope.boolOpenPeopleLikeMe == true) {
                    $scope.PeopleLikeMeIcon = 'icon ion-chevron-left placeholder-icon';
                    $scope.boolDemographicShow = false;
                }
                $scope.PeopleLikeMeTitle = 'People Like ME';
            };

            // The event of choice the option of people like me
            $scope.selectPeopleLikeMe = function (value, DemogCategory, DemogKey, Type) {
                $scope.isShowPeopleLikeMe(value);
                $scope.PeopleLikeMeTitle = 'People Like ME' + ' - ' + value;

                if (DemogCategory == 'all') {
                    DemogCategory = '';
                }

                if (DemogKey == 'all') {
                    DemogKey = '';
                }

                if (Type == '1')//participants
                {
                    $scope.participants = [];
                    $scope.getParticipants(activityId, 0, DemogCategory, DemogKey);
                }
                if (Type == '2')//PeopleOnSite
                {
                    $scope.peopleOnSite = [];
                    $scope.getPeopleOnSite(activityId, 0, DemogCategory, DemogKey);
                }
            };


        }]);
