/**
 * Created by ling.a.liu on 11/9/2016.
 */
'use strict';

controllers.controller('facultiesController',
    ['$scope', '$rootScope', 'trainingService', '$log', '$ionicLoading', '$cordovaToast', 'localStorageService',
        'connectedLearning.constants', '$stateParams','menuService','connectedLearning.messages','$ionicHistory','authService',
        function ($scope, $rootScope, trainingService, $log, $ionicLoading, $cordovaToast, localStorageService,
                  constants, $stateParams,menuService,messagesService,$ionicHistory,authService) {

            //console.log($stateParams);
            var activityId = 0;
            $scope.surveyToFaculty = "";
            $scope.event = "";


            $scope.getFaculties = function (activityId) {
                $ionicLoading.show();
                trainingService.searchPeopleNew(activityId, 0, 2, '', '', '').then(
                    function (data) {
                        //var eid = '';
                        angular.forEach(data, function (data1) {
                            var eid = data1.EnterpriseID;
                            data1.fullName = data1.lastName + ', ' + data1.firstName;

                            var cached = localStorageService.get("ACLMOBILE_IMAGE_" + eid);
                            if (cached == null || cached == "") {
                                authService.callService({
                                    serviceName: environmentData.services.myLearningService.serviceName,
                                    action: menuService.getProfileImageModel,
                                    params: {
                                        eID: eid
                                    }
                                }).then(
                                    function (data2) {
                                    var url = data2[0].m_Uri;
                                    data1.imgUrl = url;
                                    localStorageService.set("ACLMOBILE_IMAGE_" + eid, url);
                                });
                            }
                            else {
                                data1.imgUrl = cached;
                            }

                            data1.standardjobdescr = data1.CareerLevel;

                            $scope.faculty.push(data1);
                        });
                        $scope.noFacultyDataShow = !!($scope.faculty == null || $scope.faculty.length == 0);
                        $ionicLoading.hide();
                    },
                    function (data) {
                        //alert('error');
                        var msg = 'System fails to load data.';
                        $scope.noFacultyDataShow = false;
                        console.log(msg);
                        //$scope.showToast(msg, 'short', 'bottom');
                        $ionicLoading.hide();
                    })
            };

            $scope.getSurveyForFaculty = function (activityId) {
                $scope.finishLoadingSurveyToFaculty = false;
                if ($rootScope.trainingItem.fromAdmin || $rootScope.trainingItem.pickRule == 1 || !$rootScope.trainingItem.isPastSession || $rootScope.ImpersonateStatus) {
                    console.log("User as faculty/admin cannot give a survey, user cannot give survey for not past session");
                } else {

                    trainingService.getSurveyForFaculty(activityId).then(
                        function (data) {
                            if (data) {
                                $scope.surveyToFaculty = data.replace(/["]/g, "");
                            }
                            else {
                                //pop up no survey found.
                                var msg = 'No Survey Found!';
                                console.log(msg);
                            }
                            $scope.finishLoadingSurveyToFaculty = true;
                            messagesService.broadcast(constants.broadcast.finishLoadingSurveyToFaculty);
                        },

                        function (data) {
                            // Error loading expenses message
                            console.log(data.status);
                            console.log(data.data);
                            var msg = 'There was an error loading Survey. Please, try again later';
                            console.log(msg);
                            $scope.finishLoadingSurveyToFaculty = true;
                            messagesService.broadcast(constants.broadcast.finishLoadingSurveyToFaculty);
                        }
                    );
                }
            };

            $scope.navigateFeedback = function (eid, $event) {
                //$scope.navigateToState('app.eventFeedback', {item:list},false);
                $ionicLoading.show();
                if (!$scope.finishLoadingSurveyToFaculty) {
                    $scope.waitLoadingSurveyToFaculty = true;
                    $scope.EID = eid;
                    $scope.event = $event;
                } else {
                    $scope.waitLoadingSurveyToFaculty = false;
                    var url = $scope.surveyToFaculty + eid;
                    if (typeof cordova == 'undefined') {
                        window.open(url, '_system', 'location=yes');
                        $ionicLoading.hide();
                    }
                    else {
                        $scope.openSurvey(url);
                    }
                }
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
            };

            function loadStartCallBack() {
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
                    + params.message + "', the url is: '"+params.url+");";

                console.log(scriptErrorMesssage);

                $scope.inAppBrowserRef.close();

                $scope.inAppBrowserRef = undefined;

            }

            function exitCallBack() {
                $scope.$broadcast('scroll.refreshComplete');
            }

            $scope.$on(constants.broadcast.finishLoadingSurveyToFaculty, function () {

                if($scope.waitLoadingSurveyToFaculty){
                    $scope.navigateFeedback($scope.EID,$scope.event);
                }
            });

            $scope.$on('$ionicView.enter', function () {
                $scope.faculty = [];
                activityId = $stateParams.activityId?$stateParams.activityId:0;
                $scope.getFaculties(activityId);
                $scope.getSurveyForFaculty(activityId);
            });

        }]);// End controller

       