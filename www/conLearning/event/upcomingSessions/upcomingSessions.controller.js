/**
 * Created by huaifei.zhang on 2016/9/19.
 */
'use strict';

controllers.controller('upcomingSessionsController',
    ['$scope', '$rootScope', '$filter', '$ionicLoading','trainingService','itemPathService',
        function ($scope, $rootScope, filter, $ionicLoading,trainingService,itemPathService)
        {
            // console.log("-- upcomingSessionsController --");

            $scope.upcomingSessionsList = [];
            $scope.upcomingCount = 0;
            $scope.showUpcomingSessionContent = false;
            $scope.toggleUpcomingSessionIcon = 'ion-chevron-down';
            $ionicLoading.show({
                templateUrl: 'popup.html', noBackdrop: true, hideOnStateChange: true
            });

            trainingService.getUpcomingSessions().then(
                function (data) {

                    var temp;
                    if(data.length == 0)
                    {
                        $ionicLoading.hide();
                        $scope.upcomingSessionsList = [];
                        $scope.upcomingCount = 0;
                        return;
                    }
                    angular.forEach(data, function (item) {
                        temp = itemPathService.itemPath(item);
                        $scope.upcomingSessionsList.push(temp);
                    });
                    $ionicLoading.hide();
                    $scope.upcomingCount = $scope.upcomingSessionsList.length;
                    temp = null;
                },

                function (data, status) {
                    $ionicLoading.hide();
                    // Error loading expenses message
                    var msg = 'There was an error loading trainings. Please, try again later';
                    console.log(msg);
                    $rootScope.showSplash = false;
                }
            );

            $scope.toggleUpcomingSession = function () {
                if ($scope.showUpcomingSessionContent) {
                    $scope.toggleUpcomingSessionIcon = 'ion-chevron-down';
                } else {
                    $scope.toggleUpcomingSessionIcon = 'ion-chevron-up toggle-icon-width';
                }
                $scope.showUpcomingSessionContent = !$scope.showUpcomingSessionContent;
            }

        }]);
