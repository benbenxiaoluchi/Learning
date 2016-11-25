/**
 * Created by huaifei.zhang on 2016/11/8.
 */
'use strict';

controllers.controller('learningCenterCtrl',['$scope', '$rootScope', '$stateParams', '$ionicScrollDelegate', '$ionicLoading', 'trainingService', '$ionicModal', '$cordovaToast','getFacilityInfoService',
    function ($scope, $rootScope, $stateParams, $ionicScrollDelegate, $ionicLoading, trainingService, $ionicModal, $cordovaToast, getFacilityInfoService) {

        var indexOfCenter = null;
        var centerFacilityID = null;
        var centerInfo = null;
        $scope.whichFacility = null;
        $scope.googleMapVisible = true;
        $scope.weather = [];
        var venueOptionsInit = [
            "LOCATION MAP",
            "FLOOR MAPS",
            "WEATHER",
            "ALL COURSES AT THIS FACILITY",
            "ADDITIONAL INFORMATION"
        ];
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
            $scope.fontSizeC = 'facilityVenueWeather-top-info-btn bdln';
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
                centerInfo = "https://techops.accenture.com/share/RLC/St.Charles_Learning_Center_Venue_Information.pdf";
            } else if ($stateParams.city == 'Kuala Lumpur') {
                indexOfCenter = 1;
                getSingleFacility(' ', 737);
                centerFacilityID = 737;
                centerInfo = "https://techops.accenture.com/share/RLC/Kuala_Lumpur_Learning_Center_Venue_Information.pdf";
            } else if ($stateParams.city == 'Madrid') {
                indexOfCenter = 2;
                getSingleFacility(' ', 2612);
                centerFacilityID = 2612;
                centerInfo = "https://techops.accenture.com/share/RLC/Madrid_Learning_Center_Venue_Information.pdf";
            } else if ($stateParams.city == 'Bengaluru') {
                indexOfCenter = 3;
                getSingleFacility(' ', 4404);
                centerFacilityID = 4404;
                centerInfo = "https://techops.accenture.com/share/RLC/India_Learning_Center_Venue_Information.pdf";
            } else if ($stateParams.city == 'London') {
                indexOfCenter = 4;
                getSingleFacility(' ', 4790);
                centerFacilityID = 4790;
                centerInfo = "https://techops.accenture.com/share/RLC/London_Learning_Center_Venue_Information.pdf";
            } else if ($stateParams.city == 'Dublin') {
                indexOfCenter = 5;
                getSingleFacility(' ', 6176);
                centerFacilityID = 6176;
                centerInfo = "https://techops.accenture.com/share/RLC/Dublin_Learning_Center_Venue_Information.pdf";
            } else {
                indexOfCenter = 6;
                centerInfo = null;
                venueOptionsInit.pop();
            }
            $scope.venueOptions = venueOptionsInit;
            $scope.centerImg = centerImage[indexOfCenter];
        }

        function downloadAdditionalVenueInfo() {
            if(centerInfo){
                window.open(centerInfo, '_system', 'location=yes');
            }else {
                $cordovaToast.show("No Additional Information of This Center.", 'long', 'bottom');
            }
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
        };

        $scope.facilityVenueOptions = function (option) {
            switch (option) {
                case "LOCATION MAP" : venueMap();
                         break;
                case "FLOOR MAPS" : $scope.navigateToState('app.floorMap');
                         break;
                case "WEATHER" : venueWeather();
                         break;
                case "ALL COURSES AT THIS FACILITY" : $scope.navigateToOnGoingEvent(centerFacilityID);
                         break;
                case "ADDITIONAL INFORMATION" : downloadAdditionalVenueInfo();
                         break;
                default:break;
            }
        };

        $scope.hideVenueOptions = function () {
            $scope.facilityVenueOptions_modal.hide()
        };

        $scope.getFahrenheit = function () {
            getFahrenheit();
        };

        $scope.getCentigrade = function () {
            getCentigrade();
        }
    }]);