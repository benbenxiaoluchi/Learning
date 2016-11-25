/*global controllers, ionic, angular, window*/

controllers.controller('skillsController', ['$timeout', '$scope', '$rootScope', 'profileService', '$ionicLoading', '$ionicModal', '$window', '$cordovaToast', 'connectedLearning.constants', '$location', 'authService', 'environmentData', 'recommendationsService', 'connectedLearning.messages', 'connectedLearning.methods','crittercismService',
function ($timeout, $scope, $rootScope, profileService, $ionicLoading, $ionicModal, $window, $cordovaToast, constants, $location, authService, environmentData, recommendationsService, messagesService, methods, crittercismService) {
    /// <summary>
    /// Controller that manages functionality related to skills recommended
    /// </summary>
    /// <param name="$scope">
    /// scope is an object that refers to the application model. It is an execution context for expressions.
    /// Scopes are arranged in hierarchical structure which mimic the DOM structure of the application.
    /// Scopes can watch expressions and propagate events.
    /// </param>
    /// <param name="$rootScope">Same kind as before but this it's common for all controllers.</param>
    /// <doc>connectedLearning.controllers:skillsController</doc>

    'use strict';

    //#region Properties

    // Recommendations
    $scope.skillsModel = profileService.getSkillsModel();
    $scope.skillSelected = {};
    $scope.userModel = profileService.getUserModel();

    $scope.showDescription = false;
    $scope.noResultsRecommended = false;
    $scope.noResultsFutureSkills = false;
    $scope.noResultsLearningActivities = false;

    $scope.skillLearningsFinishedLoad = false;
    $scope.skillCommunitiesFinishedLoad = false;
    $scope.skillPYMKFinishedLoad = false;
    $scope.skillPositionsFinishedLoad = false;
    $scope.skillAssignmentsFinishedLoad = false;

    $scope.skillLearnings = {
        size: constants.recommendations.size,
        endPaging: true
    };
    $scope.skillLearningBoards = {
        size: constants.recommendations.size,
        endPaging: true
    };
    $scope.skillCommunities = {
        size: constants.recommendations.size,
        endPaging: true
    };
    $scope.skillPYMK = {
        size: constants.recommendations.size,
        endPaging: true
    };
    $scope.skillPositions = {
        size: constants.recommendations.size,
        endPaging: true
    };
    $scope.skillAssignments = {
        size: constants.recommendations.size,
        endPaging: true
    };

    $scope.tempFollowSkills = [];
    $scope.isTemp = false;
    $scope.disableActions = false;

    $scope.moreSkillsType = 0;
    $scope.moreSkillsTitle = "";
    $scope.typePage = "white";

    $scope.initLoader = true;

	$scope.allSkills = [];
    //#endregion

    //#region Actions

    $scope.init = function () {
        /// <summary>
        /// Initializes the controller.
        /// </summary>
        /// <doc>connectedLearning.controllers:skillsController#init</doc>

        // if opening the add follow skills page, dont load again all
        if ($location.$$path !== '/app/skills/follow/add') {

            // dont load recommended skills if already have data
            if ($scope.skillsModel.recommendedSkills.list.length === 0 &&
                $scope.skillsModel.futureSkills.list.length === 0 &&
                $scope.skillsModel.businessSkills.list.length === 0 &&
                $scope.skillsModel.specialtySkills.list.length === 0) {

                // get recommended skills
                $scope.getRecommendedSkills(false);

                // get future skills
                $scope.getFutureSkills(false);

                // get business priotiry skills
                $scope.getBusinessPrioritySkills(false);

                // get specializations
                $scope.getSpecialtySkills(false);
            }

            $scope.skillsModel.followSkills.list = [];
            // get followed skills
            $scope.getFollowSkills();
        }
    };

    $scope.getFollowSkills = function () {
        /// <summary>
        /// Get the list of skills the user is following.
        /// </summary>
        /// <doc>connectedLearning.controllers:skillsController#getFollowSkills</doc>

        // Start loading data
        $ionicLoading.show();

        var params = {
            peopleKey: profileService.getPeopleKey(),
            roleId: profileService.getRoleId(),
            careerLevel: profileService.getCareerLevel()
        };

        // get skills the user is following
        authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: profileService.getFollowSkills, params: params }).then(function (data) {

            // End loading data
            $ionicLoading.hide();

            // Set data
            $scope.skillsModel.followSkills.list = data;

        }, function (error) {
            console.log(error);
            // End loading data
            $ionicLoading.hide();
        });
    };

    $scope.getRecommendedSkills = function (loadMore) {
        /// <summary>
        /// Get the list of skills recommended to the user.
        /// </summary>
        /// <doc>connectedLearning.controllers:skillsController#getRecommendedSkills</doc>

        if (loadMore) {
            // Start loading data
            $ionicLoading.show();
        }
		var result = [];

        var params = {
            peopleKey: profileService.getPeopleKey(),
            roleId: profileService.getRoleId(),
            careerLevel: profileService.getCareerLevel(),
            size: constants.skills.maxSizeSkills
        };

        // get skills recommended for the user
        authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: profileService.getRecommendedSkills, params: params }).then(function (data) {

            if (loadMore) {
                // End loading data
                $ionicLoading.hide();
            }
            else {
                // Check if there is more data
                if (data.length > 0) {
					result = $scope.removeDuplicates(data);
                    $scope.skillsModel.recommendedSkills.endPaging = (result.length <= constants.skills.size);                }
            }

            // Set data
            $scope.skillsModel.recommendedSkills.list = result;

            // if no recommended skills found, show message
            if ($scope.skillsModel.recommendedSkills.list.length === 0) {
                $scope.noResultsRecommended = true;
            }

        }, function (error) {
            console.log(error);
            // End loading data
            $ionicLoading.hide();
            // no paging
            $scope.skillsModel.recommendedSkills.endPaging = true;
        });
    };

    $scope.getFutureSkills = function (loadMore) {
        /// <summary>
        /// Get the list of skills recommended to the user from his Career Board (FUTURE SKILLS).
        /// </summary>
        /// <doc>connectedLearning.controllers:skillsController#getFutureSkills</doc>

        if (loadMore) {
            // Start loading data
            $ionicLoading.show();
        }

        var result = [];
        var params = {
            peopleKey: profileService.getPeopleKey(),
            roleId: profileService.getRoleId(),
            careerLevel: profileService.getCareerLevel(),
            size: constants.skills.maxSizeSkills
        };

        // get skills recommended for the user
        authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: profileService.getFutureSkills, params: params }).then(function (data) {

            if (loadMore) {
                // End loading data
                $ionicLoading.hide();
            }
            else {// Check if there is more data
                if (data.length > 0) {
                    result = $scope.removeDuplicates(data);
                    $scope.skillsModel.futureSkills.endPaging = (result.length <= constants.skills.size);
                }
            }

            // Set data
            $scope.skillsModel.futureSkills.list = result;

            // if no recommended skills found, show message
            if ($scope.skillsModel.futureSkills.list.length === 0) {
                $scope.noResultsFutureSkills = true;
            }

        }, function (error) {
            console.log(error);
            // End loading data
            $ionicLoading.hide();
            // no paging
            $scope.skillsModel.futureSkills.endPaging = true;
        });
    };

    $scope.getBusinessPrioritySkills = function (loadMore) {
        /// <summary>
        /// Get the list of skills recommended to the user that are not in TAD.
        /// </summary>
        /// <doc>connectedLearning.controllers:skillsController#getBusinessPrioritySkills</doc>

        if (loadMore) {
            // Start loading data
            $ionicLoading.show();
        }

        var result = [];
        var params = {
            peopleKey: profileService.getPeopleKey(),
            enterpriseId: profileService.getEnterpriseId()
        };

        // get user's DTE
        authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: profileService.getUserDTE, params: params }).then(function (data) {

            if ($.trim(data) !== '' && data !== null && data !== undefined) {

                var params = {
                    peopleKey: profileService.getPeopleKey(),
                    dte: data
                };

                // get skills recommended for the user
                authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: profileService.getBusinessPrioritySkills, params: params }).then(function (data) {

                    if (loadMore) {
                        // End loading data
                        $ionicLoading.hide();
                    }
                    else {
                        // Check if there is more data
                        if (data.length > 0) {
                            result = $scope.removeDuplicates(data);
                            $scope.skillsModel.businessSkills.endPaging = (result.length <= constants.skills.size);
                        }
                    }

                    // Set data
                    $scope.skillsModel.businessSkills.list = result;

                }, function (error) {
                    console.log(error);
                    // End loading data
                    $ionicLoading.hide();
                    // no paging
                    $scope.skillsModel.businessSkills.endPaging = true;
                });
            }

        }, function (error) {
            console.log(error);
            // End loading data
            $ionicLoading.hide();
            // no paging
            $scope.skillsModel.businessSkills.endPaging = true;
        });
    };

    $scope.getSpecialtySkills = function (loadMore) {
        /// <summary>
        /// Get the list of specializations of the user.
        /// </summary>
        /// <doc>connectedLearning.controllers:skillsController#getSpecialtySkills</doc>

        if (loadMore) {
            // Start loading data
            $ionicLoading.show();
        }
        var result = [];
        var params = {
            peopleKey: profileService.getPeopleKey(),
            size: constants.skills.maxSizeSkills
        };

        $scope.skillsModel.specialtySkills.list = [];

        // get skills recommended for the user
        authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: profileService.getSpecialtySkills, params: params }).then(function (data) {

            if (loadMore) {
                // End loading data
                $ionicLoading.hide();
            }
            else {
                // Check if there is more data
                if (data.length > 0) {
                    result = $scope.removeDuplicates(data);
                    $scope.skillsModel.specialtySkills.endPaging = (result.length <= constants.skills.size);
                }
            }
            
            // Exclude from data skills not needed (see constants file)
            var i = 0;
            for (i = 0; i < result.length; i++) {
                if ($.inArray(result[i].SkillId, constants.skills.excludedSpecSkills) === -1) {
                    $scope.skillsModel.specialtySkills.list.push(result[i]);
                }                
            }
            $scope.skillsModel.specialtySkills.endPaging = ($scope.skillsModel.specialtySkills.list.length <= constants.skills.size);
            

        }, function (error) {
            console.log(error);
            // End loading data
            $ionicLoading.hide();
            // no paging
            $scope.skillsModel.specialtySkills.endPaging = true;
        });
    };

    $scope.toggleFollow = function (follow, isListPage) {
        /// <summary>
        /// Toggle between follow/unfollow the selected skill.
        /// </summary>
        /// <doc>connectedLearning.controllers:skillsController#toggleFollow</doc>

        // maximum limit to followed skills is 5
        if (follow && $scope.skillsModel.followSkills.list.length >= constants.skills.maximumFollowSkills) {
            if ($window.cordova) {
                $cordovaToast.show(constants.messages.maxFollowedSkills, 'long', 'bottom');
            }
            return;
        }

        if (follow) {
            crittercismService.beginTransaction('User_Activity_Click_Follow_Skill');
            crittercismService.endTransaction('User_Activity_Click_Follow_Skill');
        } else {
            crittercismService.beginTransaction('User_Activity_Click_Unfollow_Skill');
            crittercismService.endTransaction('User_Activity_Click_Unfollow_Skill');
        }
        

        // Start loading data
        $ionicLoading.show();

        if ($scope.skillSelected.SkillType === 0) {
            $scope.skillSelected.SkillType = constants.skills.type.recommended;
        }

        var params = {
            peopleKey: profileService.getPeopleKey(),
            skillId: $scope.skillSelected.SkillId,
            skillType: $scope.skillSelected.SkillType,
            follow: follow
        };

        // follow/unfollow a skill
        authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: profileService.followUnfollowSkill, params: params }).then(function (data) {

            // Set data
            $scope.skillSelected.IsFollow = follow;

            if (follow) {
                profileService.addFollowSkill($scope.skillSelected);
            } else {
                if (isListPage) {

                    // disable unfollow buttons
                    $('[id*="skillId_"]').find('.followAction').each(function () {
                        $(this).prop('disabled', true);
                    });
                    // disable any action taken
                    $scope.disableActions = true;

                    $('#skillId_' + $scope.skillSelected.SkillId).animate({ 'left': '-100%' }, 500, function () {
                        $('#skillId_' + $scope.skillSelected.SkillId).animate({ 'height': 0, 'padding': 0 }, 500, function () {
                            $timeout(function () {

                                var summaryItem = '';

                                if ($scope.skillSelected.SkillType === constants.skills.type.recommended) {
                                    summaryItem = '.summary-follow';
                                }
                                else if ($scope.skillSelected.SkillType === constants.skills.type.future) {
                                    summaryItem = '.summary-follow-future';
                                }
                                else if ($scope.skillSelected.SkillType === constants.skills.type.businessPriority) {
                                    summaryItem = '.summary-follow-business';
                                }
                                else if ($scope.skillSelected.SkillType === constants.skills.type.specialty) {
                                    summaryItem = '.summary-follow-specialty';
                                }

                                // recalculate height of section for normal skills
                                var totalHeight = 0;
                                $(summaryItem).find('.summary-card-collapsable').find('ion-item').each(function () {
                                    totalHeight += $(this)[0].clientHeight;
                                });
                                $(summaryItem).find('.summary-card-collapsable').animate({ 'height': totalHeight + 'px' }, 500, function () {
                                    $(summaryItem).find('.summary-card-collapsable').css("height", "");
                                });

                                profileService.removeFollowSkill($scope.skillSelected.SkillId);
                                // enable again unfollow buttons
                                $('[id*="skillId_"]').find('.followAction').each(function () {
                                    $(this).prop('disabled', false);
                                });
                                // enable again actions
                                $scope.disableActions = false;

                            });
                        });
                    });
                }
                else {
                    profileService.removeFollowSkill($scope.skillSelected.SkillId);
                }
            }

            // if we are in skills i'm following page
            if (isListPage) {

                if ($scope.skillSelected.SkillType === constants.skills.type.recommended) {
                    // set the skill isFollow value in the recommended skills list
                    profileService.setRecommendedSkilltoFollow($scope.skillSelected.SkillId, follow);
                }

                if ($scope.skillSelected.SkillType === constants.skills.type.future) {
                    // set the skill isFollow value in the future skills list
                    profileService.setFutureSkilltoFollow($scope.skillSelected.SkillId, follow);
                }

                if ($scope.skillSelected.SkillType === constants.skills.type.businessPriority) {
                    // set the skill isFollow value in the business priority skills list
                    profileService.setBusinessPrioritySkilltoFollow($scope.skillSelected.SkillId, follow);
                }

                if ($scope.skillSelected.SkillType === constants.skills.type.specialty) {
                    // set the skill isFollow value in the business priority skills list
                    profileService.setSpecialtySkilltoFollow($scope.skillSelected.SkillId, follow);
                }
            }

            // End loading data
            $ionicLoading.hide();

            // every time user follow/unfollow a skill, we need to reload the recommmended items
            recommendationsService.setReloadRecommendations(true);

        }, function (error) {
            console.log(error);
            // End loading data
            $ionicLoading.hide();
        });
    };

    $scope.selectSkill = function (skill) {
        /// <summary>
        /// Make a selection of a skill
        /// </summary>
        /// <doc>connectedLearning.controllers:skillsController#selectSkill</doc>

        if (!$scope.disableActions) {
            $scope.skillSelected = skill;
        }
    };

    $scope.getSkillRecommendedLearnings = function (loadMore) {
        /// <summary>
        /// Get the list of recommended items - LEARNINGS
        /// </summary>
        /// <doc>connectedLearning.controllers:homeController#getSkillRecommendedLearnings</doc>

        if (!loadMore) {

            $scope.skillLearnings.size = constants.recommendations.maxSizeLearnings;
            $scope.skillLearningBoards.size = constants.recommendations.maxSizeLearnings;
            $scope.skillLearningsFinishedLoad = false;
        }
        else {
            // Start loading data
            $ionicLoading.show();
        }

        var params = {
            peopleKey: profileService.getPeopleKey(),
            size: $scope.skillLearnings.size,
            skillsList: [{ SkillId: $scope.skillSelected.SkillId, UserProficiency: $scope.skillSelected.UserProficiency }]
        };

        // get recommended items
        authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: recommendationsService.getRecommendedLearnings, params: params }).then(function (data) {

            // Set data
            if (data.RecommendationsLst !== null) {

                // clean recommendations list
                $scope.skillLearnings.list = [];
                $scope.skillLearningBoards.list = [];

                var i = 0, result = [];
                for (i = 0; i < data.LearningList.length; i++) {

                    // check if item is in action plan
                    data.LearningList[i].InActionPlan = methods.inActionPlan($scope.userModel.actionPlan, data.LearningList[i].ID);

                    if (data.LearningList[i].MatchingSkillsNames !== undefined &&
                            data.LearningList[i].MatchingSkillsNames !== null &&
                            data.LearningList[i].MatchingSkillsNames !== "") {

                        // remove duplicated values before continue
                        var list = data.LearningList[i].MatchingSkillsNames.split(',');
                        result = [];

                        $.each(list, function (i, e) {
                            if ($.inArray(e, result) === -1) {
                                result.push(e);
                            }
                        });

                        data.LearningList[i].MatchingSkillsNames = result;

                    }

                    if (data.LearningList[i].CourseType !== 'board') {
                        $scope.skillLearnings.list.push(data.LearningList[i]);
                    }
                    else {
                        $scope.skillLearningBoards.list.push(data.LearningList[i]);
                    }
                }
            }

            $scope.skillLearningsFinishedLoad = true;

            if (!loadMore) {
                // Check if there is more data
                if ($scope.skillLearnings.list.length > 0) {
                    $scope.skillLearnings.endPaging = ($scope.skillLearnings.list.length <= constants.recommendations.size);
                }

                // Check if there is more data
                if ($scope.skillLearningBoards.list.length > 0) {
                    $scope.skillLearningBoards.endPaging = ($scope.skillLearningBoards.list.length <= constants.recommendations.size);
                }

                // on initial load, hide loading spinner when first call finishes
                if ($scope.initLoader) {
                    $scope.initLoader = false;
                    // End loading data
                    $ionicLoading.hide();
                }
            }
            else {
                // End loading data
                $ionicLoading.hide();
            }

            $scope.checkLearningActivitiesFinished();

        }, function (error) {
            console.log(error);
            // End loading data
            $ionicLoading.hide();

            $scope.skillLearningsFinishedLoad = true;
            $scope.checkLearningActivitiesFinished();
        });

    };

    $scope.getSkillRecommendedCommunities = function (loadMore) {
        /// <summary>
        /// Get the list of recommended items - COMMUNITIES
        /// </summary>
        /// <doc>connectedLearning.controllers:homeController#getSkillRecommendedCommunities</doc>

        if (!loadMore) {

            $scope.skillCommunities.size = constants.recommendations.maxSizeCommunities;
            $scope.skillCommunitiesFinishedLoad = false;
        }
        else {
            // Start loading data
            $ionicLoading.show();
        }

        var params = {
            peopleKey: profileService.getPeopleKey(),
            size: $scope.skillCommunities.size,
            skillsList: [{ SkillName: $scope.skillSelected.SkillName }]
        };

        // get recommended items
        authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: recommendationsService.getRecommendedCommunities, params: params }).then(function (data) {

            if (!loadMore) {
                // Check if there is more data
                if (data.CommunityList.length > 0) {
                    $scope.skillCommunities.endPaging = (data.CommunityList.length <= constants.recommendations.size);
                }

                // on initial load, hide loading spinner when first call finishes
                if ($scope.initLoader) {
                    $scope.initLoader = false;
                    // End loading data
                    $ionicLoading.hide();
                }
            }
            else {
                // End loading data
                $ionicLoading.hide();
            }

            // Set data
            if (data.CommunityList !== null) {

                // clean recommendations list
                $scope.skillCommunities.list = [];

                var i = 0;
                for (i = 0; i < data.CommunityList.length; i++) {

                    // check if item is in action plan
                    data.CommunityList[i].InActionPlan = methods.inActionPlan($scope.userModel.actionPlan, data.CommunityList[i].ID);

                    $scope.skillCommunities.list.push(data.CommunityList[i]);
                }
            }

            $scope.skillCommunitiesFinishedLoad = true;
            $scope.checkLearningActivitiesFinished();

        }, function (error) {
            console.log(error);
            // End loading data
            $ionicLoading.hide();

            $scope.skillCommunitiesFinishedLoad = true;
            $scope.checkLearningActivitiesFinished();
        });

    };

    $scope.getSkillRecommendedPYMK = function (loadMore) {
        /// <summary>
        /// Get the list of recommended items - PYMK
        /// </summary>
        /// <doc>connectedLearning.controllers:homeController#getSkillRecommendedPYMK</doc>

        if (!loadMore) {

            $scope.skillPYMK.size = constants.recommendations.maxSizePYMK;
            $scope.skillPYMKFinishedLoad = false;
        }
        else {
            // Start loading data
            $ionicLoading.show();
        }

        var params = {
            peopleKey: profileService.getPeopleKey(),
            careerLevelCd: profileService.getCareerLevel(),
            size: $scope.skillPYMK.size,
            skillsList: [{ SkillName: $scope.skillSelected.SkillName, UserProficiency: $scope.skillSelected.UserProficiency }]
        };

        // get recommended items
        authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: recommendationsService.getRecommendedPYMK, params: params }).then(function (data) {

            if (!loadMore) {
                // Check if there is more data
                if (data.PeopleList.length > 0) {
                    $scope.skillPYMK.endPaging = (data.PeopleList.length <= constants.recommendations.size);
                }

                // on initial load, hide loading spinner when first call finishes
                if ($scope.initLoader) {
                    $scope.initLoader = false;
                    // End loading data
                    $ionicLoading.hide();
                }
            }
            else {
                // End loading data
                $ionicLoading.hide();
            }

            // Set data
            if (data.PeopleList !== null) {

                // clean recommendations list
                $scope.skillPYMK.list = [];

                var i = 0;
                for (i = 0; i < data.PeopleList.length; i++) {

                    // check if item is in action plan
                    data.PeopleList[i].InActionPlan = methods.inActionPlan($scope.userModel.actionPlan, data.PeopleList[i].PeopleKey.toString());

                    $scope.skillPYMK.list.push(data.PeopleList[i]);
                }
            }

            $scope.skillPYMKFinishedLoad = true;
            $scope.checkLearningActivitiesFinished();

        }, function (error) {
            console.log(error);
            // End loading data
            $ionicLoading.hide();

            $scope.skillPYMKFinishedLoad = true;
            $scope.checkLearningActivitiesFinished();
        });
    };

    $scope.getSkillRecommendedPositions = function (loadMore) {
        /// <summary>
        /// Get the list of recommended items - ACM Positions
        /// </summary>
        /// <doc>connectedLearning.controllers:homeController#getSkillRecommendedPositions</doc>

        if (!loadMore) {

            $scope.skillPositions.size = constants.recommendations.maxSizePositions;
            $scope.skillPositionsFinishedLoad = false;
        }
        else {
            // Start loading data
            $ionicLoading.show();
        }

        var params = {
            peopleKey: profileService.getPeopleKey(),
            careerLevelCd: profileService.getCareerLevel(),
            size: $scope.skillPositions.size,
            skillsList: [{ SkillName: $scope.skillSelected.SkillName }]
        };

        // get recommended items
        authService.callService({
            serviceName: environmentData.services.conlearningService.serviceName, action: recommendationsService.getACMPositions, params: params
        }).then(function (data) {

            if (!loadMore) {
                // Check if there is more data
                if (data.OpportunityList.length > 0) {
                    $scope.skillPositions.endPaging = (data.OpportunityList.length <= constants.recommendations.size);
                }

                // on initial load, hide loading spinner when first call finishes
                if ($scope.initLoader) {
                    $scope.initLoader = false;
                    // End loading data
                    $ionicLoading.hide();
                }
            }
            else {
                // End loading data
                $ionicLoading.hide();
            }

            // Set data
            if (data.OpportunityList !== null) {

                // clean recommendations list
                $scope.skillPositions.list = [];

                var i = 0;
                for (i = 0; i < data.OpportunityList.length; i++) {

                    // check if item is in action plan
                    data.OpportunityList[i].InActionPlan = methods.inActionPlan($scope.userModel.actionPlan, data.OpportunityList[i].PositionId);

                    $scope.skillPositions.list.push(data.OpportunityList[i]);
                }
            }

            $scope.skillPositionsFinishedLoad = true;
            $scope.checkLearningActivitiesFinished();

        }, function (error) {
            console.log(error);
            // End loading data
            $ionicLoading.hide();

            $scope.skillPositionsFinishedLoad = true;
            $scope.checkLearningActivitiesFinished();
        });
    };

    $scope.getSkillRecommendedAssignments = function (loadMore) {
        /// <summary>
        /// Get the list of recommended items - MyS
        /// </summary>
        /// <doc>connectedLearning.controllers:homeController#getSkillRecommendedAssignments</doc>

        if (!loadMore) {

            $scope.skillAssignments.size = constants.recommendations.maxSizeAssignments;
            $scope.skillAssignmentsFinishedLoad = false;
        }
        else {
            // Start loading data
            $ionicLoading.show();
        }

        var params = {
            peopleKey: profileService.getPeopleKey(),
            enterpriseid: profileService.getEnterpriseId(),
            careerLevelCd: profileService.getCareerLevel(),
            size: $scope.skillAssignments.size,
            skillsList: [{ SkillName: $scope.skillSelected.SkillName }]
        };

        // get recommended items
        authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: recommendationsService.getMySchedulingAssignments, params: params }).then(function (data) {

            if (!loadMore) {
                // Check if there is more data
                if (data.AssignmentList.length > 0) {
                    $scope.skillAssignments.endPaging = (data.AssignmentList.length <= constants.recommendations.size);
                }

                // on initial load, hide loading spinner when first call finishes
                if ($scope.initLoader) {
                    $scope.initLoader = false;
                    // End loading data
                    $ionicLoading.hide();
                }
            }
            else {
                // End loading data
                $ionicLoading.hide();
            }

            // Set data
            if (data.AssignmentList !== null) {

                // clean recommendations list
                $scope.skillAssignments.list = [];

                var i = 0;
                for (i = 0; i < data.AssignmentList.length; i++) {

                    // check if item is in action plan
                    data.AssignmentList[i].InActionPlan = methods.inActionPlan($scope.userModel.actionPlan, data.AssignmentList[i].Id.toString());

                    $scope.skillAssignments.list.push(data.AssignmentList[i]);
                }
            }

            $scope.skillAssignmentsFinishedLoad = true;
            $scope.checkLearningActivitiesFinished();

        }, function (error) {
            console.log(error);
            // End loading data
            $ionicLoading.hide();

            $scope.skillAssignmentsFinishedLoad = true;
            $scope.checkLearningActivitiesFinished();
        });
    };

    $scope.getSkillDescription = function () {
        /// <summary>
        /// Get the description of a skill
        /// </summary>
        /// <doc>connectedLearning.controllers:homeController#getSkillDescription</doc>

        $scope.showDescription = false;

        var params = {
            peopleKey: profileService.getPeopleKey(),
            skillId: $scope.skillSelected.SkillId
        };

        // get recommended items
        authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: profileService.getSkillDescription, params: params }).then(function (data) {

            // set data
            $scope.skillSelected.SkillDescription = data;

            $scope.showDescription = true;

        }, function (error) {
            console.log(error);
        });
    };

    $scope.checkLearningActivitiesFinished = function () {

        if ($scope.skillLearningsFinishedLoad && $scope.skillCommunitiesFinishedLoad && $scope.skillPYMKFinishedLoad &&
            $scope.skillPositionsFinishedLoad && $scope.skillAssignmentsFinishedLoad) {

            if (($scope.skillLearnings === undefined || $scope.skillLearnings === null || $scope.skillLearnings.list.length === 0) &&
                ($scope.skillLearningBoards === undefined || $scope.skillLearningBoards === null || $scope.skillLearningBoards.list.length === 0) &&
                ($scope.skillCommunities === undefined || $scope.skillCommunities === null || $scope.skillCommunities.list.length === 0) &&
                ($scope.skillPYMK === undefined || $scope.skillPYMK === null || $scope.skillPYMK.list.length === 0) &&
                ($scope.skillPositions === undefined || $scope.skillPositions === null || $scope.skillPositions.list.length === 0) &&
                ($scope.skillAssignments === undefined || $scope.skillAssignments === null || $scope.skillAssignments.list.length === 0)) {

                $scope.noResultsLearningActivities = true;
            }
        }
    };

    $scope.getSkillDetail = function (loadMore) {
        /// <summary>
        /// Get details of a skill
        /// </summary>
        /// <doc>connectedLearning.controllers:skillsController#getSkillDetail</doc>

        if ($location.$$path === '/app/skills/follow/add' || $location.$$path === '/app/recommended/skills') {
            $scope.isTemp = true;
        } else {
            $scope.isTemp = false;
        }

        // Start loading data
        $scope.initLoader = true;
        $ionicLoading.show();

        $scope.showDescription = false;
        $scope.skillLearnings.list = [];
        $scope.skillLearnings.size = constants.recommendations.size;
        $scope.skillLearningBoards.list = [];
        $scope.skillLearningBoards.size = constants.recommendations.size;
        $scope.skillCommunities.list = [];
        $scope.skillCommunities.size = constants.recommendations.size;
        $scope.skillPYMK.list = [];
        $scope.skillPYMK.size = constants.recommendations.size;
        $scope.skillPositions.list = [];
        $scope.skillPositions.size = constants.recommendations.size;
        $scope.skillAssignments.list = [];
        $scope.skillAssignments.size = constants.recommendations.size;
        $scope.noResultsLearningActivities = false;

        // get skill description
        $scope.getSkillDescription();

        // get learnings
        $scope.getSkillRecommendedLearnings(loadMore);
        // get communities
        $scope.getSkillRecommendedCommunities(loadMore);
        // get pymk
        $scope.getSkillRecommendedPYMK(loadMore);
        // get acm positions
        $scope.getSkillRecommendedPositions(loadMore);
        // get mys assignments
        $scope.getSkillRecommendedAssignments(loadMore);
    };

    $scope.openLAWindow = function (activity, type) {

        var url = activity.URL;

        if (type === constants.recommendations.type.pymk) {
            crittercismService.beginTransaction('User_Activity_Click_Contact_People_Skills_Page');
            crittercismService.endTransaction('User_Activity_Click_Contact_People_Skills_Page');
            url = environmentData.peopleUrl + activity.EnterpriseID;
        }
        else if (type === constants.recommendations.type.board) {
            crittercismService.beginTransaction('User_Activity_Click_Follow_Board_Skills_Page');
            crittercismService.endTransaction('User_Activity_Click_Follow_Board_Skills_Page');
        }
        else if (type === constants.recommendations.type.learning) {
            crittercismService.beginTransaction('User_Activity_Click_Register_Training_Skills_Page');
            crittercismService.endTransaction('User_Activity_Click_Register_Training_Skills_Page');
        }
        else if (type === constants.recommendations.type.community) {
            crittercismService.beginTransaction('User_Activity_Click_Join_Community_Skills_Page');
            crittercismService.endTransaction('User_Activity_Click_Join_Community_Skills_Page');
        }
        window.open(url, '_system'); return false;
    };

    $scope.applyLAItem = function (activity, type) {

        var url = '';

        if (type === 'position') {
            crittercismService.beginTransaction('User_Activity_Click_Apply_Position_Skills_Page');
            crittercismService.endTransaction('User_Activity_Click_Apply_Position_Skills_Page');
            url = environmentData.acmURL + activity.PositionId;
        }
        else if (type === 'assignment') {
            crittercismService.beginTransaction('User_Activity_Click_Apply_Assignment_Skills_Page');
            crittercismService.endTransaction('User_Activity_Click_Apply_Assignment_Skills_Page');
            url = environmentData.mySchedulingURL + activity.Id;
        }

        window.open(url, '_system'); return false;
    };

    $scope.setHaveSeenRecommededSkills = function () {
        /// <summary>
        /// Set the flag setHaveSeenTutorial for the current user
        /// </summary>
        /// <doc>connectedLearning.controllers:baseController#setHaveSeenTutorial</doc>

        if ($scope.settings.haveSeenRecommededSkills === false) {

            var params = {
                peopleKey: profileService.getPeopleKey()
            };


            // set the user settings. The user have seen the recommended skills page
            authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: profileService.setHaveSeenRecommededSkills, params: params }).then(function (data) {

                $scope.settings.haveSeenRecommededSkills = true;

            }, function (error) {
                console.log(error);
            });
        }

        // if tempFollowSkills has values, is because we are coming from add skills page
        if ($scope.tempFollowSkills.length > 0) {

            $scope.setFollowTempSkills(true);
        }
        else {
            $scope.navigateToState('app.home', null, true);
        }
    };

    $scope.toggleTempFollow = function (skill, follow, isMoreSkillsView) {

        var prefix = '';

        if ($location.$$path === '/app/skills/follow/add') {
            prefix = 'AddSkillId_';
        }
        if ($location.$$path === '/app/recommended/skills') {
            prefix = 'RecSkillId_';
        }

        // if follow, add to temporal list
        if (follow) {

            // you cannot follow more than 5 skills
            if ($scope.tempFollowSkills.length + $scope.skillsModel.followSkills.list.length >= constants.skills.maximumFollowSkills) {
                if ($window.cordova) {
                    $cordovaToast.show(constants.messages.maxFollowedSkills, 'long', 'bottom');
                }
                return;
            }

            crittercismService.beginTransaction('User_Activity_Click_Follow_Skill');
            crittercismService.endTransaction('User_Activity_Click_Follow_Skill');

            $('#' + prefix + skill.SkillId).addClass('item-icon-right');
            $('#' + prefix + skill.SkillId).find('.followAction').hide();
            $('#' + prefix + skill.SkillId).find('i.acc-check').show();

            // update styles in more skills page
            if (prefix === 'AddSkillId_') {
                $('#MoreSkillId_white_' + skill.SkillId).addClass('item-icon-right');
                $('#MoreSkillId_white_' + skill.SkillId).find('.followAction').hide();
                $('#MoreSkillId_white_' + skill.SkillId).find('i.acc-check').show();
            }
            // update styles in more skills page
            if (prefix === 'RecSkillId_') {
                $('#MoreSkillId_blue_' + skill.SkillId).addClass('item-icon-right');
                $('#MoreSkillId_blue_' + skill.SkillId).find('.followAction').hide();
                $('#MoreSkillId_blue_' + skill.SkillId).find('i.acc-check').show();
            }

            $scope.tempFollowSkills.push(skill);
        }
            // remove from temporal list
        else {
            var position = -1, index;
            for (index = 0; index < $scope.tempFollowSkills.length; index++) {
                if ($scope.tempFollowSkills[index].SkillId === skill.SkillId) {
                    position = index;
                    break;
                }
            }
            if (position >= 0) {

                crittercismService.beginTransaction('User_Activity_Click_Unfollow_Skill');
                crittercismService.endTransaction('User_Activity_Click_Unfollow_Skill');

                $('#' + prefix + skill.SkillId).removeClass('item-icon-right');
                $('#' + prefix + skill.SkillId).find('.followAction').show();
                $('#' + prefix + skill.SkillId).find('i.acc-check').hide();

                // update styles in more skills page
                if (prefix === 'AddSkillId_') {
                    $('#MoreSkillId_white_' + skill.SkillId).removeClass('item-icon-right');
                    $('#MoreSkillId_white_' + skill.SkillId).find('.followAction').show();
                    $('#MoreSkillId_white_' + skill.SkillId).find('i.acc-check').hide();
                }
                // update styles in more skills page
                if (prefix === 'RecSkillId_') {
                    $('#MoreSkillId_blue_' + skill.SkillId).addClass('item-icon-right');
                    $('#MoreSkillId_blue_' + skill.SkillId).find('.followAction').show();
                    $('#MoreSkillId_blue_' + skill.SkillId).find('i.acc-check').hide();
                }
                $scope.tempFollowSkills.splice(position, 1);
            }
        }
    };

    $scope.returnToSkillsFollow = function () {

        messagesService.broadcast(constants.broadcast.sendTempFollowSkills, $scope.tempFollowSkills);

        $scope.navigateToState('app.skills', $scope.tempFollowSkills, true);

    };

    $scope.setFollowTempSkills = function (navigateToHome) {

        // Start loading data
        $ionicLoading.show();

        var i = 0, count = 0;
        for (i = 0; i < $scope.tempFollowSkills.length; i++) {

            if ($scope.tempFollowSkills[i].SkillType === 0) {
                $scope.tempFollowSkills[i].SkillType = constants.skills.type.recommended;
            }

            var params = {
                peopleKey: profileService.getPeopleKey(),
                skillId: $scope.tempFollowSkills[i].SkillId,
                skillType: $scope.tempFollowSkills[i].SkillType,
                follow: true
            };

            // follow/unfollow a skill
            authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: profileService.followUnfollowSkill, params: params }).then(function (data) {

                profileService.addFollowSkill($scope.tempFollowSkills[count]);

                if ($scope.tempFollowSkills[count].SkillType === constants.skills.type.recommended) {
                    // set the skill isFollow value in the recommended skills list
                    profileService.setRecommendedSkilltoFollow($scope.tempFollowSkills[count].SkillId, true);
                }

                if ($scope.tempFollowSkills[count].SkillType === constants.skills.type.future) {
                    // set the skill isFollow value in the future skills list
                    profileService.setFutureSkilltoFollow($scope.tempFollowSkills[count].SkillId, true);
                }

                if ($scope.tempFollowSkills[count].SkillType === constants.skills.type.businessPriority) {
                    // set the skill isFollow value in the future skills list
                    profileService.setBusinessPrioritySkilltoFollow($scope.tempFollowSkills[count].SkillId, true);
                }

                if ($scope.tempFollowSkills[count].SkillType === constants.skills.type.specialty) {
                    // set the skill isFollow value in the future skills list
                    profileService.setSpecialtySkilltoFollow($scope.tempFollowSkills[count].SkillId, true);
                }

                if (count >= $scope.tempFollowSkills.length - 1) {
                    // End loading data
                    $ionicLoading.hide();

                    $scope.tempFollowSkills = [];
                }

                // every time user follow/unfollow a skill, we need to reload the recommmended items
                recommendationsService.setReloadRecommendations(true);
                count++;

                // if we are setting skills to follow in blue recommendations screen, navigate to home page
                if (navigateToHome) {
                    $scope.navigateToState('app.home', null, true);
                }

            }, function (error) {
                console.log(error);
                if (count >= $scope.tempFollowSkills.length - 1) {
                    // End loading data
                    $ionicLoading.hide();

                    $scope.tempFollowSkills = [];
                }
                count++;
            });
        }
    };

    $scope.isFollowTemp = function () {

        var i = 0, exists = false;
        for (i = 0; i < $scope.tempFollowSkills.length; i++) {
            if ($scope.tempFollowSkills[i].SkillId === $scope.skillSelected.SkillId) {
                exists = true;
            }
        }

        return exists;
    };

    $scope.showMoreSkills = function (skillType) {

        switch (skillType) {
            case 'futureSkills':

                crittercismService.beginTransaction('User_Activity_View_Show_More_Skills_Future_Skills');
                crittercismService.endTransaction('User_Activity_View_Show_More_Skills_Future_Skills');

                $scope.moreSkillsType = constants.skills.type.future;
                $scope.moreSkillsTitle = "Future Role Skills";

                break;
            case 'skills':
                crittercismService.beginTransaction('User_Activity_View_Show_More_Skills_Current_Role_Skills');
                crittercismService.endTransaction('User_Activity_View_Show_More_Skills_Current_Role_Skills');

                $scope.moreSkillsType = constants.skills.type.recommended;
                $scope.moreSkillsTitle = "Current Roles Skills";
                break;
            case 'businessPrioritySkills':
                crittercismService.beginTransaction('User_Activity_View_Show_More_Skills_Business_Priority_Skills');
                crittercismService.endTransaction('User_Activity_View_Show_More_Skills_Business_Priority_Skills');

                $scope.moreSkillsType = constants.skills.type.businessPriority;
                $scope.moreSkillsTitle = "Business Priority Skills";

                break;
            case 'specialtySkills':
                crittercismService.beginTransaction('User_Activity_View_Show_More_Skills_Specialty_Skills');
                crittercismService.endTransaction('User_Activity_View_Show_More_Skills_Specialty_Skills');

                $scope.moreSkillsType = constants.skills.type.specialty;
                $scope.moreSkillsTitle = "Specialization Skills";

                break;
        }

        $scope.openModal('moreSkills');

    };

    $scope.showMoreLearningActivities = function (activityType) {

        switch (activityType) {
            case 'trainings':
                // get the full list only if not obtained before
                if ($scope.skillLearnings.list.length < constants.recommendations.maxSizeLearnings) {

                    $scope.skillLearnings.size = constants.recommendations.maxSizeLearnings;
                    $scope.getSkillRecommendedLearnings(true);
                }
                crittercismService.beginTransaction('User_Activity_View_Show_More_Learning_Activities_Trainings');
                crittercismService.endTransaction('User_Activity_View_Show_More_Learning_Activities_Trainings');

                $scope.moreLearningActivitiesType = constants.recommendations.type.learning;
                $scope.moreLearningActivitiesTitle = "Trainings";
                break;
            case 'boards':
                // get the full list only if not obtained before
                if ($scope.skillLearningBoards.list.length < constants.recommendations.maxSizeLearnings) {

                    $scope.skillLearningBoards.size = constants.recommendations.maxSizeLearnings;
                    $scope.getSkillRecommendedLearnings(true);
                }
                crittercismService.beginTransaction('User_Activity_View_Show_More_Learning_Activities_Boards');
                crittercismService.endTransaction('User_Activity_View_Show_More_Learning_Activities_Boards');

                $scope.moreLearningActivitiesType = constants.recommendations.type.board;
                $scope.moreLearningActivitiesTitle = "Learning Boards";
                break;
            case 'communities':
                // get the full list only if not obtained before
                if ($scope.skillCommunities.list.length < constants.recommendations.maxSizeCommunities) {

                    $scope.skillCommunities.size = constants.recommendations.maxSizeCommunities;
                    $scope.getSkillRecommendedCommunities(true);
                }
                crittercismService.beginTransaction('User_Activity_View_Show_More_Learning_Activities_Communities');
                crittercismService.endTransaction('User_Activity_View_Show_More_Learning_Activities_Communities');

                $scope.moreLearningActivitiesType = constants.recommendations.type.community;
                $scope.moreLearningActivitiesTitle = "Communities";
                break;
            case 'pymk':
                // get the full list only if not obtained before
                if ($scope.skillPYMK.list.length < constants.recommendations.maxSizePYMK) {

                    $scope.skillPYMK.size = constants.recommendations.maxSizePYMK;
                    $scope.getSkillRecommendedPYMK(true);
                }
                crittercismService.beginTransaction('User_Activity_View_Show_More_Learning_Activities_PYMK');
                crittercismService.endTransaction('User_Activity_View_Show_More_Learning_Activities_PYMK');

                $scope.moreLearningActivitiesType = constants.recommendations.type.pymk;
                $scope.moreLearningActivitiesTitle = "PYMK";
                break;
            case 'assignments':
                // get the full list only if not obtained before
                if ($scope.skillAssignments.list.length < constants.recommendations.maxSizeAssignments) {

                    $scope.skillAssignments.size = constants.recommendations.maxSizeAssignments;
                    $scope.getSkillRecommendedAssignments(true);
                }
                crittercismService.beginTransaction('User_Activity_View_Show_More_Learning_Activities_Assignments');
                crittercismService.endTransaction('User_Activity_View_Show_More_Learning_Activities_Assignments');

                $scope.moreLearningActivitiesType = constants.recommendations.type.assignment;
                $scope.moreLearningActivitiesTitle = "Open Scheduling Assignments";
                break;
            case 'positions':
                // get the full list only if not obtained before
                if ($scope.skillPositions.list.length < constants.recommendations.maxSizePositions) {

                    $scope.skillPositions.size = constants.recommendations.maxSizePositions;
                    $scope.getSkillRecommendedPositions(true);
                }
                crittercismService.beginTransaction('User_Activity_View_Show_More_Learning_Activities_Positions');
                crittercismService.endTransaction('User_Activity_View_Show_More_Learning_Activities_Positions');

                $scope.moreLearningActivitiesType = constants.recommendations.type.position;
                $scope.moreLearningActivitiesTitle = "Open Positions";
                break;
        }

        $scope.openModal('moreLearningActivities');

    };

    $scope.removeDuplicates = function (skillsByType) {
        var tempResult = [];
        tempResult = skillsByType;
        // to check if this value exists in the follow list
        var flag = false;        
        var index = 0;

        $.each(skillsByType, function (a, b) {
            // check if all skills is empty.
            if ($scope.allSkills.length > 0) {
                // check if item already added in all skills.
                if ($.inArray(b.SkillId, $scope.allSkills) === -1) {
                    $scope.allSkills.push(b.SkillId);
                }
                // it's already added in all skills list, so we have duplicates.
                else
                {
                    if ($scope.skillsModel.followSkills.list.length > 0) {
                        // check in follow skills, because we need to keep the duplicated item in the correct collection based on skill type.
                        // because if user decides to unfollow, it should go back on recommendations list  and fall on the same collection.
                        $.each($scope.skillsModel.followSkills.list, function (c, d) {
                            if (b.SkillId === d.SkillId) {
                                if (b.SkillType === d.SkillType) {
                                    // do nothing
                                }
                                else {
                                    tempResult.splice(a, 1);
                                }
                            }
                        });
                    }
                    else
                    {
                        tempResult.splice(a, 1);
                    }
                }
            }
            // all skills is empty.
            else {
                $scope.allSkills.push(b.SkillId);
            }
            
        });
        return tempResult;
    }
    //#endregion

    //#region Modal

    $ionicModal.fromTemplateUrl('conLearning/profile/skills/skill.detail.html', {
        scope: $scope,
        animation: "slide-in-right",
        hardwareBackButtonClose: false
    }).then(function (modal) {
        $scope.skillDetail_modal = modal;
    });
    $ionicModal.fromTemplateUrl('conLearning/profile/skills/more.skills.html', {
        scope: $scope,
        animation: "slide-in-right",
        hardwareBackButtonClose: false
    }).then(function (modal) {
        $scope.moreSkills_modal = modal;
    });
    $ionicModal.fromTemplateUrl('conLearning/profile/skills/more.learning.activities.html', {
        scope: $scope,
        animation: "slide-in-right",
        hardwareBackButtonClose: false
    }).then(function (modal) {
        $scope.moreLearningActivities_modal = modal;
    });

    $scope.openModal = function (whichModal, $event) {

        switch (whichModal) {
            case 'moreLearningActivities':
                
                $scope.moreLearningActivities_modal.show();
                $scope.moveScrollTop('moreLearningActivities');
                break;
            case 'skills':
                // detect if user is clicking on follow/check button
                if (!$scope.disableActions && !$($event.target).hasClass('skillAction')) {
                    // get the details
                    $scope.getSkillDetail(false);

                    crittercismService.beginTransaction('User_Activity_View_Skill_Detail');
                    crittercismService.endTransaction('User_Activity_View_Skill_Detail');
                    // open the modal
                    $scope.skillDetail_modal.show();
                    $scope.moveScrollTop('skillDetail');
                }
                break;
            case 'moreSkills':

                // select the type of page
                if ($location.$$path === '/app/skills/follow/add') {
                    $scope.typePage = "white";
                }
                if ($location.$$path === '/app/recommended/skills') {
                    $scope.typePage = "blue";
                }

                // update the selected skills in the page in case it was not loaded yet
                $timeout(function () {
                    var i = 0;
                    for (i = 0; i < $scope.tempFollowSkills.length; i++) {
                        // update styles in more skills page
                        if ($scope.typePage === 'white') {
                            $('#MoreSkillId_white_' + $scope.tempFollowSkills[i].SkillId).addClass('item-icon-right');
                            $('#MoreSkillId_white_' + $scope.tempFollowSkills[i].SkillId).find('.followAction').hide();
                            $('#MoreSkillId_white_' + $scope.tempFollowSkills[i].SkillId).find('i.acc-check').show();
                        }
                        // update styles in more skills page
                        if ($scope.typePage === 'blue') {
                            $('#MoreSkillId_blue_' + $scope.tempFollowSkills[i].SkillId).addClass('item-icon-right');
                            $('#MoreSkillId_blue_' + $scope.tempFollowSkills[i].SkillId).find('.followAction').hide();
                            $('#MoreSkillId_blue_' + $scope.tempFollowSkills[i].SkillId).find('i.acc-check').show();
                        }
                    }
                }, 500);
                
                $scope.moreSkills_modal.show();
                $scope.moveScrollTop('moreSkills');
                break;
        }

    };

    $scope.closeModal = function (whichModal) {

        switch (whichModal) {
            case 'moreLearningActivities':
                $scope.moreLearningActivities_modal.hide();
                break;
            case 'skills':
                $scope.skillDetail_modal.hide();
                break;
            case 'moreSkills':
                $scope.moreSkills_modal.hide();
                break;
        }
    };

    //#endregion

    //#region init

    $scope.init();

    //#endregion

    // event to get the temporal skills added in add skills follow
    $rootScope.$on(constants.broadcast.sendTempFollowSkills, function (event, args) {
        if (args.message !== null) {
            $timeout(function () {
                $scope.tempFollowSkills = args.message;
            });
        }
    });

    $scope.$on('$ionicView.enter', function () {

        // check location
        if ($location.$$path === '/app/skills/follow') {

            // if tempFollowSkills has values, is because we are coming from add skills page
            if ($scope.tempFollowSkills.length > 0) {

                $scope.setFollowTempSkills(false);
            }
        }
        if ($location.$$path === '/app/skills/follow/add') {
            // clear status
            $scope.tempFollowSkills = [];
            $('[id*="AddSkillId_"]').removeClass('item-icon-right');
            $('[id*="AddSkillId_"]').find('.followAction').show();
            $('[id*="AddSkillId_"]').find('i.acc-check').hide();

            $('[id*="MoreSkillId_white_"]').removeClass('item-icon-right');
            $('[id*="MoreSkillId_white_"]').find('.followAction').show();
            $('[id*="MoreSkillId_white_"]').find('i.acc-check').hide();

            messagesService.broadcast(constants.broadcast.updateSummaryCards);
            $scope.moveScrollTop('addSkills');
        }
        if ($location.$$path === '/app/recommended/skills') {
            // clear status
            $scope.tempFollowSkills = [];
            $('[id*="RecSkillId_"]').removeClass('item-icon-right');
            $('[id*="RecSkillId_"]').find('.followAction').show();
            $('[id*="RecSkillId_"]').find('i.acc-check').hide();

            $('[id*="MoreSkillId_blue_"]').removeClass('item-icon-right');
            $('[id*="MoreSkillId_blue_"]').find('.followAction').show();
            $('[id*="MoreSkillId_blue_"]').find('i.acc-check').hide();

            messagesService.broadcast(constants.broadcast.updateSummaryCards);
            $scope.moveScrollTop('recommendSkills');
        }

    });

}]);