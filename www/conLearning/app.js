/*global cordova, StatusBar, device, Media, successHandler, errorHandler, alert, angular, window */

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var app = angular.module('starter', ['ngIOS9UIWebViewPatch',
    'ionic',
    'harmonizr',
    'harmonizr.cards',
    'harmonizr.components',
    'ngCordova',
    'tabSlideBox',
    'ngSanitize',
    'starter.controllers',
    'starter.services',
    'starter.directives',
    'starter.factories',
    'tokensEsoService',
    'tokensEsoProviderModule',
    'LocalStorageModule',
    'esoSettingsModule',
    'pickadate',
    'rzModule',
    'esoLogin',
    'ionic-timepicker',
    'ionic-datepicker']);

var controllers = angular.module('starter.controllers', []);
var services = angular.module('starter.services', []);
var directives = angular.module('starter.directives', []);
var factories = angular.module('starter.factories', []);

angular.module('starter').config(function ($ionicConfigProvider) {

    'use strict';

    $ionicConfigProvider.backButton.text('');
    $ionicConfigProvider.backButton.icon('acc-angle-left');
});

app.config(['$httpProvider', function ($httpProvider) {
    /// <summary>
    /// Configures interceptor to manage security.
    /// </summary>
    /// <doc>connectedLearning.config:auth</doc>

    'use strict';

    // Add interceptor for toastr messages
    // $httpProvider.interceptors.push('ErrorInterceptor');
    // $httpProvider.interceptors.push('authHttpInterceptor');
}]);

app.config(function (ionicDatePickerProvider) {
    var datePickerObj = {
        inputDate: new Date(),
        mondayFirst: false,
        templateType: 'popup',
        from: new Date(2015, 1, 1),
        to: new Date(2035, 12, 31),
        showTodayButton: true,
        dateFormat: 'MM dd yyyy',
        closeOnSelect: false
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
});

app.config(function (ionicTimePickerProvider) {
    var timePickerObj = {
        inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
        format: 12,
        step: 1,
        setLabel: 'Set',
        closeLabel: 'Close'
    };
    ionicTimePickerProvider.configTimePicker(timePickerObj);
});


factories.factory('ErrorInterceptor', ['$q', '$timeout', 'connectedLearning.constants', '$cordovaToast', function ($q, $timeout, constants, $cordovaToast) {

        'use strict';

        var authInterceptorObj = {
            'requestError': function (rejection) {
                /// <summary>
                /// This function will manage the requestError.
                /// </summary>
                /// <param name="config">Contains interception data for the request.</param>
                /// <returns type="obj">Configuration object.</returns>
                /// <doc>connectedLearning.factory:httpInterceptorToken#requestError</doc>

                // dont capture the 401 error
                if (rejection.status !== 401) {

                    if (rejection.config !== undefined) {

                        // show toastr message
                        if (window.cordova) {
                            $cordovaToast.show(constants.messages.userErrorMessage, 'long', 'bottom');
                        }
                    }
                }

                // Reject
                return $q.reject(rejection);
            },
            'responseError': function (rejection) {
                /// <summary>
                /// This function will manage the responseError.
                /// </summary>
                /// <param name="config">Contains interception data for the request.</param>
                /// <returns type="obj">Configuration object.</returns>
                /// <doc>connectedLearning.factory:httpInterceptorToken#responseError</doc>

                // dont capture the 401 error
                if (rejection.status !== 401) {

                    if (rejection.config !== undefined) {

                        // show toastr message
                        if (window.cordova) {
                            $cordovaToast.show(constants.messages.userErrorMessage, 'long', 'bottom');
                        }
                    }
                }

                // Reject
                return $q.reject(rejection);
            }
        };

        return authInterceptorObj;
    }]
);

app.run(function ($ionicPlatform, $cordovaPush, $rootScope, $cordovaToast, crittercismService, $http, $ionicPopup, $ionicLoading) {
    /// <summary>
    /// Configures ionic platform to be used in connectedLearning application.
    /// </summary>
    /// <param name="$ionicPlatform">
    /// An angular abstraction of {@link ionic.utility:ionic.Platform}.
    /// Used to detect the current platform, as well as do things like override the
    /// Android back button in PhoneGap/Cordova.
    /// </param>
    /// <param name="$cordovaStatusbar">Ng Angular abstraction for statusbar</param>
    /// <doc>connectedLearning.config:ionic-platform</doc>

    'use strict';

    function checkConnection() {
        var networkState = navigator.connection.type;
        var states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.CELL] = 'Cell generic connection';
        states[Connection.NONE] = 'No network connection';
        $cordovaToast.show(states[networkState], 'long', 'bottom');
        $rootScope.$broadcast('networkStateChanged', states[networkState]);

        if (networkState == 'none') {
            $ionicLoading.hide();
        }
    }

    $ionicPlatform.ready(function () {

        // device variables
        var isWebView = ionic.Platform.isWebView();
        var isIPad = ionic.Platform.isIPad();
        var isIOS = ionic.Platform.isIOS();
        var isAndroid = ionic.Platform.isAndroid();
        var isWindowsPhone = ionic.Platform.isWindowsPhone();

        //check connection
        //checkConnection();

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault(2);
        }

       

        $ionicPlatform.on('resume', function () {
            /// <summary>
            /// Update badge everytime you resume the application.
            /// </summary>
            /// <doc>connectedLearning.config:Notifications-badge</doc>

            console.log('resuming application...');
            // launch resume event
            $rootScope.$broadcast('resume');

            //setTimeout(function() {
            //    window.cordova ? $cordovaPush.setBadgeNumber(users.badge) : '';
            //}, 1000);
        });

        $ionicPlatform.on('pause', function () {
            /// <summary>
            /// Update badge everytime you pause the application.
            /// </summary>
            /// <doc>connectedLearning.config:Notifications-badge</doc>

            console.log('pausing application...');
            //window.cordova ? $cordovaPush.setBadgeNumber(users.badge) : '';
        });

        document.addEventListener("online", checkConnection, false);
        document.addEventListener("offline", checkConnection, false);

    });
});


app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
    /// <summary>
    /// Configures routes and associates each route with a view and a controller if apply.
    /// </summary>
    /// <param name="$stateProvider">
    /// The new '$stateProvider' works similar to Angular's v1 router, but it focuses purely
    /// on state.
    /// A state corresponds to a "place" in the application in terms of the overall UI and
    /// navigation. A state describes (via the controller / template / view properties) what
    /// the UI looks like and does at that place.</param>
    /// <param name="$urlRouterProvider">
    /// '$urlRouterProvider' has the responsibility of watching '$location'.
    /// When `$location` changes it runs through a list of rules one by one until a
    /// match is found. `$urlRouterProvider` is used behind the scenes anytime you specify
    /// a url in a state configuration. All urls are compiled into a UrlMatcher object.
    /// </param>
    /// <doc>connectedLearning.config:router</doc>

    'use strict';

    $stateProvider
        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "conLearning/common/menu/menu.html",
            controller: 'menuController'
        })

        .state('app.tutorial', {
            url: "/tutorial",
            views: {
                'menuContent': {
                    templateUrl: "conLearning/common/tutorial/tutorial.html"
                }
            }
        })

        .state('app.home', {
            url: "/home",
            views: {
                'menuContent': {
                    templateUrl: "conLearning/home/home.html",
                    controller: 'homeController'
                }
            }

        })
        .state('app.skills', {
            url: "/skills/follow",
            views: {
                'menuContent': {
                    templateUrl: "conLearning/profile/follow/skills.follow.html",
                    controller: 'skillsController'
                }
            }
        })
        .state('app.addSkills', {
            url: "/skills/follow/add",
            views: {
                'menuContent': {
                    templateUrl: "conLearning/profile/follow/skills.add.html",
                    controller: 'skillsController'
                }
            }
        })
        .state('app.skillsRecommended', {
            url: "/recommended/skills",
            views: {
                'menuContent': {
                    templateUrl: "conLearning/profile/recommendations/skills.recommended.html",
                    controller: 'skillsController'
                }
            }
        })
        .state('app.people', {
            //url: "/people/:peopleKey/enterpriseId/:enterpriseId/tab/:tab",
            url: "//people?peopleKey&enterpriseId&title&date&location",
            views: {
                'menuContent': {
                    templateUrl: "conLearning/profile/profile/userProfile.html",
                    controller: "profileController"
                }
            }
        })
        .state('app.plan', {
            url: "/plan",
            views: {
                'menuContent': {
                    templateUrl: "conLearning/common/plan/plan.html",
                    controller: "planController"
                }
            }
        })
        .state('app.feedback', {
            url: "/feedback",
            views: {
                'menuContent': {
                    templateUrl: "conLearning/common/feedback/feedback.html",
                    controller: "feedbackController"
                }
            }
        })
        .state('app.events', {
            url: "/events",
            views: {
                'menuContent': {
                    templateUrl: "conLearning/event/list/events.html",
                    controller: "eventscontroller"
                }
            }
        })
        .state('app.myTraining', {
            url: "/myTraining",
            views: {
                'menuContent': {
                    templateUrl: "conLearning/event/myTraining/myTraining.html",
                    controller: "myTrainingController"
                }
            }
        })
        .state('app.impersonate', {
            url: "/impersonate",
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "conLearning/event/impersonate/impersonatesearch.html"
                }
            }
        })
        .state('app.ongoingEventsThisVenue', {
            url: "/ongoingEventsThisVenue?facilityID",
            views: {
                'menuContent': {
                    templateUrl: "conLearning/event/ongoingEvents/ongoingEvents.html",
                    controller: "ongoingEventsController"
                }
            }
        })
        .state('app.upcomingSessions', {
            url: "/upcomingSessions",
            views: {
                'menuContent': {
                    templateUrl: "conLearning/event/upcomingSessions/upcomingSessions.html",
                    controller: "upcomingSessionsController"
                }
            }
        })
        .state('app.upcomingSessionsNew', {
            url: "/upcomingSessionsNew",
            views: {
                'menuContent': {
                    templateUrl: "conLearning/event/upcomingSessions/upcomingSessions-new.html",
                    controller: "upcomingSessionsController"
                }
            }
        })
        //merge from LearningEvents' feedback, name changed to survey by Booker/0913
        .state('app.feedbackSurvey', {
            url: "/feedbackSurvey",
            views: {
                'menuContent': {
                    templateUrl: "conLearning/common/feedback/feedbackSurvey.html"
                }
            }
        })
        .state('app.about', {
            url: "/about",
            views: {
                'menuContent': {
                    templateUrl: "conLearning/common/about/about.html"
                }
            }
        })

        .state('app.venue', {
            url: "/venue?city",
            views: {
                'menuContent': {
                    templateUrl: "conLearning/event/trainingDetail/tabs/venue/venueDetails.html",
                    controller: "TrainingDetailCtrl"
                }
            }
        })

        .state('app.learningCenter', {
            url: "/learningCenter?city",
            views: {
                'menuContent': {
                    templateUrl: "conLearning/event/learningCenter/learningCenter.html",
                    controller: "learningCenterCtrl"
                }
            }
        })

        //.state('app.trainingDetail', {
        //    cache:false,
        //    url: "/event/trainingDetail?tab",
        //    views: {
        //        'menuContent': {
        //            templateUrl: "conLearning/event/trainingDetail/trainingDetail.html",
        //            controller: "TrainingDetailCtrl"
        //        }
        //    }
        //})

        .state('app.trainingDetailTabs',{
            url:"/event/tabs",
            abstract: true,
            views:{
                'menuContent': {
                    templateUrl: 'conLearning/event/trainingDetail/tabs/tabs.html'
                }
            }
        })

        .state('app.attendance', {
            cache: false,
            url: '/attendance',
            views: {
                'menuContent': {
                    templateUrl: 'conLearning/event/trainingDetail/tabs/attendance/tab.attendance.html',
                    controller: 'TrainingDetailCtrl'
                }
            }
        })

        .state('app.schedules', {
            cache: false,
            url: '/schedules',
            views: {
                'menuContent': {
                    templateUrl: 'conLearning/event/trainingDetail/tabs/schedule/tab.schedule.html',
                    controller: 'TrainingDetailCtrl'
                }
            }
        })

        .state('app.faculties', {
            cache: false,
            url: '/faculties/:activityId',
            views: {
                'menuContent': {
                    templateUrl: 'conLearning/event/trainingDetail/tabs/presenters/tab.faculty.html',
                    controller:'facultiesController'
                }
            }
        })

        .state('app.trainingDetailTabs.activityTab', {
            // cache: false,
            url: '/activity',
            cache: false,
            params: {
                selectedTraining: null,
                fromMyTraining: null
            },
            views: {
                'tab-activity': {
                    templateUrl: 'conLearning/event/trainingDetail/tabs/stream/tab.activity.html',
                    controller: 'tabActivityController'
                }
            }
        })

        .state('app.trainingDetailTabs.eventDetailsTab', {
            cache: false,
            url: '/eventDetails',
            views: {
                'tab-eventDetails': {
                    templateUrl: 'conLearning/event/trainingDetail/tabs/eventDetails/tab.eventDetails.html',
                    controller: 'TrainingDetailCtrl'
                }
            }
        })

        .state('app.trainingDetailTabs.venueTab', {
            cache: false,
            url: '/venue',
            views: {
                'tab-venue': {
                    templateUrl: 'conLearning/event/trainingDetail/tabs/venue/tab.venue.html',
                    controller: 'TrainingDetailCtrl'
                }
            }
        })

        .state('app.materials', {
            url: '/materials',
            params:{
                activityID: ''
            },
            views: {
                'menuContent': {
                    templateUrl: "conLearning/event/trainingDetail/tabs/materials/tab.materials.html",
                    controller: 'materialsCtrl'
                }
            }
        })

        .state('app.trainingDetailTabs.participantsTab', {
            cache: false,
            url: '/participants',
            views: {
                'tab-participants': {
                    templateUrl: 'conLearning/event/trainingDetail/tabs/participants/tab.participants.html',
                    controller: 'participantsCtrl'
                }
            }
        })

        .state('app.peopleOnSiteTab', {
            cache: false,
            url: '/peopleOnSite',
            views: {
                'menuContent': {
                    templateUrl: 'conLearning/event/trainingDetail/tabs/peopleOnSite/tab.peopleOnSite.html',
                    controller: 'participantsCtrl'
                }
            }
        })

        .state('app.floorMap',{
            url:'/floorMap',
            views:{
                'menuContent':{
                    templateUrl: 'conLearning/event/trainingDetail/tabs/venue/venue.floorMap.html'
                }
            }
        })

            //these two states have exist at www\conLearning\event\trainingDetail\tabs\stream\stream.module.js
        .state('app.article', {
            url: "/article/:articleId/:flag",
            views: {
                'menuContent': {
                    templateUrl: "conLearning/event/trainingDetail/tabs/stream/stream-detail.html",
                    controller: 'streamDetailController'
                }
            }
        })
        .state('app.discussion', {
            url: "/discussion/:discussionId/:circleId",
            views: {
                'menuContent': {
                    templateUrl: "conLearning/event/trainingDetail/tabs/stream/discussions-detail.html",
                    controller: "discussionsDetailController"
                }
            }
        })

        // Route for Send Inner Message
        .state('app.newPersonalisedMessage',{
            url: "/newPersonalisedMessage",
            cache: false,
            params: {
                sendToEIDList: null // SendTolists, array of eids items
            },
            views:{
                'menuContent': {
                    templateUrl: "conLearning/event/personalisedMessage/newPersonalisedMessage.html",
                    controller: "newPersonalisedMessageController"
                }
            }
        })
        .state('app.sendToList',{
            url: "/sendToList",
            cache: false,
            params:{
              specificCache:'',
                groupID:''
            },
            views:{
                'menuContent': {
                    templateUrl: "conLearning/event/personalisedMessage/sendToList.html",
                    controller: "sendToListController"
                }
            }
        })


    // if none of the above states are matched, use this as the fallback


        .state('app.login', {
            url: "/login",
            views: {
                'menuContent': {
                    templateUrl: "conLearning/tempEso/login.html",
                    controller: "loginController"
                }
            }
        })
    

    //$urlRouterProvider.otherwise('/app/login');
    $urlRouterProvider.otherwise('/app/event/tabs/activity');

}]);

app.config(['environmentDataProvider', 'connectedLearning.constants.environments', 'tokensEsoDataProvider', 'ESO_SETTINGS',
    function (environmentDataProvider, environments, tokensEsoDataProvider, ESO_SETTINGS) {
        /// <summary>
        /// Configures routes and associates each route with a view and a controller if apply.
        /// </summary>
        /// <param name="$httpProvider">
        /// Provider for Http.
        /// </param>
        /// <param name="tokensEsoDataProvider">
        /// Provider for ESO.
        /// </param>
        /// <param name="NotificationDataProvider">
        /// Data provider for Notifications.
        /// </param>
        /// <doc>connectedLearning.config:environments</doc>

        'use strict';

        // Set local environment
        var currentEnvironment = window.currentEnvironment,
            environmentData = null;

        environmentDataProvider.setEnvironment(currentEnvironment);
        environmentData = environmentDataProvider.$get();

        if (currentEnvironment !== environments.PROD) {

            // Set ESO environment
            tokensEsoDataProvider.addClientId(ESO_SETTINGS.ENVIRONMENT_STAGE, environmentData.clientId);
            tokensEsoDataProvider.setAuthMethod(ESO_SETTINGS.AUTH_METHOD_PASSWORD);
            tokensEsoDataProvider.setESOEnvironment(ESO_SETTINGS.ENVIRONMENT_STAGE);
        }
        else if (currentEnvironment === environments.PROD) {

            // Set ESO environment
            tokensEsoDataProvider.addClientId(ESO_SETTINGS.ENVIRONMENT_PROD, environmentData.clientId);
            tokensEsoDataProvider.setAuthMethod(ESO_SETTINGS.AUTH_METHOD_PASSWORD);
            tokensEsoDataProvider.setESOEnvironment(ESO_SETTINGS.ENVIRONMENT_PROD);
        }

        tokensEsoDataProvider.addService(environmentData.services.conlearningService.serviceName, environmentData.services.conlearningService.identifier);
        tokensEsoDataProvider.addService(environmentData.services.myLearningService.serviceName, environmentData.services.myLearningService.identifier);
        tokensEsoDataProvider.addService(environmentData.services.circleService.serviceName, environmentData.services.circleService.identifier);
        tokensEsoDataProvider.addService(environmentData.services.careerPlanningService.serviceName, environmentData.services.careerPlanningService.identifier);
        tokensEsoDataProvider.addService(environmentData.services.actionPlanService.serviceName, environmentData.services.actionPlanService.identifier);
        tokensEsoDataProvider.addService(environmentData.services.mySchedulingService.serviceName, environmentData.services.mySchedulingService.identifier);
        tokensEsoDataProvider.addService(environmentData.services.acmService.serviceName, environmentData.services.acmService.identifier);

    }]);

angular.module('starter').run(['authService','securityService', 'environmentData', 'connectedLearning.constants.environments', function (authService,securityService, environmentData, environments) {

    'use strict';

    //crittercism initialization for both android and iOS platform

    document.addEventListener("deviceready", function () {
        if ((typeof Crittercism !== 'undefined') && (environmentData.environment == "PROD")) {
            Crittercism.init({
                'iosAppID': '01c282a29fa849a3a7860a416981e4a500555300',
                'androidAppID': '5645bf988d4d8c0a00d08208'
            });
        } else if ((typeof Crittercism !== 'undefined') && (environmentData.environment == "STAGE")) {
            Crittercism.init({
                'iosAppID': 'b01f8e56d18c40898d2b83d39e7a403f00555300',
                'androidAppID': '6ee5dc5b78404f0da4720bbe88c5dda400555300'
            });
        } else {
            Crittercism.init({
                'iosAppID': '2222f02de93844fea0a7b712891847a200555300',
                'androidAppID': 'e8c901c610464996b5ae1c599de9ad5f00555300'
            });
        }
    }, false);

    // Set JWT for testing purpose
    if (environmentData.environment === environments.MOCK) {
        var mockJWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ind0NFVKb0lheHFadUpSTnE5Sk12LW5LU0FQOCJ9.eyJpc3MiOiJ1cm46ZmVkZXJhdGlvbjphY2NlbnR1cmU6c3RhZ2UiLCJhdWQiOiJodHRwczovL215bGJ1aWxkLXBld3MuYWNjZW50dXJlLmNvbS9teWxhcGkvIiwibmJmIjoxNDc4ODY3MTU5LCJleHAiOjE0Nzg4NzA3NTksIm5hbWVpZCI6InRpYW5wZW5nLmEubGlAYWNjZW50dXJlLmNvbSIsImFkZnMxZW1haWwiOiJ0aWFucGVuZy5hLmxpQGFjY2VudHVyZS5jb20iLCJjb21tb25uYW1lIjoidGlhbnBlbmcuYS5saSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL2NsYWltcy9BY2NlbnR1cmUuRW1haWxBZGRyZXNzIjoidGlhbnBlbmcuYS5saUBhY2NlbnR1cmUuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvY2xhaW1zL0FjY2VudHVyZS5FbnRlcnByaXNlSUQiOiJ0aWFucGVuZy5hLmxpIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvY2xhaW1zL0FjY2VudHVyZS5QZW9wbGVLZXkiOiI3NTY4NzAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy9jbGFpbXMvQWNjZW50dXJlLlBlcnNvbm5lbE51bWJlciI6IjEwNzI2ODcyIiwiYXV0aG1ldGhvZCI6InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphYzpjbGFzc2VzOlBhc3N3b3JkUHJvdGVjdGVkVHJhbnNwb3J0IiwiYXV0aF90aW1lIjoiMjAxNi0xMS0xMVQxMjoyNTo1NS43NzhaIn0.U_VfWfT5FgJylarNQ2ziivd4wQNTDDKuNJKbP08lGPKuZCJQTiV2tFgggKaA03Lr2vb4ERdPE_nyhRCmYPRMeaFBsaZfw_z9AwTdkSqPcSAbxoePEzXXNVVklh2tU3V6TAwPA3GKmUMjyNI5-AxWPvfDGXcbiQnoVk9PwjmHKP1LGm5GPR3q31QxJ1NTEBHeC152knLP7_jrHn5FmNrfKogv6NzzDckaiPxmfk25JHC-Z8CTbMGJ2_iENxhqFn2y7OiZ6RvVpfCN2Awfollitq-1ZyTecgOW72o9i0GdImDojc3vQzp0_MSZMplu6W6zZl3i72YM8zCrtUyezPOQ4g';
        authService.addToken(environmentData.services.conlearningService.serviceName, 'mock jwt token');
        authService.addToken(environmentData.services.myLearningService.serviceName,mockJWT);
        authService.addToken(environmentData.services.careerPlanningService.serviceName, 'mock jwt token');
        authService.addToken(environmentData.services.actionPlanService.serviceName, 'mock jwt token');
        authService.addToken(environmentData.services.mySchedulingService.serviceName, 'mock jwt token');
        authService.addToken(environmentData.services.acmService.serviceName, 'mock jwt token');

        securityService.addToken(environmentData.services.conlearningService.serviceName, 'mock jwt token');
        securityService.addToken(environmentData.services.myLearningService.serviceName, 'mock jwt token');
        securityService.addToken(environmentData.services.careerPlanningService.serviceName, 'mock jwt token');
        securityService.addToken(environmentData.services.actionPlanService.serviceName, 'mock jwt token');
        securityService.addToken(environmentData.services.mySchedulingService.serviceName, 'mock jwt token');
        securityService.addToken(environmentData.services.acmService.serviceName, 'mock jwt token');
    }

    //authService.addToken(environmentData.services.conlearningService.serviceName, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InNFa01ja2RuczM3UjgwUW1waVpOOUtxTzBPUSJ9.eyJpc3MiOiJ1cm46ZmVkZXJhdGlvbjphY2NlbnR1cmUiLCJhdWQiOiJodHRwczovL2Nvbm5lY3RlZGxlYXJuaW5nYXBwLmFjY2VudHVyZS5jb20vYXBpIiwibmJmIjoxNDcxMzU0MTU4LCJleHAiOjE0NzEzNTc3NTgsIm5hbWVpZCI6ImVsbWVyLmQubWFsaW5hb0BhY2NlbnR1cmUuY29tIiwidXBuIjoiZWxtZXIuZC5tYWxpbmFvQGFjY2VudHVyZS5jb20iLCJ1bmlxdWVfbmFtZSI6ImVsbWVyLmQubWFsaW5hb0BhY2NlbnR1cmUuY29tIiwiZW1haWwiOiJlbG1lci5kLm1hbGluYW9AYWNjZW50dXJlLmNvbSIsImh0dHBzOi8vZmVkZXJhdGlvbi1zdHMuYWNjZW50dXJlLmNvbS9zY2hlbWFzL2NsYWltcy8xL2VudGVycHJpc2VpZCI6ImVsbWVyLmQubWFsaW5hbyIsImh0dHBzOi8vZmVkZXJhdGlvbi1zdHMuYWNjZW50dXJlLmNvbS9zY2hlbWFzL2NsYWltcy8xL3Blb3BsZWtleSI6IjExODA3NjUiLCJodHRwczovL2ZlZGVyYXRpb24tc3RzLmFjY2VudHVyZS5jb20vc2NoZW1hcy9jbGFpbXMvMS9wZXJzb25uZWxudW1iZXIiOiIxMTA5NDMyOSIsImh0dHBzOi8vZmVkZXJhdGlvbi1zdHMuYWNjZW50dXJlLmNvbS9zY2hlbWFzL2NsYWltcy8xL2NvdW50cnljb2RlIjoiUEgiLCJhdXRobWV0aG9kIjoidXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmFjOmNsYXNzZXM6UGFzc3dvcmRQcm90ZWN0ZWRUcmFuc3BvcnQiLCJhdXRoX3RpbWUiOiIyMDE2LTA4LTE2VDA1OjQ5OjAxLjg1MFoifQ.ob51iHOuo1Th83CF0HftLJOxmZrtVzdxMxvDB6o8QTpuyADaAzUaRBq9Q3ja3q-X3bJ7sixCEkCdCCxiET4VUxW7u05QIbjoGzewgJVCBJhMhpzHkN9BvfJVlqda3bCYZ6gTZwbh3nS2WoGUywoEP-Ljl5_MKDudzIglRHkSoU1OFns2VI584gKgIxrP2jPl0GPHyYTtHq6oSLPNxJRlb2saW5q_K6SDNAH0nhds25-dl8mm_A4u0IhfQFEmc8zCuAJhY94MTMrL5XmZ89StWlR4DKJr8oylLotn45vlixWxtgG8uw3M_vappmKF5voQNvfPyWiNn4hzU5CTcgSB5A');
    //authService.addToken(environmentData.services.myLearningService.serviceName, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InNFa01ja2RuczM3UjgwUW1waVpOOUtxTzBPUSJ9.eyJpc3MiOiJ1cm46ZmVkZXJhdGlvbjphY2NlbnR1cmUiLCJhdWQiOiJodHRwczovL3Bld3MuYWNjZW50dXJlLmNvbS9teWxhcGkvIiwibmJmIjoxNDcxMzU0MTg1LCJleHAiOjE0NzEzNTc3ODUsIm5hbWVpZCI6ImVsbWVyLmQubWFsaW5hb0BhY2NlbnR1cmUuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvY2xhaW1zL0FjY2VudHVyZS5QZW9wbGVLZXkiOiIxMTgwNzY1IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvY2xhaW1zL0FjY2VudHVyZS5QZXJzb25uZWxOdW1iZXIiOiIxMTA5NDMyOSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL2NsYWltcy9BY2NlbnR1cmUuRW1haWxBZGRyZXNzIjoiZWxtZXIuZC5tYWxpbmFvQGFjY2VudHVyZS5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy9jbGFpbXMvQWNjZW50dXJlLkVudGVycHJpc2VJRCI6ImVsbWVyLmQubWFsaW5hbyIsImF1dGhtZXRob2QiOiJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YWM6Y2xhc3NlczpQYXNzd29yZFByb3RlY3RlZFRyYW5zcG9ydCIsImF1dGhfdGltZSI6IjIwMTYtMDgtMTZUMDU6NDk6MDEuODUwWiJ9.PFwbvGXgNId1FZezKzlvb_mhVHbL35TR5da0O4HrYc6SBqjQMqu_gV5cBentc6HifE9_RAyKqtKDP--qpA4S1ehKObS_1a_jecWMpsy8Ja7mJX2eb3KKp6lepJ_ZprLLRhjMU5xRhuDSaWsBo4_QgT5A0zAebk0E4CMFV2e6ALbIolqAhHLeUNdiolJS10i5dUW9J_xsBHwCRyMJ6D9TYvVSXnGmMgl3epxKvWWf7SGxbGAJxqlc093T0zYuaeJa6UGnYdpjUE2XlAOUzrWHMrxSZskXqZdDA1TxdqocoiDWrXr0qLdFXpGhdoR2lv12j6As4r_RYw-V168nXjPUyg');
    //authService.addToken(environmentData.services.careerPlanningService.serviceName, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InNFa01ja2RuczM3UjgwUW1waVpOOUtxTzBPUSJ9.eyJpc3MiOiJ1cm46ZmVkZXJhdGlvbjphY2NlbnR1cmUiLCJhdWQiOiJodHRwczovL2NhcmVlcnBsYW5uaW5nLmFjY2VudHVyZS5jb20vd2ViYXBpL2FwaS9leHRlcm5hbC1zZXJ2aWNlLyIsIm5iZiI6MTQ3MTM1NDIxNiwiZXhwIjoxNDcxMzU3ODE2LCJuYW1laWQiOiJlbG1lci5kLm1hbGluYW9AYWNjZW50dXJlLmNvbSIsInVwbiI6ImVsbWVyLmQubWFsaW5hb0BhY2NlbnR1cmUuY29tIiwidW5pcXVlX25hbWUiOiJlbG1lci5kLm1hbGluYW9AYWNjZW50dXJlLmNvbSIsImVtYWlsIjoiZWxtZXIuZC5tYWxpbmFvQGFjY2VudHVyZS5jb20iLCJodHRwczovL2ZlZGVyYXRpb24tc3RzLmFjY2VudHVyZS5jb20vc2NoZW1hcy9jbGFpbXMvMS9lbnRlcnByaXNlaWQiOiJlbG1lci5kLm1hbGluYW8iLCJodHRwczovL2ZlZGVyYXRpb24tc3RzLmFjY2VudHVyZS5jb20vc2NoZW1hcy9jbGFpbXMvMS9wZW9wbGVrZXkiOiIxMTgwNzY1IiwiaHR0cHM6Ly9mZWRlcmF0aW9uLXN0cy5hY2NlbnR1cmUuY29tL3NjaGVtYXMvY2xhaW1zLzEvcGVyc29ubmVsbnVtYmVyIjoiMTEwOTQzMjkiLCJodHRwczovL2ZlZGVyYXRpb24tc3RzLmFjY2VudHVyZS5jb20vc2NoZW1hcy9jbGFpbXMvMS9kaXNwbGF5bmFtZSI6Ik1hbGluYW8sIEVsbWVyIEQuIiwiaHR0cHM6Ly9mZWRlcmF0aW9uLXN0cy5hY2NlbnR1cmUuY29tL3NjaGVtYXMvY2xhaW1zLzEvQWNjZW50dXJlLkNhcmVlckxldmVsQ29kZSI6IjEwMDAwMTEwIiwiaHR0cHM6Ly9mZWRlcmF0aW9uLXN0cy5hY2NlbnR1cmUuY29tL3NjaGVtYXMvY2xhaW1zLzEvY29tcGFueWNvZGUiOiI4MDA2IiwiaHR0cHM6Ly9mZWRlcmF0aW9uLXN0cy5hY2NlbnR1cmUuY29tL3NjaGVtYXMvY2xhaW1zLzEvY291bnRyeWNvZGUiOiJQSCIsImh0dHBzOi8vZmVkZXJhdGlvbi1zdHMuYWNjZW50dXJlLmNvbS9zY2hlbWFzL2NsYWltcy8xL2NvbXBhbnlkZXNjcmlwdGlvbiI6IkFjY2VudHVyZSBJbmMiLCJodHRwczovL2ZlZGVyYXRpb24tc3RzLmFjY2VudHVyZS5jb20vc2NoZW1hcy9jbGFpbXMvMS91c2Vyb2JqZWN0Y29kZSI6IkVtcGxveWVlIiwiaHR0cHM6Ly9mZWRlcmF0aW9uLXN0cy5hY2NlbnR1cmUuY29tL3NjaGVtYXMvY2xhaW1zLzEvZ2VvZ3JhcGhpY3VuaXRjb2RlIjoiQVNFIiwiYXV0aG1ldGhvZCI6InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphYzpjbGFzc2VzOlBhc3N3b3JkUHJvdGVjdGVkVHJhbnNwb3J0IiwiYXV0aF90aW1lIjoiMjAxNi0wOC0xNlQwNTo0OTowMS44NTBaIn0.pRo0lc8JugS7gmiWx1o9FjoYN3F2-03dAV_Nz5cGz-hWzZATHcHBvWsXw8x2ODbhmSyX3fKjefKGGxruCxPal5M30FL64_hGZkGlypv8joR2r2xZgkXyboJ7z4TxeIyPKjhlP-SKhEKliFPni7ggLbJX6l1ruq-JQneD3lbOWFmsxL1MWrp0ftsj4-RvqOCicpchN0nep5O3NIA-DsUUcNNOrsDX8j3unxjITqpN17UsRZtfM2YyJ81sivDN7WWjzk2Gw3BVxBsbV69tY_fPek06ds6s1mkXF211-M9EPhMZNgKi1GhMpAaydPaQ0C8j1U9pQy1xFhF7lNcXmrWkQg');
    //authService.addToken(environmentData.services.actionPlanService.serviceName, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InNFa01ja2RuczM3UjgwUW1waVpOOUtxTzBPUSJ9.eyJpc3MiOiJ1cm46ZmVkZXJhdGlvbjphY2NlbnR1cmUiLCJhdWQiOiJodHRwczovL2FjdGlvbnBsYW5zZXJ2aWNlLmFjY2VudHVyZS5jb20iLCJuYmYiOjE0NzEzNTQyNjAsImV4cCI6MTQ3MTM1Nzg2MCwibmFtZWlkIjoiZWxtZXIuZC5tYWxpbmFvQGFjY2VudHVyZS5jb20iLCJ1cG4iOiJlbG1lci5kLm1hbGluYW9AYWNjZW50dXJlLmNvbSIsInVuaXF1ZV9uYW1lIjoiZWxtZXIuZC5tYWxpbmFvQGFjY2VudHVyZS5jb20iLCJlbWFpbCI6ImVsbWVyLmQubWFsaW5hb0BhY2NlbnR1cmUuY29tIiwiaHR0cHM6Ly9mZWRlcmF0aW9uLXN0cy5hY2NlbnR1cmUuY29tL3NjaGVtYXMvY2xhaW1zLzEvZW50ZXJwcmlzZWlkIjoiZWxtZXIuZC5tYWxpbmFvIiwiaHR0cHM6Ly9mZWRlcmF0aW9uLXN0cy5hY2NlbnR1cmUuY29tL3NjaGVtYXMvY2xhaW1zLzEvcGVvcGxla2V5IjoiMTE4MDc2NSIsImh0dHBzOi8vZmVkZXJhdGlvbi1zdHMuYWNjZW50dXJlLmNvbS9zY2hlbWFzL2NsYWltcy8xL3BlcnNvbm5lbG51bWJlciI6IjExMDk0MzI5IiwiaHR0cHM6Ly9mZWRlcmF0aW9uLXN0cy5hY2NlbnR1cmUuY29tL3NjaGVtYXMvY2xhaW1zLzEvQWNjZW50dXJlLkNhcmVlckxldmVsQ29kZSI6IjEwMDAwMTEwIiwiaHR0cHM6Ly9mZWRlcmF0aW9uLXN0cy5hY2NlbnR1cmUuY29tL3NjaGVtYXMvY2xhaW1zLzEvZGlzcGxheW5hbWUiOiJNYWxpbmFvLCBFbG1lciBELiIsImh0dHBzOi8vZmVkZXJhdGlvbi1zdHMuYWNjZW50dXJlLmNvbS9zY2hlbWFzL2NsYWltcy8xL2NvbXBhbnljb2RlIjoiODAwNiIsImh0dHBzOi8vZmVkZXJhdGlvbi1zdHMuYWNjZW50dXJlLmNvbS9zY2hlbWFzL2NsYWltcy8xL2NvbXBhbnlkZXNjcmlwdGlvbiI6IkFjY2VudHVyZSBJbmMiLCJodHRwczovL2ZlZGVyYXRpb24tc3RzLmFjY2VudHVyZS5jb20vc2NoZW1hcy9jbGFpbXMvMS91c2Vyb2JqZWN0Y29kZSI6IkVtcGxveWVlIiwiYXV0aG1ldGhvZCI6InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphYzpjbGFzc2VzOlBhc3N3b3JkUHJvdGVjdGVkVHJhbnNwb3J0IiwiYXV0aF90aW1lIjoiMjAxNi0wOC0xNlQwNTo0OTowMS44NTBaIn0.dh8RjI8KojaACkkZo8_mBqqM-6lxI9bh4lhTlk-ot2RdbBdR3WaWM6I-Y4Vjku_Jg4Ttxd05VmLk0NJ2TpNtINsUafxjA5-rauuPVI9ra0Vzvq1L2qKnA8BKyuHfR0XtYfLF6rEryH585_PwpDYkHvIUBJqOJrfnbyVoH7gUq_gwSsjBgRma7o1HUbr3SP2cewkgkg3vcarSiW174MPfBi_P6PElgnvnKn90WzVCurxci6IosqziCsmQaskc_ovcOzp4LURtxYeyuYg9v4OT9-SK77ReBeaZDXSZwIqeNSCs3-yg8yf3JImEYGcK-4635bEM5kLgwVIX96-aovSJ0A');
    //authService.addToken(environmentData.services.mySchedulingService.serviceName, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InNFa01ja2RuczM3UjgwUW1waVpOOUtxTzBPUSJ9.eyJpc3MiOiJ1cm46ZmVkZXJhdGlvbjphY2NlbnR1cmUiLCJhdWQiOiJodHRwczovL215c2NoZWR1bGluZ3N2Yy5hY2NlbnR1cmUuY29tIiwibmJmIjoxNDcxMzU0MjkyLCJleHAiOjE0NzEzNTc4OTIsIm5hbWVpZCI6ImVsbWVyLmQubWFsaW5hb0BhY2NlbnR1cmUuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvY2xhaW1zL0FjY2VudHVyZS5QZW9wbGVLZXkiOiIxMTgwNzY1IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvY2xhaW1zL0FjY2VudHVyZS5QZXJzb25uZWxOdW1iZXIiOiIxMTA5NDMyOSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL2NsYWltcy9BY2NlbnR1cmUuRW50ZXJwcmlzZUlEIjoiZWxtZXIuZC5tYWxpbmFvIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvY2xhaW1zL0FjY2VudHVyZS5FbWFpbEFkZHJlc3MiOiJlbG1lci5kLm1hbGluYW9AYWNjZW50dXJlLmNvbSIsImF1dGhtZXRob2QiOiJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YWM6Y2xhc3NlczpQYXNzd29yZFByb3RlY3RlZFRyYW5zcG9ydCIsImF1dGhfdGltZSI6IjIwMTYtMDgtMTZUMDU6NDk6MDEuODUwWiJ9.EKrr5glHqwCbSrDCoI5IFXwYcMoPFEQ3gin1LdIBvKe6fg9hv1a-fEXGGUErao2IN5I8kzWT-XH5_Fdpm1rPGy8Se4WA2hRzLLs-DwjBKawc0gXgiArxduPXMNc_Y9d-RwuP5XWiPXiHvRJ0-62QKqoIAoGq_pMUKGYtqX3rXQ1iR31KOBJtC-dvAp6PuXBjOJ41NY4E6O-PWmsql8C2aZWRSx87zyPtKAqQFOsUbcbtH61R1NXBzwnEYIH3ol9bRCkwimf1zHvUVxMzTMLwmjuw7pTK2Q8Trr9h6KkvbRUbkzFvVrfCResFwU5yOA8W5UsMcedYtbqdRA4IdON4pw');
    //authService.addToken(environmentData.services.acmService.serviceName, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InNFa01ja2RuczM3UjgwUW1waVpOOUtxTzBPUSJ9.eyJpc3MiOiJ1cm46ZmVkZXJhdGlvbjphY2NlbnR1cmUiLCJhdWQiOiJodHRwczovL2NhcmVlcnNtYXJrZXRwbGFjZS5hY2NlbnR1cmUuY29tL3dlYmFwaS9hcGkvZXh0ZXJuYWwtc2VydmljZS8iLCJuYmYiOjE0NzEzNTQzMjcsImV4cCI6MTQ3MTM1NzkyNywibmFtZWlkIjoiZWxtZXIuZC5tYWxpbmFvQGFjY2VudHVyZS5jb20iLCJ1bmlxdWVfbmFtZSI6ImVsbWVyLmQubWFsaW5hbyIsImh0dHBzOi8vZmVkZXJhdGlvbi1zdHMuYWNjZW50dXJlLmNvbS9zY2hlbWFzL2NsYWltcy8xL3VzZXJvYmplY3Rjb2RlIjoiRW1wbG95ZWUiLCJjb21tb25uYW1lIjoiZWxtZXIuZC5tYWxpbmFvIiwiZmFtaWx5X25hbWUiOiJNYWxpbmFvIiwiZW1haWwiOiJlbG1lci5kLm1hbGluYW9AYWNjZW50dXJlLmNvbSIsImh0dHBzOi8vZmVkZXJhdGlvbi1zdHMuYWNjZW50dXJlLmNvbS9zY2hlbWFzL2NsYWltcy8xL2VudGVycHJpc2VpZCI6ImVsbWVyLmQubWFsaW5hbyIsImh0dHBzOi8vZmVkZXJhdGlvbi1zdHMuYWNjZW50dXJlLmNvbS9zY2hlbWFzL2NsYWltcy8xL3Blb3BsZWtleSI6IjExODA3NjUiLCJodHRwczovL2ZlZGVyYXRpb24tc3RzLmFjY2VudHVyZS5jb20vc2NoZW1hcy9jbGFpbXMvMS9kaXNwbGF5bmFtZSI6Ik1hbGluYW8sIEVsbWVyIEQuIiwiaHR0cHM6Ly9mZWRlcmF0aW9uLXN0cy5hY2NlbnR1cmUuY29tL3NjaGVtYXMvY2xhaW1zLzEvY291bnRyeWNvZGUiOiJQSCIsImh0dHBzOi8vZmVkZXJhdGlvbi1zdHMuYWNjZW50dXJlLmNvbS9zY2hlbWFzL2NsYWltcy8xL2NvbXBhbnljb2RlIjoiODAwNiIsImh0dHBzOi8vZmVkZXJhdGlvbi1zdHMuYWNjZW50dXJlLmNvbS9zY2hlbWFzL2NsYWltcy8xL2Nvc3RjZW50ZXJjb2RlIjoiMDA4MDA2MDEzNiIsImh0dHBzOi8vZmVkZXJhdGlvbi1zdHMuYWNjZW50dXJlLmNvbS9zY2hlbWFzL2NsYWltcy8xL2NvbXBhbnlkZXNjcmlwdGlvbiI6IkFjY2VudHVyZSBJbmMiLCJodHRwczovL2ZlZGVyYXRpb24tc3RzLmFjY2VudHVyZS5jb20vc2NoZW1hcy9jbGFpbXMvMS9zYXB1c2VyaWQiOiIxMTA5NDMyOSIsImh0dHBzOi8vZmVkZXJhdGlvbi1zdHMuYWNjZW50dXJlLmNvbS9zY2hlbWFzL2NsYWltcy8xL3BlcnNvbm5lbG51bWJlciI6IjExMDk0MzI5IiwiYXV0aG1ldGhvZCI6InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphYzpjbGFzc2VzOlBhc3N3b3JkUHJvdGVjdGVkVHJhbnNwb3J0IiwiYXV0aF90aW1lIjoiMjAxNi0wOC0xNlQwNTo0OTowMS44NTBaIn0.TVwlzqb5v0XSuesLxPS2WhUj8K2hdpndymbP3Y2-gfcGufmSCEWP69HR_iHNr5lBwOH-3Hi7E1IZUbOrycGXhYiyo9EYhrl31DbTigDP8JVnZZMKMdua1gWeCFMjeL34wPKcK4Nvxz4EubBrTeco14YADZnXoDLkldO15Ej1Z5ODhbDVsv_HJ9YnasUzV1_2dCkEtT3fA9DFl4I5mUBeQbMsyNwOIrDgEf-n1YpI_6sE0t0D8An0X5ZDh8B8TRjtfhU8CVoEkzCILABBDheRYj1RUNey6Ii-yaQYa9WrbtjSoz7rokDDIdroIkTgidCaH6OhhrZpiYGZFKQzzBLVTQ');

}]);


app.config(function ($ionicConfigProvider) {


    'use strict';

    // For remove Back text
    $ionicConfigProvider.backButton.text('');
    // Android
    $ionicConfigProvider.tabs.position("bottom");
    $ionicConfigProvider.tabs.style("standard");

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');
});

// The new path for angular, fixed the issues with iOS9

/**
 * ================== angular-ios9-uiwebview.patch.js v1.1.0 ==================
 *
 * This patch works around iOS9 UIWebView regression that causes infinite digest
 * errors in Angular.
 *
 * The patch can be applied to Angular 1.2.0 – 1.4.5. Newer versions of Angular
 * have the workaround baked in.
 *
 * To apply this patch load/bundle this file with your application and add a
 * dependency on the "ngIOS9Patch" module to your main app module.
 *
 * For example:
 *
 * ```
 * angular.module('myApp', ['ngRoute'])`
 * ```
 *
 * becomes
 *
 * ```
 * angular.module('myApp', ['ngRoute', 'ngIOS9UIWebViewPatch'])
 * ```
 *
 *
 * More info:
 * - https://openradar.appspot.com/22186109

 * - https://github.com/angular/angular.js/issues/12241

 * - https://github.com/driftyco/ionic/issues/4082
 *
 *
 * @license AngularJS
 * (c) 2010-2015 Google, Inc. http://angularjs.org
 * License: MIT
 */
angular.module('ngIOS9UIWebViewPatch', ['ng']).config(function ($provide) {
    'use strict';
    $provide.decorator('$browser', ['$delegate', '$window', function ($delegate, $window) {

        function isIOS9UIWebView(userAgent) {
            return /(iPhone|iPad|iPod).* OS 9_\d/.test(userAgent) && !/Version\/9\./.test(userAgent);
        }

        function applyIOS9Shim(browser) {
            var pendingLocationUrl = null;
            var originalUrlFn = browser.url;

            function clearPendingLocationUrl() {
                pendingLocationUrl = null;
            }

            browser.url = function () {
                if (arguments.length) {
                    pendingLocationUrl = arguments[0];
                    return originalUrlFn.apply(browser, arguments);
                }
                return pendingLocationUrl || originalUrlFn.apply(browser, arguments);
            };
            window.addEventListener('popstate', clearPendingLocationUrl, false);
            window.addEventListener('hashchange', clearPendingLocationUrl, false);

            return browser;
        }

        if (isIOS9UIWebView($window.navigator.userAgent)) {
            return applyIOS9Shim($delegate);
        }
        return $delegate;
    }]);
});

//#region   Merge code from learning events

app.directive('autoFocus', function ($timeout) {
    return {
        link: function (scope, element, attrs) {
            $timeout(function () {

                element[0].focus();
                cordova.plugins.Keyboard.show();

            }, 150);
        }
    };
});

app.config(function (environmentDataProvider,localStorageServiceProvider) {
    var environmentData = environmentDataProvider.$get();
    localStorageServiceProvider
        .setPrefix(environmentData.clientId);
});

//##endregion