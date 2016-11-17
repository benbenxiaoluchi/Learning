/*global controllers, ionic, angular, window*/

controllers.controller('feedbackController', ['$timeout', '$scope', '$rootScope', '$ionicLoading', '$cordovaToast', '$window', 'connectedLearning.constants', 'authService', 'environmentData', 'profileService',
    function ($timeout, $scope, $rootScope, $ionicLoading, $cordovaToast, $window, constants, authService, environmentData, profileService) {
        /// <summary>
        /// Controller that manages functionality related to feedback
        /// </summary>
        /// <param name="$scope">
        /// scope is an object that refers to the application model. It is an execution context for expressions.
        /// Scopes are arranged in hierarchical structure which mimic the DOM structure of the application.
        /// Scopes can watch expressions and propagate events.
        /// </param>
        /// <param name="$rootScope">Same kind as before but this it's common for all controllers.</param>
        /// <doc>connectedLearning.controllers:feedbackController</doc>

        'use strict';

        //#region Properties
        
        $scope.feedback = {
            text : ""
        };

        //#endregion
        
        //#region Actions

        $scope.sendFeedback = function () {
            /// <summary>
            /// send a feedback about the application
            /// </summary>
            /// <doc>connectedLearning.controllers:skillsController#sendFeedback</doc>

            // Start loading data
            $ionicLoading.show();

            var params = {
                peopleKey: profileService.getPeopleKey(),
                enterpriseId: profileService.getEnterpriseId(),
                body: $scope.feedback.text
            };

            // get the user skills
            authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: profileService.sendFeedback, params: params }).then(function (data) {

                // End loading data
                $ionicLoading.hide();

                // show toastr message
                if (window.cordova) {
                    $cordovaToast.show("Mail sent successfully.", 'long', 'center');
                }
                // navigate to home on success
                $scope.navigateToState('app.home', null, true);

                // clean the comments text
                $scope.feedback.text = "";

            }, function (error) {
                console.log(error);
                // End loading data
                $ionicLoading.hide();
            });
        };

        $scope.disableButton = function () {

            if ($scope.feedback.text === "") {
                return true;
            }
            else {
                return false;
            }
        };

        //#endregion

    }]);