/*global controllers, ionic, angular, window*/

controllers.controller('planController', ['$timeout', '$scope', '$ionicHistory', '$ionicModal', '$rootScope', 'profileService', '$ionicLoading', '$cordovaToast', '$window', 'connectedLearning.constants', 'authService', 'environmentData', 'dateFilter', 'connectedLearning.methods', '$ionicActionSheet', '$ionicScrollDelegate', 'connectedLearning.messages','crittercismService',
    function ($timeout, $scope, $ionicHistory, $ionicModal, $rootScope, profileService, $ionicLoading, $cordovaToast, $window, constants, authService, environmentData, dateFilter, methods, $ionicActionSheet, $ionicScrollDelegate, messagesService, crittercismService) {
        /// <summary>
        /// Controller that manages functionality related to action plan
        /// </summary>
        /// <param name="$scope">
        /// scope is an object that refers to the application model. It is an execution context for expressions.
        /// Scopes are arranged in hierarchical structure which mimic the DOM structure of the application.
        /// Scopes can watch expressions and propagate events.
        /// </param>
        /// <param name="$rootScope">Same kind as before but this it's common for all controllers.</param>
        /// <doc>connectedLearning.controllers:planController</doc>

        'use strict';

        //#region Properties

        // Profile of user
        $scope.userModel = profileService.getUserModel();

        $scope.selectedActionItem = {};
        $scope.selectedItem = {};
        $scope.selectedPositionItem = {};
        $scope.selectedAssignmentItem = {};

        $scope.minDate = dateFilter(new Date(), 'yyyy-MM-dd');

        $scope.finishLoad = false;

        //#endregion

        //#region Actions

        $scope.updateTargetDateActionPlanItem = function () {
            /// <summary>
            /// save action plan item
            /// </summary>
            /// <doc>connectedLearning.controllers:profileController#updateTargetDateActionPlanItem</doc>

            // Start loading data
            $ionicLoading.show();

            var params = {
                sourceAppName: constants.actionPlan.sourceAppName,
                id: $scope.selectedActionItem.ActionPlanId,
                targetDate: $scope.selectedActionItem.tempTargetDate === undefined ? "" : $scope.selectedActionItem.tempTargetDate
            };

            // get the user skills
            authService.callService({ serviceName: environmentData.services.actionPlanService.serviceName, action: profileService.updateTargetDateActionPlanItem, params: params }).then(function (data) {

                // update properties saved in the action plan item
                $scope.selectedActionItem.TargetDate = $scope.selectedActionItem.tempTargetDate === undefined ? "" : $scope.selectedActionItem.tempTargetDate;

                // sort the action plan items
                $scope.userModel.actionPlan.sort(methods.sortByDate);

                // move scroll to position where the action item is located after sorting list
                //$ionicScrollDelegate.$getByHandle('myScroll').scrollTo(0, $('#actionPlanItem_' + $scope.selectedActionItem.ActionPlanId).offset().top, true);

                // End loading data
                $ionicLoading.hide();

                // close target date modal
                $scope.closeModal('targetDate');

            }, function (error) {
                console.log(error);
                // End loading data
                $ionicLoading.hide();
            });
        };

        $scope.markAsCompleted = function () {
            /// <summary>
            /// mark/unmark an action plan item as completed
            /// </summary>
            /// <doc>connectedLearning.controllers:profileController#markAsCompleted</doc>

            // Start loading data
            $ionicLoading.show();

            var params = {
                sourceAppName: constants.actionPlan.sourceAppName,
                id: $scope.selectedActionItem.ActionPlanId,
                complete: $scope.selectedActionItem.StatusCodeNbr === constants.actionPlan.status.completed ? constants.actionPlan.status.notStarted : constants.actionPlan.status.completed
            };

            // get the user skills
            authService.callService({ serviceName: environmentData.services.actionPlanService.serviceName, action: profileService.updateStatusActionPlanItem, params: params }).then(function (data) {

                // update properties saved in the action plan item
                $scope.selectedActionItem.StatusCodeNbr = $scope.selectedActionItem.StatusCodeNbr === constants.actionPlan.status.completed ? constants.actionPlan.status.notStarted : constants.actionPlan.status.completed;

                $scope.selectedActionItem.CompletionDate = dateFilter(new Date(), 'yyyy-MM-dd');

                // sort the action plan items
                $scope.userModel.actionPlan.sort(methods.sortByDate);

                // End loading data
                $ionicLoading.hide();

            }, function (error) {
                console.log(error);
                // End loading data
                $ionicLoading.hide();
            });
        };

        $scope.removeItem = function () {
            /// <summary>
            /// Remove action plan item
            /// </summary>
            /// <doc>connectedLearning.controllers:profileController#removeItem</doc>

            messagesService.broadcast(constants.broadcast.removeActionItem, { id: $scope.selectedActionItem.ActionPlanId, objectId: $scope.selectedActionItem.ObjectId, type: $scope.selectedActionItem.ObjectTypeCodeNbr });
        };

        $scope.selectAction = function (item) {
            /// <summary>
            /// Make a selection of an action item
            /// </summary>
            /// <doc>connectedLearning.controllers:profileController#selectAction</doc>

            $scope.selectedActionItem = item;
            $scope.selectedActionItem.tempTargetDate = $scope.selectedActionItem.TargetDate;
        };

        $scope.openWindow = function () {

            var url = $scope.selectedActionItem.URL;

            switch ($scope.selectedActionItem.ObjectTypeCodeNbr) {
                case constants.actionPlan.type.learning:
                    crittercismService.beginTransaction('User_Activity_Click_Register_Training_Action_Plan_Page');
                    crittercismService.endTransaction('User_Activity_Click_Register_Training_Action_Plan_Page');
                    break;
                case constants.actionPlan.type.community:
                    crittercismService.beginTransaction('User_Activity_Click_Join_Community_Action_Plan_Page');
                    crittercismService.endTransaction('User_Activity_Click_Join_Community_Action_Plan_Page');
                    break;
                case constants.actionPlan.type.pymk:
                    crittercismService.beginTransaction('User_Activity_Click_Contact_People_Action_Plan_Page');
                    crittercismService.endTransaction('User_Activity_Click_Contact_People_Action_Plan_Page');
                    break;
                case constants.actionPlan.type.board:
                    crittercismService.beginTransaction('User_Activity_Click_Follow_Board_Action_Plan_Page');
                    crittercismService.endTransaction('User_Activity_Click_Follow_Board_Action_Plan_Page');
                    break;
                case constants.actionPlan.type.position:
                    crittercismService.beginTransaction('User_Activity_Click_Apply_Position_Action_Plan_Page');
                    crittercismService.endTransaction('User_Activity_Click_Apply_Position_Action_Plan_Page');
                    break;
                case constants.actionPlan.type.assignment:
                    crittercismService.beginTransaction('User_Activity_Click_Apply_Assignment_Action_Plan_Page');
                    crittercismService.endTransaction('User_Activity_Click_Apply_Assignment_Action_Plan_Page');
                    break;
            }

            window.open(url, '_system');
            return false;
        };

        $scope.showActionSheet = function () {

            var button = "";
            var buttonList = [];
            var clickAction = [];

            switch ($scope.selectedActionItem.ObjectTypeCodeNbr) {
                case constants.actionPlan.type.learning:
                    button = "Register";
                    break;
                case constants.actionPlan.type.community:
                    button = "Join";
                    break;
                case constants.actionPlan.type.pymk:
                    button = "Contact";
                    break;
                case constants.actionPlan.type.board:
                    button = "Follow";
                    break;
                case constants.actionPlan.type.position:
                case constants.actionPlan.type.assignment:
                    button = "Apply";
                    break;
            }

            if ($scope.selectedActionItem.StatusCodeNbr === constants.actionPlan.status.completed) {
                buttonList.push({ text: "Un-mark as completed" });
                clickAction.push("markAsCompleted");
            }
            else {
                // add button for register/join, etc.
                buttonList.push({ text: button });
                clickAction.push("openWindow");

                buttonList.push({ text: "Set Target Date" });
                clickAction.push("openSetTargetDate");

                buttonList.push({ text: "Mark as completed" });
                clickAction.push("markAsCompleted");
            }

            buttonList.push({ text: "Remove" });
            clickAction.push("removeItem");

            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: buttonList,
                //destructiveText: 'Delete',
                //titleText: 'Action from Action Sheet',
                cancelText: 'Cancel',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function (index) {
                    if (clickAction[index] !== "") {
                        $scope[clickAction[index]]();
                    }
                    return true;
                }
            });

            // For example's sake, hide the sheet after two seconds
            $timeout(function () {
                hideSheet();
            }, 5000);

        };

        //#endregion

        //#region Modal

        $ionicModal.fromTemplateUrl('conLearning/common/plan/target.date.modal.html', {
            scope: $scope,
            animation: "slide-in-right",
            hardwareBackButtonClose: false
        }).then(function (modal) {
            $scope.targetDate_modal = modal;
        });

        $scope.openSetTargetDate = function () {

            if ($scope.selectedActionItem.tempTargetDate === '' || $scope.selectedActionItem.tempTargetDate === undefined) {
                $scope.selectedActionItem.tempTargetDate = dateFilter(new Date(), 'yyyy-MM-dd');
            }

            // open the modal
            $scope.targetDate_modal.show();
        };

        $ionicModal.fromTemplateUrl('conLearning/home/learning.detail.html', {
            scope: $scope,
            animation: "slide-in-right",
            hardwareBackButtonClose: false
        }).then(function (modal) {
            $scope.learningDetail_modal = modal;
        });
        $ionicModal.fromTemplateUrl('conLearning/home/community.detail.html', {
            scope: $scope,
            animation: "slide-in-right",
            hardwareBackButtonClose: false
        }).then(function (modal) {
            $scope.communityDetail_modal = modal;
        });
        $ionicModal.fromTemplateUrl('conLearning/home/skills.improve.html', {
            scope: $scope,
            animation: "slide-in-right",
            hardwareBackButtonClose: false
        }).then(function (modal) {
            $scope.skillsImprove_modal = modal;
        });
        $ionicModal.fromTemplateUrl('conLearning/home/position.detail.html', {
            scope: $scope,
            animation: "slide-in-right",
            hardwareBackButtonClose: false
        }).then(function (modal) {
            $scope.position_modal = modal;
        });
        $ionicModal.fromTemplateUrl('conLearning/home/position.skills.html', {
            scope: $scope,
            animation: "slide-in-right",
            hardwareBackButtonClose: false
        }).then(function (modal) {
            $scope.positionSkills_modal = modal;
        });
        $ionicModal.fromTemplateUrl('conLearning/home/assignment.detail.html', {
            scope: $scope,
            animation: "slide-in-right",
            hardwareBackButtonClose: false
        }).then(function (modal) {
            $scope.assignment_modal = modal;
        });

        $scope.openModal = function (whichModal) {
            switch (whichModal) {
                case 'community':
                    crittercismService.beginTransaction('User_Activity_View_Community_Detail_from_Action_Plan');
                    crittercismService.endTransaction('User_Activity_View_Community_Detail_from_Action_Plan');
                    $scope.communityDetail_modal.show();
                    $scope.moveScrollTop('communityDetail');
                    break;
                case 'learning':
                    $scope.selectedItem.MatchingSkills = [];
                    messagesService.broadcast(constants.broadcast.getLearningDetail, { id: $scope.selectedActionItem.ObjectId });
                    crittercismService.beginTransaction('User_Activity_View_Learning_Detail_from_Action_Plan');
                    crittercismService.endTransaction('User_Activity_View_Learning_Detail_from_Action_Plan');
                    $scope.learningDetail_modal.show();
                    $scope.moveScrollTop('learningDetail');
                    break;
                case 'skillsImprove':
                    crittercismService.beginTransaction('User_Activity_View_Training_Skills_You_Will_Improve_from_Action_Plan');
                    crittercismService.endTransaction('User_Activity_View_Training_Skills_You_Will_Improve_from_Action_Plan');
                    $scope.skillsImprove_modal.show();
                    $scope.moveScrollTop('skillsImprove');
                    break;
                case 'position':
                    $scope.selectedPositionItem.Skills = [];
                    $scope.selectedPositionItem.Description = "";
                    messagesService.broadcast(constants.broadcast.getPositionDetail, { id: $scope.selectedActionItem.ObjectId });
                    crittercismService.beginTransaction('User_Activity_View_Position_Detail_from_Action_Plan');
                    crittercismService.endTransaction('User_Activity_View_Position_Detail_from_Action_Plan');
                    $scope.position_modal.show();
                    $scope.moveScrollTop('positionDetail');
                    break;
                case 'positionSkills':
                    crittercismService.beginTransaction('User_Activity_View_Position_Skills_from_Action_Plan');
                    crittercismService.endTransaction('User_Activity_View_Position_Skills_from_Action_Plan');
                    $scope.positionSkills_modal.show();
                    $scope.moveScrollTop('positionSkills');
                    break;
                case 'assignment':
                    $scope.selectedAssignmentItem.Description = "";
                    messagesService.broadcast(constants.broadcast.getAssignmentDetail, { id: $scope.selectedActionItem.ObjectId });
                    crittercismService.beginTransaction('User_Activity_View_Assignment_Detail_from_Action_Plan');
                    crittercismService.endTransaction('User_Activity_View_Assignment_Detail_from_Action_Plan');
                    $scope.assignment_modal.show();
                    $scope.moveScrollTop('assignmentDetail');
                    break;
            }
        };

        $scope.closeModal = function (whichModal) {

            switch (whichModal) {
                case 'targetDate':

                    // set again temp target date as the current target date
                    $scope.selectedActionItem.tempTargetDate = $scope.selectedActionItem.TargetDate;

                    $scope.targetDate_modal.hide();
                    break;
                case 'community':
                    $scope.communityDetail_modal.hide();
                    break;
                case 'learning':
                    $scope.learningDetail_modal.hide();
                    break;
                case 'skillsImprove':
                    $scope.skillsImprove_modal.hide();
                    break;
                case 'position':
                    $scope.position_modal.hide();
                    break;
                case 'positionSkills':
                    $scope.positionSkills_modal.hide();
                    break;
                case 'assignment':
                    $scope.assignment_modal.hide();
                    break;
            }
        };

        // format date
        $scope.formatDate = function (dateString, isShort) {

            return methods.formatDate(dateString, isShort);
        };

        $scope.$on('settedDate', function (event, args) {
            // when setting date, save the action plan
            $scope.updateTargetDateActionPlanItem();
        });

        //#endregion        

        // opens a new window to register/join/contact depending on the type of item
        $scope.abreWindow = function (type) {

            var url = $scope.selectedItem.URL;            

            switch ($scope.selectedActionItem.ObjectTypeCodeNbr) {
                case constants.actionPlan.type.learning:
                    crittercismService.beginTransaction('User_Activity_Click_Register_Training_Action_Plan_Page');
                    crittercismService.endTransaction('User_Activity_Click_Register_Training_Action_Plan_Page');
                    break;
                //case constants.actionPlan.type.community:
                //    crittercismService.beginTransaction('User_Activity_Click_Join_Community_Action_Plan_Page');
                //    crittercismService.endTransaction('User_Activity_Click_Join_Community_Action_Plan_Page');
                //    break;
                //case constants.actionPlan.type.pymk:
                //    crittercismService.beginTransaction('User_Activity_Click_Contact_People_Action_Plan_Page');
                //    crittercismService.endTransaction('User_Activity_Click_Contact_People_Action_Plan_Page');
                //    url = environmentData.peopleUrl + $scope.selectedItem.EnterpriseID;
                //    break;
                //case constants.actionPlan.type.board:
                //    crittercismService.beginTransaction('User_Activity_Click_Follow_Board_Action_Plan_Page');
                //    crittercismService.endTransaction('User_Activity_Click_Follow_Board_Action_Plan_Page');
                //    break;
                //case constants.actionPlan.type.position:
                //    crittercismService.beginTransaction('User_Activity_Click_Apply_Position_Action_Plan_Page');
                //    crittercismService.endTransaction('User_Activity_Click_Apply_Position_Action_Plan_Page');
                //    break;
                //case constants.actionPlan.type.assignment:
                //    crittercismService.beginTransaction('User_Activity_Click_Apply_Assignment_Action_Plan_Page');
                //    crittercismService.endTransaction('User_Activity_Click_Apply_Assignment_Action_Plan_Page');
                //    break;
            }

            window.open(url, '_system'); return false;
        };

        // opens a new window to apply for a position or assignment item
        $scope.applyItem = function (type) {

            var url = '';

            if (type === 'position') {
                crittercismService.beginTransaction('User_Activity_Click_Apply_Position_Action_Plan_Page');
                crittercismService.endTransaction('User_Activity_Click_Apply_Position_Action_Plan_Page');
                url = environmentData.acmURL + $scope.selectedPositionItem.PositionId;
            }
            else if (type === 'assignment') {
                crittercismService.beginTransaction('User_Activity_Click_Apply_Assignment_Action_Plan_Page');
                crittercismService.endTransaction('User_Activity_Click_Apply_Assignment_Action_Plan_Page');
                url = environmentData.mySchedulingURL + $scope.selectedAssignmentItem.Id;
            }

            window.open(url, '_system'); return false;
        };

        // Opens detail modal (learning ,position or assignmet)
        $scope.openDetail = function () {

            if ($scope.selectedActionItem.ObjectTypeCodeNbr === constants.actionPlan.type.learning) {
                $scope.openModal('learning');
            }
            if ($scope.selectedActionItem.ObjectTypeCodeNbr === constants.actionPlan.type.position) {
                $scope.openModal('position');
            }
            if ($scope.selectedActionItem.ObjectTypeCodeNbr === constants.actionPlan.type.assignment) {
                $scope.openModal('assignment');
            }
        };

        // event that selects a learning item (used to open details page of that learning)
        $rootScope.$on(constants.broadcast.setLearningDetail, function (event, args) {

            if (args.message !== undefined) {

                $scope.selectedItem = args.message.item;
            }
        });

        // event that selects a position item (used to open details page of that position)
        $rootScope.$on(constants.broadcast.setPositionDetail, function (event, args) {

            if (args.message !== undefined) {

                $scope.selectedPositionItem = args.message.item;
            }
        });

        // event that selects an assignment item (used to open details page of that assignment)
        $rootScope.$on(constants.broadcast.setAssignmentDetail, function (event, args) {

            if (args.message !== undefined) {

                $scope.selectedAssignmentItem = args.message.item;
            }
        });

        //#region init

        $scope.$on('$ionicView.beforeEnter', function () {
            // before loading the page, clear action plan
            $scope.finishLoad = false;
            $scope.userModel.actionPlan = [];
        });

        $scope.$on('$ionicView.enter', function () {

            // when entering the page, load action plan, in order to have the list updated

            $ionicLoading.show();

            // Get users action plan
            authService.callService({ serviceName: environmentData.services.actionPlanService.serviceName, action: profileService.getActionPlan, params: { peopleKey: profileService.getPeopleKey() } }).then(function (data) {

                // set action plan data
                $scope.userModel.actionPlan = data.value;

                // clean date field
                var i = 0, utcDate = "";
                for (i = 0; i < $scope.userModel.actionPlan.length; i++) {
                    if ($scope.userModel.actionPlan[i].TargetDate === null) {
                        $scope.userModel.actionPlan[i].TargetDate = "";
                    }
                    else {
                        // transform UTC date to local machine date
                        utcDate = $scope.userModel.actionPlan[i].TargetDate.replace('T', ' ').substring(0, 19) + " UTC";
                        $scope.userModel.actionPlan[i].TargetDate = dateFilter(new Date(utcDate.replace(/-/g, "/")), 'yyyy-MM-dd');
                    }
                    if ($scope.userModel.actionPlan[i].CompletionDate === null) {
                        $scope.userModel.actionPlan[i].CompletionDate = "";
                    }
                    else {
                        // transform UTC date to local machine date
                        utcDate = $scope.userModel.actionPlan[i].CompletionDate.replace('T', ' ').substring(0, 19) + " UTC";
                        $scope.userModel.actionPlan[i].CompletionDate = dateFilter(new Date(utcDate.replace(/-/g, "/")), 'yyyy-MM-dd');
                    }
                }

                $scope.finishLoad = true;

                // sort the action plan items
                $scope.userModel.actionPlan.sort(methods.sortByDate);

                $ionicLoading.hide();

                $scope.showLoading = false;

            }, function (error) {
                console.log(error);
                $ionicLoading.hide();
            });

            $scope.moveScrollTop('actionPlanPage');
        });

        //#endregion

    }]);