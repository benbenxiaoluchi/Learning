/// <reference path="../profile/recommendations/skills.recommended.html" />
/*global controllers, ionic, angular, window*/

controllers.controller('baseController', ['$scope', '$state', '$window', '$filter', '$ionicHistory', '$ionicPlatform', '$rootScope', '$timeout', '$location', 'profileService', 'authService', 'connectedLearning.constants.environments', 'environmentData', 'connectedLearning.methods', 'connectedLearning.constants', '$ionicScrollDelegate', 'crittercismService', '$ionicSlideBoxDelegate', 'localStorageService',
    // Merge from LearningEvents Injection, may not work since files lack - Booker(0912)
    'menuService', '$ionicLoading', '$sce', '$ionicModal', '$ionicPopup', '$cordovaClipboard', '$cordovaToast', 'streamService', 'impersonateService', 'itemPathService', 'personalisedMessageService', 'personalisedMessageData', '$stateParams', 'getFacilityInfoService',
    function ($scope, $state, $window, filter, $ionicHistory, $ionicPlatform, $rootScope, $timeout, $location, profileService, authService, environments, environmentData, methods, constants, $ionicScrollDelegate, crittercismService, $ionicSlideBoxDelegate, localStorageService,
              // Merge from LearningEvents Injection, may not work since files lack - Booker(0912)
              menuService, $ionicLoading, $sce, $ionicModal, $ionicPopup, $cordovaClipboard, $cordovaToast, streamService, impersonateService, itemPathService, personalisedMessageService, personalisedMessageData, $stateParams, getFacilityInfoService) {
        /// <summary>
        /// Controller that manages functionality related to base functionality
        /// </summary>
        /// <param name="$scope">
        /// scope is an object that refers to the application model. It is an execution context for expressions.
        /// Scopes are arranged in hierarchical structure which mimic the DOM structure of the application.
        /// Scopes can watch expressions and propagate events.
        /// </param>
        /// <param name="$rootScope">Same kind as before but this it's common for all controllers.</param>
        /// <param name="$timeout">
        /// Angular's wrapper for window.setTimeout. The fn function is wrapped into a try/catch block and delegates any exceptions
        /// to $exceptionHandler service.
        /// </param>
        /// <param name="$filter">
        /// Angular's service which purpose is to format the value of an expression for display to the user
        /// </param>
        /// <param name="constants">Application constants.</param>
        /// <param name="methods">Application common methods.</param>
        /// <param name="messages">Contains service to broadcast events.</param>
        /// <param name="profileService">Contains REST calls to users service for connectedLearning application.</param>
        /// <param name="$cordovaToast">Cordova plugin to manage toast messages.</param>
        /// <doc>connectedLearning.controllers:baseController</doc>

        'use strict';

        //#region Properties

        console.log($window.navigator);
        console.log($window.navigator.onLine);
        console.log("baseController");

        var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
        //base64 decode
        function base64decode(str) {
            var c1, c2, c3, c4;
            var i, len, out;
            len = str.length;
            i = 0;
            out = "";
            while (i < len) {
                /* c1 */
                do {
                    c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
                }
                while (i < len && c1 == -1);
                if (c1 == -1)
                    break;
                /* c2 */
                do {
                    c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
                }
                while (i < len && c2 == -1);
                if (c2 == -1)
                    break;
                out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
                /* c3 */
                do {
                    c3 = str.charCodeAt(i++) & 0xff;
                    if (c3 == 61)
                        return out;
                    c3 = base64DecodeChars[c3];
                }
                while (i < len && c3 == -1);
                if (c3 == -1)
                    break;
                out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
                /* c4 */
                do {
                    c4 = str.charCodeAt(i++) & 0xff;
                    if (c4 == 61)
                        return out;
                    c4 = base64DecodeChars[c4];
                }
                while (i < len && c4 == -1);
                if (c4 == -1)
                    break;
                out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
            }
            return out;
        };
        function setUserActivity(location) {

            switch (location) {
                case 'app.skillsRecommended':
                    crittercismService.beginTransaction('User_Activity_View_Recommended_Skills');
                    crittercismService.endTransaction('User_Activity_View_Recommended_Skills');
                    break;
                case 'app.home':
                    crittercismService.beginTransaction('User_Activity_View_Recommendedations');
                    crittercismService.endTransaction('User_Activity_View_Recommendedations');
                    break;
                case 'app.skills':
                    crittercismService.beginTransaction('User_Activity_View_Skills_Im_Following');
                    crittercismService.endTransaction('User_Activity_View_Skills_Im_Following');
                    break;
                case 'app.plan':
                    crittercismService.beginTransaction('User_Activity_View_Action_Plan');
                    crittercismService.endTransaction('User_Activity_View_Action_Plan');
                    break;
                case 'app.feedback':
                    crittercismService.beginTransaction('User_Activity_View_Feedback');
                    crittercismService.endTransaction('User_Activity_View_Feedback');
                    break;
                case 'app.tutorial':

                    if (!$scope.settings.haveSeenTutorial) {
                        $scope.hideNavBar = true;
                    }
                    else {
                        $scope.hideNavBar = false;
                    }
                    $timeout(function () {
                        $ionicSlideBoxDelegate.$getByHandle('tutorialSlide').slide(0);
                        $('.tutoPageCounter').show();
                        $('.tutoGetStarted').hide();
                    }, 200);

                    $('.forBlackTutorialPage').show();
                    crittercismService.beginTransaction('User_Activity_View_Tutorial');
                    crittercismService.endTransaction('User_Activity_View_Tutorial');
                    break;
                case 'app.about':
                    crittercismService.beginTransaction('User_Activity_View_About');
                    crittercismService.endTransaction('User_Activity_View_About');
                    break;
                case 'app.addSkills':
                    crittercismService.beginTransaction('User_Activity_View_AddSkills');
                    crittercismService.endTransaction('User_Activity_View_AddSkills');
                case 'app.people':
                    crittercismService.beginTransaction('User_Activity_View_Profile');
                    crittercismService.endTransaction('User_Activity_View_Profile');
                    break;
            }
        }

        var updateFlag;

        function onSuccess(contacts) {

            var contact;
            if (contacts.length == 0) {
                updateFlag = false;
                contact = navigator.contacts.create();  // create a new contact object

                contact.emails = [{'id': 1, 'type': 'work', 'value': $scope.profileInfo.workemail, 'pref': true}];
                contact.ims = [{
                    'id': '1',
                    'type': 'lync',
                    'value': $scope.profileInfo.workemail,
                    'pref': false
                }];

            } else {
                updateFlag = true;
                contact = contacts[0];  // create a new contact object
            }


            contact.displayName = $scope.profileInfo.lastname + ', ' + $scope.profileInfo.firstname;
            contact.nickname = $stateParams.eid;            // specify both to support all devices

            var name = new ContactName();
            name.givenName = $scope.profileInfo.lastname;
            name.familyName = $scope.profileInfo.firstname;
            contact.name = name;


            contact.organizations = [{
                'id': '1',
                'type': 'work',
                'title': $scope.profileInfo.standardjobdescr,
                'name': 'Accenture',
                'department': $scope.profileInfo.talentsegmentdescr,
                'pref': false
            }],
                // save to device
                contact.save(onSuccess1, onError1);
        }

        function onError(contactError) {
            showToast("There was an error: " + contactError.code, 'short', 'bottom');
        };

        function onSuccess1(contact) {
            if (updateFlag) {
                showToast("Update contact successfully", 'short', 'bottom');
            } else {
                showToast("Add to contact successfully", 'short', 'bottom');
            }

        };
        function onError1(contactError) {
            showToast("There was an error: " + contactError.code, 'short', 'bottom');
        };

        //#region   Merge code from learning events

        //#region Properties
        /// <summary>
        ///  Property to manage user logged enterpriseId.
        /// </summary>
        /// <doc>myExpenses.controllers:baseController!userInfo</doc>
        $scope.userInfo = {};

        /// <summary>
        ///  Property to manage notifications
        /// </summary>
        /// <doc>myExpenses.controllers:baseController!myNotification</doc>
        $rootScope.myNotification = '';

        /// <summary>
        ///  Property to manage splash screen
        /// </summary>
        /// <doc>myExpenses.controllers:baseController!showSplash</doc>
        $rootScope.showSplash = true;

        /// <summary>
        ///  Property to manage error issues
        /// </summary>
        /// <doc>myExpenses.controllers:baseController!errorInfo</doc>
        $rootScope.errorInfo = {
            counter: 1,
            status: '',
            message: '',
            loading: false
        };

        $rootScope.isBrowser = environments.isBrowser;
        $rootScope.tabDict = [];
        $rootScope.circleId = '';

        $ionicPlatform.ready(function () {
            //Fix of dots and commas for Galaxy devices
            $rootScope.whichNumberInputIsUsed = methods.whichNumberInputIsUsed();
        });


        $scope.$on('resume', function () {
            console.log('resume - baseController');
            // redirect user to main page
            $timeout(function () {
                if ($state.current.name === 'error') {
                    $location.path('/app/home');
                }
            });
        });

        $scope.$on('ReflashHomePage', function (event, e) {
            $scope.$broadcast("$ionicView.enter", e);
        });

        if ($window.navigator.onLine) {
            $scope.userModel = profileService.getUserModel();
            $scope.profile = {};
            $scope.settings = {
                haveSeenTutorial: false,
                haveSeenRecommededSkills: false
            };
            $scope.actualYear = new Date().getFullYear();
            $scope.hideNavBar = false;
            $scope.showProfileNavBar = true;
            $rootScope.ImpersonateStatus = false;//"Impersonate";
            $scope.unReadIcon = false;
            //#endregion

            //#region functions

            //getActivityTabs

            // $scope.getActivityTabs=function(activityId){
            //
            //     authService.callService({ serviceName: environmentData.services.myLearningService.serviceName, action: trainingService.getActivityTabs , params:activityId} ).then(function (tabs) {
            //         angular.forEach(tabs, function (tab) {
            //             if (tab.tabLabel.indexOf('Social') > -1) {
            //                 $rootScope.circleId = tab.tabLabel.split('||').length > 1 ? tab.tabLabel.split('||')[1] : '';
            //                 tab.tabLabel = 'Social';
            //             }
            //             $rootScope.tabDict.push({
            //                 key: parseInt(tab.tabID),
            //                 value: tab.tabLabel
            //             });
            //
            //             var trainingDetailTab = {
            //                 text: tab.tabLabel,
            //                 tabID: parseInt(tab.tabID),
            //                 isTabVisible: tab.isTabVisible == 1 ? true : false
            //             };
            //             if (tab.tabLabel == 'About' || tab.tabLabel == 'Rate' || tab.tabLabel == 'About/Rate') {
            //                 trainingDetailTab.icon = 'acc-bubble-information-o';
            //                 trainingDetailTab.template = 'conLearning/event/trainingDetail/tabs/about/tab.about.html';
            //             } else if (tab.tabLabel == 'Schedule') {
            //                 trainingDetailTab.icon = 'acc-calendar-o';
            //                 trainingDetailTab.template = 'conLearning/event/trainingDetail/tabs/schedule/tab.schedule.html';
            //             } else if (tab.tabLabel == 'Participants') {
            //                 trainingDetailTab.icon = 'acc-people2';
            //                 trainingDetailTab.template = 'conLearning/event/trainingDetail/tabs/participants/tab.participants.html';
            //             } else if (tab.tabLabel == 'Presenters') {
            //                 trainingDetailTab.icon = 'acc-user4-o';
            //                 trainingDetailTab.template = 'conLearning/event/trainingDetail/tabs/presenters/tab.faculty.html';
            //             } else if (tab.tabLabel == 'Social') {
            //                 trainingDetailTab.icon = 'acc-chat-o';
            //                 trainingDetailTab.template = 'conLearning/event/trainingDetail/tabs/stream/stream-tab.html';
            //             } else if (tab.tabLabel == 'People On Site') {
            //                 trainingDetailTab.icon = 'acc-group-o';
            //                 trainingDetailTab.template = 'conLearning/event/trainingDetail/tabs/tab.people.html';
            //             } else if (tab.tabLabel == 'Materials') {
            //                 trainingDetailTab.icon = 'acc-layer-o';
            //                 trainingDetailTab.template = 'conLearning/event/trainingDetail/tabs/materials/tab.priorities.html';
            //             } else if (tab.tabLabel == 'Venue') {
            //                 trainingDetailTab.icon = 'acc-map-marker-o';
            //                 trainingDetailTab.template = 'conLearning/event/trainingDetail/tabs/venue/tab.venueDetails.html';
            //             }
            //             $scope.trainingDetailTabs.push(trainingDetailTab);
            //
            //             // Init Schedule Tab
            //             //$scope.getSchedule(activityId, $scope.ScheduleStartDate);
            //             if (parseInt(tab.tabID) === 0) {
            //                 $scope.$emit('changedTab', { 'tabLabel': tab.tabLabel });
            //             }
            //         });
            //     }, function () {
            //         var msg = 'There was an error get ActivityTabs for session of Activity :' + activityId;
            //         console.log(msg);
            //         $ionicLoading.hide();
            //     });
            //
            //
            // };

            // var tabs=[
            //     {
            //         title:"Activity",
            //         icon:"learn-Icon-Activity",
            //         uiSref:"app.trainingDetailTabs.activityTab",
            //         viewName:"tab-activity"
            //     },
            //     {
            //         title:"Schedule",
            //         icon:"learn-Icon-Schedule",
            //         uiSref:"app.trainingDetailTabs.scheduleTab",
            //         viewName:"tab-schedule"
            //     },
            //     {
            //         title:"Participants",
            //         icon:"learn-Icon-Participants",
            //         uiSref:"app.trainingDetailTabs.participantsTab",
            //         viewName:"tab-participants"
            //     },
            //     {
            //         title:"Getting Around",
            //         icon:"learn-Icon-GetAround",
            //         uiSref:"app.trainingDetailTabs.venueTab",
            //         viewName:"tab-venue"
            //     }
            // ];

            // var tabHtmlTpl = "<ion-tabs class='tabs-background-custom tabs-icon-top'>";
            // var t = 0;
            // for(t in tabs){
            //     tabHtmlTpl += '<ion-tab ui-sref="'+tabs[t].uiSref+'" icon="'+tabs[t].icon+'" title="'+tabs[t].title+'"><ion-nav-view name="'+tabs[t].viewName+'"></ion-nav-view></ion-tab>';
            // }
            // tabHtmlTpl += "</ion-tabs>";
            //
            // $scope.tabHtmlTpl = tabHtmlTpl;


            //#endregion

            //#region Actions

            $scope.getTutorialCurrentIndex = function () {
                return $ionicSlideBoxDelegate.$getByHandle('tutorialSlide').currentIndex() + 1;
            };

            $scope.tutorialSlideChanged = function () {
                if ($scope.getTutorialCurrentIndex() === 6) {
                    $('.tutoPageCounter').hide();
                    $('.tutoGetStarted').show();
                }
                else {
                    $('.tutoPageCounter').show();
                    $('.tutoGetStarted').hide();
                }
            };

            $scope.showLogout = function () {
                if (window.currentEnvironment === 'PROD') {
                    return false;
                }
                else {
                    return true;
                }
            };

            $scope.setHaveSeenTutorial = function () {
                /// <summary>
                /// Set the flag setHaveSeenTutorial for the current user
                /// </summary>
                /// <doc>connectedLearning.controllers:baseController#setHaveSeenTutorial</doc>
                var params = {
                    peopleKey: profileService.getPeopleKey()
                };

                // Get user settings from connected learning service
                authService.callService({
                    serviceName: environmentData.services.conlearningService.serviceName,
                    action: profileService.setHaveSeenTutorial,
                    params: params
                }).then(function (data) {

                    $scope.settings.haveSeenTutorial = true;
                    //$scope.navigateToState('app.skillsRecommended', '', true);

                }, function (error) {
                    console.log(error);
                    //$scope.navigateToState('app.skillsRecommended', '', true);
                });

                if (!$scope.settings.haveSeenRecommededSkills) {
                    $scope.navigateToState('app.skillsRecommended', '', true);
                }
                else {
                    $scope.navigateToState('app.home', '', true);
                }

            };

            // event to update profile and user settings
            $scope.$on(constants.broadcast.updateBaseController, function (event, args) {
                $scope.profile = args.message.profile;
                $scope.settings.haveSeenTutorial = args.message.haveSeenTutorial;
                $scope.settings.haveSeenRecommededSkills = args.message.haveSeenRecommededSkills;
            });

            //#endregion

            //#region Navigation (intro)
            $scope.navigateToState = function (to, params, removeFromHistory, reloaded) {

                setUserActivity(to);

                if (removeFromHistory) {
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    });
                    $state.go(to, params, {location: "replace", reload: reloaded});
                } else {
                    $state.go(to, params, {reload: reloaded});
                }
            };

            //temporary code
            $scope.downReport = function () {
                window.open('http://www.liaoningexcell.com/LearningEvents_Install_Oct28.xlsx', '_system');
            }

            $scope.navigateProfile = function (peopleKey, enterpriseId, tabId) {
                if ((peopleKey !== $scope.profile.PeopleKey) && (tabId === undefined)) {
                    tabId = 1;
                }
                if (peopleKey == $scope.profile.PeopleKey) {
                    $scope.showProfileNavBar = false;
                }
                else {
                    $scope.showProfileNavBar = true;
                }
                if (tabId === undefined) {
                    tabId = 0;
                }

                crittercismService.leaveBreadcrumb('Load profile');

                $scope.navigateToState('app.people', {
                    peopleKey: peopleKey,
                    enterpriseId: enterpriseId,
                    tab: tabId,
                    title: 'empty',
                    date: 'empty',
                    location: 'empty'
                }, false);
            };

            $scope.logout = function () {

                authService.logout();

                $timeout(function () {
                    ionic.Platform.exitApp();
                }, 3000);

            };

            $scope.goBack = function () {
                $ionicHistory.goBack();
            };

            $scope.moveScrollTop = function (page) {

                $ionicScrollDelegate.$getByHandle(page).scrollTop(true);

            };

            $scope.openFaqLink = function () {

                window.open(environmentData.faq, '_system');
                return false;
            };

            //#endregion

            $scope.navigateTraining = function (item, location, fromMyTraining) {
                $rootScope.isContentDisabled = false;
                $scope.currentTrainingId = item.ActivityID == undefined ? item.activityID : item.ActivityID;
                $rootScope.activityID = $rootScope.ImpersonateStatus == true ? $rootScope.impersonationActivityID : $scope.currentTrainingId;
                $scope.currentTrainingTitle = item.ActivityName == undefined ? item.activityName : item.ActivityName;

                //$scope.currentTrainingTitle = data2[0].title;
                $scope.ScheduleStartDate = item.StartDt == undefined ? item.startDt : item.StartDt;
                $scope.ScheduleStartLocalDate = item.StartDtLOCAL == undefined ? item.startDtLOCAL : item.StartDtLOCAL;
                $scope.currentTrainingFromDt = filter('date')(new Date(item.StartDt == undefined ? item.startDt : item.StartDt), 'MMM d, y');
                $scope.currentTrainingToDt = filter('date')(new Date(item.EndDt == undefined ? item.endDt : item.EndDt), 'MMM d, y');
                $scope.currentLocation = item.PATH;
                $scope.playabilityValue = item.PlayabilityValue;
                $scope.isPastSession = item.category == 'P' ? true : false;
                $scope.pickRule = item.isFaculty == undefined ? item.PickRule : item.isFaculty;
                $scope.isCurrent = item.isCurrent == undefined ? item.category : item.isCurrent;
                $scope.facilityID = item.facilityID || item.FacilityID;
                $scope._pickrule = false;
                if ($scope.isCurrent == true || $scope.isCurrent == 'C') {
                    $scope.isCurrent = true;
                } else {
                    $scope.isCurrent = false;
                }

                if ($rootScope.adminFlage) {
                    $scope._pickrule = true;
                } else {
                    if ($scope.pickRule == 1) {
                        $scope._pickrule = true;
                    }
                }
                //$scope.facutysForPassedSession = item.facultys;

                $scope.sendAllParVisible = false;
                if (item.PickRule == 1) {
                    $scope.sendAllParVisible = true;
                }


                if ($scope.currentTrainingFromDt != '' && $scope.currentTrainingToDt != '') {
                    if (!fromMyTraining) {
                        item.StartDtLOCAL = item.StartDtLOCAL == undefined ? item.startDtLOCAL : item.StartDtLOCAL;
                        item.EndDtLOCAL = item.EndDtLOCAL == undefined ? item.endDtLOCAL : item.EndDtLOCAL;
                        item = itemPathService.UpcomingPath(item);
                        $scope.currentTrainingDate = item.startDate;
                    } else {
                        $scope.currentTrainingDate = itemPathService.myTrainingCardDurationFilter(item).dateDuration;
                    }

                }
                else {
                    $scope.currentTrainingDate = '';
                }
                $scope.fromAdmin = item.fromAdmin ? item.fromAdmin : false;
                $scope.imgName = getFacilityInfoService.filterCenterImage(item.facilityID);
                //$rootScope.$broadcast("navigateToDetail");
                //$scope.currentLocation = item.location;
                $rootScope.trainingItem = {
                    currentTrainingId: $scope.currentTrainingId,
                    currentTrainingTitle: $scope.currentTrainingTitle,
                    currentTrainingDate: $scope.currentTrainingDate,
                    ScheduleStartDate: $scope.ScheduleStartDate,
                    ScheduleStartLocalDate: $scope.ScheduleStartLocalDate,
                    currentLocation: $scope.currentLocation,
                    city: item.FacilityCity || item.PATH,
                    playabilityValue: $scope.playabilityValue,
                    isPastSession: $scope.isPastSession,
                    pickRule: $scope.pickRule,
                    isCurrent: $scope.isCurrent,
                    facilityID: $scope.facilityID,
                    fromAdmin: $scope.fromAdmin,
                    fromMyTraining: fromMyTraining,
                    impersonateFaculty: $rootScope.ImpersonateStatus ? $rootScope.impersonationUserType == 1 : false,
                    imgName: $scope.imgName
                };

                if (fromMyTraining) {
                    $scope.navigateToState('app.trainingDetailTabs.activityTab', {
                        selectedTraining: item,
                        fromMyTraining: fromMyTraining
                    }, true, true);
                } else {
                    $scope.navigateToState('app.trainingDetailTabs.eventDetailsTab');
                }
            };

            // init for refresh the notification message page
            $scope.initNotification = function () {
                var activityID = null;
                $scope.notificationsListUnRead = [];
                $scope.notificationsListReaded = [];
                $scope.unreadCount = null;
                personalisedMessageService.getNotificationList(($rootScope.ImpersonateStatus == true ? $rootScope.impersonationEID : $rootScope.loginUserID), activityID).then(function (data) {
                    if (data && data.Content && data.Content != null) {
                        personalisedMessageData.MessageInfo = data.Content.MessageInfo;

                        $scope.unreadCount = data.Content.UnReadCount;

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
                                        activityID: $rootScope.ImpersonateStatus == true ? $rootScope.impersonationActivityID : item.ActivityID,
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
                                        activityID: $rootScope.ImpersonateStatus == true ? $rootScope.impersonationActivityID : item.ActivityID,
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
                        $scope.initNotification();
                    }
                });
            };

            //to MessagePage
            $scope.toMessagePage = function (eid) {
                var messageIDList = null;
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
                            if (messageIDList == null) {
                                messageIDList = item.id;
                            }
                            else {
                                messageIDList += ',' + item.id;
                            }
                        }
                    });
                    if (messageIDList != null) {
                        authService.callService({
                            serviceName: environmentData.services.myLearningService.serviceName,
                            action: personalisedMessageService.putPersonalisedMessage,
                            params: {AuthorID: $rootScope.loginUserID, messageID: messageIDList}
                        }).then(function (data) {
                            console.log(data.ReturnMessage);
                            if (data.ReturnMessage == 'Success') {
                                $scope.initNotification();
                            }
                        });
                    }
                }

            };

            $scope.closeMessagePage = function () {
                $scope.messagePage_modal.hide();
            };

            $scope.navigateFacility = function (facilityId) {
                $scope.currentFacitilyId = facilityId;
                $scope.navigateToState('sideMenu.facilityDetail', false);
            };
            $scope.navigateFacilities = function () {
                $scope.navigateToState('sideMenu.facility', false);
            };

            $scope.navigateWelcome = function () {
                $scope.navigateToState('sideMenu.welcome', false);
            };

            $scope.navigateEvents = function () {
                $scope.navigateToState('sideMenu.events', false);
            };

            $scope.backToEvents = function(){
                $rootScope.trainingItem.fromAdmin = false;
                $scope.navigateToState('app.events', null);
            }

            $scope.navigateToPeopleOnSite = function () {
                $scope.navigateToState('app.peopleOnSiteTab');
            };

            $scope.navigateToCopyRights = function () {
                $scope.navigateToState('app.about', null, true);
            };

            $scope.navigateToOnGoingEvent = function (centerFacilityID) {
                if (centerFacilityID) {
                    $scope.navigateToState('app.ongoingEventsThisVenue', {facilityID: centerFacilityID});
                } else {
                    $scope.navigateToState('app.ongoingEventsThisVenue', {facilityID: ($scope.facilityID || 1)});
                }
            };


            //#endregion

            // Merge from Learning Events for Menu Controller by Booker(0912)
            //#region Properties

            /// <summary>
            /// Training list model
            /// </summary>
            /// <doc>myExpenses.controllers:expensesListController</doc>

            // Current observation.
            $scope.currentObservation = [];
            var cached;
            $scope.getFollowingStatus = [];

            $scope.getUserProfileInfo = function () {

                $scope.profilebase64 = undefined;

                $ionicLoading.show();

                $scope.profileInfo = {};
                $scope.professionalbio = '';
                $scope.title = $stateParams.title;
                $scope.date = $stateParams.date;
                if ($scope.date.length != 0 && $stateParams.location.length != 0) {
                    if ($stateParams.location == 'USA - Q Center') {
                        $scope.secondTitle = 'St. Charles, From ' + $scope.date;
                    } else if ($stateParams.location == 'Kuala Lumpur - Sheraton Imperial') {
                        $scope.secondTitle = 'Kuala Lumpur, From ' + $scope.date;
                    } else if ($stateParams.location == 'SPP - Madrid High Performance Center') {
                        $scope.secondTitle = 'Madrid, From ' + $scope.date;
                    } else if ($stateParams.location == 'India Learning Center - Bengaluru Marriott Hotel') {
                        $scope.secondTitle = 'Bengaluru, From ' + $scope.date;
                    } else if ($stateParams.location == 'UIX - Wokefield Park') {
                        $scope.secondTitle = 'London, From ' + $scope.date;
                    }
                }
                $scope.eidUseToFollow = $stateParams.eid;
                //Set the begaining status for the following button
                streamService.getFollowStatusModel($scope.eidUseToFollow).then(function (data) {
                    if (data[0].isFollowing == 1) {
                        $scope.FollowIcon = {
                            "color": "#ff9900"
                        };
                    } else {
                        $scope.FollowIcon = {};
                    }
                    ;
                    $scope.getFollowingStatus = data[0].isFollowing;
                }, function (data) {
                    console.log("streamService.getFollowStatusModel:" + data);
                });

                //Get profile image
                cached = localStorageService.get("ACLMOBILE_IMAGE_" + $stateParams.eid);
                if (cached == null || cached == "") {
                    menuService.getProfileImageModel($stateParams.eid).then(function (data) {
                        $scope.imgReady = true;

                        $scope.profilebase64 = data[0].m_Uri;
                        localStorageService.set("ACLMOBILE_IMAGE_" + $stateParams.eid, data[0].m_Uri);
                        //$log.debug(data[0].m_Uri);
                        if ($scope.infoReady) {
                            $ionicLoading.hide();
                        }
                    }, function (data) {
                        $scope.imgReady = true;
                        if ($scope.infoReady) {
                            $ionicLoading.hide();
                        }
                    })
                }
                else {
                    $scope.profilebase64 = cached;
                    $scope.imgReady = true;
                    if ($scope.infoReady) {
                        $ionicLoading.hide();
                    }
                }
                //Get profile infomation
                var cachedInfo = localStorageService.get("ACLMOBILE_INFO_" + $stateParams.eid);
                if (cachedInfo == null || cachedInfo == "") {
                    menuService.getProfileInfoModel($stateParams.eid, true).then(function (data) {
                        $scope.infoReady = true;
                        localStorageService.set("ACLMOBILE_INFO_" + $stateParams.eid, data);
                        parseUserInfo(data);
                        if ($scope.imgReady) {
                            $ionicLoading.hide();
                        }

                    }, function (data, status) {
                        $scope.infoReady = true;
                        if ($scope.imgReady) {
                            $ionicLoading.hide();
                        }
                    })
                }
                else {
                    parseUserInfo(cachedInfo);
                    $scope.infoReady = true;
                    if ($scope.imgReady) {
                        $ionicLoading.hide();
                    }
                }

            };


            // An alert dialog
            $scope.showAlert = function (email) {
                $scope.isAndroidDevice = device.platform === 'Android' ? true : false;
                if ($scope.isAndroidDevice) {
                    var alertPopup = $ionicPopup.alert({
                        title: '<h2>Launch Lync</h2>',
                        template: 'Tap \'OK\' will copy this contact\'s address automatically and launch Lync, then paste the address to start a chat.',
                        okType: 'button-dark'
                    });
                    alertPopup.then(function (res) {
                        //$cordovaClipboard.copy($stateParams.eid + "@accenture.com")
                        $cordovaClipboard.copy(email)
                            .then(function () {
                            }, function () {
                                $console.log('copy faild');
                            });
                        //launch the Lync
                        //var link = "lync://" + $stateParams.eid + "@accenture.com";
                        var link = "lync://" + email;
                        window.location.href = link;
                    });
                } else {
                    //var link = "sip://" + $stateParams.eid + "@accenture.com";
                    var link = "lync://" + email;
                    window.location.href = link;
                }
            };


            $scope.addToContact = function () {
                // var contact;
                var options = new ContactFindOptions();
                options.filter = $stateParams.eid;// $stateParams.eid;
                options.multiple = false;
                options.desiredFields = [navigator.contacts.fieldType.id];
                //options.hasPhoneNumber = true;
                var fields = [navigator.contacts.fieldType.name, navigator.contacts.fieldType.nickname];
                navigator.contacts.find(fields, onSuccess, onError, options);
            };

            $scope.followPeople = function (eidUseToFollow) {
                //LoadingBar
                $ionicLoading.show();

                //follow yourself will alert fail message
                if (eidUseToFollow == $rootScope.loginUserID) {
                    $ionicPopup.alert({
                        title: '<p>Follow Fail.</p>',
                        okType: 'button-dark',
                        button: [{
                            text: 'Close'
                        }]
                    });

                    $ionicLoading.hide();
                    return;
                }

                //FollowingUserAPI
                menuService.follow(eidUseToFollow).then(function () {
                    //Judge the following status
                    if ($scope.getFollowingStatus == 1) {
                        $scope.FollowIcon = {};

                        $ionicPopup.alert({
                            title: '<p>Stop Following Success.</p>',
                            okType: 'button-dark',
                            button: [{
                                text: 'Close'
                            }]
                        });
                        $scope.getFollowingStatus = 0;
                        $ionicLoading.hide();
                    } else if ($scope.getFollowingStatus == 0) {
                        $scope.FollowIcon = {
                            "color": "#ff9900"
                        };

                        $ionicPopup.alert({
                            title: '<p>Follow Success.</p>',
                            okType: 'button-dark',
                            button: [{
                                text: 'Close'
                            }]
                        });
                        $scope.getFollowingStatus = 1;
                        $ionicLoading.hide();
                    } else {
                        $ionicPopup.alert({
                            title: '<p>Follow Fail.</p>',
                            okType: 'button-dark',
                            button: [{
                                text: 'Close'
                            }]
                        });
                        $ionicLoading.hide();
                    }
                }, function (data) {
                    console.log("menuService.follow:" + data);

                    $ionicPopup.alert({
                        title: '<p>Follow Fail.</p>',
                        okType: 'button-dark',
                        button: [{
                            text: 'Close'
                        }]
                    });

                    $ionicLoading.hide();
                });
            }

            var showToast = function (message, duration, location) {
                $cordovaToast.show(message, duration, location).then(function (success) {
                    console.log("The toast was shown");
                }, function (error) {
                    console.log("The toast was not shown due to " + error);
                });
            };

            var parseUserInfo = function (data) {

                $scope.infoReady = true;

                $scope.professionalbio = data["CupsProfile"][0].professionalbio;
                $scope.workemail = data["CupsProfile"][0].workemail;
                var sptr3 = "'";
                while ($scope.professionalbio.indexOf(sptr3) >= 0) {
                    $scope.professionalbio = $scope.professionalbio.replace(sptr3, '"');
                }

                $scope.deliberatelyTrustDangerousSnippet = function () {
                    return $sce.trustAsHtml($scope.professionalbio);
                };

                data["CupsProfile"][0].professionalbio = '';
                var out = JSON.stringify(data["CupsProfile"][0]);
                out = out.replace('sps-jobtitle', 'spsjobtitle');
                $scope.profileInfo = JSON.parse(out);
            }


            $scope.gotofeedback = function () {
                var login_url = 'https://betasurvey.accenture.com/index.php?r=survey/index/sid/218885/newtest/Y/lang/en';
                window.open(login_url, '_system', 'location=yes');
                return false;
            };

            // ImpersonateStatus disable by Booker 09/19
            // $scope.clickImpersonation = function () {
            //
            //     if ($rootScope.ImpersonateStatus == false)
            //     {
            //$state.go("sideMenu.impersonatesearch");
            //$scope.$emit("Openimpersonatesearch");
            //update impersonate path by booker 0919
            // $ionicModal.fromTemplateUrl('conLearning/event/impersonate/impersonatesearch.html', {
            //     scope: $scope
            // }).then(function (modal) {
            //     $rootScope.search_modal = modal;
            //     modal.show();
            // });
            //
            //
            //     }
            //     else if ($rootScope.ImpersonateStatus == true)
            //     {
            //         $rootScope.ImpersonateStatus = false;
            //         $scope.$emit("ReflashHomePage");
            //         $state.go("sideMenu.events");
            //     }
            //
            // };

            $scope.clickEvent = function () {
                //$scope.getTrainingList();
                $scope.$emit("ReflashHomePage");
                $state.go("sideMenu.events");
            };
            // Merge from Learning Events but deprecated - Booker(0912)
            $scope.showAbout = function () {
                $ionicPopup.alert({
                    title: '<h3>Version 9.3.0</h3>',
                    template: 'Learning Events<br />&copy; 2016 Accenture Confidential. For Internal Use Only.',
                    okType: 'button-dark',
                    button: [{
                        text: 'Close'
                    }]
                });
            };

            $scope.getProfileInformation = function (jwt) {
                return base64decode(jwt);
            };

            $scope.getClaim = function (jwt) {
                jwt = jwt.replace('\'', '');
                console.log("JWT TOKEN = " + jwt);

                jwt = jwt.replace('http://schemas.xmlsoap.org/claims/Accenture.EnterpriseID', 'enterpriseid');
                jwt = jwt.replace('http://schemas.xmlsoap.org/claims/Accenture.PeopleKey', 'peoplekey');
                jwt = jwt.replace('http://schemas.xmlsoap.org/claims/Accenture.PersonnelNumber', 'personnelnumber');
                jwt = jwt.replace('http://schemas.xmlsoap.org/claims/Accenture.DisplayName', 'displayName');

                var pattern = new RegExp("\\{(.| )+?\\}", "igm");
                var finalJwt = (jwt.match(pattern)[1]);
                var result = angular.fromJson(finalJwt);

                $scope.eid = result.enterpriseid;
                $rootScope.loginUserID = result.enterpriseid;
                $scope.peoplekey = result.peoplekey;
                $rootScope.peoplekey = result.peoplekey;
                adminAccessJudgement($rootScope.loginUserID);
                //$scope.displayName = result.displayName;
            };


            $scope.showCentersInMenu = false;
            $scope.showAdminContent = false;
            $scope.collapseCenters = function () {
                $scope.showCentersInMenu = (!$scope.showCentersInMenu);
                $ionicScrollDelegate.resize();
            };
            $scope.collapseAdministration = function () {
                $scope.showAdminContent = (!$scope.showAdminContent);
                $ionicScrollDelegate.resize();
            };
            $rootScope.adminFlage = false;
            $rootScope.fistLoad = true;
            var adminAccessJudgement = function (EID) {
                //$rootScope.adminFlage = false;
                //$rootScope.fistLoad = true;

                //Get login user role
                if ($rootScope.fistLoad) {
                    authService.callService({
                        serviceName: environmentData.services.myLearningService.serviceName,
                        action: impersonateService.getACLWhitelistUser,
                        params: {
                            eid: EID
                        }
                    }).then(
                        function (data) {
                            $rootScope.showSplash = false;
                            if (data.isAdmin == 1) {
                                $rootScope.adminFlage = true;
                            }
                        },
                        function (data, status) {
                            var msg = 'System failed to check the logged in user permission.';
                            console.log(msg);
                            $scope.showToast(msg, 'short', 'bottom');
                            $ionicLoading.hide();
                        }
                    );
                    $rootScope.$broadcast('getFacility','');
                    $rootScope.fistLoad = false;
                }
            };



        }
        else {
            return false;
        }

    }]);


