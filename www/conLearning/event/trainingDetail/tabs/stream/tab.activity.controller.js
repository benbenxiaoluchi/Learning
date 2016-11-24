'use strict';

controllers.controller('tabActivityController',
    ['$scope', '$rootScope', 'trainingService', '$log', '$ionicModal', '$ionicLoading', 'authService', '$cordovaToast', '$cordovaClipboard', '$ionicPopup', 'localStorageService', '$cordovaCalendar', 'streamService', '$ionicScrollDelegate', '$cordovaDevice', 'environmentData', 'connectedLearning.constants.environments', 'aclAuthService', '$filter', '$stateParams', 'menuService', 'itemPathService', 'getFacilityInfoService',
        function ($scope, $rootScope, trainingService, $log, $ionicModal, $ionicLoading, authService, $cordovaToast, $cordovaClipboard, $ionicPopup, localStorageService, $cordovaCalendar, streamService, $ionicScrollDelegate, device, environmentData, environments, aclAuthService, filter, $stateParams, menuService, itemPathService, getFacilityInfoService) {
            var defaultCircle = {};
            var authorIDType;
            var activityID = null;
            var viewCircleIDList = [];
            var postCircleID;

            $scope.init = function () {
                $rootScope.isContentDisabled = false;
                $ionicLoading.show();
                viewCircleIDList = [];
                postCircleID = {};
                $scope.showPost = false;
                $ionicModal.fromTemplateUrl('conLearning/event/trainingDetail/tabs/stream/select-circle.html', {
                    scope: $scope
                }).then(function (modal) {
                    $scope.selectCircle_modal = modal;
                });

                if ($stateParams !== null && typeof $stateParams !== 'undefined' && !angular.equals({}, $stateParams)){
                    if($stateParams.fromMyTraining){
                        //$scope.trainingItem = $stateParams.selectedTraining;
                        getLoginUserInfo();
                        getCircleList();
                        $scope.initNotification();
                    }
                    else if($rootScope.trainingItem && $rootScope.trainingItem.fromAdmin){
                        getLoginUserInfo();
                        getCircleList();
                        $scope.initNotification();
                    }
                    else {
                        var activityDate = {};

                        var currentEnvironment = window.currentEnvironment;
                        if (currentEnvironment === environments.DEV) {
                            authService.callService({
                                serviceName: environmentData.services.myLearningService.serviceName,
                                action: trainingService.getActivityEventInfo,
                                params: {}
                            }).then(function (data) {
                                if (typeof data !== 'undefined' && data.ReturnCode === 0 && data.Content !== null && !angular.equals({}, data.Content)) {
                                    var jwt, claims, dateDuration, imgName;

                                    // get login user information
                                    jwt = authService.jwt;
                                    console.log('jwt');
                                    claims = $scope.getProfileInformation(jwt);
                                    console.log('claims');
                                    $scope.getClaim(claims);

                                    dateDuration = itemPathService.myTrainingCardDurationFilter({
                                        'startDtLOCAL': data.Content.CourseStartDtLocal,
                                        'endDtLOCAL': data.Content.CourseEndDtLocal
                                    });
                                    imgName = getFacilityInfoService.filterCenterImage(data.Content.FacilityID);
                                    activityDate = {
                                        "currentTrainingId": data.Content.ActivityID,
                                        "currentTrainingTitle": data.Content.ActivityName,
                                        "currentTrainingDate": dateDuration.dateDuration,
                                        "currentLocation": data.Content.SessionLocation,
                                        "city": data.Content.CourseLocation,
                                        "pickRule": data.Content.IsFaculty,
                                        "facilityID": data.Content.FacilityID,
                                        "dateDuration": dateDuration.dateDuration,
                                        "fromAdmin": false,
                                        "isPastSession": false,
                                        "isCurrent": true,
                                        "ScheduleStartDate": data.Content.CourseStartDt,
                                        "ScheduleStartLocalDate": data.Content.CourseStartDtLocal,
                                        "ScheduleEndDate": data.Content.CourseEndDt,
                                        "ScheduleEndLocalDate": data.Content.CourseEndDtLocal,
                                        "FacilityID": data.Content.FacilityID,
                                        "SessionDay": data.Content.SessionDay,
                                        "SessionEventDate": data.Content.SessionEventDate,
                                        "SessionName": data.Content.SessionName,
                                        "SessionDescription": data.Content.SessionDescription,
                                        "SessionLocation": data.Content.SessionLocation,
                                        "SessionStartTime": data.Content.SessionStartTime,
                                        "SessionEndTime": data.Content.SessionEndTime,
                                        "imgName": imgName
                                    };
                                    $ionicLoading.hide();
                                    getLoginUserInfo();
                                    getCircleList();
                                    $scope.initNotification();
                                } else{
                                    $ionicLoading.hide();
                                    activityDate = {
                                        "imgName": "DefaultVenue.jpg"
                                    };
                                }

                                $rootScope.trainingItem = activityDate;
                                $rootScope.activityID = activityDate.currentTrainingId;
                                if ($rootScope.activityID == null || $rootScope.activityID == '' || typeof $rootScope.activityID == 'undefined') {
                                    $rootScope.isContentDisabled = true;
                                } else{
                                    $rootScope.isContentDisabled = false;
                                }
                            }, function (error) {
                                $rootScope.trainingItem = activityDate;
                                if ($rootScope.trainingItem == null || typeof $rootScope.trainingItem == 'undefined' || angular.equals({}, $rootScope.trainingItem)) {
                                    $rootScope.isContentDisabled = true;
                                }

                                console.log(error);
                                $scope.showLoading = false;
                                $ionicLoading.hide();
                            });
                        } else{
                            $ionicLoading.hide();
                            activityDate = {
                                "imgName": "DefaultVenue.jpg"
                            };
                            $rootScope.trainingItem = activityDate;
                            $rootScope.activityID = activityDate.currentTrainingId;
                            if ($rootScope.activityID == null || $rootScope.activityID == '' || typeof $rootScope.activityID == 'undefined') {
                                $rootScope.isContentDisabled = true;
                            } else{
                                $rootScope.isContentDisabled = false;
                            }
                        }
                    }
                }
            };

            $scope.modifyDefaultCircle = function (circle) {
                $ionicLoading.show();
                authService.callService({
                    serviceName: environmentData.services.myLearningService.serviceName,
                    action: trainingService.modifyDefaultCircle,
                    params: {
                        AuthorID: $rootScope.loginUserID,
                        AuthorIDType: $rootScope.adminFlage ? 4 : ($rootScope.trainingItem.pickRule === 0 ? 1 : 2),
                        ActivityID: $rootScope.activityID,
                        DefaultCircleID: circle.circleID,
                        DefaultCircleName: circle.circleName
                    }
                }).then(function (data) {
                    if (typeof data !== '' && data.ReturnCode === 0) {
                        getCircleList();
                    }
                }, function (error) {
                    console.log(error);
                    $scope.showLoading = false;
                    $ionicLoading.hide();
                });
            };

            var getLoginUserInfo = function () {
                if (!$rootScope.fistLoad) {
                    //Get profile image
                    menuService.getProfileImageModel($rootScope.loginUserID).then(function (data) {
                        $rootScope.profileImage = data[0].m_Uri;
                    });
                    //Get profile infomation
                    menuService.getProfileInfoModel($rootScope.loginUserID).then(function (data) {
                        $scope.profileInfo = data["CupsProfile"][0];
                        if (data["CupsProfile"][0].firstname != '') {
                            $rootScope.fullName = data["CupsProfile"][0].lastname + ', ' + data["CupsProfile"][0].firstname;
                        } else {
                            $rootScope.fullName = '';
                        }
                    });
                    //alert('Event');
                    //impersonateService.getACLWhitelistUser($rootScope.loginUserID).then(function (data) {
                    //    $rootScope.showSplash = false;
                    //    if (data.isAdmin == 1)
                    //        $rootScope.adminFlage = true;
                    //});
                    $rootScope.fistLoad = false;
                }
            };
            var getCircleList = function () {
                $scope.Circles = [];
                $scope.showCircleList = false;

                authService.callService({
                    serviceName: environmentData.services.myLearningService.serviceName,
                    action: trainingService.getCircles,
                    params: {authorID: ($rootScope.ImpersonateStatus == true ? $rootScope.impersonationEID : $rootScope.loginUserID), authorIDType: 2, activityID: $rootScope.activityID}
                }).then(function (data) {
                    if (typeof data !== 'undefined' && data.ReturnCode === 0 && data.Content !== null && !angular.equals({}, data.Content)) {
                        $scope.chooseCircleShow = true;
                        $scope.chooseCircleIcon = 'icon ion-chevron-right placeholder-icon';
                        //$scope.Circles = data.Content;

                        angular.forEach(data.Content, function (item) {
                            if (item.defaultCircle === 1) {
                                $rootScope.circleId = item.circleID;
                                defaultCircle = item;
                                console.log(item.circleName);

                                item.isViewCircle = true;
                                item.isPostCircle = true;
                            } else{
                                item.isViewCircle = false;
                                item.isPostCircle = false;
                            }

                            $scope.Circles.push(item);
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
                    $ionicLoading.hide();
                }, function (error) {
                    console.log(error);
                    $scope.showLoading = false;
                    $ionicLoading.hide();
                });
            };

            $scope.circleListTrigger = function () {
                // $scope.showCircleList = !$scope.showCircleList;
                // $ionicScrollDelegate.resize();
                viewCircleIDList = [];
                postCircleID = {};
                $scope.hideSelectCircle();

                angular.forEach($scope.Circles, function (item) {
                    if (item.isViewCircle){
                        viewCircleIDList.push(item.circleID);
                    }

                    if (item.isPostCircle){
                        postCircleID = item;
                    }
                });

                $scope.modifyDefaultCircle(postCircleID);
            };

            //get Social data
            $scope.loadStream = function (refresh) {
                $ionicLoading.show();
                //$rootScope.circleId = '79dbd409-5edc-46a9-8e92-0006751722fe';
                //$rootScope.circleId = '81a424fd-d526-4f0e-8145-88360d84f799';
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
                if (!$rootScope.ImpersonateStatus) {
                    $scope.newArticle_modal.show();
                }
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
                if (typeof $scope.tabIndex !== "undefined" && $rootScope.tabDict.length !== 0 && typeof $rootScope.tabDict[$scope.tabIndex] !== "" && $rootScope.tabDict[$scope.tabIndex].value === "Social" && $rootScope.circleId) {
                    $scope.skip = 0;
                    $scope.existMoreData = true;
                    streamService.clearStream();
                    $scope.stream = [];
                    $scope.loadStream(true);
                }
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
                $scope.showPost = true;

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

            $scope.fakeItem = {
                "id": "1",
                "date": "Oct 17, 2016",
                "name": "School Opening",
                "starttime": "08:00",
                "endtime": "12:00",
                "location": "Plenary Room",
                "description": "",
                "isCurrentState": false,
                "isUpcomingState": false,
                "isPastState": true,
                "sessionStates": "Competed"
            };
            /*
            $scope.navigateToMaterials = function (dayTime, date, startTime, endTime, sessionName, location, sessionState, pickrule, item) {
                $scope.navigateToState('app.materials', {
                    dayTime: dayTime,
                    date: date,
                    startTime: startTime,
                    endTime: endTime,
                    sessionName: sessionName,
                    location: location,
                    sessionState: sessionState,
                    pickrule: pickrule,
                    fromMain: true
                }, false);
            };*/

            $scope.openSelectCircle = function () {
                $scope.showPost = false;

                $scope.selectCircle_modal.show();
            };

            $scope.hideSelectCircle = function () {
                $scope.showPost = false;
                $scope.selectCircle_modal.hide();
            };

            $scope.updateViewCircle = function ($index) {
                $scope.Circles[$index].isViewCircle = !$scope.Circles[$index].isViewCircle;
            };

            $scope.updatePostCircle = function (item) {
                angular.forEach($scope.Circles, function (iterateItem) {
                    iterateItem.isPostCircle = (item.circleID === iterateItem.circleID);
                });
            };

            $scope.$on('$ionicView.enter', function (e) {
                $scope.init();
            });
        }]);