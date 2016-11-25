'use strict';

controllers.controller('materialsCtrl',
    ['$scope', '$rootScope', 'trainingService', '$timeout', '$ionicHistory', '$ionicLoading', '$stateParams', 'connectedLearning.methods' , '$filter',
        function ($scope, $rootScope, trainingService, $timeout, $ionicHistory, $ionicLoading, $stateParams, methods ,  $filter) {
            //Inner Function
            function parseTypeToIconStyle (type){
                // var fileTypes = ['PDF', 'DOCX', 'DOC','XLSX','XLS','PPT','PPTX','JPG','BMP','JPEG','GIF','PNG'];
                var typeclass = '';
                switch (type){
                    case 'PDF':
                        typeclass =  'learn-Icon-FilePDF';
                        break;
                    case 'DOC':
                    case 'DOCX':
                    case 'TXT':
                    case 'RTF':
                        typeclass = 'learn-Icon-FileDOC';
                        break;
                    case 'XLS':
                    case 'XLSX':
                        typeclass = 'learn-Icon-FileXLS';
                        break;
                    case 'PPT':
                    case 'PPTX':
                        typeclass = 'learn-Icon-FilePPT';
                        break;
                    case 'JPG':
                    case 'BMP':
                    case 'JPEG':
                    case 'PNG':
                    case 'GIF':
                        typeclass = 'learn-Icon-FileImage';
                        break;
                    case 'MP3':
                    case 'WAV':
                    case 'WMA':
                    case 'AVI':
                    case 'MP4':
                    case 'WMV':
                    case 'MKV':
                    case 'FLV':
                        typeclass = 'learn-Icon-FileMedia';
                        break;
                    default:
                        typeclass = 'learn-Icon-FileDefault';
                }
                return typeclass;
            }
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
                            angular.forEach($scope.meterials, function(m){
                                m.fileTypeIcon = parseTypeToIconStyle(m.type);
                            })
                        }
                        if (typeof $scope.meterials === 'undefined' || !$scope.meterials.length || !$scope.meterials[0]) {
                            $scope.noMeterialDataShow = true;
                        } else {
                            $scope.noMeterialDataShow = false;
                            //$scope.noMeterialPlaceHolder = false;
                        }
                    },
                    function (data) {
                        $scope.noMeterialDataShow = true;
                        console.log('when getMaterils api issue this will trigger');
                        console.log('failed to get materials from server, activityID is ', activityID, 'returnstatus :', data.status);
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
