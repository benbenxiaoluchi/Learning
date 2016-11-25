/**
 * Created by huaifei.zhang on 2016/10/28.
 */
'use strict';

controllers.controller('ongoingEventsController',['$scope', '$rootScope', '$ionicScrollDelegate', 'trainingService', 'itemPathService','$stateParams','$ionicLoading',
    function ($scope, $rootScope, $ionicScrollDelegate, trainingService, itemPathService, $stateParams,$ionicLoading) {

        $scope.allSessionsIcon = [];
        $scope.allSessionsShow = [];
        $scope.SessionsList = [];
        $scope.noSessionsList = false;
        $scope.NoData = "There's no course at this facility in this week.";
        $scope.FailedToGetData = "";

        function pushItem(item,cityList) {
            var tempList = [];
            tempList.push(item);
            cityList.push(tempList);
        }

        function filterCityList(list,cityList) {
            angular.forEach(list, function (item) {
                itemPathService.UpcomingPath(item);
                if(cityList.length == 0){
                    pushItem(item,cityList);
                } else {
                    var cityListLength = cityList.length;
                    for(var i = 0;i < cityListLength;i++){
                        if(item.FacilityCity == cityList[i][0].FacilityCity){
                            cityList[i].push(item);
                            break;
                        }
                        if(i == cityList.length-1){
                            pushItem(item,cityList);
                        }
                    }
                }
            });
            return cityList;
        }

        $ionicLoading.show();
        trainingService.getVenue($stateParams.facilityID || 1).then(
            function (data) {
                $scope.FailedToGetData = "";
                var list = data.Content;
                var cityList = [];
                if (list == null || list.length == 0) {
                    $scope.noSessionsList = true;
                } else {
                    cityList = filterCityList(list,cityList);
                    $scope.SessionsList = cityList;
                    for(var k = 0;k < $scope.SessionsList.length;k++){
                        if(k == 0){
                            $scope.allSessionsShow[0] = true;
                            $scope.allSessionsIcon[0] = 'ion-chevron-up';
                        } else {
                            $scope.allSessionsShow[k] = false;
                            $scope.allSessionsIcon[k] = 'ion-chevron-down';
                        }
                    }
                }
                // $scope.finishGetVenueList = true;
                $ionicLoading.hide();
            },

            function (data,status) {
                var msg = 'There was an error on getting ongoing training list. ';
                console.log(msg + ' status ' + status);
                $scope.NoData = msg;
                $scope.noSessionsList = true;
                $scope.FailedToGetData = "Error";
                // $scope.finishGetVenueList = true;
                $rootScope.showSplash = false;
                $ionicLoading.hide();
            }
        );

        $scope.showDetails = function (index) {
            $scope.allSessionsShow[index] = !$scope.allSessionsShow[index];
            $scope.allSessionsIcon[index] = $scope.allSessionsShow[index]?'ion-chevron-up':'ion-chevron-down';
            $ionicScrollDelegate.resize();
        };





        //2ndEdition

        // $scope.allSessionsIcon = [];
        // $scope.allSessionsShow = [];
        // $scope.SessionsList = [];
        // $scope.noSessionsList = false;
        // $scope.NoData = "There's no course at this facility in this week.";
        // $scope.FailedToGetData = "";
        //
        // function getFacilityCityList(gets) {
        //     var returnList = [];
        //     angular.forEach(gets,function (item) {
        //         returnList.push(item[0].FacilityCity);
        //     });
        //     return returnList;
        // }
        //
        // function pushItem(item,cityList) {
        //     var tempList = [];
        //     tempList.push(item);
        //     cityList.push(tempList);
        // }
        //
        // function filterCityList(list,cityList) {
        //     angular.forEach(list, function (item) {
        //         itemPathService.UpcomingPath(item);
        //         if(cityList.length == 0){
        //             pushItem(item,cityList);
        //         } else {
        //             var cityListLength = cityList.length;
        //             for(var i = 0;i < cityListLength;i++){
        //                 if(item.FacilityCity == cityList[i][0].FacilityCity){
        //                     cityList[i].push(item);
        //                     break;
        //                 }
        //                 if(i == cityList.length-1){
        //                     pushItem(item,cityList);
        //                 }
        //             }
        //         }
        //     });
        //     return cityList;
        // }
        //
        // trainingService.getVenue($scope.peoplekey).then(
        //     function (data) {
        //         $scope.FailedToGetData = "";
        //         var list = data.Content;
        //         var cityList = [];
        //         if (list == null || list.length == 0) {
        //             $scope.noSessionsList = true;
        //         } else {
        //             cityList = filterCityList(list,cityList);
        //         }
        //         $scope.SessionsList = cityList;
        //         for(var k = 0;k < $scope.SessionsList.length;k++){
        //             if(k == 0){
        //                 $scope.allSessionsShow[0] = true;
        //                 $scope.allSessionsIcon[0] = 'ion-chevron-up';
        //             } else {
        //                 $scope.allSessionsShow[k] = false;
        //                 $scope.allSessionsIcon[k] = 'ion-chevron-down';
        //             }
        //         }
        //         $scope.FacilityCityList = getFacilityCityList($scope.SessionsList);
        //         $scope.currentPresentedList = $scope.SessionsList[0];
        //         $scope.FacilityCityCurrent = $scope.FacilityCityList[0];
        //         // $scope.finishGetVenueList = true;
        //     },
        //
        //     function (data,status) {
        //         $scope.SessionsList = [];
        //         var msg = 'There was an error getting ongoing-events list. ' + status;
        //         console.log(msg);
        //         $scope.FailedToGetData = "Error";
        //         // $scope.finishGetVenueList = true;
        //         $rootScope.showSplash = false;
        //     }
        // );
        //
        // $scope.selectionIndex = 0;
        // $scope.currentPresentedList = [];
        // $scope.showDropdownSelections = false;
        // $scope.toggleDropDownList = function () {
        //     if($scope.FacilityCityList.length != 1){
        //         $scope.showDropdownSelections = (!$scope.showDropdownSelections);
        //     }
        // };
        //
        // $scope.chooseFacilityCity = function (index) {
        //     $scope.showDropdownSelections = (!$scope.showDropdownSelections);
        //     $scope.selectionIndex = index;
        //     $scope.currentPresentedList = $scope.SessionsList[index];
        //     $scope.FacilityCityCurrent = $scope.FacilityCityList[index];
        //     $ionicScrollDelegate.resize();
        // };





}]);
