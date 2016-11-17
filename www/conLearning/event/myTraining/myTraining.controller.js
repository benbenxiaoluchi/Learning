'use strict';
controllers.controller('myTrainingController',
    ['$scope', '$rootScope', 'trainingService', 'authService', '$ionicLoading', 'itemPathService', 'connectedLearning.messages','connectedLearning.constants', 'environmentData',
function ($scope, $rootScope, trainingService, authService, $ionicLoading, itemPathService, messagesService, constants, environmentData) {
    $scope.CurrentTrainingList = [];
    $scope.UpcomingTrainingList = [];
    $scope.PastTrainingList = [];

    $scope.$on('changedTab', function (event,data) {
        //maybe do something
        console.log("-- Tab has been changed --");
    });
    $scope.getTrainingList = function () {
        authService.callService({ serviceName: environmentData.services.myLearningService.serviceName, action: trainingService.getTrainingModel, params: { } }).then(function (data) {
            if (typeof data !== 'undefined' && !angular.equals({}, data) && typeof data.length !== 'undefined') {
                if (data.length == 0) {
                    $scope.CurrentTrainingList = [];
                    $scope.UpcomingTrainingList = [];
                    $scope.PastTrainingList = [];
                }else {
                    angular.forEach(data, function (item) {
                        if (item.category == 'C') {
                            if (item.facilityID) {
                                $scope.CurrentTrainingList.push(itemPathService.myTrainingCardDurationFilter(item));
                            } else {
                                $scope.CurrentTrainingList.push(itemPathService.myTrainingFilter(item));
                            }
                        }
                        else if (item.category == 'F') {
                            if (item.facilityID) {
                                $scope.UpcomingTrainingList.push(itemPathService.myTrainingCardDurationFilter(item));
                            } else {
                                $scope.UpcomingTrainingList.push(itemPathService.myTrainingFilter(item));
                            }
                        }
                        else if (item.category == 'P') {
                            if (item.facilityID) {
                                $scope.PastTrainingList.push(itemPathService.myTrainingCardDurationFilter(item));
                            } else {
                                $scope.PastTrainingList.push(itemPathService.myTrainingFilter(item));
                            }
                        }

                        if (item.PATH != 'RLC - St. Charles Q Center' && item.PATH != 'RLC - Kuala Lumpur Sheraton Imperial' && item.PATH != 'RLC - Madrid NH Collection Eurobuilding' && item.PATH != 'RLC - Bengaluru Marriott Hotel' && item.PATH != 'RLC - London Wokefield Park') {
                            item.imgName = 'DefaultVenue';
                        } else {
                            item.imgName = item.PATH;
                        }
                    });
                }

                $scope.$emit('changedTab', {'':''});
                messagesService.broadcast(constants.broadcast.finishLoadingAdminTraining);
            }
        }, function (error) {
            // Error loading expenses message
            var msg = 'There was an error loading my trainings. Please, try again later. Error Message: ';
            console.log(msg + error);
            messagesService.broadcast(constants.broadcast.finishLoadingAdminTraining);
        });
    };
    $scope.showTip = function () {
        if ($scope.CurrentTrainingList.length == 0) {
            $scope.NoCurr = 'You have no currently assigned training.';
        }
        else{
            $scope.NoCurr = "";
        }
        if ($scope.UpcomingTrainingList.length == 0) {
            $scope.NoUpcoming = 'You have no upcoming training.';
        }
        else{
            $scope.NoUpcoming = "";
        }
        if ($scope.PastTrainingList.length == 0) {
            $scope.NoPast = 'You have no past training.';
        }else{
            $scope.NoPast = "";
        }
    };

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    $scope.$on('$ionicView.enter', function () {
        $scope.CurrentTrainingList = [];
        $scope.UpcomingTrainingList = [];
        $scope.PastTrainingList = [];
        $scope.NoCurr = "";
        $scope.NoUpcoming = "";
        $scope.NoPast = "";

        $ionicLoading.show();
        $scope.getTrainingList();
    });

    $scope.scheduleTabCss = ['schedule-tab-selected','',''];
    $scope.tabContentSelected = [true,false,false];
    $scope.chooseScheduleTab = function (index) {
        $scope.scheduleTabCss = ['','',''];
        $scope.tabContentSelected = [false,false,false];
        $scope.scheduleTabCss[index] = 'schedule-tab-selected';
        $scope.tabContentSelected[index] = true;
    };

    $scope.navigateFeedback = function (list, $event) {
        //$scope.navigateToState('app.eventFeedback', {item:list},false);
        $ionicLoading.show();
        trainingService.getSurveyForSession(list.activityID).then(
            function (data) {
                if(data){
                    var url = data.replace(/["]/g, "");
                    if(typeof cordova == 'undefined'){
                        window.open(url, '_system', 'location=yes');
                        $ionicLoading.hide();
                    }
                    else{
                        $scope.openSurvey(url);
                    }
                }
                else{
                    //pop up no survey found.
                    var msg = 'No Survey Found!';
                    console.log(msg);
                    $ionicLoading.hide();
                }
            },

            function (data, status) {
                // Error loading expenses message
                var msg = 'There was an error loading Survey. Please, try again later';
                console.log(msg);
                $ionicLoading.hide();
            }
        );
        $event.stopPropagation();

        //var ref  = cordova.InAppBrowser.open('https://mylbuild.accenture.com/ces/router.aspx?courseCode=A87465&sessionCode=AA77&evaluatorRole=student&courseType=classroom&surveyType=EOC', '_blank', 'location=yes');
    };

    $scope.openSurvey = function(url){
        var target = "_blank";
        var options = "location=yes,hidden=yes";
        $scope.inAppBrowserRef = cordova.InAppBrowser.open(url, target, options);
        $scope.inAppBrowserRef.addEventListener('loadstart', loadStartCallBack);
        $scope.inAppBrowserRef.addEventListener('loadstop', loadStopCallBack);
        $scope.inAppBrowserRef.addEventListener('loaderror', loadErrorCallBack);
        $scope.inAppBrowserRef.addEventListener('exit', exitCallBack);
    }

    function loadStartCallBack() {

        //$ionicLoading.show();
        console.log("Start load survey page");
    }

    function loadStopCallBack() {

        if ($scope.inAppBrowserRef != undefined) {

            $scope.inAppBrowserRef.insertCSS({ code: "body{font-size: 20px;" });

            $ionicLoading.hide();

            $scope.inAppBrowserRef.show();
        }

    }

    function loadErrorCallBack(params) {
        $ionicLoading.hide();

        var scriptErrorMesssage =
            "alert('Sorry we cannot open that page. Message from the server is : "
            + params.message + "');"

        console.log(scriptErrorMesssage);

        $scope.inAppBrowserRef.close();

        $scope.inAppBrowserRef = undefined;

    }

    function exitCallBack(){
        $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.$on(constants.broadcast.finishLoadingAdminTraining, function () {
        $scope.showTip();
        $ionicLoading.hide();
    });
}]);// End controller

controllers.filter("hasClassroom", function() {
    return function(input, has) {
        var hasArr = [];
        var notArr = [];
        angular.forEach(input, function(item){
            if(item.facilityID){
                hasArr.push(item);
            }else {
                notArr.push(item);
            }
        });
        if(has){
            return hasArr;
        }else {
            return notArr;
        }
    }
});