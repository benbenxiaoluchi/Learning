'use strict';

controllers.controller('loginController',
    ['$scope', '$rootScope', '$http' ,'environmentData', 'trainingService', '$log', '$state', '$ionicModal', '$ionicLoading', 'authService', '$cordovaToast', '$cordovaClipboard', '$ionicPopup', 'localStorageService', '$cordovaCalendar', 'streamService', '$ionicScrollDelegate', '$cordovaDevice', 'connectedLearning.constants.environments', 'environmentData', 'connectedLearning.constants.environments', 'aclAuthService', 'personalisedMessageService', '$filter','impersonateService',
function ($scope, $rootScope, $http, services, trainingService, $log, $state,$ionicModal, $ionicLoading, authService, $cordovaToast, $cordovaClipboard, $ionicPopup, localStorageService, $cordovaCalendar, streamService, $ionicScrollDelegate, device, envs, environmentData, environments, aclAuthService, personalisedMessageService, filter, impersonateService) {

   $scope.data = {
       grant_type:'password',
       scope:'https://mylbuild-pews.accenture.com/mylapi/',

       username:'adtestid842',
       password:'qW3d57oH4u1Yk09wC6cU'

   };
    $scope.login = function () {
        $ionicLoading.show();

            var url = 'https://federation-sts-stage.accenture.com/services/jwt/issue/adfs';


        // $http({
        //     url:url,
        //     method: 'POST',
        //     data: $scope.data
        // }).success(function(data){
        //
        //     console.log("success!");
        // }).error(function(error){
        //     console.log("error");
        // })
        //

       $http.post(url, $scope.data)
           .success(function (data) {
               localStorageService.remove('esoToken');
               localStorageService.add('esoToken', data.access_token);

               console.log("getToken from ESO: "+ data.access_token);
               impersonateService.getACLWhitelistUser($scope.data.username).then(function (data) {
                   $rootScope.showSplash = false;
                   if (data.isAdmin == 1)
                       $rootScope.adminFlage = true;
                   else
                       $rootScope.adminFlage = false;
               });
               $rootScope.fistLoad = false;

               $state.go("app.trainingDetailTabs.activityTab");
               })
           .error(function (data, status, headers, config) {
                   alert('login faild');
               });


        $ionicLoading.hide();
    };

    $scope.initNotification = function () {
        return;
        

    };


}]);