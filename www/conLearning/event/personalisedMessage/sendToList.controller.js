/**
 * Created by booker on 2016/10/20.
 */
'use strict';

controllers.controller('sendToListController',
    ['$scope', '$rootScope', '$ionicLoading', '$ionicHistory', '$stateParams', 'connectedLearning.methods', 'personalisedMessageData',
        function ($scope, $rootScope, $ionicLoading,$ionicHistory, $stateParams, methods, personalisedMessageData)
        {
        // some function for view
            $scope.closeAllParticipantsList = function(){
                // navigateToNewMessage and param sendToIsEmpty set to false
                var pickedList = $scope.allParticipantsList.filter(function (item) {
                    return item.isPicked == true;
                });
                //personalisedMessageData.allParticipantsList = $scope.allParticipantsList;
                $scope.navigateToState('app.newPersonalisedMessage',{sendToEIDList: pickedList},false);

            };
            // search  method
            $scope.filterParticipantsPicker = function(text){
                if (methods.isEmptyOrNull(text)) {
                    angular.forEach($scope.allParticipantsList, function(p){
                        p.isMatched = true;
                    });
                    return
                }
                angular.forEach($scope.allParticipantsList, function(p){
                    p.isMatched = false;
                });
                if ($scope.people.toSearch == text && text.length > 2) { // forbidden some ", " meaningless scenario
                    text = text.toLowerCase();
                    var splitted = text.split(' ');
                    for (var i = 0; i < $scope.allParticipantsList.length; i++) {
                        var toBeAdded = false;
                        if (splitted.length == 1) { // search eid or fullname
                            toBeAdded = ($scope.allParticipantsList[i].EnterpriseID.toLowerCase().indexOf(text) >= 0)
                                    || ($scope.allParticipantsList[i].fullName.toLowerCase().indexOf(text) >= 0);
                        }
                        else {   //check each part of eid or fullname, work like fuzzy query, can be removed for enhancement
                            var matchEnterpriseID = true,
                                matchFullName = true;
                            for (var j = 0; j < splitted.length; j++) {
                                matchEnterpriseID = matchEnterpriseID && ($scope.allParticipantsList[i].EnterpriseID.toLowerCase().indexOf(splitted[j]) >= 0);
                                matchFullName = matchFullName && ($scope.allParticipantsList[i].fullName.toLowerCase().indexOf(splitted[j]) >= 0);
                            }
                            toBeAdded = matchEnterpriseID || matchFullName;
                        }
                        if (toBeAdded) {
                            $scope.allParticipantsList[i].isMatched = true;
                        }
                    }
                }

            };
            //pick the learner into sendList
            $scope.pickParticipant = function (index) {
                $scope.allParticipantsList[index].isPicked = !$scope.allParticipantsList[index].isPicked;
            };
            // some inner function

            $scope.initList = function(){
                $scope.people = {
                    toSearch:''
                };
                $scope.allParticipantsList =personalisedMessageData.allParticipantsList;
                $scope.groupID = $stateParams.groupID;
            };
            //Init

            $scope.$on('$ionicView.beforeEnter', function () {
                    $scope.initList();
                    if ($stateParams.specificCache == 'clr') {
                        $scope.people = {
                            toSearch: ''
                        };
                        $scope.filterParticipantsPicker('');
                    }
            });

        }]);