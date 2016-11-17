'use strict';

controllers.controller('materialsCtrl',
    ['$scope', '$rootScope', 'trainingService', '$timeout', '$ionicHistory', '$ionicLoading', '$stateParams', 'connectedLearning.methods' , '$filter',
        function ($scope, $rootScope, trainingService, $timeout, $ionicHistory, $ionicLoading, $stateParams, methods ,  $filter) {
            //Inner Function
            $scope.getMaterial = function (activityID) {
                $ionicLoading.show();

                trainingService.getMaterialDetails(activityID).then(function (data) {
                        $ionicLoading.hide();
                        $scope.meterials = [];
                        if (data != null) {
                            $scope.allMeterials = trainingService.parseMetreialFromHTML(data);
                            $scope.meterials = $scope.allMeterials; // update for UI-Refine, disable admin flag icon
                            // if ($rootScope.adminFlage == true || $scope.pickRule == true) {
                            //     $scope.meterials = $scope.allMeterials;
                            // } else {
                            //     angular.forEach($scope.allMeterials, function (subItem) {
                            //         if (subItem.role == 0) {
                            //             $scope.meterials.push(subItem)
                            //         }
                            //     });
                            // }
                        }
                        if (typeof $scope.meterials === 'undefined' || !$scope.meterials.length || !$scope.meterials[0]) {
                            $scope.noMeterialDataShow = true;
                        } else {
                            $scope.noMeterialDataShow = false;
                            //$scope.noMeterialPlaceHolder = false;
                        }
                    },
                    function (data, status) {
                        console.log('failed to get materials from server, activityID is ', activityID, 'returnstatus :', status);
                        $ionicLoading.hide();
                    }
                )
            };
            $scope.closeMaterials = function () {
                $scope.navigateToState('app.trainingDetailTabs.eventDetailsTab');
            };
            $scope.materialDownload = function (downloadURL) {
                console.log(downloadURL);
                window.open(downloadURL, '_system', 'location=yes');
            };

            //Init
            var activityID = $stateParams.activityID;
            //activityID = '1058746'; // for temple test of materials api service
            if (!methods.isEmptyOrNull(activityID)){
                $scope.getMaterial(activityID)
            }

        }]);
