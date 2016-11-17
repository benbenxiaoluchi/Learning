'use strict';

controllers.controller('tabActivityController',
    ['$scope', '$rootScope', 'trainingService', '$log', '$ionicModal', '$ionicLoading', 'authService', '$cordovaToast', '$cordovaClipboard', '$ionicPopup', 'localStorageService', '$cordovaCalendar', 'streamService', '$ionicScrollDelegate', '$cordovaDevice', 'environmentData', 'connectedLearning.constants.environments', 'aclAuthService', 'personalisedMessageService', '$filter', 'personalisedMessageData', '$stateParams', 'menuService',
        function ($scope, $rootScope, trainingService, $log, $ionicModal, $ionicLoading, authService, $cordovaToast, $cordovaClipboard, $ionicPopup, localStorageService, $cordovaCalendar, streamService, $ionicScrollDelegate, device, environmentData, environments, aclAuthService, personalisedMessageService, filter, personalisedMessageData, $stateParams, menuService) {
            var defaultCircle = {};
            var authorIDType;
            var activityID = null;
            var viewCircleIDList = [];
            var postCircleID;
            $scope.unReadIcon = false;

            $scope.init = function () {
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
                    }
                    else{
                        if($stateParams.fromEventUpdate){
                            var mockDate = {
                                "currentTrainingId": 1294922,
                                "currentTrainingTitle": "design thinking",
                                "currentTrainingDate":"Oct 24 - 25",
                                "PATH": "Bangalore",
                                "PickRule": 1,
                                "facilityID": 1,
                                "dateDuration": "Oct 24 - 25",
                                "fromAdmin": false
                            };
                            $rootScope.trainingItem = mockDate;
                            $rootScope.activityID = 1294922;
                        }
                        else if($rootScope.trainingItem && $rootScope.trainingItem.fromAdmin){

                        }
                        else{ //first loading
                            var mockDate = {
                                "currentTrainingId": 1294922,
                                "currentTrainingTitle": "design thinking",
                                "currentTrainingDate":"Oct 24 - 25",
                                "PATH": "Bangalore",
                                "PickRule": 1,
                                "facilityID": 1,
                                "dateDuration": "Oct 24 - 25",
                                "fromAdmin": false
                            };
                            $rootScope.trainingItem = mockDate;
                            $rootScope.activityID = 1294922;
                        }

                    }
                }

                authService.callService({
                    serviceName: environmentData.services.myLearningService.serviceName,
                    action: trainingService.getTrainingModel,
                    params: {}
                }).then(function (data) {
                    var jwt, claims;

                    //removed by qiang
                    //if (window.currentEnvironment != environments.MOCK) {
                        jwt = authService.jwt;
                        // //jwt = aclAuthService.getJWT();
                        console.log('jwt');
                        //     console.log(jwt);
                        claims = $scope.getProfileInformation(jwt);
                        // //claims = aclAuthService.getProfileInformation(jwt);
                        console.log('claims');
                        //     console.log(claims);
                        $scope.getClaim(claims);
                    //}

                    getLoginUserInfo();
                    getCircleList();
                    initNotification();

                });

            };
            // init for refresh the notification message page
            var initNotification = function () {

                $scope.notificationsListUnRead = [];
                $scope.notificationsListReaded = [];
                $scope.unreadCount = null;
                personalisedMessageService.getNotificationList(($rootScope.ImpersonateStatus == true ? $rootScope.impersonationEID : $rootScope.loginUserID), activityID).then(function (data) {
                    if (data && data.Content && data.Content != null) {
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
            //Hide the notification message page

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
                            timeStramp:new Date(item.MessageSendDate)
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

                if ($rootScope.ImpersonateStatus == false ) {
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

            $scope.modifyDefaultCircle = function (circle) {
                $ionicLoading.show();
                authService.callService({
                    serviceName: environmentData.services.myLearningService.serviceName,
                    action: trainingService.modifyDefaultCircle,
                    params: {
                        AuthorID: $rootScope.ImpersonateStatus == true ? $rootScope.impersonationEID : $rootScope.loginUserID,
                        AuthorIDType: 2,
                        ActivityID: 1294922,
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
                    params: {authorID: ($rootScope.ImpersonateStatus == true ? $rootScope.impersonationEID : $rootScope.loginUserID), authorIDType: 2, activityID: $scope.trainingItem.activityID}
                }).then(function (data) {
                    if (typeof data !== '' && data.ReturnCode === 0 && typeof data.Content.length !== 'undefined') {
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
            };

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