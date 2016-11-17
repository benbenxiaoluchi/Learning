/**
 * Created by qiang.shao on 4/27/2015.
 */
//navigator.splashcreen.hide();
'use strict';

controllers.controller('TrainingDetailCtrl',
    ['$scope', '$rootScope', 'trainingService', '$timeout', '$stateParams', '$filter', 'menuService', '$ionicSlideBoxDelegate', '$log', '$ionicLoading', '$ionicHistory', 'authService', '$ionicPlatform', '$ionicModal', '$cordovaToast', '$cordovaClipboard', '$ionicPopup', 'localStorageService', '$cordovaCalendar', 'streamService', '$ionicScrollDelegate', '$cordovaDevice', 'connectedLearning.constants.environments', 'environmentData', '$interval', 'personalisedMessageData', 'itemPathService', 'personalisedMessageService', 'getFacilityInfoService',
        function ($scope, $rootScope, trainingService, $timeout, $stateParams, filter, menuService, $ionicSlideBoxDelegate, $log, $ionicLoading, $ionicHistory, authService, $ionicPlatform, $ionicModal, $cordovaToast, $cordovaClipboard, $ionicPopup, localStorageService, $cordovaCalendar, streamService, $ionicScrollDelegate, device, envs, environmentData, $interval, personalisedMessageData, itemPathService, personalisedMessageService, getFacilityInfoService) {
            var activityId, playabilityValue, sendAllParVisible, currentTrainingFromDt, loginUserID;
            //#region Properties
            $scope.meterials = [];
            $scope.searchInprogress = false;
            $scope.positionPartFlag = 0, $scope.positionFacuFlag = 0, $scope.positionPeopleFlag = 0;
            $scope.participants = [], $scope.faculty = [], $scope.Venue = [], $scope.singleFacility = [], $scope.Schedule = [], $scope.peopleLikeMe = [], $scope.peopleOnSite = [], $scope.weather = [], $scope.demographicType = [], $scope.demographics = [];
            $scope.googleMapVisible = false;
            $scope.allParAddress = '';
            $scope.qCenterLinkVisible = false;
            $scope.currentTemp = 'C';
            $scope.weatherCard = false;
            $scope.sendEmailVisible = false;
            $scope.notificationsListUnRead = [];
            $scope.notificationsListReaded = [];
            var ImpersonateStatus;
            var par_boolOpenPeopleLikeMe, par_boolPeopleLikeMeShow, par_PeopleLikeMeTitle, par_PeopleLikeMeIcon, par_DemographicTitle, par_boolOpenDemographic, par_boolDemographicShow
                , par_DemographicIcon, par_demographics, par_boolOpenDemographics, par_boolDemographicsShow, par_DemographicsTitle, peo_peopleLikeMe,
                peo_boolOpenPeopleLikeMe, peo_boolPeopleLikeMeShow, peo_PeopleLikeMeTitle, peo_PeopleLikeMeIcon, peo_DemographicTitle, peo_boolOpenDemographic, peo_boolDemographicShow
                , peo_DemographicIcon, peo_demographics, peo_boolOpenDemographics, peo_boolDemographicsShow, peo_DemographicsTitle, par_peopleLikeMe;
            $scope.sessionComments = '';
            $scope.circleTitle = 'Circle';
            //#endregion
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
            function getRollCall(loginUserID, AuthorIDType, activityId, mockDate) {
                trainingService.getRollCall(loginUserID, AuthorIDType, activityId, mockDate).then(function (data) {
                    if (data.Content != '') {
                        $scope.sumOfInRoom = data.Content.SumOfInRooms;
                        $scope.sumOfOutRoom = data.Content.SumOfOutRoom + data.Content.NoAction;
                        $scope.sumOfLearners = data.Content.SumOfLearners;
                    } else {
                        $scope.sumOfInRoom = 0;
                        $scope.sumOfOutRoom = 0;
                        $scope.sumOfLearners = 0;
                    }
                }, function (data) {
                    console.log("getRollCall: " + data);
                });
            }

            //display the attendance status and time
            $scope.sessionId = [];
            $scope.authorId = [];
            if (environmentData.environment !== envs.PROD && environmentData.environment !== envs.DEV) {
                trainingService.getAttendanceStatus($scope.eid, $scope.currentTrainingId, $scope.sessionId).then(function (data) {
                    if (data) {
                        var attStatus = data.Status[0].AttendanceStatus;
                        var attDT = data.Status[0].StatusDT;
                        //$scope.statusData = data.StatusDT;
                        if (attStatus == 0) {
                            $scope.currentAttendanceStatus = 'No Action';
                        } else if (attStatus == 1 || attStatus == 2) {
                            $scope.currentAttendanceStatus = 'Checked in' + ' since ' + filter('date')(new Date(attDT), 'hh:mma');
                        } else {
                            $scope.currentAttendanceStatus = 'Checked out' + ' since ' + filter('date')(new Date(attDT), 'hh:mma');
                        }
                    } else {
                        console.log('Attendance API is down.');
                    }
                }, function (data) {
                    console.log(data);
                });
            }

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
            $scope.changeSearch = function () {
                if (searchText.length < 3) {
                    $scope.canSearch = false;
                } else {
                    $scope.canSearch = true;
                }
            };
            $scope.closeSearch = function () {
                $scope.search_modal.hide();
                $scope.clearSearch();
            };

            $scope.navToPeople = function (eid, peopleKey) {
                $scope.navigateToState('app.people', {peopleKey: peopleKey, enterpriseId: eid, tab: 0}, false);
            };

            /*
             $scope.$on("changedTab", function (event, data) {


             // var d = new Date();
             // alert(d.getTime());
             // alert(Date.parse(d)/1000);

             //$scope.showPost = false;
             $scope.tabIndex = data.tab;
             var id = data.id;
             //event.stopPropagation();//prevent the event popup again.
             $scope.participantsflag = false;
             $scope.peopleFlag = false;

             if (sendAllParVisible && data.tabLabel == 'Participants') {
             $scope.sendEmailVisible = true;
             } else {
             $scope.sendEmailVisible = false;
             }

             if (data.tabLabel == 'Schedule') {
             if ($scope.Schedule.length == 0) {
             $scope.getSchedule(activityId, $scope.ScheduleStartDate, $scope.ScheduleStartLocalDate);
             }
             } else if (data.tabLabel == 'Participants') {
             saveDropdownValue(4);
             restoreDropdownValue(2);
             $scope.initializeDropdownValue();
             $scope.getDemographicType('1');
             $scope.getPeopleLikeMe(($rootScope.ImpersonateStatus == true ? $rootScope.impersonationPeopleKey : $rootScope.peoplekey), activityId, 1);

             if ($scope.participants.length == 0) {
             $scope.getParticipants(activityId, $scope.positionPartFlag, '', '');
             }
             $scope.allParAddress = '';
             $scope.getAllParEmail();
             } else if (data.tabLabel == 'Presenters') {
             if ($scope.faculty.length == 0) {
             $scope.getFaculty(activityId, $scope.positionFacuFlag);
             }
             } else if (data.tabLabel == 'Social') {
             $scope.openCircles = false;

             authService.callService({
             serviceName: environmentData.services.myLearningService.serviceName,
             action: trainingService.getCircles,
             params: {authorID: loginUserID, authorIDType: 1, activityID: activityId}
             }).then(function (data) {
             if (typeof data !== '' && data.ReturnCode === 0 && typeof data.Content.length !== 'undefined') {
             $scope.chooseCircleShow = true;
             $scope.chooseCircleIcon = 'icon ion-chevron-right placeholder-icon';
             $scope.Circles = data.Content;

             angular.forEach(data.Content, function (item) {
             if (item.defaultCircle === 1) {
             $rootScope.circleId = item.circleID;
             $scope.circleTitle = 'Circle - ' + item.circleName;
             console.log(item.circleName);
             }
             });
             } else {
             if (data !== '' && data.ReturnCode === 0 && data.Content !== '') {
             $scope.chooseCircleShow = false;
             $rootScope.circleId = data.Content.circleID;
             }
             }

             $scope.stream = [];
             $scope.skip = 0;
             $scope.existMoreData = true;
             $scope.isLoading = false;
             //$scope.showPost = true;

             streamService.clearStream();

             if (streamService.getCurrentStream().length == 0) {
             $scope.loadStream();
             }
             else {
             $scope.stream = streamService.getCurrentStream();
             $scope.skip = streamService.getCurrentStream().length;
             }
             $ionicModal.fromTemplateUrl('conLearning/event/trainingDetail/tabs/stream/new-post.html', {
             scope: $scope
             }).then(function (modal) {
             $scope.newArticle_modal = modal;
             });

             }, function (error) {
             console.log(error);
             $scope.showLoading = false;
             });
             } else if (data.tabLabel == 'People On Site') {
             saveDropdownValue(2);
             restoreDropdownValue(4);

             $scope.initializeDropdownValue();
             $scope.getDemographicType('4');
             $scope.getPeopleLikeMe(($rootScope.ImpersonateStatus == true ? $rootScope.impersonationPeopleKey : $rootScope.peoplekey), activityId, 4);

             if ($scope.peopleOnSite.length == 0) {
             //$scope.initializeDropdownValue();
             //$scope.getDemographicType('4');
             //$scope.getPeopleLikeMe($rootScope.peoplekey, activityId, 4);
             $scope.getPeopleOnSite(activityId, $scope.positionPeopleFlag, '', '');
             }
             } else if (data.tabLabel == 'Materials') {
             if ($scope.meterials.length == 0) {
             $scope.getMaterial(activityId);
             }
             } else if (data.tabLabel == 'Venue') {
             $scope.qCenterLinkVisible = false;

             if ($scope.currentLocation == 'RLC - St. Charles Q Center') {
             $scope.qCenterLinkVisible = true;
             $scope.getSingleFacility(activityId, 1);
             } else if ($scope.currentLocation == 'RLC - Kuala Lumpur Sheraton Imperial') {
             $scope.getSingleFacility(activityId, 737);
             } else if ($scope.currentLocation == 'RLC - Madrid NH Collection Eurobuilding') {
             $scope.getSingleFacility(activityId, 2612);
             } else if ($scope.currentLocation == 'RLC - Bengaluru Marriott Hotel') {
             $scope.getSingleFacility(activityId, 4404);
             } else if ($scope.currentLocation == 'RLC - London Wokefield Park') {
             $scope.getSingleFacility(activityId, 4790);
             }
             } else if (data.tabLabel == 'About' || data.tabLabel == 'Rate' || data.tabLabel == 'About/Rate') {
             $ionicLoading.show();
             if ($scope.isPastSession && !sendAllParVisible) {
             getSurveyLink(activityId);
             getFacultySurveyLink(activityId);

             //get faculty image.
             angular.forEach($scope.facutysForPassedSession, function (faculty) {
             var eid = faculty.EnterpriseID;
             faculty.fullName = faculty.lastName + ', ' + faculty.firstName;
             var cached = localStorageService.get('ACLMOBILE_IMAGE_' + eid);
             if (cached == null || cached == '') {
             menuService.getProfileImageModel(eid).then(function (data) {
             var url = data[0].m_Uri;
             faculty.imgUrl = url;
             localStorageService.set('ACLMOBILE_IMAGE_' + eid, url);
             });
             } else {
             faculty.imgUrl = cached;
             }
             });
             } else {
             $scope.getTrainingDesc(activityId);
             }
             }
             });
             */

            $scope.moreDataCanBeLoaded = function () {
                if (typeof $scope.tabIndex !== "undefined" && $rootScope.tabDict.length !== 0 && typeof $rootScope.tabDict[$scope.tabIndex] !== "" && $rootScope.tabDict[$scope.tabIndex].value === "Participants") {
                    return $scope.moreParticipantsData;
                } else if (typeof $scope.tabIndex !== "undefined" && $rootScope.tabDict.length !== 0 && typeof $rootScope.tabDict[$scope.tabIndex] !== "" && $rootScope.tabDict[$scope.tabIndex].value === "People On Site") {
                    return $scope.morePeopleData;
                } else {
                    return false;
                }
            };

            $scope.loadMore = function () {
                // Participant tab.
                if (typeof $scope.tabIndex !== "undefined" && $rootScope.tabDict.length !== 0 && typeof $rootScope.tabDict[$scope.tabIndex] !== "" && $rootScope.tabDict[$scope.tabIndex].value === "Participants") {
                    if ($scope.participantsflag) {
                        $scope.getParticipants(activityId, $scope.positionPartFlag, '', '');
                    }
                    else {
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                    $scope.participantsflag = true;
                }
                ;

                // PeopleOnSite tab.
                if (typeof $scope.tabIndex !== "undefined" && $rootScope.tabDict.length !== 0 && typeof $rootScope.tabDict[$scope.tabIndex] !== "" && $rootScope.tabDict[$scope.tabIndex].value === "People On Site") {
                    if ($scope.peopleFlag) {
                        $scope.getPeopleOnSite(activityId, $scope.positionPeopleFlag, '', '');
                    }
                    else {
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                    $scope.peopleFlag = true;
                }
            };

            $scope.moreSearchCanBeLoaded = function () {
                if (typeof $scope.tabIndex !== "undefined" && $rootScope.tabDict.length !== 0 && typeof $rootScope.tabDict[$scope.tabIndex] !== "" && $rootScope.tabDict[$scope.tabIndex].value === "Participants") {
                    return $scope.moreVenueData;
                } else if (typeof $scope.tabIndex !== "undefined" && $rootScope.tabDict.length !== 0 && typeof $rootScope.tabDict[$scope.tabIndex] !== "" && $rootScope.tabDict[$scope.tabIndex].value === "People On Site") {
                    return $scope.morePeopleOnSiteData;
                }
            };

            $scope.loadMoreSearch = function () {
                if (!$scope.searchInprogress) {
                    $scope.searchPeople(activityId, $scope.positionSearchFlag, 1);
                    $scope.searchPeopleOnSite(activityId, $scope.peopleOnSiteSearchPositionFlag);
                }
            };
            //#region Actions
            /*$scope.$on('navigateToDetail', function (event, data) {
             $scope.description = "";
             $scope.participants = [];
             $scope.faculty = [];
             $scope.Venue = [];
             $scope.singleFacility = [];
             $scope.Schedule = [];
             $scope.ScheduleStartDate = '';
             $scope.meterials = [];
             $scope.boolOpenPeopleLikeMe = false;
             $scope.PeopleLikeMeTitle = 'People Like ME';
             //event.stopPropagation();//prevent the event popup again.
             $scope.init();
             });*/
            function clearData() {
                $scope.description = "";
                $scope.participants = [];
                $scope.faculty = [];
                $scope.Venue = [];
                $scope.singleFacility = [];
                $scope.Schedule = [];
                //$scope.ScheduleStartDate = '';
                $scope.meterials = [];
                $scope.boolOpenPeopleLikeMe = false;
                $scope.PeopleLikeMeTitle = 'People Like ME';
            }

            $scope.init = function () {
                clearData();
                //$scope.$on('$ionicView.loaded', function (e) {
                activityId = $rootScope.activityID;
                playabilityValue = $scope.playabilityValue;
                sendAllParVisible = $scope.sendAllParVisible;
                loginUserID = $rootScope.ImpersonateStatus == true ? $rootScope.impersonationEID : $rootScope.loginUserID;

                if ($scope.currentTrainingId == undefined || $scope.currentTrainingId == null) {
                    $scope.currentTrainingId = activityId;
                    $scope.currentTrainingDate = $rootScope.trainingItem.currentTrainingDate;
                    $scope.currentTrainingTitle = $rootScope.trainingItem.currentTrainingTitle;
                    $scope.pickRule = $rootScope.trainingItem.PickRule;
                    $scope.fromAdmin = $rootScope.trainingItem.fromAdmin;
                }

                currentTrainingFromDt = $scope.currentTrainingFromDt;
                $scope.isAndroidDevice = device.platform === 'Android' ? true : false;
                if (personalisedMessageData.backViewFlag == true) {
                    $scope._dayTime = (!$scope._dayTime) ? personalisedMessageData._dayTime : angular.noop();
                    $ionicModal.fromTemplateUrl('conLearning/event/trainingDetail/tabs/attendance/attendance.main.html', {
                        scope: $scope
                    }).then(function (modal) {
                        $scope.attendanceModal = modal;
                        $scope.getSessionLearners(3);
                        var mockDate = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC')
                        var AuthorIDType;
                        if ($rootScope.adminFlage) {
                            AuthorIDType = 4;
                        }
                        else if ($scope.pickRule == 1) {
                            AuthorIDType = 2;
                        }
                        getRollCall(loginUserID, AuthorIDType, activityId, mockDate);
                        console.log('this attendanceModal is showing after back from new message')
                        $scope.attendanceModal.show();
                    })
                }
                //$scope.noSchedulePlaceHolder= true;
                //$scope.noMeterialPlaceHolder = true;
                //$scope.noFacultyPlaceHolder = true;
                saveDropdownValue(2);
                saveDropdownValue(4);

                processNotification();

                //$ionicLoading.show();

                //$scope.getSchedule(activityId, $scope.ScheduleStartDate, $scope.ScheduleStartLocalDate);
                //$scope.getParticipants(activityId,10,'','');

                // $scope.initializeDropdownValue();
                // $scope.getDemographicType('1');
                // $scope.getPeopleLikeMe($rootScope.peoplekey, activityId, 1);

                // if ($scope.participants.length == 0) {
                //     $scope.getParticipants(activityId, $scope.positionPartFlag, '', '');
                // }


            };

            /*
             $scope.sessionSurvey;
             $scope.facultySurvey;

             var getSurveyLink = function (activityId) {
             $ionicLoading.show();
             trainingService.getSurveyForSession(activityId).then(
             function (survey) {
             $scope.sessionSurvey = survey;
             $scope.sessionSurveyReady = true;
             $ionicLoading.hide();

             }, function () {
             var msg = 'There was an error get Presenters survey for session of Activity :' + activityId;
             console.log(msg);
             $ionicLoading.hide();
             })
             };
             var getFacultySurveyLink = function (activityId) {
             $ionicLoading.show();
             trainingService.getSurveyForFaculty(activityId).then(
             function (survey) {
             $scope.facultySurvey = survey;
             $scope.facultySurveyReady = true;
             //$ionicLoading.hide();


             //get faculty image.
             if ($scope.faculty.length == 0) {
             $scope.getFaculty(activityId, $scope.positionFacuFlag);
             }


             }, function () {
             $ionicLoading.hide();
             var msg = 'There was an error get Presenters survey for session of Activity :' + activityId;
             console.log(msg);
             $ionicLoading.hide();
             })
             };

             $scope.openSurvey = function (URL) {
             if (!$rootScope.ImpersonateStatus) {
             window.open(URL, '_system', 'location=yes');
             return false;
             }
             };
             */
            $scope.navigateToProfile = function (eid) {
                menuService.getProfiledTAIModel(eid).then(function (data) {
                    $rootScope.profileImage = data[0].m_Uri;
                });
                boradcase(data)
            };

            $scope.initEventDetail = function () {
                $scope.getTrainingDesc(activityId);
            };

            $scope.initParticipants = function () {
                $scope.initializeDropdownValue();
                saveDropdownValue(2);
                restoreDropdownValue(4);
                $scope.getDemographicType('1');
                $scope.getPeopleLikeMe(($rootScope.ImpersonateStatus == true ? $rootScope.impersonationPeopleKey : $rootScope.peoplekey), activityId, 1);
                $scope.getParticipants(activityId, 0, '', '');
                $scope.tabIndex = "Participants";
            };

            $scope.initVenue = function () {
                $scope.tabIndex = "Venue";
            };

            $scope.initPeopleOnSite = function () {
                $scope.initializeDropdownValue();
                saveDropdownValue(2);
                restoreDropdownValue(4);
                $scope.getDemographicType('4');
                $scope.getPeopleLikeMe($rootScope.peoplekey, activityId, 4);
                $scope.getPeopleOnSite(activityId, 0, '', '');
                $scope.tabIndex = "People On Site";
            };

            //get description
            $scope.getTrainingDesc = function (activityID) {
                $ionicLoading.show();
                authService.callService({
                    serviceName: environmentData.services.myLearningService.serviceName,
                    action: trainingService.getTrainingDesc,
                    params: activityID
                })
                    .then(function (data) {

                            var desc = data[0].description;
                            //$scope.courseCode = data[0].courseCd;
                            while (desc.indexOf('\r\n') >= 0) {
                                desc = desc.replace('\r\n', '<BR/>');
                            }
                            $scope.description = desc;
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $ionicLoading.hide();
                        },
                        function (data, status) {

                            var msg = 'System fails to load data.';
                            console.log(msg);
                            $scope.showToast(msg, 'short', 'bottom');
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $ionicLoading.hide();
                        }
                    );
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
                                menuService.getProfileImageModel(eid).then(function (imgedata) {
                                    var url = imgedata[0].m_Uri;
                                    profiledata.imgUrl = url;
                                    localStorageService.set("ACLMOBILE_IMAGE_" + eid, url);
                                });
                            }
                            else {
                                profiledata.imgUrl = cached;
                            }

                            //Get profile infomationf
                            menuService.getProfileInfoModel(profiledata.EnterpriseID).then(function (titledata) {
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
                                menuService.getProfileImageModel(eid).then(function (data5) {
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
                                menuService.getProfileImageModel(profiledata.enterpriseID).then(function (imgedata) {
                                    data3.imgUrl = imgedata[0].m_Uri;
                                    localStorageService.set("ACLMOBILE_IMAGE_" + profiledata.enterpriseID, imgedata[0].m_Uri);
                                });
                            }
                            else {
                                data3.imgUrl = cached;
                            }

                            //Get profile infomation
                            menuService.getProfileInfoModel(profiledata.enterpriseID).then(function (titledata) {
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
                            menuService.getProfileImageModel(item.enterpriseID).then(function (result) {
                                item.imgUrl = result[0].m_Uri;
                            });

                            menuService.getProfileInfoModel(item.enterpriseID, true).then(function (levelResult) {
                                item.standardjobdescr = levelResult["CupsProfile"][0].standardjobdescr;
                            });

                            item.currentTrainingDate = filter('date')(new Date(item.startDtLocal), 'MMM d, y') + ' to ' + filter('date')(new Date(item.endDtLocal), 'MMM d, y');

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

            //Get faculty list
            /*
             $scope.getFaculty = function (activityId, positionFlag) {

             $ionicLoading.show();

             trainingService.searchPeople(activityId, 0, 2, '', '', '').then(
             function (data2) {
             //var eid = '';
             angular.forEach(data2, function (data3, index, array) {
             var eid = data3.EnterpriseID;
             data3.fullName = data3.lastName + ', ' + data3.firstName;

             var cached = localStorageService.get("ACLMOBILE_IMAGE_" + eid);
             if (cached == null || cached == "") {
             menuService.getProfileImageModel(eid).then(function (data5) {
             var url = data5[0].m_Uri;
             data3.imgUrl = url;
             localStorageService.set("ACLMOBILE_IMAGE_" + eid, url);
             });
             }
             else {
             data3.imgUrl = cached;
             }

             data3.standardjobdescr = data3.CareerLevel;

             $scope.faculty.push(data3);
             });
             if ($scope.faculty == null || $scope.faculty.length == 0) {
             $scope.noFacultyDataShow = true;
             } else {
             $scope.noFacultyDataShow = false;
             //$scope.noFacultyPlaceHolder = false;
             }
             $ionicLoading.hide();


             },
             function (data2, status2) {
             //alert('error');
             var msg = 'System fails to load data.';
             console.log(msg);
             $scope.showToast(msg, 'short', 'bottom');
             $ionicLoading.hide();
             }
             );
             };
             */
            //Get venue page info
            $scope.getSingleFacility = function (activityId, facilityId) {


                //var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

                // var mapOptions = {
                //     center: myLatlng,
                //     zoom: 16,
                //     mapTypeId: google.maps.MapTypeId.ROADMAP
                //     };

                //var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

                //navigator.geolocation.getCurrentPosition(function(pos) {
                //map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                //var myLocation = new google.maps.Marker({
                //    position : new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                //    map: map,
                //    title: "My Location"
                //});
                //});

                $ionicLoading.show();


                trainingService.getSingleFacility(activityId, facilityId).then(
                    function (facilitydata) {
                        $scope.singleFacility = [];

                        angular.forEach(facilitydata, function (item) {
                            if (item.city == 'London') {
                                item.city = item.add2;
                            }
                            $scope.singleFacility.push(item);
                        });

                        trainingService.getRegion().then(
                            function (result) {
                                var resultArray = [];
                                resultArray = result.split(';');
                                if (resultArray[resultArray.length - 1] == 'China') {
                                    $scope.googleMapVisible = false;
                                } else {
                                    $scope.googleMapVisible = true;
                                }

                                if (resultArray[resultArray.length - 1] == 'United States') {
                                    $scope.getFahrenheit();
                                } else {
                                    $scope.getCentigrade();
                                }

                                console.log('GPS country: ' + resultArray[resultArray.length - 1]);
                            },
                            function (result, status) {
                                var msg = 'System fails to load data.';
                                console.log(msg);
                                $scope.showToast(msg, 'short', 'bottom');
                            });

                        $ionicLoading.hide();
                    },
                    function (facilitydata, status2) {
                        var msg = 'System fails to load data.';
                        console.log(msg);
                        $scope.showToast(msg, 'short', 'bottom');
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                );
            };

            $scope.getFahrenheit = function () {
                $scope.fontSizeC = 'font-weight: normal';
                $scope.fontSizeF = 'font-weight: bold';
                $scope.getWeatherInfo($scope.singleFacility[0].city, 'f');
            };

            $scope.getCentigrade = function () {
                $scope.fontSizeC = 'font-weight: bold';
                $scope.fontSizeF = 'font-weight: normal';
                $scope.getWeatherInfo($scope.singleFacility[0].city, 'c');
            };

            // Get weather info in venue page
            $scope.getWeatherInfo = function (loc, degree) {
                $scope.weather = [];
                $ionicLoading.show();

                var searchCondition = "select item from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + loc + "') and u='" + degree + "'";
                trainingService.getWeatherInfo(searchCondition).then(
                    function (weatherdata) {
                        angular.forEach(weatherdata, function (item) {
                            $scope.weather.push(item);
                        });

                        $scope.weatherCard = true;
                        $ionicLoading.hide();
                    },
                    function (weatherdata, status) {
                        var msg = 'System fails to load data.';
                        console.log(msg);
                        $scope.showToast(msg, 'short', 'bottom');
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                );
            };
            // To schedule page
            $scope.initSchedulesPage = function () {
                $scope.getSchedule($scope.currentTrainingId, $scope.ScheduleStartDate, $scope.ScheduleStartLocalDate);
            };

            $scope.closePage = function () {
                $scope.navigateToState('app.trainingDetailTabs.eventDetailsTab');
            };

            $scope.loadingSchedule = function () {
                $scope.hideDay = [];
                $scope.showTitle = false;
                $scope.$broadcast('scroll.refreshComplete');
            };
            //Get schedule list
            $scope.getSchedule = function (activityId, startdate, startLocalDate) {
                $scope.haveEvent = [];
                $scope.hideDay = [];
                $scope.showTitle = false;
                var AuthorIDType;
                $ionicLoading.show();

                if ($rootScope.adminFlage) {
                    AuthorIDType = 4;
                }
                else if ($scope.pickRule == 1) {
                    AuthorIDType = 2;
                }

                authService.callService({
                    serviceName: environmentData.services.myLearningService.serviceName,
                    action: trainingService.getScheduleDetails,
                    params: activityId
                })
                    .then(function (data) {
                            if (data != null) {

                                if (typeof data["activity"]["day"].length === 'undefined') {
                                    var objs = data["activity"]["day"];
                                    data["activity"]["day"] = [objs];
                                }

                                angular.forEach(data["activity"]["day"], function (item, index) {
                                    if (item["@eventDate"] != '') {
                                        //item["@count"] = $scope.addDate(startdate, item["@count"]);
                                        //item["@count"] = new Date(item["@eventDate"]);
                                        item["@count"] = filter('date')(item["@eventDate"], 'MMM d, y');

                                    }
                                    else {
                                        item["@count"] = '';
                                    }

                                    var dt = new Date(item['@count']);

                                    if (typeof item.event.length === 'undefined') {
                                        var obj = item.event;
                                        item.event = [obj];
                                    }

                                    var Item = {
                                        starttime: item.event[0].starttime,
                                        endtime: item.event[item.event.length - 1].endtime
                                    };

                                    item.eventState = scheduleDataProcessing(Item, dt, startdate, startLocalDate);

                                    angular.forEach(item.event, function (subItem, subIndex) {
                                        subItem = scheduleDataProcessing(subItem, dt, startdate, startLocalDate);
                                    });

                                });

                                $scope.Schedule = data["activity"]["day"];


                                if ($scope.Schedule == null || $scope.Schedule.length == 0) {
                                    $scope.noScheduleDataShow = true;
                                }
                                else {
                                    $scope.noScheduleDataShow = false;

                                    if ($scope.isCurrent == true) {

                                        angular.forEach($scope.Schedule, function (item, index) {
                                            $scope.hideDay.push(item.eventState.isPastState);
                                        });


                                        if ($scope.hideDay[0] == true) {
                                            $scope.showTitle = true;
                                        }

                                        if ($scope.pickRule == 1 || $rootScope.adminFlage == true) {
                                            var mockDate = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC');
                                            getRollCall(loginUserID, AuthorIDType, activityId, mockDate);
                                        }
                                    }
                                    else {

                                        if ($scope.pickRule == 1 || $rootScope.adminFlage == true) {
                                            var mockDate = filter('date')(new Date($scope.Schedule[0]["@eventDate"]), 'MM-dd-yyyy HH:mm:ss', 'UTC');
                                            getRollCall(loginUserID, AuthorIDType, activityId, mockDate);
                                        }
                                    }

                                }

                                var indexs=[];
                                angular.forEach($scope.Schedule, function (item, index) {
                                    if(item.eventState.isPastState ==false){
                                        indexs.push(index);
                                    }
                                });

                                calendarState($scope.Schedule[indexs[0]]["@count"], $scope.Schedule[indexs[0]].event[0].starttime, $scope.Schedule[indexs[0]].event[0].endtime, $scope.Schedule[indexs[0]].event[0].name, $scope.Schedule[indexs[0]].event[0].location, $scope.subHour, indexs[0], 0);

                            }
                            $ionicLoading.hide();
                        },
                        function (data, status) {
                            var msg = 'System fails to load data.';
                            console.log(msg);
                            $scope.showToast(msg, 'short', 'bottom');
                            $ionicLoading.hide();
                        })

            };

            function scheduleDataProcessing(item, dt, startdate, startLocalDate) {
                var tmpS = item.starttime.split(':'), tmpE = item.endtime.split(':');
                var year = dt.getFullYear(), mon = dt.getMonth(), day = dt.getDate(), startH = tmpS[0], startM = tmpS[1], endH = tmpE[0], endM = tmpE[1];
                var startDt = new Date(year, mon, day, startH, startM, 0, 0);
                var endDt = new Date(year, mon, day, endH, endM, 0, 0);

                //else {
                //    //item.showCurTimeLine = false;
                //}
                //
                //if (isNaN(Date.parse(startDt)) || isNaN(Date.parse(endDt))) {
                //    //item.showAddBtn = false;
                //}
                //else {
                //    //item.showAddBtn = true;
                //}

                if (startdate != '' && startLocalDate != '' && startdate != undefined) {
                    //var displayDate = startdate.split('T')[0] + ' ' + item.starttime;
                    //var d1 = new Date(startdate);
                    //var d2 = new Date(displayDate);
                    //$scope.subHour = (d1 - d2) / 1000 / 3600;
                    $scope.subHour = (new Date(startdate) - new Date(startLocalDate)) / 1000 / 3600;
                }

                if (!isNaN(Date.parse(startDt)) && !isNaN(Date.parse(endDt))) {
                    if (parseInt(tmpS[0]) > parseInt(tmpE[0])) {
                        endDt = new Date((endDt / 1000 + 86400) * 1000); //If the start Hour > end Hour , Add one day for End date based on current day.
                    }

                    startDt.setHours(startDt.getHours() + $scope.subHour);
                    endDt.setHours(endDt.getHours() + $scope.subHour);
                    var offset = new Date().getTimezoneOffset() / 60;
                    startDt.setHours(startDt.getHours() - offset);
                    endDt.setHours(endDt.getHours() - offset);
                }

                if (startDt <= new Date() && new Date() <= endDt) {
                    item.isCurrentState = true;
                    item.isUpcomingState = false;
                    item.isPastState = false;
                    item.sessionStates = "In Progress";
                    //item.showCurTimeLine = true;
                    //item.topMarginPercent = filter('number')((new Date() - startDt) / (endDt - startDt), 2) * 100;
                }
                if (startDt > new Date()) {
                    item.isCurrentState = false;
                    item.isUpcomingState = true;
                    item.isPastState = false;
                    item.sessionStates = "";
                }
                if (new Date() > endDt) {
                    item.isCurrentState = false;
                    item.isUpcomingState = false;
                    item.isPastState = true;
                    item.sessionStates = "Completed";
                }

                return item;
            }

            //Get material list
            // $scope.getMaterial = function (activityID) {
            //     $ionicLoading.show();
            //
            //     trainingService.getMaterialDetails(activityID).then(function (data) {
            //             $ionicLoading.hide();
            //             $scope.meterials = [];
            //             if (data != null) {
            //                 $scope.allMeterials = trainingService.parseMetreialFromHTML(data);
            //                 $scope.meterials = $scope.allMeterials; // update for UI-Refine, disable admin flag icon
            //                 // if ($rootScope.adminFlage == true || $scope.pickRule == true) {
            //                 //     $scope.meterials = $scope.allMeterials;
            //                 // } else {
            //                 //     angular.forEach($scope.allMeterials, function (subItem) {
            //                 //         if (subItem.role == 0) {
            //                 //             $scope.meterials.push(subItem)
            //                 //         }
            //                 //     });
            //                 // }
            //             }
            //             if (typeof $scope.meterials === 'undefined' || !$scope.meterials.length || !$scope.meterials[0]) {
            //                 $scope.noMeterialDataShow = true;
            //             } else {
            //                 $scope.noMeterialDataShow = false;
            //                 //$scope.noMeterialPlaceHolder = false;
            //             }
            //         },
            //         function (data, status) {
            //             var msg = 'System fails to load data.';
            //             console.log(msg);
            //             $scope.showToast(msg, 'short', 'bottom');
            //             $ionicLoading.hide();
            //         }
            //     )
            // };

            // add day count
            $scope.addDate = function (dd, dadd) {
                var a = new Date(dd);
                a = a.valueOf();
                a = a + (dadd - 1) * 24 * 60 * 60 * 1000;
                a = new Date(a);
                return a;
            };


            $scope.sendChatMsg = function (index, type) {
                var address = "";
                if (type == 0) { //participant
                    address = $scope.participants[index].eMail;
                }
                else if (type == 1) { //facult
                    address = $scope.faculty[index].eMail;
                }
                else if (type == 2) { //people on site
                    address = $scope.peopleOnSite[index].eMail;
                }

                $scope.showAlert(address);
            };


            $scope.sendEmail = function (index, type) {

                var address = "";
                if (type == 0) { //participant
                    address = $scope.participants[index].eMail;
                    //address = 'jun.h.li@accenture.com;qiang.shao@accenture.com';
                }
                else if (type == 1) { //facult
                    address = $scope.faculty[index].eMail;
                }
                else if (type == 2) { //people on site
                    address = $scope.peopleOnSite[index].eMail;
                }

                var link = "mailto:" + address + "?subject=" + $scope.currentTrainingTitle;
                window.location.href = link;
            };


            $scope.getAllParEmail = function () {
                trainingService.searchPeople(activityId, -1, 1, '', '', '').then(
                    function (data2) {
                        //var eid = '';
                        angular.forEach(data2, function (data3, index, array) {
                            if ($scope.allParAddress == '') {
                                $scope.allParAddress = data3.eMail
                            }
                            else {
                                $scope.allParAddress = $scope.allParAddress + ';' + data3.eMail;
                            }
                        });
                    },
                    function (data2, status2) {
                        var msg = 'System fails to load data.';
                        console.log(msg);
                        $scope.showToast(msg, 'short', 'bottom');
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                )
            };


            // Send mail for faculty
            $scope.sendAllParEmail = function () {
                var link = "mailto:" + $scope.allParAddress + "?subject=" + $scope.currentTrainingTitle;
                window.location.href = link;
            };


            // An alert dialog
            $scope.showAlert = function (address) {

                if ($scope.isAndroidDevice) {
                    var alertPopup = $ionicPopup.alert({
                        title: '<h2>Launch Lync</h2>',
                        template: 'Tap \'OK\' will copy this contact\'s address automatically and launch Lync, then paste the address to start a chat.',
                        okType: 'button-dark' // String (default: 'button-positive')
                    });

                    alertPopup.then(function (res) {

                        $cordovaClipboard.copy(address)
                            .then(function () {
                            }, function () {
                                $console.log('copy faild');
                            });

                        //launch the Lync
                        var link = "lync://" + address;
                        window.location.href = link;
                    });
                } else {
                    //launch the Lync
                    var link = "sip://" + address;
                    window.location.href = link;
                }
            };

            var calendarState = function (_date, _start, _end, _title, _location, _subHour, index, num) {

                var dt = new Date(_date);
                var tmpS = _start.split(':'), tmpE = _end.split(':');
                var year = dt.getFullYear(), mon = dt.getMonth(), day = dt.getDate(), startH = tmpS[0], startM = tmpS[1], endH = tmpE[0], endM = tmpE[1];
                var start = new Date(year, mon, day, startH, startM, 0, 0),
                    end = new Date(year, mon, day, endH, endM, 0, 0);

                if (!isNaN(Date.parse(start)) && !isNaN(Date.parse(end))) {
                    if (parseInt(tmpS[0]) > parseInt(tmpE[0])) {
                        end = new Date((end / 1000 + 86400) * 1000); //If the start Hour > end Hour , Add one day for End date based on current day.
                    }

                    start.setHours(start.getHours() + _subHour);
                    end.setHours(end.getHours() + _subHour);
                    var offset = new Date().getTimezoneOffset() / 60;
                    start.setHours(start.getHours() - offset);
                    end.setHours(end.getHours() - offset);


                    var cal = {
                        title: _title,
                        location: _location.replace(/(^\s*)|(\s*$)/g, ""), // fix ios crash bug
                        notes: '',
                        startDate: start,
                        endDate: end
                    };
                    //defaultOptions = angular.extend(defaultOptions, cal);

                    $cordovaCalendar.findEvent(cal).then(function (result) {
                            if (result.length != 0) {
                                if (num + 1 < $scope.Schedule[index].event.length) {
                                    calendarState($scope.Schedule[index]["@count"], $scope.Schedule[index].event[num + 1].starttime, $scope.Schedule[index].event[num + 1].endtime, $scope.Schedule[index].event[num + 1].name, $scope.Schedule[index].event[num + 1].location, $scope.subHour, index, num + 1);
                                } else if (num + 1 == $scope.Schedule[index].event.length && index + 1 < $scope.Schedule.length) {
                                    $scope.haveEvent[index] = true;
                                    calendarState($scope.Schedule[index + 1]["@count"], $scope.Schedule[index + 1].event[0].starttime, $scope.Schedule[index + 1].event[0].endtime, $scope.Schedule[index + 1].event[0].name, $scope.Schedule[index + 1].event[0].location, $scope.subHour, index + 1, 0);
                                }
                            } else {
                                $scope.haveEvent[index] = false;
                                if (index + 1 < $scope.Schedule.length) {
                                    calendarState($scope.Schedule[index + 1]["@count"], $scope.Schedule[index + 1].event[0].starttime, $scope.Schedule[index + 1].event[0].endtime, $scope.Schedule[index + 1].event[0].name, $scope.Schedule[index + 1].event[0].location, $scope.subHour, index + 1, 0);
                                }
                            }
                        }, function (err) {
                            $scope.haveEvent[index] = false;
                        }
                    );
                }
                // });

                // if (haveEvent.length == items.event.length) {
                //
                //     return true;
                //
                // } else {
                //
                //     return false;
                // }

            };

            $scope.addToCalendar = function (_date, _start, _end, _title, _location, _subHour, index, num) {


                //$ionicLoading.show();


                var dt = new Date(_date);
                var tmpS = _start.split(':'), tmpE = _end.split(':');
                var year = dt.getFullYear(), mon = dt.getMonth(), day = dt.getDate(), startH = tmpS[0], startM = tmpS[1], endH = tmpE[0], endM = tmpE[1];
                var start = new Date(year, mon, day, startH, startM, 0, 0),
                    end = new Date(year, mon, day, endH, endM, 0, 0);

                if (!isNaN(Date.parse(start)) && !isNaN(Date.parse(end))) {
                    if (parseInt(tmpS[0]) > parseInt(tmpE[0])) {
                        end = new Date((end / 1000 + 86400) * 1000); //If the start Hour > end Hour , Add one day for End date based on current day.
                    }

                    start.setHours(start.getHours() + _subHour);
                    end.setHours(end.getHours() + _subHour);
                    var offset = new Date().getTimezoneOffset() / 60;
                    start.setHours(start.getHours() - offset);
                    end.setHours(end.getHours() - offset);


                    var cal = {
                        title: _title,
                        location: _location.replace(/(^\s*)|(\s*$)/g, ""), // fix ios crash bug
                        notes: '',
                        startDate: start,
                        endDate: end
                    };
                    //defaultOptions = angular.extend(defaultOptions, cal);

                    $cordovaCalendar.findEvent(cal).then(function (result) {
                            if (result.length == 0) {
                                //alert('not found');
                                //add to calendar if not found
                                $cordovaCalendar.createEvent(cal).then(function (Result) {

                                    if (num + 1 < $scope.Schedule[index].event.length) {
                                        $scope.addToCalendar(_date, $scope.Schedule[index].event[num + 1].starttime, $scope.Schedule[index].event[num + 1].endtime, $scope.Schedule[index].event[num + 1].name, $scope.Schedule[index].event[num + 1].location, _subHour, index, num + 1);
                                    } else {
                                        schedulePopup();
                                        $scope.haveEvent[index] = true;
                                    }
                                    //$ionicLoading.hide();
                                    //$scope.showToast('Add to calendar successfully', 'short', 'bottom');
                                }, function (err) {
                                    //$ionicLoading.hide();
                                    $scope.showToast('There was an error: ' + err, 'short', 'bottom');
                                });
                            }
                            else {
                                if (cal.startDate != result[0].startDate && cal.endDate != result[0].endDate) {
                                    $cordovaCalendar.createEvent(cal).then(function (Result) {

                                        if (num + 1 < $scope.Schedule[index].event.length) {
                                            $scope.addToCalendar(_date, $scope.Schedule[index].event[num + 1].starttime, $scope.Schedule[index].event[num + 1].endtime, $scope.Schedule[index].event[num + 1].name, $scope.Schedule[index].event[num + 1].location, _subHour, index, num + 1);
                                        } else {
                                            schedulePopup();
                                            $scope.haveEvent[index] = true;
                                        }
                                        //$ionicLoading.hide();
                                        //$scope.showToast('Add to calendar successfully', 'short', 'bottom');
                                    }, function (err) {
                                        //$ionicLoading.hide();
                                        $scope.showToast('There was an error: ' + err, 'short', 'bottom');
                                    });
                                } else {
                                    //$scope.showToast('Event already exist in calendar', 'short', 'bottom');
                                    if (num + 1 < $scope.Schedule[index].event.length) {
                                        $scope.addToCalendar(_date, $scope.Schedule[index].event[num + 1].starttime, $scope.Schedule[index].event[num + 1].endtime, $scope.Schedule[index].event[num + 1].name, $scope.Schedule[index].event[num + 1].location, _subHour, index, num + 1);
                                    } else {
                                        schedulePopup();
                                        $scope.haveEvent[index] = true;
                                    }
                                }
                            }

                        }
                        ,
                        function (err) {
                            alert('found err');
                        }
                    );
                }


                //$cordovaCalendar.deleteEvent(cal).then(function (result1) {
                //    $cordovaCalendar.createEvent(cal).then(function (result) {
                //        //$ionicLoading.hide();
                //        //$scope.showToast('Add to calendar successfully', 'short', 'bottom');
                //        $timeout(callAtTimeout, 3000);
                //    }, function (err) {
                //        $ionicLoading.hide();
                //        $scope.showToast('There was an error: ' + err, 'short', 'bottom');
                //    });

                //}, function (err1) {
                //    $cordovaCalendar.createEvent(cal).then(function (result) {
                //        //$ionicLoading.hide();
                //        //$scope.showToast('Add to calendar successfully', 'short', 'bottom');
                //        $timeout(callAtTimeout, 3000);
                //    }, function (err) {
                //        $ionicLoading.hide();
                //        $scope.showToast('There was an error: ' + err, 'short', 'bottom');
                //    });
                //});


            };
            //get Social data
            $scope.loadStream = function (refresh) {
                $ionicLoading.show();
                $rootScope.circleId = '79dbd409-5edc-46a9-8e92-0006751722fe';
                if (!$rootScope.circleId) {
                    $ionicLoading.hide();
                } else {
                    streamService.getEventSecured($rootScope.circleId, 10, $scope.skip, refresh).then(
                        function (data) {
                            $ionicLoading.hide();
                            console.log(data);
                            var previous = $scope.stream.length;
                            $scope.stream = data;
                            $scope.skip += 10;
                            $scope.existMoreData = $scope.stream.length > previous;

                            if ($scope.stream.length > 0) {
                                $scope.$emit('check-follow', $scope.stream[0].isFollowingGroup);
                            }

                            $ionicScrollDelegate.resize();
                        }, function (error) {
                            $scope.existMoreData = false;
                            $ionicLoading.hide();
                            var msg = 'There was an error from getStream:' + $rootScope.circleId;
                            console.log(msg);
                        }
                    )
                }
                ;
            };
            $scope.openNewArticle = function () {
                $scope.newArticle_modal.show();
            };
            $scope.closeNewArticle = function () {
                $scope.newArticle_modal.hide();
            };
            $scope.$on('acc-article-like', function (event, args) {
                //crittercismService.leaveBreadcrumb('Like Article - Id:' + args.eventID);
                streamService.like(args.eventID).then(
                    function (data) {
                        streamService.likeManagement(args);
                    },
                    function (error) {
                        console.log(error);
                        //messagesService.log(error);
                        //messagesService.show(constants.messages.stream.like);
                    }
                );
                event.stopPropagation();
            });
            $scope.$on('acc-article-share', function (event, args) {
                if (args.userShareThis == 1) {
                    return;
                }
                //crittercismService.leaveBreadcrumb('Share Article - Id:' + args.eventID);

                streamService.share(args.eventID).then(
                    function (data) {
                        streamService.shareManagement(args);
                    }, function (error) {
                        console.log(error);
                        //messagesService.log(error);
                        //messagesService.show(constants.messages.stream.share);
                    }
                );
            });
            $scope.$on('acc-article-comment', function (event, args) {
                streamService.setDetail(args);
                $scope.navigateToState('app.article', {articleId: args.eventID, flag: true}, false);
            });
            $scope.$on('acc-article-navigate', function (event, args) {
                streamService.setDetail(args);
                $scope.navigateToState('app.article', {articleId: args.eventID, flag: false}, false);
            });
            $scope.$on('acc-article-hashtag', function (event, args) {
                $scope.navigateToState('app.discussion', {discussionId: args, circleId: $rootScope.circleId}, false);
            });
            $scope.$on('acc-article-profile', function (event, eid, peopleKey) {
                $scope.navToPeople(eid, peopleKey);
            });
            $scope.$on('post-created', function (event, args) {
                $scope.skip = 0;
                $scope.existMoreData = true;
                streamService.clearStream();
                $scope.stream = [];
                $scope.loadStream(true);
            });
            $scope.doRefresh = function () {

                $scope.$broadcast('scroll.refreshComplete');

                if ($scope.isCurrent == true) {
                    $scope.getSchedule(activityId, $scope.ScheduleStartDate, $scope.ScheduleStartLocalDate);
                }
                //if (typeof $scope.tabIndex !== "undefined" && $rootScope.tabDict.length !== 0 && typeof $rootScope.tabDict[$scope.tabIndex] !== "" && $rootScope.tabDict[$scope.tabIndex].value === "Social" && $rootScope.circleId) {
                //    $scope.skip = 0;
                //    $scope.existMoreData = true;
                //    streamService.clearStream();
                //    $scope.stream = [];
                //    $scope.loadStream(true);
                //}
            };

            $scope.getVenue = function () {
                $scope.qCenterLinkVisible = false;
                if ($stateParams.city == 'St. Charles') {
                    $scope.qCenterLinkVisible = true;
                    $scope.getSingleFacility('', 1);
                } else if ($stateParams.city == 'Kuala Lumpur') {
                    $scope.getSingleFacility('', 737);
                } else if ($stateParams.city == 'Madrid') {
                    $scope.getSingleFacility('', 2612);
                } else if ($stateParams.city == 'Bengaluru') {
                    $scope.getSingleFacility('', 4404);
                } else if ($stateParams.city == 'Reading') {
                    $scope.getSingleFacility('', 4790);
                }
            };

            function callAtTimeout() {
                //console.log("Timeout occurred");
                $ionicLoading.hide();
                $scope.showToast('Add to calendar successfully', 'short', 'bottom');
            }

            $scope.showToast = function (message, duration, location) {
                $cordovaToast.show(message, duration, location).then(function (success) {
                    console.log("The toast was shown");
                }, function (error) {
                    console.log("The toast was not shown due to " + error);
                });
            };

            $scope.getLearners = function (index) {
                $scope.FilterLearners = [];
                $scope.parFlag = index;
                var attendanceStatus = null;
                // In Room
                if (index == 1) {
                    $scope.filterLearnerTitle = 'In Room';
                    $scope.filterLearnerTitleColor = {
                        'background-color': '#47A518'
                    };
                    $scope.filterLearnerTitleIcon = 'learn-Icon-ParticipantsInRoom';
                    attendanceStatus = 1;
                    // Out of Room
                } else if (index == 2) {
                    $scope.filterLearnerTitle = 'Out of Room';
                    $scope.filterLearnerTitleColor = {
                        'background-color': '#FCB049'
                    };
                    $scope.filterLearnerTitleIcon = 'learn-Icon-ParticipantsOutofRoom';
                    attendanceStatus = 2;
                    // All Participants
                } else if (index == 3) {
                    $scope.filterLearnerTitle = 'All Participants';
                    $scope.filterLearnerTitleColor = {
                        'background-color': 'black'
                    };
                    $scope.filterLearnerTitleIcon = 'ion-person';
                }
                $ionicLoading.show();

                // AuthorID, AuthorIDType, ActivityID, AttendanceStatus, StatusTS
                var mockDate = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC')
                var AuthorIDType;
                if ($rootScope.adminFlage) {
                    AuthorIDType = 4;
                }
                else if ($scope.pickRule == 1) {
                    AuthorIDType = 2;
                }
                console.log('getLearners: pickrule-adminflage', $scope.pickRule, $rootScope.adminFlage)
                trainingService.getLearnerByStatus(loginUserID, AuthorIDType, activityId, attendanceStatus, mockDate).then(function (data) {
                    angular.forEach(data.Content, function (item) {
                        var attendanceDetail = '';
                        if (index == 1) {
                            if (item.AttendanceStatus == 1) {
                                if (item.AuthorTypeID == 2) {
                                    attendanceDetail = 'Faculty Check-in at ' + filter('date')(new Date(item.StatusTS), 'h:mm a');
                                } else if (item.AuthorTypeID == 3) {
                                    attendanceDetail = 'Sensor Check-in at ' + filter('date')(new Date(item.StatusTS), 'h:mm a');
                                }

                                $scope.FilterLearners.push({
                                    EnterpriseID: item.LearnerID,
                                    fullName: item.LastName + ', ' + item.FirstName,
                                    attendanceDetail: attendanceDetail,
                                    attendanceStatus: item.AttendanceStatus
                                })
                            }
                        } else if (index == 2) {
                            if (item.AttendanceStatus == -1) {
                                attendanceDetail = 'Auto Check-out at ' + filter('date')(new Date(item.StatusTS), 'h:mm a');
                                $scope.FilterLearners.push({
                                    EnterpriseID: item.LearnerID,
                                    fullName: item.LastName + ', ' + item.FirstName,
                                    attendanceDetail: attendanceDetail,
                                    attendanceStatus: item.AttendanceStatus
                                })
                            }
                            if (item.AttendanceStatus == 0) {
                                attendanceDetail = 'Not Checked-in';
                                $scope.FilterLearners.push({
                                    EnterpriseID: item.LearnerID,
                                    fullName: item.LastName + ', ' + item.FirstName,
                                    attendanceDetail: attendanceDetail,
                                    attendanceStatus: item.AttendanceStatus
                                })
                            }
                        } else if (index == 3) {
                            if (item.AttendanceStatus == 1) {
                                if (item.AuthorTypeID == 2) {
                                    attendanceDetail = 'Faculty Check-in at ' + filter('date')(new Date(item.StatusTS), 'h:mm a');
                                } else if (item.AuthorTypeID == 3) {
                                    attendanceDetail = 'Sensor Check-in at ' + filter('date')(new Date(item.StatusTS), 'h:mm a');
                                }
                            } else if (item.AttendanceStatus == -1) {
                                attendanceDetail = 'Auto Check-out at ' + filter('date')(new Date(item.StatusTS), 'h:mm a');
                            } else if (item.AttendanceStatus == 0) {
                                attendanceDetail = 'Not Checked-in';
                            }
                            $scope.FilterLearners.push({
                                EnterpriseID: item.LearnerID,
                                fullName: item.LastName + ', ' + item.FirstName,
                                attendanceDetail: attendanceDetail,
                                attendanceStatus: item.AttendanceStatus
                            })
                        }
                    })
                    $ionicLoading.hide();
                }).then(function (data) {
                    console.log('getLearnerByStatus: ' + data);
                    $ionicLoading.hide();
                });

                $ionicModal.fromTemplateUrl('conLearning/event/trainingDetail/tabs/attendance/attendance.main.html', {
                    scope: $scope
                }).then(function (modal) {
                    $scope.attendanceModal = modal;
                    modal.show();
                });
            };

            $scope.sessionParticipantTabCss = ['', 'btn-active', ''];
            $scope.getSessionLearners = function (index) {
                $scope.sessionParticipantTabCss = ['', '', ''];
                $scope.sessionParticipantTabCss[index] = 'btn-active';
                $scope.FilterLearners = [];
                $scope.parFlag = index;
                var attendanceStatus = null;
                if (index == 1) {
                    attendanceStatus = 1;
                } else if (index == 2) {
                    attendanceStatus = 2;
                }

                $ionicLoading.show();
                var mockDate = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC')
                var AuthorIDType;
                if ($rootScope.adminFlage) {
                    AuthorIDType = 4;
                }
                else if ($scope.pickRule == 1) {
                    AuthorIDType = 2;
                }
                console.log('getSessionLearners: pickrule-adminflage', $scope.pickRule, $rootScope.adminFlage)
                trainingService.getLearnerByStatus(loginUserID, AuthorIDType, activityId, attendanceStatus, mockDate).then(function (data) {
                    angular.forEach(data.Content, function (item) {
                        var checkInTime = '';
                        var checkOutTime = '';
                        var isNoAction = false;
                        if (index == 1) {
                            checkInTime = filter('date')(new Date(item.LatestCheckInTime), 'h:mm a');
                        } else if (index == 2) {
                            if (item.AttendanceStatus == -1) {
                                checkInTime = filter('date')(new Date(item.LatestCheckInTime), 'h:mm a');
                                checkOutTime = filter('date')(new Date(item.LatestCheckOutTime), 'h:mm a');
                            } else if (item.AttendanceStatus == 0) {
                                isNoAction = true;
                            }
                        } else if (index == 3) {
                            if (item.AttendanceStatus == 1) {
                                checkInTime = filter('date')(new Date(item.LatestCheckInTime), 'h:mm a');
                            } else if (item.AttendanceStatus == -1) {
                                checkInTime = filter('date')(new Date(item.LatestCheckInTime), 'h:mm a');
                                checkOutTime = filter('date')(new Date(item.LatestCheckOutTime), 'h:mm a');
                            } else if (item.AttendanceStatus == 0) {
                                isNoAction = true;
                            }
                        }
                        $scope.FilterLearners.push({
                            EnterpriseID: item.LearnerID,
                            fullName: item.LastName + ', ' + item.FirstName,
                            attendanceStatus: item.AttendanceStatus,
                            checkInTime: checkInTime,
                            checkOutTime: checkOutTime,
                            isNoAction: isNoAction
                        });
                        //Todo get the group list from Here by Booker

                    });
                    if (index == 3) parseGroupListForMessage();
                    $ionicLoading.hide();
                }, function (data) {
                    console.log('getLearnerByStatus: ' + data);
                    $ionicLoading.hide();
                });
            };

            $scope.closeAttendanceTracking = function () {
                $scope.attendanceModal.hide();
                $scope.$broadcast('scroll.refreshComplete');
            };

            $scope.UpdateAllLearners = function () {
                var index = 3;
                $scope.sessionParticipantTabCss = ['', '', ''];
                $scope.sessionParticipantTabCss[index] = 'materials-tab-selected';
                $scope.FilterLearners = [];
                $scope.parFlag = index;
                var checkInTimeList = [];
                var checkOutTimeList = [];
                var attendanceStatus = null;

                $ionicLoading.show();
                var mockDate = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC')
                var AuthorIDType;
                if ($rootScope.adminFlage) {
                    AuthorIDType = 4;
                }
                else if ($scope.pickRule == 1) {
                    AuthorIDType = 2;
                }
                console.log('UpdateAllLearners: pickrule-adminflage', $scope.pickRule, $rootScope.adminFlage)
                trainingService.getLearnerByStatus(loginUserID, AuthorIDType, activityId, attendanceStatus, mockDate).then(function (data) {
                    angular.forEach(data.Content, function (item) {
                        var checkInTime = '';
                        var checkOutTime = '';
                        var isNoAction = false;
                        if (item.AttendanceStatus == 1) {
                            checkInTime = filter('date')(new Date(item.StatusTS), 'h:mm a');
                        } else if (item.AttendanceStatus == -1) {
                            checkOutTime = filter('date')(new Date(item.StatusTS), 'h:mm a');
                        } else if (item.AttendanceStatus == 0) {
                            isNoAction = true;
                        }
                        $scope.FilterLearners.push({
                            EnterpriseID: item.LearnerID,
                            fullName: item.LastName + ', ' + item.FirstName,
                            attendanceStatus: item.AttendanceStatus,
                            checkInTime: checkInTime,
                            checkOutTime: checkOutTime,
                            isNoAction: isNoAction
                        });
                    });
                    if (index == 3) parseGroupListForMessage();
                    $ionicLoading.hide();
                }, function (data) {
                    console.log('getLearnerByStatus: ' + data);
                    $ionicLoading.hide();
                });

                getRollCall(loginUserID, AuthorIDType, activityId, mockDate);
            };

            $scope.showAttendanceCheckIn = function (eid, fullName, attendanceStatus) {
                if (attendanceStatus == 0 || attendanceStatus == -1) {
                    $scope.participantActionFullName = fullName;
                    $scope.participantActionEid = eid;
                    $scope.activityList = [];
                    $scope.isAfterCheckIn = false;
                    var percent = 100;
                    var activityItems = [];
                    var specItems = [];
                    $ionicLoading.show();
                    var mockDate = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC')
                    var AuthorIDType;
                    if ($rootScope.adminFlage) {
                        AuthorIDType = 4;
                    }
                    else if ($scope.pickRule == 1) {
                        AuthorIDType = 2;
                    }
                    trainingService.getAttendanceInfo(loginUserID, AuthorIDType, eid, activityId, mockDate).then(function (data) {
                        if (data.Content != null) {
                            angular.forEach(data.Content.Status, function (item) {
                                if (item.AttendanceStatus == 99) {
                                    specItems.push(item);
                                } else {
                                    activityItems.push(item);
                                }

                                if (item.AttendanceStatus != 0 && item.AttendanceStatus != 99) {
                                    $scope.activityList.push({
                                        ActivityStatus: item.AttendanceStatus,
                                        ActivityTime: filter('date')(new Date(item.StatusTS), 'h:mm a')
                                    })
                                }
                            });
                        }

                        angular.forEach($scope.activityList, function (result) {
                            if (result.ActivityStatus == 1) {
                                result.ActivityIcon = 'learn-Icon-ParticipantsInRoom';
                                result.ActivityIconColor = {
                                    'color': 'rgb(71, 165, 24)'
                                };
                            } else if (result.ActivityStatus == -1) {
                                result.ActivityIcon = 'learn-Icon-ParticipantsOutofRoom';
                                result.ActivityIconColor = {
                                    'color': 'rgb(252, 176, 73)'
                                };
                            }
                        });
                        $scope.isImpersonate = false;
                        if ($rootScope.ImpersonateStatus == true) {
                            $scope.isImpersonate = true;
                        }

                        $ionicModal.fromTemplateUrl('conLearning/event/trainingDetail/tabs/attendance/attendance.checkInDetail.html', {
                            scope: $scope
                        }).then(function (modal) {
                            $scope.detail_modal = modal;
                            modal.show();
                        });

                        $ionicLoading.hide();
                    }, function (data) {
                        $ionicLoading.hide();
                        console.log('getAttendanceInfo: ' + data);
                    });
                }
            };

            $scope.closeAttendanceCheckIn = function () {
                $scope.detail_modal.hide();
                $scope.UpdateAllLearners();
            };

            $scope.showAttendanceDetail = function (eid, attendanceStatus, learnerName) {
                $scope.participantActionEid = eid;
                $scope.fullName = learnerName;
                var percent = 100;
                $scope.activityList = [];
                var specItems = [];
                $ionicLoading.show();
                var AuthorIDType;
                if ($rootScope.adminFlage) {
                    AuthorIDType = 4;
                }
                else if ($scope.pickRule == 1) {
                    AuthorIDType = 2;
                }
                var mockDate = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC');
                trainingService.getAttendanceInfo(loginUserID, AuthorIDType, eid, activityId, mockDate).then(function (data) {
                    if (data.Content != null) {
                        angular.forEach(data.Content.Status, function (item) {
                            if (item.AttendanceStatus == 99) {
                                specItems.push(item);
                            }
                        });

                        if (specItems.length > 0) {
                            $scope.participantActionComment = specItems[0].Comments;
                            if (specItems[0].Participation != null) {
                                percent = specItems[0].Participation;
                            }
                        } else {
                            $scope.participantActionComment = '';
                        }
                    }

                    $scope.percent = {
                        value: percent,
                        options: {
                            floor: 0,
                            ceil: 100,
                            hideLimitLabels: true,
                            showSelectionBar: true,
                            translate: function (value) {
                                return value + '%';
                            }
                        }
                    };
                    $scope.isImpersonate = false;
                    if ($rootScope.ImpersonateStatus == true) {
                        $scope.isImpersonate = true;
                    }
                    $ionicModal.fromTemplateUrl('conLearning/event/trainingDetail/tabs/attendance/attendance.attendanceDetail.html', {
                        scope: $scope
                    }).then(function (modal) {
                        $scope.attendanceDetail_modal = modal;
                        modal.show();
                    });
                    $ionicLoading.hide();
                }, function (data) {
                    $ionicLoading.hide();
                    console.log('showAttendanceDetail: ' + data);
                });
            };

            $scope.closeAttendanceDetail = function () {
                $scope.attendanceDetail_modal.hide();
            };

            $scope.attendanceConfirm = function (eid) {
                var mockDate = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC');
                var AuthorIDType;
                if ($rootScope.adminFlage) {
                    AuthorIDType = 4;
                }
                else if ($scope.pickRule == 1) {
                    AuthorIDType = 2;
                }
                trainingService.postAttendanceInfo(loginUserID, AuthorIDType, eid, activityId, $scope.percent.value, $scope.$$childTail.participantActionComment, mockDate).then(function (data) {
                    $ionicLoading.hide();
                    $scope.attendanceDetail_modal.hide();
                    $scope.showToast('Attendance confirm success!', 'short', 'bottom');
                }, function (data) {
                    console.log('attendanceConfirm: ' + data);
                    $ionicLoading.hide();
                });
            };

            $scope.showCheckInSlider = function (learnerId, learnerName, index) {
                $scope.participantActionEid = learnerId;
                $scope.fullName = learnerName;
                $scope.checkinPopTime = filter('date')(new Date(), 'HH:mm');
                if ($scope.checkininterval) $interval.cancel($scope.checkininterval);
                $scope.checkininterval = $interval(function () {
                    $scope.checkinPopTime = filter('date')(new Date(), 'HH:mm');
                }, 1000);
                $scope.checkinIndex = index;
                $scope.isImpersonate = false;
                if ($rootScope.ImpersonateStatus == true) {
                    $scope.isImpersonate = true;
                }
                $ionicModal.fromTemplateUrl('conLearning/event/trainingDetail/tabs/attendance/attendance.checkInSlider.html', {
                    scope: $scope
                }).then(function (modal) {
                    $scope.checkInSliderModal = modal;
                    modal.show();
                });
            };

            $scope.checkInPopupAction = function (learnerId, index) {
                $interval.cancel($scope.checkininterval);
                var checkInDT = new Date();
                $ionicLoading.show();
                var mockDate = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC')
                var AuthorIDType;
                if ($rootScope.adminFlage) {
                    AuthorIDType = 4;
                }
                else if ($scope.pickRule == 1) {
                    AuthorIDType = 2;
                }
                trainingService.postCheckIn(loginUserID, AuthorIDType, learnerId, activityId, '', mockDate).then(function (data) {
                    if (data.ReturnCode == 0) {
                        $scope.UpdateAllLearners();
                        $ionicLoading.hide();
                        $scope.checkInSliderModal.hide();
                        $scope.showToast('Check in success!', 'short', 'bottom');
                    }
                }, function (data) {
                    console.log('postCheckIn: ' + data);
                    $ionicLoading.hide();
                });
            };

            $scope.closeCheckInSlider = function () {
                $interval.cancel($scope.checkininterval);
                $scope.checkInSliderModal.hide();
            };

            $scope.checkInAction = function (eid) {
                var checkInDT = new Date();
                $ionicLoading.show();
                var mockDate = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC')
                var AuthorIDType;
                if ($rootScope.adminFlage) {
                    AuthorIDType = 4;
                }
                else if ($scope.pickRule == 1) {
                    AuthorIDType = 2;
                }
                trainingService.postCheckIn(loginUserID, AuthorIDType, eid, activityId, '', mockDate).then(function (data) {
                    if (data.ReturnCode == 0) {
                        var checkInContent = [{
                            ActivityTime: filter('date')(new Date(checkInDT), 'h:mm a'),
                            ActivityIcon: 'learn-Icon-ParticipantsInRoom',
                            ActivityIconColor: {
                                'color': 'rgb(71, 165, 24)'
                            }
                        }];
                        $scope.activityList = checkInContent.concat($scope.activityList);
                        $scope.isAfterCheckIn = true;
                        $scope.UpdateAllLearners();
                        $ionicScrollDelegate.scrollTop();
                        $ionicLoading.hide();
                        $scope.showToast('Check in success!', 'short', 'bottom');
                    }
                }, function (data) {
                    console.log(" -- When click to check in,the ReturnCode is " + data.ReturnCode + " -- ");
                    $ionicLoading.hide();
                });
                getRollCall(loginUserID, AuthorIDType, activityId, mockDate);
            };

            //Expand or merger Choose Circle
            $scope.isShowCircles = function () {
                $scope.openCircles = !$scope.openCircles;
                if ($scope.openCircles) {
                    $scope.chooseCircleIcon = 'icon ion-chevron-left placeholder-icon';
                } else {
                    $scope.chooseCircleIcon = 'icon ion-chevron-right placeholder-icon';
                }
            };

            $scope.selectCircle = function (circle) {
                $rootScope.circleId = '';
                $rootScope.circleId = circle.circleID;
                $scope.circleTitle = 'Circle';
                $scope.circleTitle = $scope.circleTitle + ' - ' + circle.circleName;

                $scope.isShowCircles();

                $scope.stream = [];
                $scope.skip = 0;
                $scope.existMoreData = true;
                $scope.isLoading = false;
                //$scope.showPost = true;

                streamService.clearStream();

                if (streamService.getCurrentStream().length == 0) {
                    $scope.loadStream(true);
                }
                else {
                    $scope.stream = streamService.getCurrentStream();
                    $scope.skip = streamService.getCurrentStream().length;
                }
                $ionicModal.fromTemplateUrl('templates/event/stream/new-post.html', {
                    scope: $scope
                }).then(function (modal) {
                    $scope.newArticle_modal = modal;
                });
            };

            $scope.showAttendanceTracking = function (dayTime, date, fromMain, isCurrentState) {
                $ionicLoading.hide();
                $scope._dayTime = dayTime;
                $scope._date = filter('dateProcessing')(date);
                $scope.isCurrentState = isCurrentState;
                $scope._pickrule = false;
                if ($rootScope.adminFlage) {
                    $scope._pickrule = true;
                } else {
                    if (pickrule == 1) {
                        $scope._pickrule = true;
                    }
                }

                if (!fromMain) {
                    $ionicModal.fromTemplateUrl('conLearning/event/trainingDetail/tabs/attendance/attendance.main.html', {
                        scope: $scope
                    }).then(function (modal) {
                        $scope.attendanceModal = modal;
                        $scope.getSessionLearners(3);
                        var mockDate = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC')
                        var AuthorIDType;
                        if ($rootScope.adminFlage) {
                            AuthorIDType = 4;
                        }
                        else if ($scope.pickRule == 1) {
                            AuthorIDType = 2;
                        }
                        getRollCall(loginUserID, AuthorIDType, activityId, mockDate);
                        $scope.attendanceModal.show();
                    })
                }
            };

            // $scope.materialDownload = function (downloadURL) {
            //     console.log(downloadURL);
            //     window.open(downloadURL, '_system', 'location=yes');
            // };

            // $scope.closeMaterialsModal = function () {
            //     var sessionData = localStorageService.get('LEARNINGEVENTS_SESSIONDATA');
            //
            //     if ($scope.subTabsModal != undefined && $scope.subTabsModal != null) {
            //         $scope.subTabsModal.hide();
            //         $scope.attendanceModal.hide();
            //     } else {
            //         $ionicHistory.goBack();
            //     }
            //
            //     // angular.forEach(sessionData, function (item) {
            //     //     if (activityId == item.activityID) {
            //     //         angular.forEach(item.Session, function (data) {
            //     //             if (sessionid == data.SessionID) {
            //     //                 data.Comment = localStorageService.get('LEARNINGEVENTS_SESSIONCOMMENTS' +activityId);
            //     //             }
            //     //         })
            //     //         //item.Comment = $scope.sessionComments;
            //     //     }
            //     // });
            //
            //     // localStorageService.set('LEARNINGEVENTS_SESSIONDATA', sessionData);
            // };

            // add navigate to  new PersonalisedMessage, using for both portal
            $scope.navigateToPersonalisedMessage = function (eidItem, flag) {
                var participantItems = [];
                participantItems.push(eidItem); // from CheckIn/Out view, slide a EID and send message, only one eid
                personalisedMessageData.flag = flag;
                personalisedMessageData.backViewFlag = null;
                $scope.attendanceModal.hide();
                if ($scope.subTabsModal != undefined && $scope.subTabsModal != null) //from admin page ,material is modal
                    $scope.subTabsModal.hide();
                $scope.navigateToState('app.newPersonalisedMessage', {sendToEIDList: participantItems}, true);
            };

            var parseGroupListForMessage = function () {
                var _array = $scope.FilterLearners;
                angular.forEach(_array, function (item) {
                    item.isMatched = true;
                    item.isPicked = false;
                    item.isGrouped = false;
                });
                personalisedMessageData._dayTime = $scope._dayTime;
                personalisedMessageData.activityID = activityId;
                personalisedMessageData.allParticipantsList = _array;
                personalisedMessageData.checkInList = _array.filter(function (obj) {
                    return obj.attendanceStatus == 1
                });
                personalisedMessageData.checkOutList = _array.filter(function (obj) {
                    return (obj.attendanceStatus == -1 || obj.attendanceStatus == 0)
                });
                console.log('10/25 ', personalisedMessageData.allParticipantsList);
                console.log('10/25 ', personalisedMessageData.checkInList);
                console.log('10/25 ', personalisedMessageData.checkOutList);
            };


            //schedulePopup

            var schedulePopup = function () {

                var schedulePopup = $ionicPopup.show({

                    cssClass: 'schedule-popup',
                    templateUrl: 'conLearning/event/trainingDetail/tabs/schedule/tab.schedulePopup.html',
                    scope: $scope

                });
                schedulePopup.then(function (res) {
                    console.log('Tapped!', res);
                });

                $timeout(function () {
                    schedulePopup.close();
                }, 2000);

            };

            //personalisedmessage
            // init for refresh the notification message page
            var processNotification = function () {

                $scope.unreadCount = personalisedMessageData.unreadCount;

                if (Number(personalisedMessageData.unreadCount) != 0) {
                    $scope.unReadIcon = true;
                } else {
                    $scope.unReadIcon = false;
                }

                if (personalisedMessageData.MessageInfo.length != 0) {
                    var currentTime = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC');
                    angular.forEach(personalisedMessageData.MessageInfo, function (item, index, Array) {
                        var expiryTime = filter('date')(item.MessageExpiryDate, 'MM-dd-yyyy HH:mm:ss');
                        //var sendTime = filter('date')(item.MessageSendDate, 'MM-dd-yyyy HH:mm:ss');
                        if (expiryTime >= currentTime) {
                            var diffTime = (new Date(currentTime).getTime()) - new Date(filter('date')(item.MessageSendDate, 'MM-dd-yyyy HH:mm:ss')).getTime();
                            var diffMin = diffTime / 60000;
                            var diffHour = diffTime / 3600000;
                            var diffDay = diffTime / 86400000;
                            var messageTime;
                            if (diffDay >= 1 && diffDay < 2) {
                                messageTime = ' 1 day ago'
                            } else {
                                if (diffDay >= 2) {
                                    messageTime = parseInt(diffDay) + ' days ago'
                                } else {
                                    if (diffHour >= 1 && diffHour < 2) {
                                        messageTime = ' 1 hour ago'
                                    } else {
                                        if (diffHour >= 2) {
                                            messageTime = parseInt(diffHour) + ' hours ago'
                                        } else {
                                            if (diffMin >= 1 && diffMin < 2) {
                                                messageTime = ' 1 minute ago'
                                            } else {
                                                if (diffMin >= 2) {
                                                    messageTime = parseInt(diffMin) + ' minutes ago'
                                                } else {
                                                    if (diffMin < 1) {
                                                        messageTime = 'Just now'
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if (item.IsRead == 0) {
                                $scope.notificationsListUnRead.push({
                                    messageTime: messageTime,
                                    activityID: item.ActivityID,
                                    isRead: item.IsRead,
                                    id: item.ID,
                                    notificationsInf: item.MessageBody,
                                    expiryDate: item.MessageExpiryDate,
                                    sendDate: new Date(filter('date')(item.MessageSendDate, 'MM-dd-yyyy HH:mm:ss')),
                                    sender: item.SenderFullName,
                                    senderID: item.SenderID
                                });
                            } else {
                                $scope.notificationsListReaded.push({
                                    messageTime: messageTime,
                                    activityID: item.ActivityID,
                                    isRead: item.IsRead,
                                    id: item.ID,
                                    notificationsInf: item.MessageBody,
                                    expiryDate: item.MessageExpiryDate,
                                    sendDate: new Date(filter('date')(item.MessageSendDate, 'MM-dd-yyyy HH:mm:ss')),
                                    sender: item.SenderFullName,
                                    senderID: item.SenderID
                                });
                            }
                        }
                    });
                }
            }

            var initNotification = function () {
                var activityID = null;

                $scope.notificationsListUnRead = [];
                $scope.notificationsListReaded = [];
                personalisedMessageService.getNotificationList(($rootScope.ImpersonateStatus == true ? $rootScope.impersonationEID : $rootScope.loginUserID), activityID).then(function (data) {
                    if (data.Content != null) {
                        personalisedMessageData.MessageInfo = data.Content.MessageInfo;

                        $scope.unreadCount = data.Content.UnReadCount;

                        personalisedMessageData.unreadCount = data.Content.UnReadCount;

                        if ($scope.unreadCount != 0) {
                            $scope.unReadIcon = true;
                        } else {
                            $scope.unReadIcon = false;
                        }

                        var currentTime = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC');
                        angular.forEach(personalisedMessageData.MessageInfo, function (item, index, Array) {
                            var expiryTime = filter('date')(item.MessageExpiryDate, 'MM-dd-yyyy HH:mm:ss');
                            //var sendTime = filter('date')(item.MessageSendDate, 'MM-dd-yyyy HH:mm:ss');
                            if (expiryTime >= currentTime) {
                                var diffTime = (new Date(currentTime).getTime()) - new Date(filter('date')(item.MessageSendDate, 'MM-dd-yyyy HH:mm:ss')).getTime();
                                var diffMin = diffTime / 60000;
                                var diffHour = diffTime / 3600000;
                                var diffDay = diffTime / 86400000;
                                var messageTime;
                                if (diffDay >= 1 && diffDay < 2) {
                                    messageTime = ' 1 day ago'
                                } else {
                                    if (diffDay >= 2) {
                                        messageTime = parseInt(diffDay) + ' days ago'
                                    } else {
                                        if (diffHour >= 1 && diffHour < 2) {
                                            messageTime = ' 1 hour ago'
                                        } else {
                                            if (diffHour >= 2) {
                                                messageTime = parseInt(diffHour) + ' hours ago'
                                            } else {
                                                if (diffMin >= 1 && diffMin < 2) {
                                                    messageTime = ' 1 minute ago'
                                                } else {
                                                    if (diffMin >= 2) {
                                                        messageTime = parseInt(diffMin) + ' minutes ago'
                                                    } else {
                                                        if (diffMin < 1) {
                                                            messageTime = 'Just now'
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if (item.IsRead == 0) {
                                    $scope.notificationsListUnRead.push({
                                        messageTime: messageTime,
                                        activityID: item.ActivityID,
                                        isRead: item.IsRead,
                                        id: item.ID,
                                        notificationsInf: item.MessageBody,
                                        expiryDate: item.MessageExpiryDate,
                                        sendDate: new Date(filter('date')(item.MessageSendDate, 'MM-dd-yyyy HH:mm:ss')),
                                        sender: item.SenderFullName,
                                        senderID: item.SenderID
                                    });
                                } else {
                                    $scope.notificationsListReaded.push({
                                        messageTime: messageTime,
                                        activityID: item.ActivityID,
                                        isRead: item.IsRead,
                                        id: item.ID,
                                        notificationsInf: item.MessageBody,
                                        expiryDate: item.MessageExpiryDate,
                                        sendDate: new Date(filter('date')(item.MessageSendDate, 'MM-dd-yyyy HH:mm:ss')),
                                        sender: item.SenderFullName,
                                        senderID: item.SenderID
                                    });
                                }
                            }
                        });
                    }
                    $ionicLoading.hide();
                }, function (error) {
                    $ionicLoading.hide();
                    personalisedMessageData.MessageInfo = [];
                    personalisedMessageData.unreadCount = null;
                });

            };

            $scope.hideNotification = function () {
                $scope.viewNotifications_modal.hide()
            };
            //Open the ontification message page
            $scope.viewNotifications = function () {
                $ionicModal.fromTemplateUrl('conLearning/event/personalisedMessage/notificationsList.html', {
                    scope: $scope,
                    animation: 'slide-in-right'
                }).then(function (modal) {
                    $scope.viewNotifications_modal = modal;
                    modal.show();
                    if (personalisedMessageData.MessageInfo.length == 0) {
                        initNotification();
                    }
                });
            };

            //to MessagePage
            $scope.toMessagePage = function (eid) {

                $scope.message = [];

                var Objs = personalisedMessageData.MessageInfo;

                angular.forEach(Objs, function (item, index) {
                    if (eid.toLowerCase() == item.SenderID.toLowerCase()) {
                        var sendDate = filter('date')(new Date(item.MessageSendDate), 'd-MMM-yyyy | HH:mm a');
                        $scope.message.push({
                            isRead: item.IsRead,
                            id: item.ID,
                            notificationsInf: item.MessageBody,
                            sendDate: sendDate,
                            senderID: item.SenderID,
                            timeStramp: new Date(item.MessageSendDate)
                        })
                    }
                });

                $ionicModal.fromTemplateUrl('conLearning/event/personalisedMessage/messagePage.html', {
                    scope: $scope,
                    animation: 'slide-in-right'
                }).then(function (modal) {
                    $scope.messagePage_modal = modal;
                    modal.show();
                });
                if ($rootScope.ImpersonateStatus == false) {
                    angular.forEach($scope.message, function (item, index) {
                        if (item.isRead == 0) {
                            authService.callService({
                                serviceName: environmentData.services.myLearningService.serviceName,
                                action: personalisedMessageService.putPersonalisedMessage,
                                params: {AuthorID: $rootScope.loginUserID, messageID: item.id}
                            }).then(function (data) {
                                console.log(data.ReturnMessage);
                            });
                        }
                    });
                }
                initNotification();
            };

            $scope.closeMessagePage = function () {
                $scope.messagePage_modal.hide();
            };

            $scope.init();

            $scope.venueOptions = ["LOCATION MAP", "FLOOR MAPS", "WEATHER", "ALL PEOPLE AT THIS FACILITY", "ALL COURSES AT THIS FACILITY"];

            $scope.navigateFeedback = function (activityID, $event) {
                //$scope.navigateToState('app.eventFeedback', {item:list},false);
                $ionicLoading.show();
                trainingService.getSurveyForSession(activityID).then(
                    function (data) {
                        if (data) {
                            var url = data.replace(/["]/g, "");
                            if (typeof cordova == 'undefined') {
                                window.open(url, '_system', 'location=yes');
                                $ionicLoading.hide();
                            }
                            else {
                                $scope.openSurvey(url);
                            }
                        }
                        else {
                            //pop up no survey found.
                            var msg = 'No Survey Found!';
                            console.log(msg);
                            $ionicLoading.hide();
                        }
                    },

                    function (data, status) {
                        // Error loading expenses message
                        var msg = 'There was an error loading Survey. Please, try again later';
                        console.log(msg);
                        $ionicLoading.hide();
                    }
                );
                $event.stopPropagation();

                //var ref  = cordova.InAppBrowser.open('https://mylbuild.accenture.com/ces/router.aspx?courseCode=A87465&sessionCode=AA77&evaluatorRole=student&courseType=classroom&surveyType=EOC', '_blank', 'location=yes');
            };

            $scope.openSurvey = function (url) {
                var target = "_blank";
                var options = "location=yes,hidden=yes";
                $scope.inAppBrowserRef = cordova.InAppBrowser.open(url, target, options);
                $scope.inAppBrowserRef.addEventListener('loadstart', loadStartCallBack);
                $scope.inAppBrowserRef.addEventListener('loadstop', loadStopCallBack);
                $scope.inAppBrowserRef.addEventListener('loaderror', loadErrorCallBack);
                $scope.inAppBrowserRef.addEventListener('exit', exitCallBack);
            }

            function loadStartCallBack() {

                //$ionicLoading.show();
                console.log("Start load survey page");
            }

            function loadStopCallBack() {

                if ($scope.inAppBrowserRef != undefined) {

                    $scope.inAppBrowserRef.insertCSS({code: "body{font-size: 20px;"});

                    $ionicLoading.hide();

                    $scope.inAppBrowserRef.show();
                }

            }

            function loadErrorCallBack(params) {
                $ionicLoading.hide();

                var scriptErrorMesssage =
                    "alert('Sorry we cannot open that page. Message from the server is : "
                    + params.message + "');"

                console.log(scriptErrorMesssage);

                $scope.inAppBrowserRef.close();

                $scope.inAppBrowserRef = undefined;

            }

            function exitCallBack() {
                $scope.$broadcast('scroll.refreshComplete');
            }


            /* Part : tab.venue */
            var indexOfCenter = null;
            $scope.whichFacility = null;
            var centerImage = [];
            var defaultCenterInfo = {
                "facilityID": "Default",
                "name": "Default",
                "add1": "Default",
                "add2": "Default",
                "city": "Default",
                "zip": "Default",
                "state": "Default",
                "country": "Default",
                "eMail": "Default",
                "phn1": "Default",
                "phn2": "Default",
                "fax": "Default",
                "url": "Default"
            };

            function getFahrenheit() {
                $scope.fontSizeC = 'font-weight: normal';
                $scope.fontSizeF = 'font-weight: bold';
                getWeatherInfo($scope.whichFacility.city, 'f');
            }

            function getCentigrade() {
                $scope.fontSizeC = 'font-weight: bold';
                $scope.fontSizeF = 'font-weight: normal';
                getWeatherInfo($scope.whichFacility.city, 'c');
            }

            // Get weather info in venue page
            function getWeatherInfo(loc, degree) {
                $scope.weather = [];

                var searchCondition = "select item from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + loc + "') and u='" + degree + "'";

                trainingService.getRegion().then(
                    function (result) {
                        var resultArray = [];
                        resultArray = result.split(';');
                        if (resultArray[resultArray.length - 1] == 'China') {
                            $scope.googleMapVisible = false;
                        } else {
                            $scope.googleMapVisible = true;
                        }

                        if (resultArray[resultArray.length - 1] == 'United States') {
                            getFahrenheit();
                        } else {
                            getCentigrade();
                        }

                        console.log('GPS country: ' + resultArray[resultArray.length - 1]);
                    },
                    function (result, status) {
                        var msg = 'System fails to load data.';
                        console.log(msg);
                        $scope.showToast(msg, 'short', 'bottom');
                    }
                );

                trainingService.getWeatherInfo(searchCondition).then(
                    function (weatherdata) {
                        angular.forEach(weatherdata, function (item) {
                            $scope.weather.push(item);
                        });

                        $scope.weatherCard = true;
                    },
                    function (weatherdata, status) {
                        var msg = 'System fails to load data.';
                        console.log(msg);
                        $scope.showToast(msg, 'short', 'bottom');
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                );

            }

            function getSingleFacility(activityId, facilityId) {
                $ionicLoading.show();
                trainingService.getSingleFacility(activityId, facilityId).then(
                    function (facilitydata) {
                        $scope.whichFacility = facilitydata[0];
                        $ionicLoading.hide();
                    },
                    function (data, status) {
                        $scope.whichFacility = defaultCenterInfo;
                        var msg = 'System fails to load data.';
                        console.log(msg + "status : " + status);
                        $ionicLoading.hide();
                    }
                );
            }

            function getCenter() {
                getSingleFacility($scope.currentTrainingId, $scope.facilityID);
                switch ($scope.facilityID) {
                    case 1:
                        indexOfCenter = 0;
                        break;
                    case 737:
                        indexOfCenter = 1;
                        break;
                    case 2612:
                        indexOfCenter = 2;
                        break;
                    case 4404:
                        indexOfCenter = 3;
                        break;
                    case 4790:
                        indexOfCenter = 4;
                        break;
                    default :
                        indexOfCenter = 5;
                        break;
                }
                $scope.centerImg = centerImage[indexOfCenter];
            }

            $scope.venueMap = function () {
                getCenter();
                $ionicModal.fromTemplateUrl('conLearning/event/learningCenter/facilityVenueMap.html', {
                    scope: $scope,
                    animation: 'slide-in-right'
                }).then(function (modal) {
                    $scope.facilityVenueOptions_modal = modal;
                    modal.show();
                });
            };

            $scope.venueWeather = function () {
                getCenter();
                $ionicModal.fromTemplateUrl('conLearning/event/learningCenter/facilityVenueWeather.html', {
                    scope: $scope,
                    animation: 'slide-in-right'
                }).then(function (modal) {
                    $scope.facilityVenueOptions_modal = modal;
                    modal.show();
                });
            };

            var getLearningCenter = function () {
                centerImage = getFacilityInfoService.getCenterImageList();
                getCenter();
            };
            getLearningCenter();
            $scope.hideVenueOptions = function () {
                $scope.facilityVenueOptions_modal.hide()
            };

            /* Part (above): tab.venue */


        }]);// End TrainingDetailCtrl controller

app.filter('timeProcessing', function () {
    return function (inputTime) {
        var time = null;
        var inputTimeArr = inputTime.split(":");
        if (inputTimeArr[0] < 12) {
            time = inputTime + "AM";
        }
        if (inputTimeArr[0] > 12) {
            inputTimeArr[0] = inputTimeArr[0] - 12;
            time = inputTimeArr[0] + ":" + inputTimeArr[1] + "PM";
        }
        if (inputTimeArr[0] == 12) {
            time = inputTime + "PM";
        }
        return time;
    }
});

app.filter('dateProcessing', function () {
    return function (inputDate) {
        var date = null;
        var inputDateArr = inputDate.split(",");
        inputDateArr = inputDateArr[0].split(" ");

        date = inputDateArr[1] + " " + inputDateArr[0];

        return date;
    }
});