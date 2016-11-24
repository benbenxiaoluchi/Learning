/**
 * Created by booker on 2016/10/20.
 */
'use strict';

controllers.controller('newPersonalisedMessageController',
    ['$scope', '$rootScope', '$filter', '$timeout', '$ionicPopup', '$ionicLoading', '$stateParams', 'personalisedMessageData', 'connectedLearning.methods', 'personalisedMessageService', 'ionicTimePicker', 'ionicDatePicker', '$filter',"$ionicScrollDelegate", '$ionicActionSheet',
        function ($scope, $rootScope, filter, $timeout, $ionicPopup, $ionicLoading, $stateParams, personalisedMessageData, methods, personalisedMessageService, ionicTimePicker, ionicDatePicker, $filter, $ionicScrollDelegate, $ionicActionSheet) {

            $scope.scheduleStyle = 'inActive-btn';
            $scope.nowStyle = '';
            $scope.showSchedulePlugin = false;

            // some functions
            $scope.openTimePlugin = function () {
                var ipObj1 = {
                    callback: function (val) {      //Mandatory
                        if (typeof (val) === 'undefined') {
                            console.log('Time not selected');
                        } else {
                            var selectedTime = new Date(val * 1000); // val is a local time value, after new date, change time zone two times.
                            $scope.scheduleTime = $filter('date')(new Date(selectedTime), 'hh:mm a', 'UTC');        //local time
                            $scope.scheduleTimeForSend = $filter('date')(new Date(selectedTime), 'HH:mm:ss', 'UTC');//local time
                            console.log('time for display', $scope.scheduleTime);
                            console.log('time for send', $scope.scheduleTimeForSend);
                            // $scope.scheduleTime = selectedTime.getUTCHours() + ':' + selectedTime.getUTCMinutes() + ':' + selectedTime.getUTCSeconds();
                        }
                    },
                    inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60))
                };
                ionicTimePicker.openTimePicker(ipObj1);
            };

            $scope.openDatePlugin = function () {
                var ipObjScheduleDate = {
                    callback: function (val, event) {
                        $scope.scheduleDate = $filter('date')(new Date(val), 'MMM dd yyyy');
                        $scope.scheduleDateForSend = $filter('date')(new Date(val), 'MM-dd-yyyy');
                    },
                    from: new Date()
                };
                ionicDatePicker.openDatePicker(ipObjScheduleDate);
            };
            $scope.showScheduleDate = function (type) {
                if (type == 1) {
                    $scope.scheduleDateFlag = true;
                } else {
                    $scope.scheduleDateFlag = false;
                    $scope.scheduleDate = '';
                    $scope.scheduleTime = '';
                }
            };
            $scope.closeNewMessage = function () {
                $scope.exitCacheData();
                $scope.navigateToState('app.attendance');
                // $scope.$broadcast('backToCheckInOutModal');
            };
            $scope.navigateToSendToList = function () {
                personalisedMessageData.messageBody = $scope.message.body;
                $scope.navigateToState('app.sendToList', {specificCache: 'clr', groupID: $scope.groupID}, false);
            };

            $scope.clickSchedule = function () {
                $scope.scheduleStyle = '';
                $scope.nowStyle = 'inActive-btn';
                $scope.showSchedulePlugin = true;
                $ionicScrollDelegate.scrollBottom();
            };

            $scope.clickNow = function () {
                $scope.scheduleStyle = 'inActive-btn';
                $scope.showSchedulePlugin = false;
                $scope.clearSchedulePluginValue();
                if ($scope.nowStyle == '') {
                    $scope.clickToSendMessage('now');
                }
                $scope.nowStyle = '';
            };

            $scope.clearSchedulePluginValue = function () {
                $scope.scheduleDate = '';
                $scope.scheduleDateForSend = '';
                $scope.scheduleTime = '';
                $scope.scheduleTimeForSend = '';
            };

            $scope.clickToSendMessage = function (type) {
                $ionicLoading.show();
                //senderID, activityID, authorIDType, messageBody, recipientsList, listType, messageSendDate, messageExpiryDays
                console.log($scope.pickRule); //get from baseController
                var senderID = $rootScope.ImpersonateStatus == true ? $rootScope.impersonationEID : $rootScope.loginUserID,
                    activityID = $scope.activityID,
                    authorIDType = $scope.pickRule ? 2 : 4, //2 or 4, faculty or admin
                    messageBody = $scope.message.body,
                    recipientsList = personalisedMessageData.allParticipantsList.map(function (obj) {
                        if (obj.isGrouped || obj.isPicked)
                            return obj.EnterpriseID;
                    }).filter(Boolean).join(","),
                    listType = '2', //only include method to use
                    //get local time and date
                    messageSendDateStr = type == 'now'? $filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss') : $scope.scheduleDateForSend + ' ' + $scope.scheduleTimeForSend,
                    messageExpiryDays = 30; // default is 30 days
                if (authorIDType == 2) recipientsList += ',' + senderID; // if faculty, message send to him


                if(type == 'schedule'){
                    var nowDateTimes = $filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss');
                    if (messageSendDateStr < nowDateTimes) {
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Schedule date incorrect',
                            template: 'Please select a timing later than current!'
                        });
                        return
                    }
                    if (methods.isEmptyOrNull($scope.scheduleDateForSend) || methods.isEmptyOrNull($scope.scheduleTimeForSend)) {
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Some Fields are empty',
                            template: 'Please fill necessary fields before sending your message'
                        });
                        return
                    }
                }


                if (methods.isEmptyOrNull(recipientsList) || methods.isEmptyOrNull(activityID) || methods.isEmptyOrNull(messageBody)) {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Some Fields are empty',
                        template: 'Please fill necessary fields before sending your message'
                    });
                    return
                }
                console.log(personalisedMessageData.allParticipantsList);
                
                messageSendDateStr = messageSendDateStr.replace("-", "/").replace("-", "/"); //add for Bug 508749
                var messageSendDate = $filter('date')(new Date(Date.parse(messageSendDateStr)),'MM-dd-yyyy HH:mm:ss','UTC');
                console.log('make sure the date', messageSendDate);
                console.log('ready to send: ', senderID, activityID, authorIDType, messageBody, recipientsList, listType, messageSendDate, messageExpiryDays);
                personalisedMessageService.postPersonalisedMessage(senderID, activityID, authorIDType, messageBody, recipientsList, listType, messageSendDate, messageExpiryDays)
                    .then(function (data) {
                        if (data.ReturnCode == 0 || data.ReturnMessage == "Success") {
                            $scope.exitCacheData();
                            $ionicLoading.hide();
                            var messageSendOK = $ionicPopup.show({

                                cssClass: 'schedule-popup',
                                templateUrl: 'conLearning/event/personalisedMessage/sendMessageOkPopup.html',
                                scope: $scope
                            });
                            messageSendOK.then(function (res) {
                                console.log('Tapped!', res);
                            });
                            $timeout(function () {
                                messageSendOK.close();
                                $scope.closeNewMessage();
                            }, 2000);

                        }else{
                            //todo popup an error handle
                            $ionicLoading.hide();
                            console.log('api return error: ', data.ReturnCode+ '--' +data.ReturnMessage)
                        }
                    }, function (data) {
                        $ionicLoading.hide();
                        console.log("PostPersonalisedMessage Error" + data.ReturnCode + " -- " + data.ReturnMessage);
                    });
            };
            $scope.selectGroupList = function (groupID) {
                var exist;
                switch (groupID) {
                    case 'A':
                        exist = $scope.sendToText.sendToTextLineGroup.indexOf('All Participants;') > -1;
                        $scope.sendToText.sendToTextLineGroup = $scope.sendToText.sendToTextLineGroup.replace(/(All Participants;|In the Room;|Out of the Room;)/g, '');
                        angular.forEach(personalisedMessageData.allParticipantsList, function (item) {
                            item.isGrouped = false;
                        });
                        if (!exist) {
                            $scope.sendToText.sendToTextLineGroup = 'All Participants;';
                            $scope.groupID = groupID;
                            angular.forEach(personalisedMessageData.allParticipantsList, function (item) {
                                item.isGrouped = true;
                            });
                        } else {
                            $scope.groupID = null;
                        }
                        break;
                    case 'I':
                        exist = $scope.sendToText.sendToTextLineGroup.indexOf('In the Room;') > -1;
                        $scope.sendToText.sendToTextLineGroup = $scope.sendToText.sendToTextLineGroup.replace(/(All Participants;|In the Room;|Out of the Room;)/g, '');
                        angular.forEach(personalisedMessageData.allParticipantsList, function (item) {
                            item.isGrouped = false;
                        });
                        if (!exist) {
                            $scope.sendToText.sendToTextLineGroup = 'In the Room;';
                            $scope.groupID = groupID;
                            angular.forEach(personalisedMessageData.checkInList, function (item) {
                                var idx = personalisedMessageData.allParticipantsList.indexOf(item);
                                personalisedMessageData.allParticipantsList[idx].isGrouped = true;
                            });
                        } else {
                            $scope.groupID = null;
                        }
                        break;
                    case 'O':
                        exist = $scope.sendToText.sendToTextLineGroup.indexOf('Out of the Room;') > -1;
                        $scope.sendToText.sendToTextLineGroup = $scope.sendToText.sendToTextLineGroup.replace(/(All Participants;|In the Room;|Out of the Room;)/g, '');
                        angular.forEach(personalisedMessageData.allParticipantsList, function (item) {
                            item.isGrouped = false;
                        });
                        if (!exist) {
                            $scope.sendToText.sendToTextLineGroup = 'Out of the Room;';
                            $scope.groupID = groupID;
                            angular.forEach(personalisedMessageData.checkOutList, function (item) {
                                var idx = personalisedMessageData.allParticipantsList.indexOf(item);
                                personalisedMessageData.allParticipantsList[idx].isGrouped = !personalisedMessageData.allParticipantsList[idx].isGrouped;
                            });
                        } else {
                            $scope.groupID = null;
                        }
                        break;
                }
                personalisedMessageData.sendToGroupSelected = $scope.sendToText.sendToTextLineGroup;
                personalisedMessageData.groupID = $scope.groupID;
            };
            $scope.exitCacheData = function () {
                $scope.sendToText.sendToTextLineGroup = '';
                $scope.sendToText.sendToTextLine = '';
                $scope.message.body = '';
                personalisedMessageData.groupID = null;
                personalisedMessageData.allParticipantsList = null;
                personalisedMessageData.activityID = null;
                personalisedMessageData.checkInList = null;
                personalisedMessageData.checkOutList = null;
                personalisedMessageData.sendToGroupSelected = null;
                personalisedMessageData.messageBody = '';
                personalisedMessageData.flag = '';
                personalisedMessageData.backViewFlag = true;
            };
            $scope.resetParticularData = function () {
            };
            //Inner Function
            function parseShortToTextLine() {
                // padding-left + padding-right = 70px
                // +Count will have about 20px space
                // font size is 14px, one letter almost 7px in eyes
                var pos,
                    counter,
                    positions = [],
                    stringText = $scope.sendToText.sendToTextLineGroup + $scope.sendToText.sendToTextLine;
                var textLineLength = document.getElementById('ToListSizeID').clientWidth - 70 - 21;
                console.log(textLineLength);
                if (stringText.length * 7 > textLineLength) {
                    pos = stringText.indexOf(';');
                    while (pos > -1) {
                        positions.push(pos);
                        pos = stringText.indexOf(';', pos + 1);
                    }
                    for (var i = 0; i < positions.length - 1; i++) {
                        if (positions[i] * 7 <= textLineLength && positions[i + 1] * 7 > textLineLength) {
                            counter = i;
                            //length -(counter+1)
                            stringText = stringText.slice(0, positions[i]) + '; +' + (positions.length - counter - 1);
                            console.log('results:', stringText);
                            break;
                        }
                    }
                }
                return stringText;
            }

            $scope.$watchGroup(['sendToText.sendToTextLineGroup', 'sendToText.sendToTextLine'], function (newValue, oldValue, scope) {
                console.log('change');
                if (angular.isUndefined($scope.sendToText.sendToTextLine)) {
                    $scope.sendToText.sendToTextLine = '';
                }
                if (angular.isUndefined($scope.sendToText.sendToTextLineGroup)) {
                    $scope.sendToText.sendToTextLineGroup = '';
                }
                $scope.sentTextLineParse = parseShortToTextLine();

            }, true);
            //Init
            console.log('message body', personalisedMessageData.messageBody);
            $scope.message = {body: personalisedMessageData.messageBody};
            $scope.sendToText = {sendToTextLine: '', sendToTextLineGroup: ''};
            $scope.groupID = personalisedMessageData.groupID;
            $scope.activityID = personalisedMessageData.activityID;
            $scope.checkInCount = personalisedMessageData.checkInList.length;
            $scope.checkOutCount = personalisedMessageData.checkOutList.length;
            $scope.flag = personalisedMessageData.flag;
            console.log($scope.flag);
            $scope.sendToEIDList = ($stateParams.sendToEIDList == null || $stateParams.sendToEIDList[0] == null) ? [] : $stateParams.sendToEIDList;
            $scope.sendToText.sendToTextLineGroup = personalisedMessageData.sendToGroupSelected == null ? '' : personalisedMessageData.sendToGroupSelected;
            console.log('testIn', personalisedMessageData.checkInCount, 'testOut', personalisedMessageData.checkOutCount);
            console.log('In:', $scope.checkInCount, 'Out:', $scope.checkOutCount, 'TO:', $scope.sendToEIDList);
            if ($scope.sendToEIDList.length == 0) {
                $scope.sendToText.sendToTextLine = '';
            } else {
                if ($scope.sendToEIDList.length == 1) {
                    personalisedMessageData.allParticipantsList.find(function (item) {
                        return item == $scope.sendToEIDList[0];
                    }).isPicked = true;
                }
                $scope.sendToText.sendToTextLine = $scope.sendToEIDList.map(function (obj) {
                        return obj.fullName;
                    }).join(";") + ';'
            }
            $scope.sentTextLineParse = parseShortToTextLine();

            $scope.sendOption = "Message Now";
            $scope.showSendOption = function() {
                $ionicActionSheet.show({
                    buttons: [
                        { text: 'Message Now' },
                        { text: 'Schedule for Later' }
                    ],
                    cancelText: 'Cancel',
                    cancel: function() {
                        console.log('CANCELLED');
                    },
                    buttonClicked: function(index) {
                        console.log('BUTTON CLICKED', index);
                        if (index === 0){
                            $scope.sendOption = "Message Now";
                            //$scope.clickSchedule();
                            $scope.showSchedulePlugin = false;
                        } else if (index === 1){
                            $scope.sendOption = "Schedule for Later";
                            //$scope.clickNow();
                            $scope.showSchedulePlugin = true;
                        }
                        return true;
                    }
                });
            };

        }]);