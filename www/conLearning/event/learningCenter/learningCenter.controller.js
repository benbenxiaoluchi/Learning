/**
 * Created by huaifei.zhang on 2016/11/8.
 */
'use strict';

controllers.controller('learningCenterCtrl',['$scope', '$rootScope', '$stateParams', '$ionicScrollDelegate', '$ionicLoading', 'trainingService', '$ionicModal', '$cordovaToast','getFacilityInfoService',
    function ($scope, $rootScope, $stateParams, $ionicScrollDelegate, $ionicLoading, trainingService, $ionicModal, $cordovaToast, getFacilityInfoService) {

        var indexOfCenter = null;
        var centerFacilityID = null;
        $scope.whichFacility = null;
        $scope.venueOptions = ["LOCATION MAP","FLOOR MAPS","WEATHER","ALL COURSES AT THIS FACILITY","ADDITIONAL INFORMATION"];
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
            trainingService.getWeatherInfo(searchCondition).then(
                function (weatherdata) {
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

        function getCenter() {
            if ($stateParams.city == 'St. Charles') {
                indexOfCenter = 0;
                getSingleFacility(' ', 1);
                centerFacilityID = 1;
            } else if ($stateParams.city == 'Kuala Lumpur') {
                indexOfCenter = 1;
                getSingleFacility(' ', 737);
                centerFacilityID = 737;
            } else if ($stateParams.city == 'Madrid') {
                indexOfCenter = 2;
                getSingleFacility(' ', 2612);
                centerFacilityID = 2612;
            } else if ($stateParams.city == 'Bengaluru') {
                indexOfCenter = 3;
                getSingleFacility(' ', 4404);
                centerFacilityID = 4404;
            } else if ($stateParams.city == 'London') {
                indexOfCenter = 4;
                getSingleFacility(' ', 4790);
                centerFacilityID = 4790;
            } else if ($stateParams.city == 'Dublin') {
                indexOfCenter = 5;
                getSingleFacility(' ', 6176);
                centerFacilityID = 6176;
            } else {
                indexOfCenter = 6;
                // getSingleFacility('', );
            }
            $scope.centerImg = centerImage[indexOfCenter];
        }


        var venueMap = function () {
            getRegion();
            //$ionicLoading.hide();
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

        $scope.getLearningCenter = function () {
            centerImage = getFacilityInfoService.getCenterImageList().centerImages;
            getCenter();
            //getRegion()
        };

        $scope.facilityVenueOptions = function (index) {
            switch (index) {
                case 0 : venueMap();
                         break;
                case 1 : $scope.navigateToState('app.floorMap');
                         break;
                case 2 : venueWeather();
                         break;
                case 3 : $scope.navigateToOnGoingEvent(centerFacilityID);
                         break;
                case 4 : ;
            }
        };

        $scope.hideVenueOptions = function () {
            $scope.facilityVenueOptions_modal.hide()
        };

    }]);