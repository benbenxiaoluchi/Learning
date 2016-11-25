/*global directives, ionic*/

//#region Common
directives.directive('acnImageDisplay', ['connectedLearning.constants', 'profileService', 'connectedLearning.methods', 'authService', 'environmentData', function (constants, profileService, methods, authService, environmentData) {
    /// <summary>
    /// Manage Accenture image route.
    /// </summary>
    /// <doc>connectedLearning.directives:acn-image-display</doc>

    'use strict';

    return {
        restrict: 'A',
        replace: false,
        link: function (scope, elem, attr) {
            /// <summary>
            /// Manage Image functionality.
            /// </summary>
            /// <param name="scope">Scope object.</param>
            /// <param name="elem">Elem</param>
            /// <param name="attr">Attributes.</param>
            /// <doc>connectedLearning.directives:acn-image-display#link</doc>

            attr.$observe('ref', function () {
                var defaultImgSrc = constants.common.noImageUrl,
                    realImgSrc,
                    ref = attr.ref;

                if (methods.isEmptyOrNull(ref) || (ref.indexOf('myte') === 0)) {
                    elem.attr('src', defaultImgSrc);
                    return;
                }

                // Get user settings from connected learning service
                authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: profileService.getUserImage, params: ref }).then(function (data) {

                    realImgSrc = "data:image/jpeg;base64," + data.Data;
                    elem.attr('src', realImgSrc);

                }, function (error) {
                    console.log(error);
                    // set default image source
                    elem.attr('src', defaultImgSrc);
                });

            }, true);
        }
    };
}]);

directives.directive('acnImageDisplayDiv', ['connectedLearning.constants', 'connectedLearning.methods', 'streamService', function (constants, methods, streamService) {
    return {
        restrict: 'A',
        replace: false,
        link: function (scope, elem, attr) {
            var defaultImage = "url('" + constants.common.noImageUrl + "')";
            elem[0].style.backgroundImage = defaultImage;
            attr.$observe('ref', function () {
                var realImgSrc, ref = attr.ref;
                elem[0].style.backgroundImage = defaultImage;
                if (!methods.isEmptyOrNull(ref)) {
                    streamService.getEventImage(ref).then(function (data) {
                        if (!methods.isEmptyOrNull(data[0].m_Uri)) {
                            realImgSrc = "data:image/jpeg;base64," + data[0].m_Uri;
                            elem[0].style.backgroundImage = "url('" + realImgSrc + "')";
                        }
                    }, function (data, status) {
                        // set default image source
                        elem[0].style.backgroundImage = defaultImage;
                    });
                }
            }, true);
        }
    };
}]);
directives.directive('summaryCard', ['connectedLearning.constants', 'connectedLearning.methods', '$timeout', function (constants, methods, $timeout) {
    /// <summary>
    /// Manage summary cards.
    /// </summary>
    /// <doc>connectedLearning.directives:summary-card</doc>

    'use strict';

    return {
        restrict: 'A',
        replace: false,
        link: function (scope, elem, attr) {
            /// <summary>
            /// Manage summary cards.
            /// </summary>
            /// <param name="scope">Scope object.</param>
            /// <param name="elem">Elem</param>
            /// <param name="attr">Attributes.</param>
            /// <doc>connectedLearning.directives:summary-card#link</doc>

            function SummaryCardVisibility() {

                $timeout(function () {


                    if ($(elem).find('.summary-card-element').length === 0) {
                        $(elem).hide();
                    }
                    else if ($(elem).find('.summary-card-element').length === 1 && $(elem).find('.summary-card-element')[0].$$NG_REMOVED) {
                        $(elem).hide();
                    }
                    else {
                        $(elem).show();
                    }

                    if (attr.showMore !== undefined) {
                        var i = 0, count = 0;
                        for (i = 0; i < scope.$eval(attr.summaryCard); i++) {
                            if (!scope.$eval(attr.showMore)[i].IsFollow) {
                                count++;
                            }
                        }

                        if (count > 2) {
                            $(elem).find('.show-more').show();
                        }
                        else {
                            $(elem).find('.show-more').hide();
                        }
                    }

                }, 100);
            }

            scope.$watch(attr.summaryCard, function () {

                SummaryCardVisibility();
            });

            // event to update summary card
            scope.$on(constants.broadcast.updateSummaryCards, function (event, args) {

                SummaryCardVisibility();
            });
        }
    };
}]);

directives.directive('addActionPlan', ['connectedLearning.constants', 'connectedLearning.methods', 'authService', 'environmentData', 'profileService', '$ionicLoading', 'recommendationsService', 'connectedLearning.messages', '$location',
    function (constants, methods, authService, environmentData, profileService, $ionicLoading, recommendationsService, messagesService, $location) {
        /// <summary>
        /// Adds an item to the action plan of the user
        /// </summary>
        /// <doc>connectedLearning.directives:add-action-plan</doc>

        'use strict';

        return {
            restrict: 'A',
            replace: false,
            link: function (scope, elem, attr) {
                /// <summary>
                /// Adds an item to the action plan of the user
                /// </summary>
                /// <param name="scope">Scope object.</param>
                /// <param name="elem">Elem</param>
                /// <param name="attr">Attributes.</param>
                /// <doc>connectedLearning.directives:add-action-plan#link</doc>

                var userModel = profileService.getUserModel();

                $(elem).on('click', function () {

                    var item = JSON.parse(attr.addActionPlan);
                    var type = parseInt(attr.type, 10);
                    var itemId = "";
                    var itemName = "";

                    // add to plan only if the item is not already on it
                    if (!item.InActionPlan && $location.$$path !== '/app/plan') {                        

                        if (type === constants.actionPlan.type.pymk) {
                            itemId = item.PeopleKey.toString();
                            itemName = item.FirstName + ' ' + item.LastName;
                            item.URL = environmentData.peopleUrl + item.EnterpriseID;
                        }
                        else if (type === constants.actionPlan.type.position) {
                            itemName = item.PositionTitle;
                            itemId = item.PositionId;
                            item.URL = environmentData.acmURL + item.PositionId;
                        }
                        else if (type === constants.actionPlan.type.assignment) {
                            itemName = item.AssignmentTitle;
                            itemId = item.Id.toString();
                            item.URL = environmentData.mySchedulingURL + item.Id.toString();
                        }
                        else {
                            itemName = item.Title;
                            itemId = item.ID;
                        }                        

                        var params = {
                            peopleKey: profileService.getPeopleKey(),
                            sourceAppName: constants.actionPlan.sourceAppName,
                            ObjectTypeCodeNbr: type,
                            ObjectId: itemId,
                            ObjectNameTxt: itemName,
                            URL: item.URL
                        };

                        // Start loading data
                        $ionicLoading.show();

                        // Get users action plan
                        authService.callService({ serviceName: environmentData.services.actionPlanService.serviceName, action: profileService.addActionPlanItem, params: params }).then(function (data) {
                            
                            var itemToPlan = {
                                ActionPlanId: 99,
                                ObjectNameTxt: itemName,
                                ObjectTypeCodeNbr: type,
                                ObjectId: itemId,
                                TargetDate: "",
                                CompletionDate: null,
                                StatusCodeNbr: 1401,
                                ActionTypeDetail: "Skill",
                                ActionTypeID: "80008081",
                                ActionTypeNameText: "C#",
                                MandatoryInd: "N",
                                URL: ""
                            };

                            // add the item to plan
                            profileService.addToActionPlanList(itemToPlan);

                            if (attr.isDetail === "true") {
                                // set the item in the recommended list
                                var index = 0;

                                switch (type) {
                                    case constants.actionPlan.type.learning:
                                        for (index = 0; index < scope.skillLearnings.list.length; index++) {
                                            if (scope.skillLearnings.list[index].ID === itemId) {
                                                scope.skillLearnings.list[index].InActionPlan = true;
                                                break;
                                            }
                                        }
                                        break;
                                    case constants.actionPlan.type.board:
                                        for (index = 0; index < scope.skillLearningBoards.list.length; index++) {
                                            if (scope.skillLearningBoards.list[index].ID === itemId) {
                                                scope.skillLearningBoards.list[index].InActionPlan = true;
                                                break;
                                            }
                                        }
                                        break;
                                    case constants.actionPlan.type.community:
                                        for (index = 0; index < scope.skillCommunities.list.length; index++) {
                                            if (scope.skillCommunities.list[index].ID === itemId) {
                                                scope.skillCommunities.list[index].InActionPlan = true;
                                                break;
                                            }
                                        }
                                        break;
                                    case constants.actionPlan.type.pymk:
                                        for (index = 0; index < scope.skillPYMK.list.length; index++) {
                                            if (scope.skillPYMK.list[index].PeopleKey.toString() === itemId) {
                                                scope.skillPYMK.list[index].InActionPlan = true;
                                                break;
                                            }
                                        }
                                        break;
                                    case constants.actionPlan.type.position:
                                        for (index = 0; index < scope.skillPositions.list.length; index++) {
                                            if (scope.skillPositions.list[index].PositionId === itemId) {
                                                scope.skillPositions.list[index].InActionPlan = true;
                                                break;
                                            }
                                        }
                                        break;
                                    case constants.actionPlan.type.assignment:
                                        for (index = 0; index < scope.skillAssignments.list.length; index++) {
                                            if (scope.skillAssignments.list[index].Id.toString() === itemId) {
                                                scope.skillAssignments.list[index].InActionPlan = true;
                                                break;
                                            }
                                        }
                                        break;
                                }
                            }

                            // set the item in the recommended list
                            recommendationsService.setRecommendedItemInActionPlan(itemId, true, type);

                            messagesService.broadcast(constants.broadcast.updateSummaryCards);

                            // End loading data
                            $ionicLoading.hide();

                        }, function (error) {
                            console.log(error);
                            // End loading data
                            $ionicLoading.hide();
                        });
                    }

                });
            }
        };
    }]);

directives.directive('removeActionPlan', ['connectedLearning.constants', 'connectedLearning.methods', 'authService', 'environmentData', 'profileService', '$ionicLoading', 'recommendationsService', '$ionicScrollDelegate',
    function (constants, methods, authService, environmentData, profileService, $ionicLoading, recommendationsService, $ionicScrollDelegate) {
        /// <summary>
        /// Removes an item of the action plan of the user
        /// </summary>
        /// <doc>connectedLearning.directives:remove-action-plan</doc>

        'use strict';

        return {
            restrict: 'A',
            replace: false,
            link: function (scope, elem, attr) {
                /// <summary>
                /// Removes an item of the action plan of the user
                /// </summary>
                /// <param name="scope">Scope object.</param>
                /// <param name="elem">Elem</param>
                /// <param name="attr">Attributes.</param>
                /// <doc>connectedLearning.directives:remove-action-plan#link</doc>

                // event to update summary card
                scope.$on(constants.broadcast.removeActionItem, function (event, args) {

                    if (args.message !== null) {

                        // Start loading data
                        $ionicLoading.show();

                        // Get users action plan
                        authService.callService({ serviceName: environmentData.services.actionPlanService.serviceName, action: profileService.removeActionPlanItem, params: { id: args.message.id } }).then(function (data) {

                            $('#actionPlanItem_' + args.message.id).animate({ 'left': '-100%' }, 500, function () {
                                $('#actionPlanItem_' + args.message.id).animate({ 'height': 0, 'padding': 0 }, 500, function () {
                                    var type = parseInt(args.message.type, 10);

                                    // remove the item from the action plan
                                    profileService.removeFromActionPlanList(args.message.id, type);

                                    // set the item in the recommended list
                                    recommendationsService.setRecommendedItemInActionPlan(args.message.objectId, false, type);

                                    // resize page to accomodate new size because we have removed one item
                                    $ionicScrollDelegate.$getByHandle('myScroll').resize();

                                    // End loading data
                                    $ionicLoading.hide();

                                });
                            });

                        }, function (error) {
                            console.log(error);
                            // End loading data
                            $ionicLoading.hide();
                        });
                    }
                });
            }
        };
    }]);

directives.directive('hideTutorialBlackPage', ['connectedLearning.constants', 'profileService', 'connectedLearning.methods', 'authService', 'environmentData', function (constants, profileService, methods, authService, environmentData) {
    /// <summary>
    /// 
    /// </summary>
    /// <doc>connectedLearning.directives:acn-image-display</doc>

    'use strict';

    return {
        restrict: 'A',
        replace: false,
        link: function (scope, elem, attr) {
            /// <summary>
            /// Manage Image functionality.
            /// </summary>
            /// <param name="scope">Scope object.</param>
            /// <param name="elem">Elem</param>
            /// <param name="attr">Attributes.</param>
            /// <doc>connectedLearning.directives:acn-image-display#link</doc>

            $(elem).on('click', function () {

                $(elem).hide();

            });
            
        }
    };
}]);

directives.directive('showCameraActions', ['$timeout', '$ionicActionSheet', function ($timeout, $ionicActionSheet) {
    function link(scope, element, attrs) {
        function showCameraActionsMenu(scope, $ionicActionSheet) {
            var hideSheet = $ionicActionSheet.show({
                buttons: [{ text: 'Camera' }, { text: 'Photo Library' }],
                cancelText: 'Cancel',
                cancel: function () {
                    scope.isCameraActionsShown = false;
                },
                buttonClicked: function (index) {
                    scope.takePicture(index == 0);
                    //Hide options
                    $timeout(function () {
                        hideSheet();
                    }, 25);
                }
            });
        }
        element.bind('click', function (event) {
            showCameraActionsMenu(scope, $ionicActionSheet);
            event.stopPropagation();
        });
    }
    return {
        link: link
    };
}]);

directives.directive('bindHtmlCompile', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(function () {
                return scope.$eval(attrs.bindHtmlCompile);
            }, function (value) {
                // Incase value is a TrustedValueHolderType, sometimes it
                // needs to be explicitly called into a string in order to
                // get the HTML string.
                element.html(value && value.toString());
                // If scope is provided use it, otherwise use parent scope
                var compileScope = scope;
                if (attrs.bindHtmlScope) {
                    compileScope = scope.$eval(attrs.bindHtmlScope);
                }
                $compile(element.contents())(compileScope);
            });
        }
    };
}]);

directives.directive('loadingFeedbackSurvey', ['$ionicLoading', function ($ionicLoading) {
    return {
        restrict: 'A',
        replace: false,
        link: function (scope, elem, attr) {
            $ionicLoading.show();
            $(elem).load(function(){
                $ionicLoading.hide();
            })
        }
    };
}]);
directives.directive('disableFeedback', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'A',
        replace: false,
        link: function (scope, elem, attr) {
            if($rootScope.ImpersonateStatus){
                elem.attr("disabled",true);
            }
            else{
                elem.attr("disabled",false);
            }
        }
    };
}]);

//#endregion