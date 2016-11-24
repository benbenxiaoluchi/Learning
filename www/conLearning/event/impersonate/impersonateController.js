/**
 * Created by jun.h.li on 11/2/2015.
 */
'use strict';
controllers.controller('impersonateController',
    ['$scope', '$rootScope', 'menuService', 'trainingService', 'impersonateService', 'authService', '$ionicActionSheet', 'localStorageService', '$state', '$log', '$stateParams', '$cordovaInAppBrowser', '$ionicLoading', '$sce', '$ionicPopup', '$cordovaClipboard', '$cordovaToast','$filter','$ionicModal','environmentData',
        function ($scope, $rootScope, menuService, trainingService, impersonateService, authService, $ionicActionSheet, localStorageService, $state, $log, $stateParams, $cordovaInAppBrowser, $ionicLoading, $sce, $ionicPopup, $cordovaClipboard, $cordovaToast, filter, $ionicModal, environmentData) {
            $scope.inSearchProgress = false;
            $scope.boolActivities = false;
            $scope.positionSearchFlag = 0;

            $scope.performSearch = function () {
                $scope.Venue = [];
                $scope.noDataShow = false;
                $scope.searchPeople($scope.searchText, 0, 3);
                cordova.plugins.Keyboard.close();
                //$scope.getActivityList($scope.searchText);
            };

            $scope.loadMoreSearch = function () {
                if (!$scope.inSearchProgress) {
                    $scope.searchPeople($scope.searchText, $scope.positionSearchFlag, 3);
                }
            };

            $scope.moreSearchCanBeLoaded = function () {
                return $scope.moreVenueData;
            };

            // search participant & faculty by activityid
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
                        RecordCount: positionFlag,
                        ReturnSetFlag: type,
                        SearchStr: '',
                        DemogCategory: '',
                        DemogKey: ''
                    }
                }).then(
                    function (venuedata) {
                        $scope.inSearchProgress = false;
                        angular.forEach(venuedata, function (profiledata, index, array) {

                            var eid = profiledata.EnterpriseID;
                            profiledata.fullName = profiledata.lastName + ', ' + profiledata.firstName;
                            if (profiledata.isInstructor == 1) {
                                profiledata.type = 'Faculty'
                            }
                            if (profiledata.isInstructor == 0) {
                                profiledata.type = 'Participants'
                            }

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

            // impersonate select user and view the trainig details
            $scope.impersonate = function (impersonationEid, impersonationPeopleKey, impactivityID, impersonationUserType) {
                $rootScope.impersonationEID = impersonationEid;
                $rootScope.impersonationPeopleKey = impersonationPeopleKey;
                $rootScope.impersonationActivityID = impactivityID;
                $rootScope.impersonationUserType = impersonationUserType;

                $ionicLoading.show();

                //Get impersonation token
                authService.callService({
                    serviceName: environmentData.services.myLearningService.serviceName,
                    action: impersonateService.getManageModePermission,
                    params: {
                        impersonationEid: impersonationEid,
                        impersonationPeopleKey: impersonationPeopleKey
                    }
                }).then(
                    function (data) {
                        if (typeof data !== 'undefined' && !angular.equals({}, data)){
                            $rootScope.ImpersonateStatus = true; //"End Impersonation";
                            $rootScope.impersonationToken = data.token;
                            console.log('impersonationToken:' + $rootScope.impersonationToken);

                            $scope.navigateToState('app.trainingDetailTabs.activityTab', { selectedTraining: null, fromMyTraining: null }, true, true);
                        } else{
                            $scope.showToast('Impersonate failed, please try again.', 'short', 'bottom');
                        }
                    },
                    function (data, status) {
                        var msg = 'System fails to load data.';
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

        }]);// End list controller
