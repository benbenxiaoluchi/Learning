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
            $scope.faculty = [], $scope.Venue = [], $scope.singleFacility = [], $scope.Schedule = [], $scope.weather = [], $scope.demographicType = [], $scope.demographics = [];
            $scope.googleMapVisible = true;
            $scope.allParAddress = '';
            $scope.qCenterLinkVisible = false;
            $scope.currentTemp = 'C';
            $scope.weatherCard = false;
            $scope.sendEmailVisible = false;
            $scope.notificationsListUnRead = [];
            $scope.notificationsListReaded = [];
            var ImpersonateStatus;

            $scope.circleTitle = 'Circle';
            //#endregion

            function getRollCall(loginUserID, AuthorIDType, activityId, timeNow) {
                trainingService.getRollCall(loginUserID, AuthorIDType, activityId, timeNow).then(function (data) {
                    $ionicLoading.hide();
                    if (data.Content && data.Content != '') {
                        $scope.sumOfInRoom = data.Content.SumOfInRooms;
                        $scope.sumOfOutRoom = data.Content.SumOfOutRoom + data.Content.NoAction;
                        $scope.sumOfLearners = data.Content.SumOfLearners;
                    } else {
                        $scope.sumOfInRoom = 0;
                        $scope.sumOfOutRoom = 0;
                        $scope.sumOfLearners = 0;
                    }
                }, function (data) {
                    $ionicLoading.hide();
                    console.log("getRollCall: " + data);
                });
            }

            // $scope.changeSearch = function () {
            //     if (searchText.length < 3) {
            //         $scope.canSearch = false;
            //     } else {
            //         $scope.canSearch = true;
            //     }
            // };


            // $scope.navToPeople = function (eid, peopleKey) {
            //     $scope.navigateToState('app.people', {peopleKey: peopleKey, enterpriseId: eid, tab: 0}, false);
            // };

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
            /*
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
            };*/




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
                activityId = $rootScope.trainingItem.currentTrainingId;
                playabilityValue = $scope.playabilityValue;
                sendAllParVisible = $scope.sendAllParVisible;
                loginUserID = $rootScope.ImpersonateStatus == true ? $rootScope.impersonationEID : $rootScope.loginUserID;

                currentTrainingFromDt = $scope.currentTrainingFromDt;
                $scope.isAndroidDevice = device.platform === 'Android' ? true : false;
                if (personalisedMessageData.backViewFlag == true) {
                    // $scope.initSchedulesPage(); // fix close bug for past training may improve.
                    $scope._dayTime = (!$scope._dayTime) ? personalisedMessageData._dayTime : angular.noop();
                    $scope.isCurrentState = personalisedMessageData.isCurrentState;
                    $scope._date = personalisedMessageData._date;
                    $ionicModal.fromTemplateUrl('conLearning/event/trainingDetail/tabs/attendance/attendance.main.html', {
                        scope: $scope
                    }).then(function (modal) {
                        $scope.attendanceModal = modal;
                        $scope.getSessionLearners(3);
                        var AuthorIDType;
                        if (!$rootScope.ImpersonateStatus) {
                            if ($rootScope.adminFlage) {
                                AuthorIDType = 4;
                            }
                            else if ($rootScope.trainingItem.pickRule == 1) {
                                AuthorIDType = 2;
                            }
                        } else {
                            if ($rootScope.impersonationUserType == 1) {
                                AuthorIDType = 2;
                            }
                        }
                        var timeNow = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC');
                        getRollCall(loginUserID, AuthorIDType, activityId, timeNow);
                        personalisedMessageData.backViewFlag = null;
                        console.log('this attendanceModal back from new message', ' cannot get in again since', personalisedMessageData.backViewFlag);
                        $scope.attendanceModal.show();
                    })
                }
                //$scope.noSchedulePlaceHolder= true;
                //$scope.noMeterialPlaceHolder = true;
                //$scope.noFacultyPlaceHolder = true;
                //saveDropdownValue(2);
                //saveDropdownValue(4);

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
            // $scope.navigateToProfile = function (eid) {
            //     menuService.getProfiledTAIModel(eid).then(function (data) {
            //         $rootScope.profileImage = data[0].m_Uri;
            //     });
            //     boradcase(data)
            // };

            $scope.initEventDetail = function () {
                $scope.getTrainingDesc(activityId);
                $scope.initNotification();
            };

            $scope.initVenue = function () {
                $scope.tabIndex = "Venue";
                getLearningCenter();
                $scope.initNotification();
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

            //$scope.getFahrenheit = function () {
            //    $scope.fontSizeC = 'font-weight: normal';
            //    $scope.fontSizeF = 'font-weight: bold';
            //    $scope.getWeatherInfo($scope.singleFacility[0].city, 'f');
            //};

            //$scope.getCentigrade = function () {
            //    $scope.fontSizeC = 'font-weight: bold';
            //    $scope.fontSizeF = 'font-weight: normal';
            //    $scope.getWeatherInfo($scope.singleFacility[0].city, 'c');
            //};

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
                $scope.getSchedule($rootScope.trainingItem.currentTrainingId, $rootScope.trainingItem.ScheduleStartDate, $rootScope.trainingItem.ScheduleStartLocalDate);
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

                if (!$rootScope.ImpersonateStatus) {
                    if ($rootScope.adminFlage) {
                        AuthorIDType = 4;
                    }
                    else if ($rootScope.trainingItem.pickRule == 1) {
                        AuthorIDType = 2;
                    }
                } else {
                    if ($rootScope.impersonationUserType == 1) {
                        AuthorIDType = 2;
                    }
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
                                    if (!angular.isString(item.event) && item.event.length != 0) {

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

                                        $scope.Schedule.push(item);
                                    }
                                });

                                if ($scope.Schedule == null || $scope.Schedule.length == 0 || $scope.Schedule.length != data["activity"]["day"].length) {
                                    $scope.noScheduleDataShow = true;
                                    $ionicLoading.hide();
                                }
                                else {
                                    $scope.noScheduleDataShow = false;

                                    if ($rootScope.trainingItem.isCurrent == true) {

                                        angular.forEach($scope.Schedule, function (item, index) {
                                            $scope.hideDay.push(item.eventState.isPastState);
                                        });

                                        if ($scope.hideDay[0] == true) {
                                            $scope.showTitle = true;
                                        }

                                        if ($rootScope.trainingItem.pickRule == 1 || $rootScope.adminFlage == true) {
                                            var timeNow = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC');
                                            getRollCall(loginUserID, AuthorIDType, activityId, timeNow);
                                        }
                                    }
                                    else {

                                        if ($rootScope.trainingItem.pickRule == 1 || $rootScope.adminFlage == true) {
                                            var timeNow = filter('date')(new Date($scope.Schedule[0]["@eventDate"]), 'MM-dd-yyyy HH:mm:ss', 'UTC');
                                            getRollCall(loginUserID, AuthorIDType, activityId, timeNow);
                                        }
                                    }

                                }
                                if (!$rootScope.trainingItem.fromAdmin) {
                                    var indexs = [];
                                    angular.forEach($scope.Schedule, function (item, index) {
                                        if (item.eventState.isPastState == false) {
                                            indexs.push(index);
                                        }
                                    });

                                    if (indexs.length != 0) {
                                        calendarState($scope.Schedule[indexs[0]]["@count"], $scope.Schedule[indexs[0]].event[0].starttime, $scope.Schedule[indexs[0]].event[0].endtime, $scope.Schedule[indexs[0]].event[0].name, $scope.Schedule[indexs[0]].event[0].location, $scope.subHour, indexs[0], 0);
                                    }
                                }
                            }
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
            // $scope.addDate = function (dd, dadd) {
            //     var a = new Date(dd);
            //     a = a.valueOf();
            //     a = a + (dadd - 1) * 24 * 60 * 60 * 1000;
            //     a = new Date(a);
            //     return a;
            // };


            // $scope.sendChatMsg = function (index, type) {
            //     var address = "";
            //     if (type == 0) { //participant
            //         address = $scope.participants[index].eMail;
            //     }
            //     else if (type == 1) { //facult
            //         address = $scope.faculty[index].eMail;
            //     }
            //     else if (type == 2) { //people on site
            //         address = $scope.peopleOnSite[index].eMail;
            //     }
            //
            //     $scope.showAlert(address);
            // };
            //
            //
            // $scope.sendEmail = function (index, type) {
            //
            //     var address = "";
            //     if (type == 0) { //participant
            //         address = $scope.participants[index].eMail;
            //         //address = 'jun.h.li@accenture.com;qiang.shao@accenture.com';
            //     }
            //     else if (type == 1) { //facult
            //         address = $scope.faculty[index].eMail;
            //     }
            //     else if (type == 2) { //people on site
            //         address = $scope.peopleOnSite[index].eMail;
            //     }
            //
            //     var link = "mailto:" + address + "?subject=" + $scope.currentTrainingTitle;
            //     window.location.href = link;
            // };


            // $scope.getAllParEmail = function () {
            //     trainingService.searchPeople(activityId, -1, 1, '', '', '').then(
            //         function (data2) {
            //             //var eid = '';
            //             angular.forEach(data2, function (data3, index, array) {
            //                 if ($scope.allParAddress == '') {
            //                     $scope.allParAddress = data3.eMail
            //                 }
            //                 else {
            //                     $scope.allParAddress = $scope.allParAddress + ';' + data3.eMail;
            //                 }
            //             });
            //         },
            //         function (data2, status2) {
            //             var msg = 'System fails to load data.';
            //             console.log(msg);
            //             $scope.showToast(msg, 'short', 'bottom');
            //             $ionicLoading.hide();
            //             $scope.$broadcast('scroll.infiniteScrollComplete');
            //         }
            //     )
            // };
            //
            //
            // // Send mail for faculty
            // $scope.sendAllParEmail = function () {
            //     var link = "mailto:" + $scope.allParAddress + "?subject=" + $scope.currentTrainingTitle;
            //     window.location.href = link;
            // };
            //
            //
            // // An alert dialog
            // $scope.showAlert = function (address) {
            //
            //     if ($scope.isAndroidDevice) {
            //         var alertPopup = $ionicPopup.alert({
            //             title: '<h2>Launch Lync</h2>',
            //             template: 'Tap \'OK\' will copy this contact\'s address automatically and launch Lync, then paste the address to start a chat.',
            //             okType: 'button-dark' // String (default: 'button-positive')
            //         });
            //
            //         alertPopup.then(function (res) {
            //
            //             $cordovaClipboard.copy(address)
            //                 .then(function () {
            //                 }, function () {
            //                     $console.log('copy faild');
            //                 });
            //
            //             //launch the Lync
            //             var link = "lync://" + address;
            //             window.location.href = link;
            //         });
            //     } else {
            //         //launch the Lync
            //         var link = "sip://" + address;
            //         window.location.href = link;
            //     }
            // };

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
            // $scope.loadStream = function (refresh) {
            //     $ionicLoading.show();
            //     $rootScope.circleId = '79dbd409-5edc-46a9-8e92-0006751722fe';
            //     if (!$rootScope.circleId) {
            //         $ionicLoading.hide();
            //     } else {
            //         streamService.getEventSecured($rootScope.circleId, 10, $scope.skip, refresh).then(
            //             function (data) {
            //                 $ionicLoading.hide();
            //                 console.log(data);
            //                 var previous = $scope.stream.length;
            //                 $scope.stream = data;
            //                 $scope.skip += 10;
            //                 $scope.existMoreData = $scope.stream.length > previous;
            //
            //                 if ($scope.stream.length > 0) {
            //                     $scope.$emit('check-follow', $scope.stream[0].isFollowingGroup);
            //                 }
            //
            //                 $ionicScrollDelegate.resize();
            //             }, function (error) {
            //                 $scope.existMoreData = false;
            //                 $ionicLoading.hide();
            //                 var msg = 'There was an error from getStream:' + $rootScope.circleId;
            //                 console.log(msg);
            //             }
            //         )
            //     }
            //     ;
            // };
            $scope.openNewArticle = function () {
                $scope.newArticle_modal.show();
            };
            $scope.closeNewArticle = function () {
                $scope.newArticle_modal.hide();
            };
            // $scope.$on('acc-article-like', function (event, args) {
            //     //crittercismService.leaveBreadcrumb('Like Article - Id:' + args.eventID);
            //     streamService.like(args.eventID).then(
            //         function (data) {
            //             streamService.likeManagement(args);
            //         },
            //         function (error) {
            //             console.log(error);
            //             //messagesService.log(error);
            //             //messagesService.show(constants.messages.stream.like);
            //         }
            //     );
            //     event.stopPropagation();
            // });
            // $scope.$on('acc-article-share', function (event, args) {
            //     if (args.userShareThis == 1) {
            //         return;
            //     }
            //     //crittercismService.leaveBreadcrumb('Share Article - Id:' + args.eventID);
            //
            //     streamService.share(args.eventID).then(
            //         function (data) {
            //             streamService.shareManagement(args);
            //         }, function (error) {
            //             console.log(error);
            //             //messagesService.log(error);
            //             //messagesService.show(constants.messages.stream.share);
            //         }
            //     );
            // });
            // $scope.$on('acc-article-comment', function (event, args) {
            //     streamService.setDetail(args);
            //     $scope.navigateToState('app.article', {articleId: args.eventID, flag: true}, false);
            // });
            // $scope.$on('acc-article-navigate', function (event, args) {
            //     streamService.setDetail(args);
            //     $scope.navigateToState('app.article', {articleId: args.eventID, flag: false}, false);
            // });
            // $scope.$on('acc-article-hashtag', function (event, args) {
            //     $scope.navigateToState('app.discussion', {discussionId: args, circleId: $rootScope.circleId}, false);
            // });
            // $scope.$on('acc-article-profile', function (event, eid, peopleKey) {
            //     $scope.navToPeople(eid, peopleKey);
            // });
            // $scope.$on('post-created', function (event, args) {
            //     $scope.skip = 0;
            //     $scope.existMoreData = true;
            //     streamService.clearStream();
            //     $scope.stream = [];
            //     $scope.loadStream(true);
            // });
            // $scope.doRefresh = function () {
            //
            //     $scope.$broadcast('scroll.refreshComplete');
            //
            //     if ($scope.isCurrent == true) {
            //         $scope.getSchedule(activityId, $scope.ScheduleStartDate, $scope.ScheduleStartLocalDate);
            //     }
            //     //if (typeof $scope.tabIndex !== "undefined" && $rootScope.tabDict.length !== 0 && typeof $rootScope.tabDict[$scope.tabIndex] !== "" && $rootScope.tabDict[$scope.tabIndex].value === "Social" && $rootScope.circleId) {
            //     //    $scope.skip = 0;
            //     //    $scope.existMoreData = true;
            //     //    streamService.clearStream();
            //     //    $scope.stream = [];
            //     //    $scope.loadStream(true);
            //     //}
            // };

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

            // function callAtTimeout() {
            //     //console.log("Timeout occurred");
            //     $ionicLoading.hide();
            //     $scope.showToast('Add to calendar successfully', 'short', 'bottom');
            // }

            $scope.showToast = function (message, duration, location) {
                $cordovaToast.show(message, duration, location).then(function (success) {
                    console.log("The toast was shown");
                }, function (error) {
                    console.log("The toast was not shown due to " + error);
                });
            };

            //#region Attendance Tracking

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
                var AuthorIDType;
                if (!$rootScope.ImpersonateStatus) {
                    if ($rootScope.adminFlage) {
                        AuthorIDType = 4;
                    }
                    else if ($rootScope.trainingItem.pickRule == 1) {
                        AuthorIDType = 2;
                    }
                } else {
                    if ($rootScope.impersonationUserType == 1) {
                        AuthorIDType = 2;
                    }
                }
                console.log('getSessionLearners: pickrule-adminflage', $rootScope.trainingItem.pickRule, $rootScope.adminFlage);
                var timeNow = '';
                if ($rootScope.trainingItem.isCurrent) {
                    timeNow = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC');
                } else {
                    timeNow = filter('date')(personalisedMessageData.timeNowForSchedule, 'MM-dd-yyyy HH:mm:ss', 'UTC');
                }
                trainingService.getLearnerByStatus(loginUserID, AuthorIDType, activityId, attendanceStatus, timeNow).then(function (data) {
                    $ionicLoading.hide();
                    if (data.ReturnCode == 0) {
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
                    }
                    if (index == 3) parseGroupListForMessage();
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
                $scope.sessionParticipantTabCss[index] = 'btn-active';
                $scope.FilterLearners = [];
                $scope.parFlag = index;
                var checkInTimeList = [];
                var checkOutTimeList = [];
                var attendanceStatus = null;

                $ionicLoading.show();

                var AuthorIDType;
                if (!$rootScope.ImpersonateStatus) {
                    if ($rootScope.adminFlage) {
                        AuthorIDType = 4;
                    }
                    else if ($rootScope.trainingItem.pickRule == 1) {
                        AuthorIDType = 2;
                    }
                } else {
                    if ($rootScope.impersonationUserType == 1) {
                        AuthorIDType = 2;
                    }
                }
                console.log('UpdateAllLearners: pickrule-adminflage', $rootScope.trainingItem.pickRule, $rootScope.adminFlage);
                var timeNow = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC');
                trainingService.getLearnerByStatus(loginUserID, AuthorIDType, activityId, attendanceStatus, timeNow).then(function (data) {
                    $ionicLoading.hide();
                    if (data.ReturnCode == 0) {
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
                    }
                    parseGroupListForMessage();
                }, function (data) {
                    console.log('getLearnerByStatus: ' + data);
                    $ionicLoading.hide();
                });

                getRollCall(loginUserID, AuthorIDType, activityId, timeNow);
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
                    var AuthorIDType;
                    if (!$rootScope.ImpersonateStatus) {
                        if ($rootScope.adminFlage) {
                            AuthorIDType = 4;
                        }
                        else if ($rootScope.trainingItem.pickRule == 1) {
                            AuthorIDType = 2;
                        }
                    } else {
                        if ($rootScope.impersonationUserType == 1) {
                            AuthorIDType = 2;
                        }
                    }
                    var timeNow = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC');
                    trainingService.getAttendanceInfo(loginUserID, AuthorIDType, eid, activityId, timeNow).then(function (data) {
                        if (data.ReturnCode == 0) {
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
                if (!$rootScope.ImpersonateStatus) {
                    if ($rootScope.adminFlage) {
                        AuthorIDType = 4;
                    }
                    else if ($rootScope.trainingItem.pickRule == 1) {
                        AuthorIDType = 2;
                    }
                } else {
                    if ($rootScope.impersonationUserType == 1) {
                        AuthorIDType = 2;
                    }
                }
                var timeNow = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC');
                trainingService.getAttendanceInfo(loginUserID, AuthorIDType, eid, activityId, timeNow).then(function (data) {
                    if (data.ReturnCode == 0) {
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
                var AuthorIDType;
                if (!$rootScope.ImpersonateStatus) {
                    if ($rootScope.adminFlage) {
                        AuthorIDType = 4;
                    }
                    else if ($rootScope.trainingItem.pickRule == 1) {
                        AuthorIDType = 2;
                    }
                } else {
                    if ($rootScope.impersonationUserType == 1) {
                        AuthorIDType = 2;
                    }
                }
                var timeNow = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC');
                trainingService.postAttendanceInfo(loginUserID, AuthorIDType, eid, activityId, $scope.percent.value, $scope.participantActionComment, timeNow).then(function (data) {
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
                var AuthorIDType;
                if (!$rootScope.ImpersonateStatus) {
                    if ($rootScope.adminFlage) {
                        AuthorIDType = 4;
                    }
                    else if ($rootScope.trainingItem.pickRule == 1) {
                        AuthorIDType = 2;
                    }
                } else {
                    if ($rootScope.impersonationUserType == 1) {
                        AuthorIDType = 2;
                    }
                }
                var timeNow = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC')
                trainingService.postCheckIn(loginUserID, AuthorIDType, learnerId, activityId, '', timeNow).then(function (data) {
                    $ionicLoading.hide();
                    if (data.ReturnCode == 0) {
                        $scope.UpdateAllLearners();
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
                $ionicLoading.show();
                var AuthorIDType;
                if (!$rootScope.ImpersonateStatus) {
                    if ($rootScope.adminFlage) {
                        AuthorIDType = 4;
                    }
                    else if ($rootScope.trainingItem.pickRule == 1) {
                        AuthorIDType = 2;
                    }
                } else {
                    if ($rootScope.impersonationUserType == 1) {
                        AuthorIDType = 2;
                    }
                }
                var checkInDT = new Date();
                var timeNow = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC');
                trainingService.postCheckIn(loginUserID, AuthorIDType, eid, activityId, '', timeNow).then(function (data) {
                    $ionicLoading.hide();
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
                        $scope.showToast('Check in success!', 'short', 'bottom');
                    }
                }, function (data) {
                    console.log(" -- When click to check in,the ReturnCode is " + data.ReturnCode + " -- ");
                    $ionicLoading.hide();
                });
                getRollCall(loginUserID, AuthorIDType, activityId, timeNow);
            };

            $scope.checkInAll = function () {
                $ionicLoading.show();
                var AuthorIDType;
                if ($rootScope.adminFlage) {
                    AuthorIDType = 4;
                }
                else if ($rootScope.trainingItem.pickRule == 1) {
                    AuthorIDType = 2;
                }
                var timeNow = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC');
                trainingService.postCheckIn(loginUserID, AuthorIDType, '', activityId, '', timeNow).then(function (data) {
                    if (data.ReturnCode == 0) {
                        var timeNow = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC');
                        getRollCall(loginUserID, AuthorIDType, activityId, timeNow);
                        $scope.showToast('Check in all success!', 'short', 'bottom');
                    }
                }, function (data) {
                    console.log(" -- When click to check in all,the ReturnCode is " + data.ReturnCode + " -- ");
                    $ionicLoading.hide();
                });
            }

            $scope.showAttendanceTracking = function (dayTime, date, fromMain, isCurrentState) {
                $scope._dayTime = dayTime;
                $scope._date = filter('dateProcessing')(date);
                $scope.isCurrentState = isCurrentState;
                if (typeof $scope.Schedule[0] != 'undefined')
                    personalisedMessageData.timeNowForSchedule = $scope.Schedule[0]["@eventDate"];

                if (!fromMain) {
                    $ionicModal.fromTemplateUrl('conLearning/event/trainingDetail/tabs/attendance/attendance.main.html', {
                        scope: $scope
                    }).then(function (modal) {
                        $scope.attendanceModal = modal;
                        $scope.getSessionLearners(3);
                        var AuthorIDType;
                        if (!$rootScope.ImpersonateStatus) {
                            if ($rootScope.adminFlage) {
                                AuthorIDType = 4;
                            }
                            else if ($rootScope.trainingItem.pickRule == 1) {
                                AuthorIDType = 2;
                            }
                        } else {
                            if ($rootScope.impersonationUserType == 1) {
                                AuthorIDType = 2;
                            }
                        }
                        var timeNow = '';
                        if ($rootScope.trainingItem.isCurrent) {
                            timeNow = filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss', 'UTC');
                        } else {
                            timeNow = filter('date')(new Date($scope.Schedule[0]["@eventDate"]), 'MM-dd-yyyy HH:mm:ss', 'UTC');
                        }
                        getRollCall(loginUserID, AuthorIDType, activityId, timeNow);
                        $scope.attendanceModal.show();
                    })
                }
            };

            //#endregion

            //Expand or merger Choose Circle
            // $scope.isShowCircles = function () {
            //     $scope.openCircles = !$scope.openCircles;
            //     if ($scope.openCircles) {
            //         $scope.chooseCircleIcon = 'icon ion-chevron-left placeholder-icon';
            //     } else {
            //         $scope.chooseCircleIcon = 'icon ion-chevron-right placeholder-icon';
            //     }
            // };
            //
            // $scope.selectCircle = function (circle) {
            //     $rootScope.circleId = '';
            //     $rootScope.circleId = circle.circleID;
            //     $scope.circleTitle = 'Circle';
            //     $scope.circleTitle = $scope.circleTitle + ' - ' + circle.circleName;
            //
            //     $scope.isShowCircles();
            //
            //     $scope.stream = [];
            //     $scope.skip = 0;
            //     $scope.existMoreData = true;
            //     $scope.isLoading = false;
            //     //$scope.showPost = true;
            //
            //     streamService.clearStream();
            //
            //     if (streamService.getCurrentStream().length == 0) {
            //         $scope.loadStream(true);
            //     }
            //     else {
            //         $scope.stream = streamService.getCurrentStream();
            //         $scope.skip = streamService.getCurrentStream().length;
            //     }
            //     $ionicModal.fromTemplateUrl('templates/event/stream/new-post.html', {
            //         scope: $scope
            //     }).then(function (modal) {
            //         $scope.newArticle_modal = modal;
            //     });
            // };

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
                personalisedMessageData.isCurrentState = $scope.isCurrentState;
                personalisedMessageData._date = $scope._date;
                $scope.attendanceModal.hide();
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
                console.log('all list ', personalisedMessageData.allParticipantsList);
                console.log('CheckIn List ', personalisedMessageData.checkInList);
                console.log('CheckOut List ', personalisedMessageData.checkOutList);
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

            $scope.init();

            $scope.venueOptions = ["LOCATION MAP", "FLOOR MAPS", "WEATHER", "ALL PEOPLE AT THIS FACILITY", "ALL COURSES AT THIS FACILITY"];

            // $scope.navigateFeedback = function (activityID, $event) {
            //     //$scope.navigateToState('app.eventFeedback', {item:list},false);
            //     $ionicLoading.show();
            //     trainingService.getSurveyForSession(activityID).then(
            //         function (data) {
            //             if (data) {
            //                 var url = data.replace(/["]/g, "");
            //                 if (typeof cordova == 'undefined') {
            //                     window.open(url, '_system', 'location=yes');
            //                     $ionicLoading.hide();
            //                 }
            //                 else {
            //                     $scope.openSurvey(url);
            //                 }
            //             }
            //             else {
            //                 //pop up no survey found.
            //                 var msg = 'No Survey Found!';
            //                 console.log(msg);
            //                 $ionicLoading.hide();
            //             }
            //         },
            //
            //         function (data, status) {
            //             // Error loading expenses message
            //             var msg = 'There was an error loading Survey. Please, try again later';
            //             console.log(msg);
            //             $ionicLoading.hide();
            //         }
            //     );
            //     $event.stopPropagation();
            //
            //     //var ref  = cordova.InAppBrowser.open('https://mylbuild.accenture.com/ces/router.aspx?courseCode=A87465&sessionCode=AA77&evaluatorRole=student&courseType=classroom&surveyType=EOC', '_blank', 'location=yes');
            // };
            //
            // $scope.openSurvey = function (url) {
            //     var target = "_blank";
            //     var options = "location=yes,hidden=yes";
            //     $scope.inAppBrowserRef = cordova.InAppBrowser.open(url, target, options);
            //     $scope.inAppBrowserRef.addEventListener('loadstart', loadStartCallBack);
            //     $scope.inAppBrowserRef.addEventListener('loadstop', loadStopCallBack);
            //     $scope.inAppBrowserRef.addEventListener('loaderror', loadErrorCallBack);
            //     $scope.inAppBrowserRef.addEventListener('exit', exitCallBack);
            // }
            //
            // function loadStartCallBack() {
            //
            //     //$ionicLoading.show();
            //     console.log("Start load survey page");
            // }
            //
            // function loadStopCallBack() {
            //
            //     if ($scope.inAppBrowserRef != undefined) {
            //
            //         $scope.inAppBrowserRef.insertCSS({code: "body{font-size: 20px;"});
            //
            //         $ionicLoading.hide();
            //
            //         $scope.inAppBrowserRef.show();
            //     }
            //
            // }
            //
            // function loadErrorCallBack(params) {
            //     $ionicLoading.hide();
            //
            //     var scriptErrorMesssage =
            //         "alert('Sorry we cannot open that page. Message from the server is : "
            //         + params.message + "');"
            //
            //     console.log(scriptErrorMesssage);
            //
            //     $scope.inAppBrowserRef.close();
            //
            //     $scope.inAppBrowserRef = undefined;
            //
            // }
            //
            // function exitCallBack() {
            //     $scope.$broadcast('scroll.refreshComplete');
            // }


            /* Part : tab.venue */
            var indexOfCenter = null;
            $scope.whichFacility = null;
            $scope.weather = [];
            var centerImage = [];
            var centerInfor = null;
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
            var venueOptionsInit = [
                "LOCATION MAP",
                "FLOOR MAPS",
                "WEATHER",
                "ALL PEOPLE AT THIS FACILITY",
                "ALL COURSES AT THIS FACILITY",
                "ADDITIONAL INFORMATION"
            ];
            
            function getFahrenheit() {
                $scope.fontSizeC = 'facilityVenueWeather-top-info-btn bdrn';
                $scope.fontSizeF = 'facilityVenueWeather-top-info-btn active bdrn';
                getWeatherInfo($scope.whichFacility.city, 'f');
            }

            function getCentigrade() {
                $scope.fontSizeC = 'facilityVenueWeather-top-info-btn active bdrn';
                $scope.fontSizeF = 'facilityVenueWeather-top-info-btn bdln';
                getWeatherInfo($scope.whichFacility.city, 'c');
            }

            // Get weather info in venue page
            function getWeatherInfo(loc, degree) {
                var searchCondition = "select item from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + loc + "') and u='" + degree + "'";
                trainingService.getWeatherInfo(searchCondition).then(
                    function (weatherdata) {
                        $scope.weather = [];
                        angular.forEach(weatherdata, function (item) {
                            $scope.weather.push(item);
                        });
                        $scope.weatherCard = true;
                        $ionicLoading.hide();
                    },
                    function (weatherdata, status) {
                        $ionicLoading.hide();
                        var msg = 'System fails to load data.';
                        console.log(msg);
                        $scope.showToast(msg, 'short', 'bottom');
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                );

            }

            function getRegion() {
                $ionicLoading.show();
                trainingService.getRegion().then(
                    function (result) {
                        var resultArray = result.split(';');
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
                        $ionicLoading.hide();
                        var msg = 'System fails to load data.';
                        console.log(msg);
                        $scope.showToast(msg, 'short', 'bottom');
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
                getSingleFacility($rootScope.trainingItem.currentTrainingId, $rootScope.trainingItem.facilityID);
                switch ($rootScope.trainingItem.facilityID) {
                    case 1:
                        indexOfCenter = 0;
                        centerInfor = "https://techops.accenture.com/share/RLC/St.Charles_Learning_Center_Venue_Information.pdf";
                        break;
                    case 737:
                        indexOfCenter = 1;
                        centerInfor = "https://techops.accenture.com/share/RLC/Kuala_Lumpur_Learning_Center_Venue_Information.pdf";
                        break;
                    case 2612:
                        indexOfCenter = 2;
                        centerInfor = "https://techops.accenture.com/share/RLC/Madrid_Learning_Center_Venue_Information.pdf";
                        break;
                    case 4404:
                        indexOfCenter = 3;
                        centerInfor = "https://techops.accenture.com/share/RLC/India_Learning_Center_Venue_Information.pdf";
                        break;
                    case 4790:
                        indexOfCenter = 4;
                        centerInfor = "https://techops.accenture.com/share/RLC/London_Learning_Center_Venue_Information.pdf";
                        break;
                    case 6176:
                        indexOfCenter = 5;
                        centerInfor = "https://techops.accenture.com/share/RLC/Dublin_Learning_Center_Venue_Information.pdf";
                        break;
                    default :
                        indexOfCenter = 6;
                        centerInfor = null;
                        venueOptionsInit.pop();
                        break;
                }
                $scope.venueOption = venueOptionsInit;
                $scope.centerImg = centerImage[indexOfCenter];
            }

            var venueMap = function () {
                getRegion();
                //$ionicLoading.show();
                $ionicModal.fromTemplateUrl('conLearning/event/learningCenter/facilityVenueMap.html', {
                    scope: $scope,
                    animation: 'slide-in-right'
                }).then(function (modal) {
                    $scope.facilityVenueOptions_modal = modal;
                    modal.show();
                    $ionicLoading.hide();
                }, function () {
                    $ionicLoading.hide();
                });
            };

            var venueWeather = function () {
                getRegion();
                $ionicModal.fromTemplateUrl('conLearning/event/learningCenter/facilityVenueWeather.html', {
                    scope: $scope,
                    animation: 'slide-in-right'
                }).then(function (modal) {
                    $scope.facilityVenueOptions_modal = modal;
                    modal.show();
                });
            };

            var getLearningCenter = function () {
                centerImage = getFacilityInfoService.getCenterImageList().centerImages;
                getCenter();
            };
            // getLearningCenter();
            $scope.hideVenueOptions = function () {
                $scope.facilityVenueOptions_modal.hide()
            };

            $scope.getFahrenheit = function () {
                getFahrenheit();
            };

            $scope.getCentigrade = function () {
                getCentigrade();
            };
            function downloadAdditionalVenueInfo() {
                if(centerInfor){
                    window.open(centerInfor, '_system', 'location=yes');
                }else {
                    $cordovaToast.show("No Additional Information of This Center.", 'long', 'bottom');
                }
            }

            $scope.facilityVenueOptions = function (option) {
                switch (option) {
                    case "LOCATION MAP" :
                        venueMap();
                        break;
                    case "FLOOR MAPS" :
                        $scope.navigateToState('app.floorMap');
                        break;
                    case "WEATHER" :
                        venueWeather();
                        break;
                    case "ALL PEOPLE AT THIS FACILITY" :
                        $scope.navigateToPeopleOnSite();
                        break;
                    case "ALL COURSES AT THIS FACILITY" :
                        $scope.navigateToOnGoingEvent($rootScope.trainingItem.facilityID);
                        break;
                    case "ADDITIONAL INFORMATION" :
                        downloadAdditionalVenueInfo();
                        break;
                    default:break;
                }
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

app.filter('weatherDateProcessing', function () {
    return function (inputDate) {
        var date = null;
        var inputDateArr = inputDate.split(" ");
        if (inputDateArr[0] == 1) {
            date = inputDateArr[0] + "st " + inputDateArr[1];
        }
        else if (inputDateArr[0] == 2) {
            date = inputDateArr[0] + "nd " + inputDateArr[1];
        }
        else if (inputDateArr[0] == 3) {
            date = inputDateArr[0] + "rd " + inputDateArr[1];
        }
        else {
            date = inputDateArr[0] + "th " + inputDateArr[1];
        }
        return date;
    }
});